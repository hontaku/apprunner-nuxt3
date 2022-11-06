#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { PipelineStack } from '../lib/pipeline/stack'
import { getConfig } from '../config'
import { AppRunnerStack } from '../lib/apprunner/stack'
const app = new cdk.App()

// Contextの値は次の優先順位で決定される（高 > 低）
// construct.node.setContext() > cliオプション'cdk deploy --context key=value' > ./cdk.json > ~/.cdk.json > AWSアカウントから自動補完
// https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/context.html#context_construct
// デプロイ先を切り替えるためにpackage.json内のコマンドでコンテキストを変えている
const env = app.node.tryGetContext('env') as string
const systemId = app.node.tryGetContext('systemId') as string

if (!systemId) throw new Error('Context value [systemid] is invalid.')

if (env !== 'dev' && env !== 'stg' && env !== 'prod') {
  throw new Error('Context value [env] is invalid.')
}

// 既存のparameter.jsonをTypescript化することで型定義が利く＆記載漏れを防ぐことができる
// 参考 https://maku.blog/p/vx5ta85/
const config = getConfig(env)

const synthesizerProps = {
  fileAssetsBucketName: `${systemId}-${env}-temporary`,
  bucketPrefix: `cdk-temporary-${env}`,
  qualifier: `${systemId}-${env}-cdk`
}

new PipelineStack(app, `${systemId}-${env}-pipeline-stack`, {
  synthesizer: new cdk.CliCredentialsStackSynthesizer(synthesizerProps),
  config,
  env: { region: 'ap-northeast-1' }
})

new AppRunnerStack(app, `${systemId}-${env}-apprunner-stack`, {
  synthesizer: new cdk.CliCredentialsStackSynthesizer(synthesizerProps),
  config,
  env: { region: 'ap-northeast-1' }
})
