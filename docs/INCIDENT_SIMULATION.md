# Incident Simulation

## Purpose

The `GET /api/incidents/demo` endpoint exists to show how a small service can
expose or simulate an operational concern without needing a real failure or a
complex monitoring stack. This document turns that into a realistic
support/sysadmin walkthrough.

## Demo Use Cases

- Show how a suspicious but non-critical event might appear in logs.
- Demonstrate how dashboards or alerts could classify low-severity issues.
- Explain how operational metadata can be surfaced without exposing internal
  systems.

## Realistic Incident Flow

A worked example of how a support engineer would handle a report, using only the
signals this service exposes. It mirrors the triage order in the
[Operations Runbook](OPERATIONS_RUNBOOK.md).

### 1. A user reports the service is unavailable

> "The service isn't responding."

Acknowledge, capture the time it started, and confirm the affected environment
and URL.

### 2. Support checks `/health` and `/ready`

```bash
curl -s https://my-service.example/health
curl -s https://my-service.example/ready
```

- Both healthy → the process is up; the problem may be networking, DNS, the
  client, or a specific endpoint. Re-scope.
- `/health` fails or times out → the process or container is unhealthy. Continue.
- No response at all → likely an infrastructure/ingress problem; lean toward
  escalation.

### 3. Support checks the logs

```bash
az containerapp logs show --name my-service --resource-group my-rg --follow
```

Look for `5xx` responses, errors from the centralized error handler, or a burst
of failures around the time the issue started. Note request paths and durations.

### 4. Support checks the recent deployment

```bash
curl -s https://my-service.example/
```

Compare the reported `version`/environment against the last known-good release
and the most recent CI/CD deployment timestamp. A failure that begins right after
a deploy strongly suggests the release as the cause.

### 5. Escalate if needed

Escalate when it is a full outage, a suspected security/data issue, the cause is
outside this service, or first-line actions (restart/redeploy/rollback) do not
restore it. Include impact, the running version, recent deployment info, and
sanitized log excerpts. See escalation notes in the
[Operations Runbook](OPERATIONS_RUNBOOK.md#6-escalation-notes).

### 6. Document the resolution

Record what happened, the root cause (if known), and the fix in the
[Operational Changelog](CHANGELOG_OPERATIONS.md) — without sensitive data. If a
secret may have been exposed, follow the rotation steps in the
[Security Baseline](SECURITY_BASELINE.md).

## Monitoring and Logging Concept

In a real environment, a simulated latency warning could be correlated with:

- elevated response times in Azure Monitor or Application Insights
- structured logs shipped from container stdout
- GitHub Actions deployment timestamps to see whether a release introduced the
  warning

## Why This Matters

The endpoint is intentionally fake, but the concept is real: production-minded
services should be observable, diagnosable, and easy to discuss in operational
terms. The flow above is the same one a support or operations engineer would run
against a real service.
