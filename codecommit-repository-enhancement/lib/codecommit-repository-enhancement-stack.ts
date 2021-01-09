import * as cdk from '@aws-cdk/core';
import * as codecommit from '@aws-cdk/aws-codecommit'
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as target from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam'

import { testEmailAddress } from '../config/index'

export class CodecommitRepositoryEnhancementStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // SNS Topic
    const topic = new sns.Topic(this, 'Custom-Topic-1', {
      displayName: 'custom topic Display name',
      topicName: 'custom-topic-Topic-name',
    });

    // SNS Subscription
    const subscription = new subs.EmailSubscription(testEmailAddress);
    topic.addSubscription(subscription)

    // SNS Target - Will be used by the repo
    const snsTarget = new target.SnsTopic(topic)

    // Custom codecommit repository
    const repo = new codecommit.Repository(this, 'Custom-Repository-1' ,{
      repositoryName: 'proof-of-concept-1',
      description: 'Repository to experience with',
    });

    // Using the repo eventBridge capability to send message if sg happening on master
    repo.onCommit('Custom-Commit-To-Master-1', {
      branches: ['master'],
      target: snsTarget
    })

    // ### //
    // Adding a restricting policy to the repository to prevent any damaging action on master
    
    // Developer Group
    const developerGroup = new iam.Group(this, 'Custom-IAM-developer-group-1', {
      groupName: 'Custom-Developers-1',
    })
    
    // The Denying Policy Document
    const policyStatement = new iam.PolicyStatement({
      actions: [
        'codecommit:MergeBranchesByFastForward',
        'codecommit:MergeBranchesBySquash',
        'codecommit:MergeBranchesByThreeWay',
        'codecommit:PutFile',
        'codecommit:GitPush',
        'codecommit:DeleteBranch'
      ],
      effect: iam.Effect.DENY,
      resources: [repo.repositoryArn],
      conditions: {
        "Null": {
          "codecommit:References": "false"
        },
        "StringEqualsIfExists": {
          "codecommit:References": [
            "refs/heads/master",
            "refs/heads/prod"
          ]
        }
      },
    })

    developerGroup.addToPolicy(policyStatement)
  }
}
