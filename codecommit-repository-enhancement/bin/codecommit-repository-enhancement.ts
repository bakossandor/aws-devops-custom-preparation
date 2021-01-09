#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CodecommitRepositoryEnhancementStack } from '../lib/codecommit-repository-enhancement-stack';

const app = new cdk.App();
new CodecommitRepositoryEnhancementStack(app, 'CodecommitRepositoryEnhancementStack');
