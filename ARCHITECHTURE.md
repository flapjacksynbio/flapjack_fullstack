# Architecture

## Overview

Flapjack is a research data platform for genetic circuit and assay workflows. It combines a browser-based client, a Django/Channels backend, relational persistence, and websocket-based computation/streaming endpoints.

This document describes:

- the current observed architecture in the repository
- the intended system boundaries
- operational and security concerns
- the recommended target deployment model

## System context

At a high level, Flapjack consists of four runtime layers:

1. **Frontend client**
   - React application served on port 3000 in local development
   - calls REST endpoints over HTTP
   - connects to websocket endpoints for analysis, plotting, and registry upload flows

2. **Backend application**
   - Django application served as ASGI with Gunicorn + Uvicorn workers
   - exposes REST endpoints for the registry and auth flows
   - exposes websocket routes through Django Channels

3. **Primary data store**
   - PostgreSQL
   - intended to hold the durable system of record for users, metadata, studies, assays, samples, and measurements

4. **Ephemeral messaging/cache layer**
   - Redis
   - used for Channels transport and similar short-lived coordination concerns
   - must not be treated as the durable source of truth

## Current observed implementation

### Frontend

The frontend is a React application using:

- React 16
- `react-app-rewired`
- Ant Design
- Redux
- Plotly

The local development frontend expects:

- `REACT_APP_HTTP_API=http://localhost:8000/api/`
- `REACT_APP_WS_API=ws://localhost:8000/ws/`

### Backend

The backend is a Django 3 application with:

- Django REST Framework
- JWT authentication
- Channels
- Redis channel layer
- Gunicorn + Uvicorn for ASGI serving

Observed URL structure:

- `/api/auth/register/`
- `/api/auth/log_in/`
- `/api/auth/refresh/`
- `/api/auth/user_info/`
- `/api/auth/log_out/`
- `/api/<registry-resource>/`

Observed websocket routes:

- `/ws/plot`
- `/ws/analysis`
- `/ws/registry`

### Registry/data API surface

The registry router currently includes endpoints for:

- study
- assay
- sample
- dna
- media
- strain
- measurement
- signal
- supplement
- chemical
- vector
- vectorall
- user
- assays_in_study
- vector_in_assay
- strain_in_assay
- media_in_assay
- signal_in_assay

These resources strongly suggest the core product boundary is a biological experiment and measurement registry with analysis and plotting layered on top.

## Component boundaries

### `flapjack_frontend`
Responsible for:

- user-facing navigation and data interaction
- token-driven authenticated API access
- websocket-driven interactive analysis/plot behavior
- rendering of registry and visualization workflows

It should not:

- embed secrets
- own authoritative business rules
- become the source of truth for access control or validation

### `flapjack_api`
Responsible for:

- authentication and identity
- authorization and permission enforcement
- persistence rules and data model lifecycle
- REST API behavior
- websocket orchestration
- business logic around registry, analysis, and plotting

It should not:

- assume local-only infrastructure
- rely on hardcoded environment-specific settings
- treat Redis as durable storage

### PostgreSQL
Responsible for:

- durable relational storage
- transactional integrity
- authoritative system-of-record persistence

It should not:

- be configured by hardcoded credentials in repo files
- be used without backups and restore procedures
- depend on ad hoc container-local storage in production

### Redis
Responsible for:

- channel layer transport
- short-lived cache/message coordination

It should not:

- store authoritative long-term data
- be required to recover historical data after restart

## Runtime flows

## 1. Authentication flow

1. User registers or logs in through `/api/auth/...`
2. Backend issues JWT refresh and access tokens
3. Frontend stores and sends bearer tokens to the backend
4. Refresh token is used to obtain new access tokens
5. Logout blacklists the provided refresh token

## 2. Registry CRUD flow

1. Frontend sends authenticated REST requests to `/api/...`
2. Django REST Framework resolves routing and permissions
3. Registry/business logic reads/writes PostgreSQL
4. Response is returned to frontend as JSON

## 3. Websocket analysis/plot flow

1. Frontend connects to `/ws/plot`, `/ws/analysis`, or `/ws/registry`
2. Django Channels routes websocket traffic
3. Redis is used as the channel layer backend
4. Backend returns streamed responses or computed results to the client

## Deployment model

## Current local model

Current local development uses a single Docker Compose file with:

- frontend container
- backend container
- postgres container
- redis container

This is adequate for local development only.

## Target production model

Production should use a split-responsibility model:

- frontend served as static assets or containerized web app behind TLS
- backend deployed as an ASGI app service
- managed PostgreSQL for durable storage
- managed Redis only if still required for Channels
- object storage for large uploaded files or exports
- secrets injected at runtime from environment or secret manager
- automated backups and restore runbooks

## Configuration boundaries

The repository must move toward explicit environment separation:

- `development`
- `staging`
- `production`

Recommended config categories:

- Django secret key
- allowed hosts
- debug mode
- CORS/CSRF origins
- database connection settings
- Redis settings
- file/object storage settings
- JWT/token settings
- logging and observability settings

No environment-specific secret should be committed to version control.

## Security posture

The current repository state indicates the codebase is still operating with development-oriented defaults.

Immediate security objectives:

- remove hardcoded secrets and credentials
- disable wildcard hosts/origins outside local development
- define production-safe auth/session/token settings
- add secure deployment defaults
- document incident recovery and restore procedures

## Observability and operations

The target operational baseline should include:

- structured application logs
- clear startup failures when required env vars are missing
- health endpoints for backend, database, and Redis dependencies
- migration strategy documented and scripted
- backup and restore procedures documented and tested
- CI checks for build, lint, and smoke validation

## Testing expectations

Current repository structure should evolve toward:

- backend unit/integration tests for auth and critical registry flows
- frontend tests for critical state and routing behavior
- smoke test that brings up Compose and validates API readiness
- migration test coverage for schema changes that affect persistent data

## Architecture risks

Current observed risks include:

- local-development settings embedded in application code
- hardcoded secrets and database credentials
- production-unsuitable permissive Django settings
- unclear persistence guarantees in current Compose setup
- no documented backup/restore contract
- aging framework/runtime versions that will make maintenance harder over time

## Open questions

1. What uploaded artifacts, if any, are currently stored on local container filesystems rather than in PostgreSQL or object storage?
2. Which websocket workloads are latency-sensitive enough to keep on Channels/Redis as-is?
3. What is the expected production deployment target: single VM, container platform, or managed app services?
4. Is there existing legacy data that must be imported before the current database is retired?
5. Which API behaviors are relied on by external clients such as `pyFlapjack` and must remain backward compatible?

## Architecture principles

1. PostgreSQL is the durable source of truth.
2. Redis is ephemeral.
3. Code must be runnable locally in Docker.
4. Production config must be explicit and environment-driven.
5. Security and recoverability are mandatory, not optional.
6. Major architecture changes require an ADR.
