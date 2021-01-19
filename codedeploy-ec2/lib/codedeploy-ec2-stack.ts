import * as cdk from '@aws-cdk/core';
import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

export class CodedeployEc2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const ec2Iam = new iam.Role(this, 'ec2-iam', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 's3-read-access-managed-policy', 'arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess'),
      ]
    })
    const defaultVPC = ec2.Vpc.fromLookup(this, 'default-vpc', {
      isDefault: true,
    })
    const awsAMI = new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 });
  
    const userData = ec2.UserData.forLinux()
    // logging to the console
    userData.addCommands('exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1')
    // Installing basics
    userData.addCommands('sudo yum update -y', 'sudo yum install ruby -y', 'sudo yum install wget -y')
    // Erasing existing codedeploy
    userData.addCommands('CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"', '$CODEDEPLOY_BIN stop', 'yum erase codedeploy-agent -y')
    // Installing codedeploy
    userData.addCommands('cd /home/ec2-user', 'wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install', 'sudo chmod +x ./install', 'sudo ./install auto')
    userData.addCommands('sudo service codedeploy-agent start')
    // Installing nodejs
    userData.addCommands('curl --silent --location https://rpm.nodesource.com/setup_15.x | bash',  'yum -y install nodejs', 'npm i cross-env -g')
     
    const ec2SecurityGroup = new ec2.SecurityGroup(this, 'ec2-securitygroup', {
      vpc: defaultVPC,
      allowAllOutbound: true,
    })
    ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22))
    ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080))

    const ec2Instance = new ec2.Instance(this, 'ec2-instance-1', {
      machineImage: awsAMI,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      vpc: defaultVPC,
      keyName: 'test-ec2-pait',
      role: ec2Iam,
      userData: userData,
      securityGroup: ec2SecurityGroup,
    })
    cdk.Tags.of(ec2Instance).add('Name', 'Node-Server')
    cdk.Tags.of(ec2Instance).add('Environment', 'Test')

    const application = new codedeploy.ServerApplication(this, 'CodeDeployApplication', {
      applicationName: 'Express-Web-Server-1',
    });

    const codedeployRole = new iam.Role(this, 'codedeploy-role-1', {
      roleName: 'Codedeploy-role-1',
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, 'codedeploy-managed-policy-1', 'arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole')
      ]
    })

    const deploymentGroup = new codedeploy.ServerDeploymentGroup(this, 'CodeDeployDeploymentGroup', {
      application: application,
      deploymentGroupName: 'Test-Deployment-Group-1',
      ec2InstanceTags: new codedeploy.InstanceTagSet(
        {
          'Name': ['Node-Server'],
          'Environment': ['Test'],
        },
      ),
      role: codedeployRole,
    });
  }
}
