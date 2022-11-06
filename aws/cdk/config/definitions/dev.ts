import { AppRunner, Pipeline } from '../types'

export const appRunner: AppRunner = {
  instance: {
    cpu: '1',
    memory: '2'
  }
}

export const pipeline: Pipeline = {
  branchName: 'main'
}
