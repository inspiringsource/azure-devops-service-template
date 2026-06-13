# Onboarding & Offboarding

Lightweight checklists for adding and removing people who work on or support this
service. Map the roles below to the model in
[ACCESS_CONTROL.md](ACCESS_CONTROL.md).

These checklists are generic and contain no real names, accounts, or
credentials.

## Onboarding (New Developer or Support User)

### Access

- [ ] Add the person to the correct GitHub team for the repository with the
      minimum role required (Developer / Support / Viewer).
- [ ] Grant Azure access via the appropriate group/RBAC role if their role needs
      it (most Support/Viewer users do not).
- [ ] Confirm they do **not** receive secret-management access unless they are
      Owner / Admin.

### Local Setup (Developers)

- [ ] Clone the repository.
- [ ] `npm install`
- [ ] `cp .env.example .env` and fill in local, non-production values.
- [ ] `npm run dev` and confirm the service responds on `http://localhost:3000`.
- [ ] `npm test`, `npm run build`, and `npm run lint` all pass.

### Orientation

- [ ] Read the [README](../README.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
- [ ] Read the [Operations Runbook](OPERATIONS_RUNBOOK.md) (especially
      health checks, log review, and incident triage).
- [ ] Read the [Security Baseline](SECURITY_BASELINE.md).
- [ ] Confirm they know who to escalate to.

## Offboarding (Departing User)

Do these promptly when someone leaves the team or no longer needs access.

- [ ] **Remove repository access** — remove the user from the GitHub repository /
      teams.
- [ ] **Remove deployment permissions** — remove any Azure RBAC roles, group
      memberships, or pipeline permissions they held.
- [ ] **Rotate secrets if needed** — if the user had access to or knowledge of
      any secret (CI credentials, Azure credentials, Key Vault entries), rotate
      it. Always rotate after an Owner / Admin departs.
- [ ] **Revoke tokens** — invalidate any personal access tokens, SSH keys, or
      service credentials associated with the user.
- [ ] **Document handover** — record ownership of anything the person was
      responsible for (runbook steps, open incidents, knowledge) and reassign it.

### Verification

- [ ] Confirm the user can no longer access the repository.
- [ ] Confirm rotated secrets are in place and the pipeline still succeeds.
- [ ] Note the offboarding in the operational record
      ([CHANGELOG_OPERATIONS.md](CHANGELOG_OPERATIONS.md)) without including
      personal data.
