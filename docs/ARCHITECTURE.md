# Architecture

## App Structure

The starter is intentionally simple and split by concern:

- `src/server.ts` starts the HTTP listener
- `src/app.ts` assembles middleware and routes
- `src/config/env.ts` centralizes environment parsing and defaults
- `src/routes/index.ts` defines the service endpoints
- `src/middleware/requestLogger.ts` records request metadata
- `src/middleware/errorHandler.ts` handles 404 and 500 responses
- `template.config.json` holds starter defaults for name, display name, port, and deployment target
- `scripts/init-template.sh` helps adapt the starter to a new service name

This keeps the runtime easy to understand while still matching the shape of a maintainable production-style starter/template.

## Request Flow

1. An HTTP request reaches the Express app.
2. JSON parsing middleware is applied.
3. Request logging middleware tracks method, path, status, duration, and timestamp.
4. The request is routed to the appropriate endpoint.
5. Unknown routes fall through to the not-found handler.
6. Unhandled exceptions are normalized by the error-handling middleware.

## Health and Readiness Checks

- `GET /health` acts as a liveness-style endpoint with uptime and timestamp data.
- `GET /ready` acts as a readiness-style endpoint for load balancers, release validation, or container orchestration checks.

For a larger system, readiness would normally verify dependencies such as databases, queues, or external APIs. In this portfolio demo, it simply confirms that the process is ready to serve traffic.

## Logging

The logging middleware outputs structured JSON to standard output. That keeps the demo cloud-friendly because Azure App Service, Container Apps, and Kubernetes platforms commonly collect stdout/stderr into centralized logging pipelines.

Logged fields include:

- HTTP method
- request path
- response status code
- request duration
- timestamp

## CI/CD Pipeline

The GitHub Actions workflow demonstrates a practical baseline pipeline:

1. Check out the code
2. Install dependencies with `npm ci`
3. Run automated tests
4. Compile TypeScript
5. Run lint checks
6. Build the Docker image
7. On pushes to `main`, publish the image to GitHub Container Registry
8. Leave a realistic Azure deployment section ready for secret-backed enablement

In shorthand, the delivery flow is:

`code -> test -> build -> Docker image -> GHCR -> optional Azure deploy`

GHCR publishing uses `GITHUB_TOKEN`. Azure deployment placeholders should use GitHub Secrets or Azure Key Vault backed credentials. Real secrets should never be committed.

This is enough to show quality gates and deployable artifact creation without claiming the demo is a full production system or enterprise platform.

## Azure Container Apps Architecture

The included [infra/main.bicep](../infra/main.bicep) example targets Azure Container Apps with a minimal resource set:

- Existing resource group
- Log Analytics workspace
- Container Apps environment
- Public-facing Container App running the service container image

This matches the service shape well because the starter already exposes:

- HTTP traffic on a configurable container port
- `GET /health` for liveness-style monitoring
- `GET /ready` for readiness-style checks
- stdout/stderr logging that can flow into Azure monitoring

## Azure Deployment Target Options

### 1. Azure Container Apps

Best fit for this starter when you want a modern Azure container runtime without introducing Kubernetes complexity.

### 2. Azure App Service

Also reasonable for a small API if App Service matches the target organization better than Container Apps.

### 3. Azure Kubernetes Service

Use AKS only when the platform actually needs Kubernetes-level orchestration, policy control, or multi-service operational patterns. For this demo, it is mentioned for completeness rather than implemented in depth.
