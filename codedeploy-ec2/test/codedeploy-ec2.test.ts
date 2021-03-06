import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CodedeployEc2 from '../lib/codedeploy-ec2-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CodedeployEc2.CodedeployEc2Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
