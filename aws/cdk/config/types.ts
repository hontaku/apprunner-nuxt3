import { StackProps } from 'aws-cdk-lib'

// 環境を切り替える値を連携するためにcustomStackPropsを定義する
export interface customStackProps extends StackProps {
  config: {
    appRunnerConfig: AppRunner
    pipelineConfig: Pipeline
  }
}

export type AppRunner = {
  hoge: 'hoge'
}

export type Pipeline = {
  branchName: 'main' | 'stg' | 'prod'
}
