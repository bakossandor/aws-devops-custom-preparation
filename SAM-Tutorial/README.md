
sam package --template-file template.yml --output-template-file package.yml --s3-bucket <bucket>
sam deploy --template-file <tempalte file> --stack-name <stack name> --capabilities CAPABILITY_IAM