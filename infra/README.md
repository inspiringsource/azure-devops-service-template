# Infrastructure Notes

Infrastructure in this repository is intentionally lightweight because the goal is to demonstrate delivery approach, not to ship a full platform stack.

## Current Scope

- Application code
- Containerization
- CI/CD workflow
- Azure deployment placeholders

## How This Could Be Extended

If this project needed stronger infrastructure automation, the next step would be to add Infrastructure as Code with:

- Bicep for Azure-native provisioning
- Terraform for broader multi-environment or multi-cloud consistency

Potential managed resources:

- Azure Resource Group
- Azure Container Registry
- Azure App Service or Azure Container Apps
- Log Analytics / Application Insights

That extension is deliberately not included yet so the repository stays simple, readable, and portfolio-friendly.
