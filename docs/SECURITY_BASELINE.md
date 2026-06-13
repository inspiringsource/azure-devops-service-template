# Security Baseline

Practical, baseline security expectations for this service. These are realistic
hygiene items for a small containerized service — not a full enterprise security
program. They describe how the template is intended to be operated safely.

## Secrets Management

- Store secrets **only** in GitHub Secrets or Azure Key Vault.
- **Never commit credentials** to the repository (no secrets in code, config,
  Dockerfiles, or `.env` files committed to git).
- `.env` is for local, non-production values only and is git-ignored; use
  `.env.example` as the safe template.
- Rotate secrets on a schedule and immediately after any suspected exposure or
  Owner/Admin departure (see
  [ONBOARDING_OFFBOARDING.md](ONBOARDING_OFFBOARDING.md)).

## Access & Least Privilege

- Grant the minimum access each role needs (see
  [ACCESS_CONTROL.md](ACCESS_CONTROL.md)).
- Deployment happens through the CI/CD pipeline rather than long-lived personal
  production credentials.
- Use named identities through teams/groups, not shared accounts.

## Dependency Hygiene

- Keep dependencies current and review updates.
- Run `npm audit` periodically and address high/critical findings.
- Pin/lock dependencies via `package-lock.json` for reproducible installs
  (`npm ci`).

## Container Image Hygiene

- Build from a defined, reasonably current base image.
- Keep images minimal; use `.dockerignore` to avoid copying unnecessary or
  sensitive files into the image.
- Tag images immutably (by commit SHA) so deployments and rollbacks are precise.
- Rebuild images to pick up base-image security updates.

## Logging Without Sensitive Data

- Logs are structured JSON written to stdout/stderr.
- Do **not** log secrets, tokens, credentials, or personal data.
- Scrub sensitive values before sharing log excerpts during incident handling.

## Transport & Deployment Security

- Assume **HTTPS/TLS** in front of the service in any deployed environment
  (e.g. Azure Container Apps ingress provides TLS termination).
- Do not expose internal-only endpoints or debugging routes publicly in
  production.
- Keep the health/readiness endpoints free of sensitive internal detail.

## CI/CD Security

- CI uses the built-in `GITHUB_TOKEN` for GHCR publishing; scope it minimally.
- Treat the pipeline as a trusted path to production — protect the default
  branch and review changes before merge.
- Keep deployment credentials in GitHub Secrets / Key Vault, referenced by the
  workflow, never inlined.

## Quick Checklist

- [ ] No secrets in git history or working tree
- [ ] Secrets only in GitHub Secrets / Azure Key Vault
- [ ] Least-privilege access mapped to roles
- [ ] Dependencies audited and locked
- [ ] Minimal, current container image with `.dockerignore`
- [ ] No sensitive data in logs
- [ ] HTTPS assumed for deployed environments
