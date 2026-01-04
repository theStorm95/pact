# API Contracts: Initialize Monorepo and Mobile App Foundation

**Feature**: 001-monorepo-mobile | **Phase**: 1 (Design & Contracts) | **Date**: 2026-01-03

## Overview

This feature is an infrastructure/tooling story focused on project structure initialization. It does not involve API endpoints, data transfer objects, or service contracts.

## Contracts

**None** - This story creates the monorepo structure and mobile app foundation but does not define any API contracts. API contracts will be introduced in later stories that implement backend functionality.

## Future API Contracts

Future stories will introduce API contracts:

- **Story 2.1** (User Registration): `POST /users/register` - Create new user account
- **Story 2.2** (User Login): `POST /auth/login` - Authenticate user and return JWT
- **Story 3.1** (Create Pact): `POST /pacts` - Create new immutable pact
- **Story 3.2** (Get User Pacts): `GET /pacts` - Retrieve all pacts for authenticated user
- **Story 4.1** (Today's View): `GET /pacts/today` - Get pacts due today
- **Story 4.2** (Check-off Pact): `POST /pacts/:id/completions` - Record pact completion

These contracts will be defined in their respective `contracts/` directories using OpenAPI 3.0 specification format.

## Configuration Files

While there are no API contracts, this story does create configuration files that define the structure:

### Workspace Configuration (`pnpm-workspace.yaml`)

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Package Metadata (`package.json`)

See [data-model.md](../data-model.md) for package.json structure details.

---

## Summary

This story does not introduce API contracts. It establishes the monorepo structure and mobile app foundation that will host future API clients and backend services. API contracts will be documented as RESTful OpenAPI specifications in subsequent stories that implement backend functionality.
