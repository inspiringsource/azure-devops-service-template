# Incident Simulation

`GET /api/incidents/demo` returns a harmless low-severity example for support
and logging demonstrations. `GET /error-demo` exercises centralized error
handling. They are not monitoring or fault-injection systems.

Both routes are available in tests and local development. In production they
return 404 unless `ENABLE_DEMO_ROUTES=true` is explicitly set. Normal cloud
deployments keep the flag false; enable it only for a controlled demonstration
and disable it afterwards.

## Example exercise

1. Confirm the report time, affected URL, and scope.
2. Check `/health`, `/ready`, and `/` for process state and deployed version.
3. Review Container Apps logs by generated request ID, status, path, and
   duration. Query parameters are intentionally absent from request logs.
4. Compare `APP_VERSION` with the deployed commit SHA or image digest.
5. If a release caused the issue, deploy the previous known-good immutable SHA
   tag or digest through the Bicep workflow.
6. Verify health and record a sanitized operational note.

Example log command:

```bash
az containerapp logs show \
  --name my-service \
  --resource-group my-rg \
  --follow
```

Escalate a full outage, suspected security or data issue, platform/network
failure, or any incident whose impact is growing. Include impact, timestamps,
deployed version, request IDs, and sanitized evidence.
