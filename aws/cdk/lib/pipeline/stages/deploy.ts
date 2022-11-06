import { getCodebuildProject } from '../codebuild'
import { DeployStageParams, CodebuildParams, action } from '../types'

/** CDKのDeployを実行するDeployステージのアクションを作成するClass */
export class Deploy {
  /** アクション(メインの資源以外にもMockなどのデプロイアクションが増えることを想定) */
  private _codeBuild: { deploy: action }

  /** コンストラクタ(Stageのactionを作成する関数を呼ぶ) */
  constructor(params: DeployStageParams) {
    this._codeBuild = { deploy: this.createCodeBuild(params) }
  }

  /** ActionのGetter */
  get actions() {
    // CodePipelineのaddStageに配列をそのまま渡せるようにする
    const actions = [this._codeBuild.deploy.action]
    return actions
  }

  /** メインの資源に対するデプロイアクション作成 */
  private createCodeBuild(params: DeployStageParams) {
    const codebuildParams: CodebuildParams = {
      ...params,
      inputArtifact: params.inputArtifact.build,
      buildSpec: './aws/buildspec/buildspec_deploy.yml',
      runtimeMode: 'deploy'
    }
    return getCodebuildProject(codebuildParams)
  }
}
