# Flapjack Fullstack

Flapjack Fullstack is the deployment and development repository for the Flapjack web application: a full-stack system for storing, querying, analyzing, and visualizing genetic circuit and assay data.

This repository brings together:

- `flapjack_api`: Django/Channels backend, REST API, authentication, and websocket endpoints
- `flapjack_frontend`: React frontend
- `docker-compose.yml`: local orchestration for the app stack

## Purpose

This repository exists to make Flapjack runnable as a single system during development and to provide the foundation for a production-ready deployment.

The application currently supports:

- user registration, login, token refresh, logout, and user info retrieval
- study, assay, sample, vector, strain, media, signal, measurement, and related registry operations
- websocket-backed analysis, plotting, and registry upload flows
- programmatic access through a documented REST and websocket API

## Current stack

### Backend
- Python 3.7 container
- Django 3.0.5
- Django REST Framework
- Channels + Redis channel layer
- JWT authentication via `djangorestframework-simplejwt`
- Gunicorn + Uvicorn worker for ASGI serving

### Frontend
- React 16
- `react-app-rewired`
- Ant Design
- Redux
- Plotly

### Infrastructure
- Docker Compose
- PostgreSQL 12
- Redis

## Repository layout

```text
.
├── flapjack_api/
│   ├── flapjack_api/        # Django project config, ASGI/WSGI, routing, settings
│   ├── accounts/            # Authentication endpoints
│   ├── registry/            # Core data registry API
│   ├── analysis/            # Analysis services / websocket handlers
│   ├── plot/                # Plot services / websocket handlers
│   ├── requirements.txt
│   └── Dockerfile
├── flapjack_frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml
Local development
Prerequisites
Docker
Docker Compose
Frontend environment file
```

Create flapjack_frontend/.env.dev with:

REACT_APP_HTTP_API=http://localhost:8000/api/
REACT_APP_WS_API=ws://localhost:8000/ws/
Start the stack
docker compose up --build
Run database migrations

Open a shell in the API container:

docker exec -it flap_api bash

Then run:

python manage.py migrate
Access the app
Frontend: http://localhost:3000
Backend API: http://localhost:8000
Auth endpoints: http://localhost:8000/api/auth/
Registry endpoints: http://localhost:8000/api/
Websocket base paths: /ws/plot, /ws/analysis, /ws/registry
Common development tasks
Create new migrations
docker exec -it flap_api bash
python manage.py makemigrations
python manage.py migrate
Rebuild the stack
docker compose down
docker compose up --build
View logs
docker compose logs -f
Current state and important warnings

This repository is valuable but not yet production-hardened.

Current code and configuration indicate several issues that must be addressed before using this stack as a trusted system of record:

secrets and database credentials are currently hardcoded in the repository
Django is configured with permissive development defaults
the current Compose setup should not be assumed to provide production-grade persistence
backup, restore, and disaster recovery workflows are not yet documented in this repository

Treat the current Docker Compose setup as a local development environment, not as a secure production deployment.

Production direction

The intended production target for Flapjack is:

managed PostgreSQL for durable primary storage
environment-based secrets only
encrypted backups and restore documentation
Redis for ephemeral channel-layer and cache concerns only
object storage for large uploaded data if file volume grows beyond database suitability
separate development, staging, and production configuration

See ARCHITECTURE.md and ADR-001.md for the recommended target state.

API and related projects
API docs: https://flapjacksynbio.github.io/flapjack_api
Python client: https://github.com/flapjacksynbio/pyFlapjack
How to work in this repository
For maintainers
keep changes small and reversible
keep Docker Compose runnable
document architecture changes in this repo
avoid introducing new secrets into version control
update docs when runtime behavior changes
For ChatGPT and Codex

Start with these files before making major changes:

README.md
ARCHITECTURE.md
PRODUCT.md
AGENT.md
ADR-001.md

Use them as the working contract for the repository. If code and docs diverge, patch the docs or code explicitly rather than silently working around inconsistencies.

Next priorities
remove hardcoded secrets and database credentials
fix persistence and deployment assumptions
document backup and restore
add CI and test coverage for critical paths
separate local development settings from production settings
