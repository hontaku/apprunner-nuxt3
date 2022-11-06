import { Fn } from 'aws-cdk-lib'
import * as CodeCommit from 'aws-cdk-lib/aws-codecommit'
import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline'
import * as CodePipelineActions from 'aws-cdk-lib/aws-codepipeline-actions'
import { action, SourceStageParams } from '../types'

/** ビルド対象の資源を引き込むSourceステージのアクションを作成するClass */
export class Source {
  /** アクション */
  private _codeCommit: action

  /** コンストラクタ(Stageのactionを作成する関数を呼ぶ) */
  constructor(params: SourceStageParams) {
    this._codeCommit = this.getCodeCommit(params)
  }

  /** ActionのGetter */
  get action() {
    // CodePipelineのaddStageに配列をそのまま渡せるようにする
    return [this._codeCommit.action]
  }

  /** ArtifactのGetter */
  get artifact() {
    return this._codeCommit.outputArtifact
  }

  /** メインの資源を引き込むSourceアクション作成 */
  private getCodeCommit(params: SourceStageParams) {
    const sourceOutput = new CodePipeline.Artifact()
    const repo = CodeCommit.Repository.fromRepositoryName(
      params.cdkApp,
      `CodeCommit`,
      Fn.importValue(`${params.systemId}-repository-name`)
    )
    const action = new CodePipelineActions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: repo,
      branch: params.branchName,
      output: sourceOutput,
      role: params.role,
      trigger: CodePipelineActions.CodeCommitTrigger.POLL
    })
    return { action, outputArtifact: sourceOutput }
  }
}
