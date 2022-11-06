import { AppRunner, Pipeline } from './types'
import { devAppRunner, stgAppRunner, prodAppRunner, devPipeline, stgPipeline, prodPipeline } from './definitions'

export const getApiConfig = (env: string): AppRunner => {
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

export const getPipelineConfig = (env: string): Pipeline => {
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
