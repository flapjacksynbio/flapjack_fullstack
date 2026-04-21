# Product

## Product name

Flapjack Fullstack

## Product summary

Flapjack is a web application and API for storing, organizing, analyzing, and visualizing data from genetic circuit and assay workflows.

The product combines:

- a researcher-facing web frontend
- a programmatic API
- registry-style metadata management
- websocket-enabled analysis and plotting workflows

## Problem statement

Researchers and engineering teams working with assay and genetic circuit data need a reliable system for:

- organizing studies, assays, samples, vectors, strains, media, signals, and measurements
- preserving data over time
- querying data programmatically
- running analysis and visualization workflows
- sharing access across users without losing provenance and structure

The repository in its current state provides the core shape of this product, but it needs operational hardening so that the system can be trusted as a maintained software tool rather than only a local research deployment.

## Target users

### Primary users
- synthetic biology researchers
- computational biology researchers
- lab engineers and data stewards
- developers integrating Flapjack into scientific workflows

### Secondary users
- maintainers of the Flapjack codebase
- infrastructure/operators supporting hosted deployments
- downstream client developers, including Python users of `pyFlapjack`

## Goals

1. Provide a durable system of record for experimental metadata and measurements.
2. Support authenticated user access through web and API interfaces.
3. Preserve a clear domain model for studies, assays, samples, and measurements.
4. Support interactive analysis and plotting workflows.
5. Make the stack reproducible for local development.
6. Make production persistence secure, recoverable, and maintainable.
7. Keep the platform backward-compatible enough for existing Flapjack usage patterns where practical.

## Non-goals

1. Rewriting the platform from scratch before stabilization.
2. Replacing the scientific domain model without strong migration justification.
3. Moving core business logic into the frontend.
4. Treating ad hoc container storage as acceptable production persistence.
5. Broad product redesign before security and recoverability are addressed.

## Main workflows

## 1. User onboarding and authentication
- register a user
- log in with username or email
- receive access and refresh tokens
- refresh sessions
- retrieve user info
- log out safely

## 2. Registry management
- create and manage studies
- create and manage assays within studies
- attach samples and biological/material metadata
- store measurements and related domain objects
- retrieve and filter registry data via API

## 3. Scientific analysis and plotting
- request plot and analysis operations through websocket-backed endpoints
- stream or retrieve computed results
- use API and frontend together for exploration workflows

## 4. Programmatic access
- use the REST API directly
- integrate with Python workflows through `pyFlapjack`
- enable reproducible scripted access to the data registry

## Success criteria

A successful v1 stabilization of this repository means:

- the repository can be cloned and run locally with clear instructions
- no secrets are committed in version control
- database configuration is environment-driven
- production persistence is designed around managed durable storage
- backup and restore procedures are documented
- migrations are the supported way to evolve schema
- the core auth and registry flows remain functional
- future contributors can understand the codebase without reverse engineering the architecture

## Scope for the next iteration

The next delivery cycle should focus on stabilization and hardening, not net-new product surface area.

### In scope
- document the current architecture and product boundaries
- harden configuration and secret handling
- define secure durable production persistence
- preserve and clarify the existing API/backend/frontend roles
- add CI/testing/documentation scaffolding
- establish backup/restore and migration expectations
- clarify what belongs in PostgreSQL, Redis, and object storage

### Out of scope
- major domain model redesign
- frontend redesign unrelated to maintainability
- replacing Django/React solely for technology preference
- introducing broad new analysis features before reliability work

## Product constraints

1. Existing API consumers may depend on current endpoint shapes.
2. Local Docker-based development should remain possible.
3. Data integrity matters more than short-term implementation convenience.
4. Production storage must survive the deletion of any single local database instance.
5. Secrets must never be checked into source control.
6. The product serves scientific workflows, so provenance and data structure clarity matter.

## Product risks

1. Loss of historical data if persistence remains tied to fragile local container assumptions.
2. Security exposure from hardcoded secrets and permissive settings.
3. Maintenance burden from outdated dependencies and undocumented architecture.
4. Breaking downstream consumers if API behavior changes without coordination.

## Product direction

The immediate product direction is:

- keep the existing product shape
- harden the platform
- preserve user workflows
- make persistence trustworthy
- make the repository understandable enough for sustained Codex-assisted development
