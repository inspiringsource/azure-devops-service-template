targetScope = 'resourceGroup'

@description('Azure region for the starter resources.')
param location string = resourceGroup().location

@description('Container App name.')
@minLength(2)
@maxLength(32)
param appName string = 'azure-devops-service-starter'

@description('Immutable container image to deploy, preferably including a commit SHA tag or digest.')
param containerImage string

@description('Port exposed by the container.')
@minValue(1)
@maxValue(65535)
param containerPort int = 3000

@description('Container Apps environment name.')
@minLength(2)
@maxLength(60)
param environmentName string = '${appName}-env'

@description('Log Analytics workspace name.')
@minLength(4)
@maxLength(63)
param logAnalyticsName string = '${appName}-logs'

@description('Tags applied to all resources.')
param tags object = {}

@description('Version reported by the service, normally the deployed Git commit SHA.')
param deploymentVersion string = 'local'

@description('Minimum replicas. Zero reduces idle cost but allows cold starts after scale-to-zero.')
@minValue(0)
@maxValue(10)
param minimumReplicas int = 0

@description('Maximum replicas for this lightweight starter. Must be greater than or equal to minimumReplicas.')
@minValue(1)
@maxValue(10)
param maximumReplicas int = 1

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2025-07-01' = {
  name: logAnalyticsName
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      disableLocalAuth: false
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    workspaceCapping: {
      dailyQuotaGb: -1
    }
  }
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2026-01-01' = {
  name: environmentName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2026-01-01' = {
  name: appName
  location: location
  tags: tags
  properties: {
    environmentId: containerAppsEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: true
        allowInsecure: false
        targetPort: containerPort
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: appName
          image: containerImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/health'
                port: containerPort
                scheme: 'HTTP'
              }
              initialDelaySeconds: 5
              periodSeconds: 30
              timeoutSeconds: 5
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/ready'
                port: containerPort
                scheme: 'HTTP'
              }
              initialDelaySeconds: 3
              periodSeconds: 10
              timeoutSeconds: 5
              failureThreshold: 3
            }
          ]
          env: [
            {
              name: 'PORT'
              value: string(containerPort)
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'APP_ENV'
              value: 'azure-container-apps'
            }
            {
              name: 'APP_VERSION'
              value: deploymentVersion
            }
            {
              name: 'ENABLE_DEMO_ROUTES'
              value: 'false'
            }
          ]
        }
      ]
      scale: {
        minReplicas: minimumReplicas
        maxReplicas: maximumReplicas
      }
    }
  }
}

output containerAppName string = containerApp.name
output containerAppUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
