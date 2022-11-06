import { Stack } from 'aws-cdk-lib'
import * as IAM from 'aws-cdk-lib/aws-iam'
import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline'
import * as CodePipelineActions from 'aws-cdk-lib/aws-codepipeline-actions'
import { Pipeline } from '../../config/types'

export type StageParams = {
  cdkApp: Stack
  systemId: string
  env: 'dev' | 'stg' | 'prod'
  inputArtifact: CodePipeline.Artifact
  role: IAM.IRole
}

export type CodebuildParams = StageParams & {
  runtimeMode: 'build' | 'deploy'
  buildSpec: string
}

export type SourceStageParams = Omit<StageParams, 'inputArtifact'> & {
  branchName: Pipeline['branchName']
}

export type DeployStageParams = Omit<StageParams, 'inputArtifact'> & {
  inputArtifact: {
    build: CodePipeline.Artifact
  }
}

export type action = {
  action: CodePipelineActions.CodeCommitSourceAction | CodePipelineActions.CodeBuildAction
  outputArtifact: CodePipeline.Artifact
}
