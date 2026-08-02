# Operations Runbook

## Health and identity

```bash
curl --fail --silent https://my-service.example/health
curl --fail --silent https://my-service.example/ready
curl --fail --silent https://my-service.example/
```

`/health` proves the process is alive. `/ready` is intentionally shallow until
required dependencies are added. `/` reports `APP_VERSION`, which the release
workflow sets to the deployed commit SHA.

## Logs

Each request log contains the generated request ID, method, path without query
parameters, status, duration, and timestamp. The same request ID is returned in
the `x-request-id` response header.

```bash
docker compose logs --follow

az containerapp logs show \
  --name my-service \
  --resource-group my-rg \
  --follow
```

Do not copy tokens, personal data, or sensitive payloads into incident notes.

## Restart or redeploy

Local restart:

```bash
docker compose restart
```

Azure releases are manual. Re-run the release workflow for a chosen commit and
enable its protected deployment job, or deploy a known immutable image directly:

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file infra/main.bicep \
  --parameters \
    appName=my-service \
    containerImage=ghcr.io/my-org/my-service@sha256:<digest> \
    deploymentVersion=<full-commit-sha>
```

The GHCR package must be public for this secret-free template. Private GHCR
requires registry credentials. ACR with managed identity is recommended for a
production extension.

## Triage

1. Confirm `/health` and `/ready`, then scope the impact.
2. Read `/` and compare its version with the expected release.
3. Find related logs using time and request ID.
4. Check the GitHub release run and Azure deployment result.
5. Restart, redeploy a known digest, roll back, or escalate.
6. Verify all three endpoints and document the result.

## Rollback

Identify the last known-good commit-SHA tag or digest and deploy it through the
same Bicep path. Do not use a mutable tag as the rollback reference.

The template uses single-revision mode. A successful deployment makes the new
revision active; this starter does not configure multiple active revisions or
weighted traffic shifting. Rollback therefore means deploying the previous
known-good image again.

Escalate full outages, security/data concerns, infrastructure failures, or
unresolved incidents. Include impact, time, version/digest, request IDs,
sanitized logs, and actions already attempted.
