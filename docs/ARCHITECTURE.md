# Architecture

## App Structure

The application is intentionally simple and split by concern:

- `src/server.ts` starts the HTTP listener
- `src/app.ts` assembles middleware and routes
- `src/config/env.ts` centralizes environment parsing and defaults
- `src/routes/index.ts` defines the service endpoints
- `src/middleware/requestLogger.ts` records request metadata
- `src/middleware/errorHandler.ts` handles 404 and 500 responses

This keeps the runtime easy to understand while still matching the shape of a maintainable production-oriented service template.

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
5. Build the Docker image
6. Leave a realistic Azure deployment section ready for secret-backed enablement

This is enough to show quality gates and deployable artifact creation without claiming the demo is a full production system or enterprise platform.

## Azure Deployment Target Options

### 1. Azure App Service

Good fit for a simple web API where managed hosting and fast setup matter more than deep orchestration control.

### 2. Azure Container Apps

Good fit when the service should run as a container with revision-based deployments, simpler scaling, and clearer container-first operations.

### 3. Azure Kubernetes Service

Use AKS only when the platform actually needs Kubernetes-level orchestration, policy control, or multi-service operational patterns. For this demo, it is mentioned for completeness rather than implemented in depth.
