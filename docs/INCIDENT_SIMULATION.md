# Incident Simulation

## Purpose

The `GET /api/incidents/demo` endpoint exists to show how a small service can expose or simulate an operational concern without needing a real failure or a complex monitoring stack.

## Demo Use Cases

This endpoint can support a portfolio walkthrough in several ways:

- Show how a suspicious but non-critical event might appear in logs
- Demonstrate how dashboards or alerts could classify low-severity issues
- Explain how operational metadata can be surfaced without exposing internal systems

## Monitoring and Logging Concept

In a real environment, a simulated latency warning could be correlated with:

- elevated response times in Azure Monitor or Application Insights
- structured logs shipped from container stdout
- GitHub Actions deployment timestamps to see whether a release introduced the warning

## Example Story for a Recruiter or Interviewer

You can describe the flow like this:

1. A user or synthetic check hits the demo incident endpoint.
2. The request logger captures the request metadata.
3. A monitoring platform aggregates the event and response timing.
4. Engineers inspect logs and metrics to determine whether the warning is harmless or a sign of degradation.

## Why This Matters

The endpoint is intentionally fake, but the concept is real: production-minded services should be observable, diagnosable, and easy to discuss in operational terms.
