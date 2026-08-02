# Access Control

Map these generic roles to GitHub teams and Azure RBAC or Entra groups. Grant
named identities the minimum access needed and avoid shared accounts.

| Role | Repository | Publish image | Deploy | Logs | Secrets/settings |
| --- | --- | ---: | ---: | ---: | ---: |
| Owner / Admin | Admin | Yes | Approve/manage | Yes | Yes |
| Developer | Write | Via workflow | By approved workflow | Yes | No |
| Support | Read | No | No | Read | No |
| Viewer | Read as needed | No | No | Selected read | No |

## Automation identities

- Automatic CI has `contents: read` only.
- The manual publish job receives `packages: write`, `attestations: write`, and
  `id-token: write` only for publishing and attesting the image.
- The optional Azure job has `contents: read` and `id-token: write`. It uses
  `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_SUBSCRIPTION_ID` GitHub
  environment variables with an Entra federated credential. No long-lived JSON
  credential is used.
- The `azure-production` GitHub environment should be protected with required
  reviewers and environment-scoped variables.

The Azure identity should be scoped to the target resource group and receive
only the RBAC permissions required for Bicep deployment. Owners manage
repository settings, environment protection, federated credentials, and access
reviews. Developers should not need personal production credentials.

See [ONBOARDING_OFFBOARDING.md](ONBOARDING_OFFBOARDING.md) and
[SECURITY_BASELINE.md](SECURITY_BASELINE.md).
