# Azure DevOps Service Starter

A production-style Azure DevOps service starter built as a public portfolio demo. Including CI/CD, Docker, testing, logging, health checks, and Azure-ready infrastructure using Bicep.

## Project Purpose

This repository is designed to use Azure/DevOps workflow skills and credible engineering habits rather than business logic depth. It is not presented as a real production system. The goal is to show how a starter/template can be built with honest operational basics and a realistic delivery path.

- Clean TypeScript service structure
- Basic operational endpoints for health and readiness
- Logging and centralized error handling
- Automated testing with Jest
- Docker packaging for local and cloud deployment
- GitHub Actions CI/CD that validates the codebase and publishes a Docker image to GHCR
- Minimal Azure Container Apps Bicep example
- Reusable service starter/template structure for future demos or small internal APIs

## Architecture Overview

The API is a single Express service organized by clear responsibilities:

- `src/config`: environment configuration and runtime defaults
- `src/routes`: HTTP endpoints
- `src/middleware`: request logging and error handling
- `tests`: endpoint coverage using `supertest`
- `infra`: minimal Azure Container Apps infrastructure example
- `docs`: architecture and monitoring concepts

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the deeper design walkthrough.

## API Endpoints

- `GET /`: service metadata, environment, and version
- `GET /health`: liveness-style status, timestamp, and uptime
- `GET /ready`: readiness-style status
- `GET /api/incidents/demo`: simulated incident payload for observability demos

## CI/CD Pipeline

The GitHub Actions workflow in [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) runs on pushes to `main` and on pull requests. It performs:

1. `npm ci`
2. `npm test`
3. `npm run build`
4. `npm run lint`
5. `docker build`
6. On `main`, logs in to GitHub Container Registry and pushes:
   `ghcr.io/${{ github.repository }}:${{ github.sha }}`
7. Optionally tags and pushes `latest`
8. Leaves Azure deployment as an opt-in placeholder after the image publish step

GHCR publishing uses the repository `GITHUB_TOKEN`. Azure deployment remains optional so normal CI/CD success does not depend on cloud credentials.

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The API starts on `http://localhost:3000` by default.

## Starter Customization

The repository includes [template.config.json](template.config.json) for starter metadata defaults and [scripts/init-template.sh](scripts/init-template.sh) for safe renaming of the common starter identifiers.

Example:

```bash
./scripts/init-template.sh my-new-service
```

The script creates backup files, updates common names in the starter, and prints follow-up steps for manual review.

## Docker

### Build and run with Docker

```bash
docker build -t azure-devops-service-starter .
docker run -p 3000:3000 --env-file .env azure-devops-service-starter
```

### Run with Docker Compose

```bash
docker compose up --build
```

The compose setup uses `.env.example`, restarts unless stopped, and includes a simple `/health` check.

## Testing

Run the automated test suite:

```bash
npm test
```

Build the TypeScript project:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Infrastructure Example

The starter now includes [infra/main.bicep](infra/main.bicep), a minimal Azure Container Apps example that provisions:

- Log Analytics workspace
- Container Apps environment
- Container App

The Bicep file assumes the resource group already exists and keeps parameters limited to the values most likely to vary between environments.

Example deployment:

```bash
az deployment group create \
  --resource-group my-rg \
  --template-file infra/main.bicep \
  --parameters appName=my-service containerImage=ghcr.io/my-org/my-service:latest
```

## Azure Deployment Concept

This repo is Azure-ready rather than Azure-bound. The deployment path is intentionally documented and scaffolded without embedding credentials, making it suitable as a public portfolio demo and starter/template.

### Option 1: Azure Container Apps

- Build and push the Docker image to GHCR or another registry
- Authenticate in GitHub Actions with `AZURE_CREDENTIALS`
- Deploy the image to a Container App using `AZURE_CONTAINER_APP_NAME` and `AZURE_RESOURCE_GROUP`

### Option 2: Azure App Service

- Use the same container image approach if App Service is the preferred hosting model
- Authenticate with `AZURE_CREDENTIALS`
- Deploy using a Web App-specific action and `AZURE_WEBAPP_NAME`

### Option 3: Extend with IaC

- Extend the supplied Bicep or replace it with Terraform under `infra/`
- Provision the resource group, registry, monitoring, and runtime environment
- Promote the same artifact across environments

## Secrets Guidance

- GHCR publishing in GitHub Actions uses the built-in `GITHUB_TOKEN`.
- Azure deployment placeholders expect values such as `AZURE_CREDENTIALS`, `AZURE_RESOURCE_GROUP`, `AZURE_CONTAINER_APP_NAME`, and optionally `AZURE_ENVIRONMENT_NAME`.
- Store real secrets in GitHub Secrets or Azure Key Vault.
- Never commit real credentials, publish profiles, or tokens into the repository.

## Production-Readiness Notes

This is a public portfolio demo and reusable starter/template, but it follows credible production-style patterns:

- Explicit health and readiness endpoints
- Environment-driven configuration
- Structured request logging
- Centralized error handling
- Repeatable CI build, lint, test, and image packaging pipeline
- Registry publishing through GHCR
- Azure Container Apps infrastructure example
- Containerized runtime for consistent deployment behavior

## What This Project Demonstrates

- Ability to package a small API as a reusable Azure DevOps service starter
- Ability to design a small service with operational concerns in mind
- Familiarity with TypeScript/Express backend structure
- Practical CI/CD pipeline design using GitHub Actions and GHCR
- Understanding of Azure deployment targets and safe secret handling
- Clear engineering documentation suitable for recruiters and hiring managers

# Azure DevOps Service Starter

A reusable Azure DevOps service starter that I use as a baseline for building and deploying small services. This repository is also published as a portfolio project to demonstrate how I structure, test, package, and deliver services in a production-oriented workflow.

This is not a production system, but it reflects patterns I would apply in real environments.

---

## Why this exists

Instead of creating isolated demo projects, I prefer maintaining a reusable starter that I can evolve and reuse across services. This repository serves two purposes:

- A **practical starting point** for future services
- A **public demonstration** of how I approach CI/CD, containerization, and cloud deployment

The focus is on **operational readiness**, not business logic.

---

## What this starter includes

- TypeScript-based Node.js service with a clean structure
- Health and readiness endpoints (`/health`, `/ready`)
- Structured logging and centralized error handling
- Automated tests using Jest
- Docker setup for consistent runtime environments
- GitHub Actions CI/CD pipeline
- Docker image publishing to GitHub Container Registry (GHCR)
- Minimal Azure Container Apps infrastructure using Bicep
- Lightweight template system for reuse

---

## How I use this

This repository is meant to be copied and adapted when starting a new service.

Typical workflow:

1. Clone or copy this repository
2. Run the init script to rename the service
3. Adjust environment variables and configuration
4. Implement actual business logic
5. Extend infrastructure if needed
6. Deploy using the existing CI/CD pipeline

The goal is to avoid re-solving the same setup problems every time.

---

## Project structure

```
src/
  config/       runtime configuration
  routes/       API endpoints
  middleware/   logging and error handling

tests/          API and behavior tests
infra/          Azure infrastructure (Bicep)
docs/           architecture and concepts
.github/        CI/CD pipeline
scripts/        template utilities
```

---

## API endpoints

- `GET /` → service metadata (name, environment, version)
- `GET /health` → liveness probe (uptime, timestamp)
- `GET /ready` → readiness probe
- `GET /api/incidents/demo` → simulated incident output (for logging/monitoring demos)

These are intentionally included because they are standard in containerized/cloud environments.

---

## CI/CD pipeline

The GitHub Actions pipeline is designed to reflect a real delivery flow:

1. Install dependencies (`npm ci`)
2. Run tests
3. Lint code
4. Build TypeScript
5. Build Docker image
6. Push image to GHCR

Image format:
```
ghcr.io/${{ github.repository }}:${{ github.sha }}
```

This ensures:
- reproducible builds
- versioned artifacts
- deployable images

Azure deployment is intentionally left as an optional step.

---

## Docker

### Build

```
docker build -t azure-devops-service-starter .
```

### Run

```
docker run -p 3000:3000 --env-file .env azure-devops-service-starter
```

### Docker Compose

```
docker compose up --build
```

Includes:
- health check (`/health`)
- restart policy
- environment file support

---

## Template usage

To reuse this starter:

```
./scripts/init-template.sh my-service-name
```

This updates:
- service name references
- common identifiers

Then review changes manually before continuing.

---

## Infrastructure (Azure)

The repository includes a minimal Bicep file:

```
infra/main.bicep
```

It defines:
- Log Analytics workspace
- Container Apps environment
- Container App

Example deployment:

```
az deployment group create \
  --resource-group my-rg \
  --template-file infra/main.bicep \
  --parameters appName=my-service containerImage=ghcr.io/my-org/my-service:latest
```

This is intentionally minimal, but provides a real starting point.

---

## Secrets and configuration

- GHCR uses `GITHUB_TOKEN` (no manual setup required)
- Azure deployment would use:
  - `AZURE_CREDENTIALS`
  - `AZURE_RESOURCE_GROUP`
  - `AZURE_CONTAINER_APP_NAME`

Secrets should be stored in:
- GitHub Secrets
- or Azure Key Vault

Never committed to the repository.

---

## Design approach

This starter reflects how I approach small services:

- Keep services simple, observable, and deployable
- Treat CI/CD as part of the system, not an afterthought
- Use containers to standardize runtime behavior
- Include health/readiness from the start
- Prefer minimal but real infrastructure over mock setups

---

## What this demonstrates

- Ability to structure a backend service with operational concerns in mind
- Practical CI/CD pipeline design (build → test → package → publish)
- Containerization and reproducible builds
- Basic Azure infrastructure knowledge (Container Apps + Bicep)
- Awareness of production patterns without over-engineering

---

## Notes

This repository is intentionally scoped:
- no database
- no authentication
- no complex domain logic

The focus is the **delivery pipeline and service structure**, not the application itself.