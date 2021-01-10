import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as ecr from '@aws-cdk/aws-ecr';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3 from '@aws-cdk/aws-s3';


export class CodebuildDockerCachingFromEcrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECR
    // Setting the RemovalPolicy to DESTROY, I don't want to keep the resource around after the DEMO, but DON'T DO IT IN PROD
    const customECR = new ecr.Repository(this, 'custom-ecr-1-for-later-deletion', {
      repositoryName: 'custom-ecr-1-for-later-deletion',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    }) 

    //source
    const customS3 = new s3.Bucket(this, 'CustomTestS3Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: 'custombucket-1-for-temporary-source',
    })

    // Service Role and Policy
    const customPolicyStatement1 = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:GetRepositoryPolicy",
          "ecr:DescribeRepositories",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:BatchGetImage",
          "ecr:ListTagsForResource",
          "ecr:DescribeImageScanFindings",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage",
      ],
      resources: ["*"]
    })

    const customCodebuild = new codebuild.Project(this, 'CustomCodeBuild-1', {
      projectName: 'Custom-Codebuild-Project-1',
      source: codebuild.Source.s3({
        bucket: customS3,
        path: `app.zip`,
      }),
      timeout: cdk.Duration.minutes(10),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yaml'),
      environmentVariables:  {
        'CONTAINER_REPOSITORY_URL': {
          value: customECR.repositoryUri
        }
      },
      environment: {
        privileged: true,
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3
      }
    })
    customCodebuild.addToRolePolicy(customPolicyStatement1)
  }
}
