import { Stack, Fn, CfnElement } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { customStackProps } from '../../config/types'

import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline'

import * as IAM from 'aws-cdk-lib/aws-iam'
import * as S3 from 'aws-cdk-lib/aws-s3'

import { Source } from './stages/source'
import { Build } from './stages/build'
import { Deploy } from './stages/deploy'
import { Approval } from './stages/approval'

/** Pipeline stack */
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: customStackProps) {
    super(scope, id, props)

    // CDKのエントリーポイント(bin/cdk.ts)で例外を起こすのでキャストにする
    const systemId = this.node.tryGetContext('systemId') as string
    const env = this.node.tryGetContext('env') as 'dev' | 'stg' | 'prod'

    // 型ガードにより、いちいち条件分岐を行わないようにする
    if (!props) throw new Error('props is invalid.')

    // 予め用意しておいたRoleをCloudformation経由でインポートし、CDKが自動的にPolicyを追加しないようにする
    const pipelineRole = IAM.Role.fromRoleArn(this, 'PipeLineRole', Fn.importValue('CodePipelineServiceRoleArn'), {
      mutable: false
    })

    // 予め用意しておいたS3バケットをCloudformation経由でインポートする
    const tempBucket = S3.Bucket.fromBucketName(
      this,
      'TempBucket',
      Fn.importValue(`${systemId}-${env}-pipeline-temporary-bucket-name`)
    )

    const sourceAction = new Source({
      systemId,
      cdkApp: this,
      env,
      branchName: props.config.pipelineConfig.branchName,
      role: pipelineRole
    })

    const buildActions = new Build({
      systemId,
      cdkApp: this,
      env,
      inputArtifact: sourceAction.artifact,
      role: pipelineRole
    })

    const applovalActions = new Approval()

    const deployActions = new Deploy({
      systemId,
      cdkApp: this,
      env,
      inputArtifact: {
        build: buildActions.artifacts.build
      },
      role: pipelineRole
    })

    // Pipelineの構築
    const pipeline = new CodePipeline.Pipeline(this, `CodePipeline`, {
      pipelineName: `${systemId}-${env}-pipeline`,
      artifactBucket: tempBucket,
      role: pipelineRole
    })
    pipeline.addStage({
      stageName: `Source`,
      actions: sourceAction.action
    })

    pipeline.addStage({
      stageName: `Build`,
      actions: buildActions.actions
    })
    pipeline.addStage({
      stageName: `Apploval`,
      actions: applovalActions.actions
    })

    pipeline.addStage({
      stageName: `Deploy`,
      actions: deployActions.actions
    })
  }
  // Cloudformationテンプレートの論理IDにランダムな数字が振られないようにする
  protected allocateLogicalId(cfnElement: CfnElement): string {
    const scopes = cfnElement.node.scopes
    const stackIndex = scopes.indexOf(cfnElement.stack)
    const pathComponents = scopes
      .slice(stackIndex + 1)
      .map((x) => x.node.id.replace(/[^A-Za-z0-9]/g, '').replace(/Resource/g, ''))
    return pathComponents.join('')
  }
}
