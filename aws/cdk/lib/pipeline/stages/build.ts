import { getCodebuildProject } from '../codebuild'
import { action, StageParams } from '../types'

/** TypescriptやDockerをビルドするStageのアクションを作成するClass */
export class Build {
  /** アクション(メインの資源以外にもMockなどのビルドアクションが増えることを想定) */
  private _codeBuild: { build: action }

  /** コンストラクタ(Stageのactionを作成する関数を呼ぶ) */
  constructor(params: StageParams) {
    this._codeBuild = { build: this.createCodeBuild(params) }
  }

  /** ActionのGetter */
  get actions() {
    // CodePipelineのaddStageに配列をそのまま渡せるようにする
    const actions = [this._codeBuild.build.action]
    return actions
  }

  /** ArtifactのGetter */
  get artifacts() {
    return { build: this._codeBuild.build.outputArtifact }
  }

  /** メインの資源に対するビルドアクション作成 */
  private createCodeBuild(params: StageParams): action {
    return getCodebuildProject({
      ...params,
      buildSpec: './aws/buildspec/buildspec_build.yml',
      runtimeMode: 'build'
    })
  }
}
