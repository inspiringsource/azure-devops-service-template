# Security Baseline

This is practical starter hygiene, not a complete security program.

## Runtime and data

- Keep credentials out of code, images, logs, `.env` files, and git.
- Store runtime secrets in an appropriate Azure secret store and expose only
  what the process needs.
- Request logs omit query parameters and include generated correlation IDs.
- Express hides `x-powered-by` and limits JSON bodies to 100 KB.
- Production hides demo routes unless they are explicitly enabled.
- TLS-only Container Apps ingress terminates public HTTPS traffic.

## Dependencies and images

- Use Node 24 LTS consistently and rebuild when its pinned Alpine digest is
  updated.
- Install from `package-lock.json` with `npm ci`.
- Run `npm audit` and resolve findings; CI rejects high or critical production
  dependency findings.
- Dependabot tracks npm, action, and Docker updates.
- Run containers as the non-root `node` user and keep the build context narrow.
- Publish immutable commit-SHA tags, provenance, and an SBOM. Deploy by digest.

## Automation and Azure

- CI has read-only repository permissions.
- Only the manual publish job can write packages and attestations.
- Azure deployment is optional, protected by a GitHub environment, and uses
  Entra federation plus GitHub OIDC. Do not create a long-lived JSON deployment
  secret.
- Scope the Azure identity to the target resource group with least privilege.
- Protect `main`, review workflow changes, and require appropriate deployment
  approval.

## Registry assumption

The included Bicep has no registry secret and therefore requires a public GHCR
package. Private GHCR needs registry credentials. For production, prefer ACR
with managed identity so image pulls do not depend on stored registry passwords.

Report vulnerabilities privately as described in [SECURITY.md](../SECURITY.md).
