# Operational Changelog

A lightweight record of operational events: deployments, incidents, rollbacks,
secret rotations, and access changes. This is **not** the code changelog — it
captures what happened in operations and why.

Keep entries short, factual, and free of sensitive data (no credentials, no
personal information).

Format: `YYYY-MM-DD — <type> — <summary>`
Types: `deploy`, `incident`, `rollback`, `secret-rotation`, `access`, `note`

## Example Entries

> The entries below are illustrative examples to show the expected format.

- 2026-06-13 — note — Added operational documentation set (runbook, access
  control, onboarding/offboarding, security baseline).
- 2026-06-10 — deploy — Released `v1.2.0` (image tag `ghcr.io/my-org/my-service:9f3a1c2`)
  to Azure Container Apps. Health checks green post-deploy.
- 2026-06-10 — incident — Elevated response times reported after deploy. Triaged
  via `/health` and logs; traced to a slow dependency call. Severity: low.
- 2026-06-10 — rollback — Reverted to previous known-good image
  (`ghcr.io/my-org/my-service:5b2e7d8`) to restore normal latency while a fix was
  prepared. Verified with health check.
- 2026-06-08 — secret-rotation — Rotated Azure deployment credential after a team
  member offboarding. Pipeline re-verified.
- 2026-06-08 — access — Removed departing user from repository and Azure group;
  handover documented.
