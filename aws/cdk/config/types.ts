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

/** シングルCPUの設定値 */
type singleCpuInstance = {
  /** CPU使用個数 */
  cpu: '1'
  /** メモリの容量(GB) */
  memory: '2' | '3' | '4'
}

/** デュアルCPUの設定値(仕様によりメモリは4GBのみ選択可) */
type dualCpuInstance = {
  /** CPU使用個数 */
  cpu: '2'
  /** メモリの容量(GB) */
  memory: '4'
}

/** AppRunner設定 */
export type AppRunner = {
  /** インスタンス設定 */
  instance: singleCpuInstance | dualCpuInstance
}

/** Pipeline設定 */
export type Pipeline = {
  /** Pipelineの対象ブランチ */
  branchName: 'main' | 'stg' | 'prod'
}
