import { AppRunner, Config, Pipeline } from './types'
import { devAppRunner, stgAppRunner, prodAppRunner, devPipeline, stgPipeline, prodPipeline } from './definitions'

/**
 * AppRunner設定取得関数
 * @param env 環境名
 * @throw 未定義の環境名のとき例外発生
 * @returns 環境固有の設定値
 */
const getAppRunnerConfig = (env: string): AppRunner => {
  switch (env) {
    case 'dev':
      return devAppRunner
    case 'stg':
      return stgAppRunner
    case 'prod':
      return prodAppRunner
    default:
      throw new Error('Context value [env] is invalid.')
  }
}

/**
 * Pipeline設定取得関数
 * @param env 環境名
 * @throw 未定義の環境名のとき例外発生
 * @returns 環境固有の設定値
 */
const getPipelineConfig = (env: string): Pipeline => {
  switch (env) {
    case 'dev':
      return devPipeline
    case 'stg':
      return stgPipeline
    case 'prod':
      return prodPipeline
    default:
      throw new Error('Context value [env] is invalid.')
  }
}

/**
 * 設定取得関数
 * @param env 環境名
 * @throw 未定義の環境名のとき例外発生
 * @returns AppRunnerとPipelineそれぞれの設定値のオブジェクト
 */
export const getConfig = (env: string): Config => {
  return {
    appRunnerConfig: getAppRunnerConfig(env),
    pipelineConfig: getPipelineConfig(env)
  }
}
