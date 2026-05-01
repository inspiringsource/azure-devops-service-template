# Azure DevOps Service Template

`azure-devops-service-template` is a public portfolio demo and reusable starter template that shows how I would structure, test, containerize, and deliver a simple Node.js service using a production-style Azure and DevOps workflow. It is intentionally lightweight: no database, no authentication, and no unnecessary platform complexity.

## Project Purpose

This repository is designed to demonstrate practical Azure/DevOps workflow skills and credible engineering habits rather than business logic depth. It is not presented as a real production system.

- Clean TypeScript service structure
- Basic operational endpoints for health and readiness
- Logging and centralized error handling
- Automated testing with Jest
- Docker packaging for local and cloud deployment
- GitHub Actions CI/CD with Azure-ready deployment placeholders
- Reusable service template structure for future demos or small internal APIs

## Architecture Overview

The API is a single Express service organized by clear responsibilities:

- `src/config`: environment configuration and runtime defaults
- `src/routes`: HTTP endpoints
- `src/middleware`: request logging and error handling
- `tests`: endpoint coverage using `supertest`
- `infra`: portfolio notes on future infrastructure automation
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
4. `docker build`

The workflow also includes commented Azure deployment placeholders so the repo remains safe to publish without live credentials.

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

## Docker

### Build and run with Docker

```bash
docker build -t azure-devops-service-template .
docker run -p 3000:3000 --env-file .env azure-devops-service-template
```

### Run with Docker Compose

```bash
docker compose up --build
```

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

## Azure Deployment Concept

This repo is Azure-ready rather than Azure-bound. The deployment path is intentionally documented and scaffolded without embedding credentials, making it suitable as a public portfolio demo and starter template.

### Option 1: Azure App Service

- Build and push the Docker image to Azure Container Registry
- Authenticate in GitHub Actions with `AZURE_CREDENTIALS`
- Deploy the image to an App Service Web App using `AZURE_WEBAPP_NAME`

### Option 2: Azure Container Apps

- Push the image to a registry
- Use GitHub Actions to update the Container App revision
- Keep secrets such as `AZURE_RESOURCE_GROUP` and registry credentials in GitHub Secrets

### Option 3: Extend with IaC

- Add Bicep or Terraform under `infra/`
- Provision the resource group, registry, monitoring, and runtime environment
- Promote the same artifact across environments

## Production-Readiness Notes

This is a portfolio demo and reusable template, but it follows credible production-oriented patterns:

- Explicit health and readiness endpoints
- Environment-driven configuration
- Structured request logging
- Centralized error handling
- Repeatable CI build and test pipeline
- Containerized runtime for consistent deployment behavior

## What This Project Demonstrates

- Ability to package a small API as a reusable Azure DevOps service template
- Ability to design a small service with operational concerns in mind
- Familiarity with TypeScript/Express backend structure
- Practical CI/CD pipeline design using GitHub Actions
- Understanding of Azure deployment targets and safe secret handling
- Clear engineering documentation suitable for recruiters and hiring managers
