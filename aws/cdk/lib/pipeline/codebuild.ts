import { Fn } from 'aws-cdk-lib'
import * as CodeBuild from 'aws-cdk-lib/aws-codebuild'
import * as CodePipeline from 'aws-cdk-lib/aws-codepipeline'
import * as CodePipelineActions from 'aws-cdk-lib/aws-codepipeline-actions'
import { action, CodebuildParams } from './types'

/** CodeBuildのプロジェクト作成関数 */
export const getCodebuildProject = (params: CodebuildParams): action => {
  // S3に置くファイルのAssetsを作成
  const buildOutput = new CodePipeline.Artifact()
  // buildspecをGitプロジェクトのルートから相対パスで指定
  const buildCmd = CodeBuild.BuildSpec.fromSourceFilename(params.buildSpec)

  // CodeBuildのプロジェクトを作成
  const codebuild = new CodeBuild.PipelineProject(params.cdkApp, `${params.runtimeMode}-project`, {
    projectName: `${params.systemId}-${params.env}-${params.runtimeMode}`,
    description: `Build project for ${params.systemId} ${params.runtimeMode}`,
    environment: {
      buildImage: CodeBuild.LinuxBuildImage.AMAZON_LINUX_2_4,
      computeType: CodeBuild.ComputeType.SMALL,
      privileged: true,
      environmentVariables: {
        ENV: { value: params.env },
        SYSTEM_ID: { value: params.systemId },
        // 環境ごとにURIが変わるので環境変数でURIを渡す
        CONTAINER_REPOSITORY_URI: {
          value: Fn.importValue(`${params.systemId}-${params.env}-container-repository-uri`)
        }
      }
    },
    role: params.role,
    buildSpec: buildCmd
  })

  // Stageの中のアクションを定義する
  const buildAction = new CodePipelineActions.CodeBuildAction({
    actionName: `${params.runtimeMode}`,
    project: codebuild,
    input: params.inputArtifact,
    outputs: [buildOutput],
    role: params.role
  })
  return { action: buildAction, outputArtifact: buildOutput }
}
