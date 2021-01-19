#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CodedeployEc2Stack } from '../lib/codedeploy-ec2-stack';

const app = new cdk.App();
new CodedeployEc2Stack(app, 'CodedeployEc2Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});
