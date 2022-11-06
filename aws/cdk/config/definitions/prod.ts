import { AppRunner, Pipeline } from '../types'

export const appRunner: AppRunner = {
  instance: {
    cpu: '2',
    memory: '4'
  }
}

export const pipeline: Pipeline = {
  branchName: 'prod'
}
