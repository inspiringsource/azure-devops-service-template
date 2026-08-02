# Onboarding and Offboarding

## Onboarding

- [ ] Add the person to the minimum required GitHub team and Azure RBAC group.
- [ ] Keep GitHub environment approval and identity-management access limited
      to owners.
- [ ] Clone the repository and run `nvm use`, `npm ci`, and
      `cp .env.example .env`.
- [ ] Run `npm run check`, then `npm start` and verify `/health` and `/ready`.
- [ ] If needed, install Docker and verify `docker compose up --build` reaches a
      healthy state.
- [ ] Read the README, architecture, runbook, and security baseline.
- [ ] Understand that CI is automatic, image release is manual, and Azure
      deployment is a separate optional approval-gated job.

## Offboarding

- [ ] Remove repository, team, environment-approval, and Azure RBAC access.
- [ ] Remove the person from Entra groups and revoke personal tokens or keys.
- [ ] Review federated credentials and automation identities; remove only those
      tied to the departing person's responsibilities.
- [ ] Rotate any secret the person could access. OIDC avoids a long-lived Azure
      deployment secret but does not eliminate unrelated runtime secrets.
- [ ] Reassign open incidents, runbook ownership, and deployment approvals.
- [ ] Verify removed access and record a sanitized operational note.

Use [ACCESS_CONTROL.md](ACCESS_CONTROL.md) as the role model. These checklists
are generic and contain no real identities or credentials.
