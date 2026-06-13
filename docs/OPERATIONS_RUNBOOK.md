# Operations Runbook

Practical, day-to-day procedures for running this service. The steps are written
to be followed by a support engineer or junior system specialist without deep
prior knowledge of the codebase.

Endpoints referenced here:

- `GET /` — service metadata (name, environment, version)
- `GET /health` — liveness (status, uptime, timestamp)
- `GET /ready` — readiness
- `GET /api/incidents/demo` — simulated incident payload

Replace `localhost:3000` with the real host or Azure Container App URL when
working against a deployed environment.

## 1. Service Health Check

Confirm the service is alive and serving traffic.

```bash
# Liveness — should return status: healthy with an uptime value
curl -s http://localhost:3000/health

# Readiness — should return status: ready
curl -s http://localhost:3000/ready

# Metadata — confirm the expected environment and version are running
curl -s http://localhost:3000/
```

What to look for:

- `/health` returns `"status": "healthy"` and a growing `uptime`.
- `/ready` returns `"status": "ready"`.
- `/` reports the environment (`development`, `staging`, `production`) and
  version you expect to be deployed.

If `/health` fails but the container is running, treat it as a process-level
problem (see incident triage). If the host does not respond at all, treat it as
an infrastructure/networking problem.

## 2. Restart / Redeploy Procedure

### Local (Docker)

```bash
# Restart the running container
docker compose restart

# Rebuild and restart after a code or config change
docker compose up --build -d
```

### Azure Container Apps

A redeploy is normally triggered by publishing a new image and updating the
Container App to the new revision.

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file infra/main.bicep \
  --parameters appName=my-service containerImage=ghcr.io/my-org/my-service:<tag>
```

After any restart or redeploy, re-run the **Service Health Check** above before
considering the action complete.

## 3. Log Review

The service writes structured JSON logs to stdout/stderr. Each request log
includes HTTP method, path, status code, duration, and timestamp.

```bash
# Local container logs (follow)
docker compose logs -f

# Azure Container Apps logs
az containerapp logs show \
  --name my-service \
  --resource-group my-rg \
  --follow
```

When reviewing logs, focus on:

- non-2xx/3xx status codes (`4xx` client errors, `5xx` server errors)
- unusually high request durations
- repeated errors clustered around a deployment timestamp
- the centralized error handler output for 500 responses

## 4. Incident Triage

A simple, repeatable triage order:

1. **Reproduce / confirm.** Hit `/health` and `/ready`. Is the issue real and
   current, or already recovered?
2. **Scope it.** One endpoint or the whole service? One user or everyone?
3. **Check recent changes.** Was there a recent deployment? Compare the version
   reported by `/` against the last known-good release.
4. **Read the logs.** Look for errors around the time the issue started
   (section 3).
5. **Decide an action.** Restart, redeploy, roll back, or escalate.
6. **Document.** Record what happened and what fixed it (see
   [CHANGELOG_OPERATIONS.md](CHANGELOG_OPERATIONS.md)).

Severity guide (keep it simple):

- **Low** — degraded but usable, no data risk. Handle in business hours.
- **Medium** — partial outage or repeated errors affecting users.
- **High** — full outage or suspected security/data issue. Escalate promptly.

## 5. Rollback Concept

This service publishes immutable images tagged by commit SHA to GHCR, so a
rollback is "deploy the previous known-good image" rather than reverting code in
a hurry.

1. Identify the last known-good image tag (previous commit SHA or `latest`
   before the bad release).
2. Redeploy that tag using the redeploy procedure in section 2.
3. Verify with the health check.
4. Record the rollback and open follow-up work to fix the root cause forward.

In Azure Container Apps, rolling back can also mean shifting traffic back to a
previous healthy revision rather than deploying a new one.

## 6. Escalation Notes

Escalate when:

- the issue is **High** severity (full outage, data or security concern), or
- a restart/redeploy/rollback does not restore service, or
- the cause is outside this service (Azure platform incident, networking, DNS,
  registry/GHCR availability), or
- you are unsure and the impact is growing.

When escalating, include:

- what is broken and since when
- impact (who/what is affected)
- the version reported by `/` and the most recent deployment
- relevant log excerpts (with sensitive data removed)
- what you have already tried

> This is a portfolio/template service. Role names, on-call rotations, and
> contact details should be filled in per the adopting organization. See
> [ACCESS_CONTROL.md](ACCESS_CONTROL.md) for the role model these procedures
> assume.
