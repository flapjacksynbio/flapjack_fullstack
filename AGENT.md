# AGENT

This file defines how ChatGPT and Codex should collaborate in this repository.

## Mission

Keep Flapjack runnable, understandable, and safe to evolve.

The short-term mission is not feature expansion. The short-term mission is to stabilize the repository, harden persistence and configuration, and document the system well enough that future implementation work becomes predictable.

## Repository truths

Unless code proves otherwise, assume the following:

- `flapjack_api` is the backend system of record and business logic boundary
- `flapjack_frontend` is the user-facing client
- PostgreSQL is intended to be the durable relational datastore
- Redis is an ephemeral dependency, not a durable data store
- Docker Compose must continue to support local development
- the current codebase contains development-oriented security and persistence gaps
- documentation is part of the product and must be updated with implementation changes

## Non-negotiable rules

1. Prefer small, reviewable changes.
2. Keep the project runnable after every meaningful change.
3. Do not introduce or commit secrets.
4. Do not silently change the domain model.
5. Use migrations for schema evolution.
6. Write tests for non-trivial logic when adding or changing behavior.
7. Update docs when architecture, setup, or behavior changes.
8. Surface assumptions and blockers explicitly.
9. Avoid hidden scope expansion.
10. Ask for an ADR when the architecture meaningfully changes.

## Decision split

### ChatGPT owns
- ambiguity reduction
- architecture reasoning
- task decomposition
- milestone planning
- tradeoff analysis
- deciding whether work is local-dev-only or production-affecting
- checking whether Codex output matches intent

### Codex owns
- editing files
- implementing scoped changes
- refactoring within approved boundaries
- wiring configuration
- adding tests
- updating docs as part of the same change
- preparing small commits and clear diffs

When in doubt, ChatGPT decides the plan and Codex implements the scoped step.

## Required startup behavior for any new work

Before making major changes, review:

- `README.md`
- `ARCHITECTURE.md`
- `PRODUCT.md`
- `AGENT.md`
- `ADR-001.md`

Then inspect the touched code paths before editing.

Do not recreate these docs from scratch unless explicitly asked. Patch them when they drift.

## Working style

### Allowed
- incremental refactors
- narrow-scope hardening
- fixing unsafe defaults
- adding missing documentation
- improving runtime checks
- adding CI and smoke validation
- introducing `.env.example` files with placeholders only

### Not allowed without explicit review
- framework rewrites
- broad API redesign
- renaming core domain resources casually
- switching persistence technology without an ADR
- deleting or bypassing migrations
- large cross-cutting refactors without an implementation plan

## Standard workflow

### 1. Inspect
Read the relevant code and docs.

### 2. Summarize
State:
- what is true now
- what is risky
- what will change
- what will not change

### 3. Plan
Break work into small steps.

A good plan:
- preserves runtime behavior where practical
- prioritizes security and data durability
- identifies migration and rollback implications

### 4. Implement
Make the smallest viable change set.

### 5. Validate
Run the narrowest meaningful checks available.

Examples:
- `docker compose config`
- app build checks
- migration checks
- backend smoke path validation
- frontend test command if relevant

### 6. Document
If code changes behavior or architecture, update docs in the same unit of work.

## Required reporting format for implementation tasks

When reporting work, include:

1. files changed
2. why each file changed
3. commands run
4. validation results
5. assumptions
6. blockers
7. follow-up work

## Documentation rules

- `README.md` explains how to run and orient to the repo
- `ARCHITECTURE.md` explains design and boundaries
- `PRODUCT.md` explains user/problem/scope intent
- `AGENT.md` explains how agents work here
- `ADR-001.md` and future ADRs explain major decisions

If a code change invalidates one of these documents, update it immediately.

## Security rules

- Never hardcode credentials, tokens, or secrets.
- Prefer environment variables with fail-fast validation.
- Keep development and production settings separate.
- Restrict CORS, hosts, and debug settings appropriately.
- Do not assume a local Docker setup is production-safe.

## Persistence rules

- PostgreSQL is the authoritative store for durable application data.
- Redis is ephemeral.
- Large uploaded artifacts should move to object storage if durability or scale requires it.
- Every persistence-affecting change must consider:
  - migration path
  - backup implications
  - restore implications
  - rollback implications

## ADR triggers

Create or update an ADR when:

- there are multiple reasonable architecture options
- a storage or deployment decision has lasting impact
- authentication/session behavior changes materially
- a change alters the boundary between frontend, backend, DB, Redis, or object storage
- a decision will likely need future revisiting

## Current highest-priority work

1. remove hardcoded secrets and credentials
2. fix persistence assumptions in local and production config
3. document backup and restore
4. add CI and smoke validation
5. make configuration environment-driven
6. reduce production risk without rewriting the system

## Escalation rule

If a requested change would:
- risk data loss,
- break compatibility unexpectedly,
- or trigger a broad redesign,

stop, summarize the tradeoff, and require an explicit plan or ADR before proceeding.
