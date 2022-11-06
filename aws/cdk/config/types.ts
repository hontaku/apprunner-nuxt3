import { StackProps } from 'aws-cdk-lib'

/** 設定 */
export type Config = {
  /** AppRunner設定 */
  appRunnerConfig: AppRunner
  /** Pipeline設定 */
  pipelineConfig: Pipeline
}

// 環境を切り替える値を連携するためにcustomStackPropsを定義する
export interface customStackProps extends StackProps {
  config: Config
}

/** AppRunner設定 */
export type AppRunner = {
  hoge: 'hoge'
}

/** Pipeline設定 */
export type Pipeline = {
  /** Pipelineの対象ブランチ */
  branchName: 'main' | 'stg' | 'prod'
}
