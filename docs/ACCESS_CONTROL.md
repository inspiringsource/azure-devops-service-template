# Access Control

A simple, generic role model for operating this service. It is intentionally
lightweight and contains **no real credentials, accounts, or personal data**. An
adopting organization should map these roles to real identities in GitHub and
Azure (for example via GitHub teams and Azure RBAC / Entra ID groups).

## Principles

- **Least privilege** — grant the minimum access needed for a role to do its job.
- **Separation of duties** — the ability to deploy and the ability to manage
  secrets are kept distinct where practical.
- **Auditability** — access is granted to named individuals through groups/teams,
  not shared accounts.

## Roles

| Role            | Deploy | View logs | Manage secrets | Troubleshoot |
|-----------------|:------:|:---------:|:--------------:|:------------:|
| Owner / Admin   |  Yes   |    Yes    |      Yes       |     Yes      |
| Developer       |  Yes¹  |    Yes    |       No²      |     Yes      |
| Support         |   No   |    Yes    |       No       |     Yes³     |
| Viewer          |   No   |   Yes⁴    |       No       |      No      |

¹ Developers deploy via the CI/CD pipeline (e.g. merge/push to `main`), not by
holding standalone production deployment credentials.
² Developers consume secrets through the pipeline/runtime; they do not create or
rotate them.
³ Support troubleshoots using read-only signals (health endpoints, logs) and
documented runbook actions such as requesting a restart/redeploy.
⁴ Viewers may have read-only access to dashboards/logs only where appropriate.

### Owner / Admin

- Full control of the repository, infrastructure, and secrets.
- Manages GitHub repository settings and branch protection.
- Creates and rotates secrets in GitHub Secrets and Azure Key Vault.
- Approves access requests and changes to the role model.

### Developer

- Writes code, runs tests, and ships changes through the CI/CD pipeline.
- Can read logs and metrics to debug.
- Does **not** hold long-lived production deployment credentials directly;
  deployment happens through the pipeline.

### Support

- First responder for operational issues using the
  [Operations Runbook](OPERATIONS_RUNBOOK.md).
- Read-only access to health endpoints and logs.
- Can perform documented, low-risk actions (restart/redeploy via approved
  process) and escalate when needed.
- Cannot view or manage secrets and cannot change infrastructure.

### Viewer

- Read-only visibility for stakeholders (e.g. dashboards, status, selected
  logs).
- No deployment, no secret access, no configuration changes.

## Secrets and Access Mapping

- GHCR publishing uses the built-in `GITHUB_TOKEN` in CI.
- Azure access uses `AZURE_CREDENTIALS`, `AZURE_RESOURCE_GROUP`, and
  `AZURE_CONTAINER_APP_NAME`, stored in **GitHub Secrets** or **Azure Key
  Vault** — never committed to the repository.
- Only Owner / Admin creates and rotates these secrets.

See [SECURITY_BASELINE.md](SECURITY_BASELINE.md) for the security expectations
that back this model, and [ONBOARDING_OFFBOARDING.md](ONBOARDING_OFFBOARDING.md)
for how access is granted and removed.
