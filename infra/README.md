# Infrastructure Notes

Infrastructure in this repository is intentionally lightweight because the goal is to demonstrate a credible production-style delivery path for a public portfolio starter/template, not to ship a full platform stack.

## Included Example

[main.bicep](main.bicep) provisions a minimal Azure Container Apps setup inside an existing resource group:

- Log Analytics workspace
- Container Apps environment
- Container App

The template keeps the parameter surface small and avoids secrets. It assumes the container image is already available in a registry such as GHCR.

## Example Deployment

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file infra/main.bicep \
  --parameters \
    appName=my-service \
    environmentName=my-service-env \
    logAnalyticsName=my-service-logs \
    containerImage=ghcr.io/my-org/my-service:latest
```

## What Is Intentionally Not Included

- Resource group creation
- Private networking
- Custom domains and certificates
- Secret injection
- Advanced scaling rules

Those are valid next steps for a real project, but they are omitted here to keep the starter readable and portfolio-friendly.

## How This Could Be Extended

- Add Bicep modules for environments, identities, and monitoring
- Swap or supplement Bicep with Terraform if that better matches the target team
- Add managed identities, Key Vault references, and private registry credentials
