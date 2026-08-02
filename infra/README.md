# Azure Container Apps infrastructure

`main.bicep` is intentionally small. It creates one Log Analytics workspace,
one Container Apps managed environment, and one public Container App in an
existing resource group. It adds TLS-only ingress, explicit HTTP liveness and
readiness probes, resource tags, and `APP_VERSION`.

## Validate without deploying

```bash
az bicep build --file infra/main.bicep
```

## Deploy an immutable image

`containerImage` is required and has no public default:

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file infra/main.bicep \
  --parameters \
    appName=my-service \
    containerImage=ghcr.io/my-org/my-service@sha256:<digest> \
    deploymentVersion=<full-commit-sha> \
    tags='{"environment":"demo","managedBy":"bicep"}'
```

The default `minimumReplicas=0` and `maximumReplicas=1` reduce idle cost for a
demo but allow a cold start after scale-to-zero. Increase the minimum when
latency requirements justify the cost.

The app uses single-revision mode. This template does not configure weighted
traffic shifting or multiple active revisions.

## Registry behavior

The secret-free example assumes the GHCR package is public. Private GHCR images
require registry credentials configured in Container Apps. Azure Container
Registry with a managed identity and `AcrPull` is the recommended production
extension.

## Deliberately excluded

Resource-group creation, databases, Kubernetes, private networking, custom
domains, runtime secrets, and a large monitoring platform are outside this
starter's scope.
