import * as CodePipelineActions from 'aws-cdk-lib/aws-codepipeline-actions'
import * as IAM from 'aws-cdk-lib/aws-iam'

/** 反映時に承認を得るためのStageのアクションを作るClass */
export class Approval {
  /** アクション(Developper以外にも増えることを想定) */
  private _actions: {
    developper: CodePipelineActions.ManualApprovalAction
  }

  /** コンストラクタ(Stageのactionを作成する関数を呼ぶ) */
  constructor(role: IAM.IRole) {
    this._actions = {
      developper: this.createDevelopperApploval(role)
    }
  }

  /** ActionのGetter */
  get actions() {
    // CodePipelineのaddStageに配列をそのまま渡せるようにする
    return [this._actions.developper]
  }

  /** 開発者向けApprovalアクション作成 */
  private createDevelopperApploval(role: IAM.IRole) {
    return new CodePipelineActions.ManualApprovalAction({
      actionName: 'developper-apploval',
      additionalInformation: `Please review`,
      role
    })
  }
}
