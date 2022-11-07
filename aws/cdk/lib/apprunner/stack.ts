import { Stack, Fn, CfnElement } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { customStackProps } from '../../config/types'

import * as AppRunner from 'aws-cdk-lib/aws-apprunner'

/** AppRunner stack */
export class AppRunnerStack extends Stack {
  constructor(scope: Construct, id: string, props?: customStackProps) {
    super(scope, id, props)

    // CDKのエントリーポイント(bin/cdk.ts)で例外を起こすのでキャストにする
    const systemId = this.node.tryGetContext('systemId') as string
    const env = this.node.tryGetContext('env') as 'dev' | 'stg' | 'prod'
    const imageTag = (this.node.tryGetContext('imageTag') as string) || 'latest'

    // 型ガードにより、いちいち条件分岐を行わないようにする
    if (!props) throw new Error('props is invalid.')

    // VPC作成時のSubnetにConnectorをアタッチする
    const vpcConnector = new AppRunner.CfnVpcConnector(this, 'VPCConnector', {
      vpcConnectorName: `${systemId}-${env}-vpc-connector`,
      subnets: [
        Fn.importValue(`${systemId}-${env}-ProtectSubnetAZa`),
        Fn.importValue(`${systemId}-${env}-ProtectSubnetAZc`)
      ],
      securityGroups: [Fn.importValue(`${systemId}-${env}-ProtectSecurityGroup`)]
    })

    new AppRunner.CfnService(this, 'AppRunner', {
      serviceName: systemId,
      instanceConfiguration: {
        cpu: `${props.config.appRunnerConfig.instance.cpu} vCPU`,
        memory: `${props.config.appRunnerConfig.instance.memory} GB`,
        instanceRoleArn: Fn.importValue(`AppRunnerServiceRoleArn`)
      },
      networkConfiguration: {
        egressConfiguration: { egressType: 'VPC', vpcConnectorArn: vpcConnector.attrVpcConnectorArn }
      },
      healthCheckConfiguration: {
        healthyThreshold: 1,
        unhealthyThreshold: 3,
        interval: 10,
        protocol: 'HTTP',
        path: '/',
        timeout: 3
      },
      sourceConfiguration: {
        autoDeploymentsEnabled: false,
        authenticationConfiguration: {
          accessRoleArn: Fn.importValue(`AppRunnerBuildRoleArn`)
        },
        imageRepository: {
          imageIdentifier: `${Fn.importValue(`${systemId}-${env}-container-repository-uri`)}:${imageTag}`,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            runtimeEnvironmentVariables: [
              { name: 'ENV', value: env },
              { name: 'SYSTEM_ID', value: systemId }
            ],
            port: '3000'
          }
        }
      }
    })
  }
  // Cloudformationテンプレートの論理IDにランダムな数字が振られないようにする
  protected allocateLogicalId(cfnElement: CfnElement): string {
    const scopes = cfnElement.node.scopes
    const stackIndex = scopes.indexOf(cfnElement.stack)
    const pathComponents = scopes
      .slice(stackIndex + 1)
      .map((x) => x.node.id.replace(/[^A-Za-z0-9]/g, '').replace(/Resource/g, ''))
    return pathComponents.join('')
  }
}
