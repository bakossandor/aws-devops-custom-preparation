# AWS CDK Codedeploy EC2 application bundle


## Deploying the application

- setup these env variables `CDK_DEFAULT_ACCOUNT`, `CDK_DEFAULT_REGION`
- `npm install`     installing dependencies
- `npm run build`   compile typescript to js
- `cdk synth`       emits the synthesized CloudFormation template
- `cdk deploy`      deploy this stack to your default AWS account/region

- Test the codedeploy manually creating a revision - unfortunately there is no cdk code for this...
  - put the  ./app/application.zip to an `S3 bucket of your choise`
  - create a new `deployment` from the `application`'s `deployment group`


## Docs
https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install-linux.html
https://docs.aws.amazon.com/codedeploy/latest/userguide/resource-kit.html#resource-kit-bucket-names
