# Data Model: Initialize Web App and Shared Packages

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-01-03  
**Status**: N/A - No Data Model

## Overview

This feature establishes infrastructure (web application and shared packages workspace) and does not involve data entities, database schemas, or state management of business domain objects.

## Entities

**No data entities** - This is a development environment and code organization feature.

## Rationale

The Initialize Web App and Shared Packages feature focuses on:

- Creating the Vite + React web application structure
- Establishing shared packages workspace for code reuse
- Configuring TypeScript path aliases and module resolution
- Setting up pnpm workspace configuration

These are infrastructure concerns that do not require data modeling. Future features (Epic 2: Authentication, Epic 3: Pact Management) will introduce data entities that will be documented in their respective data-model.md files.

## Configuration State

While this feature doesn't have data entities, it does establish configuration that will be used by future features:

### Package Configuration Files

**Purpose**: Define workspace relationships and module exports

**Files**:

- `pnpm-workspace.yaml`: Defines which directories are part of the monorepo
- `package.json` (root): Defines workspace scripts and shared dependencies
- `package.json` (per package): Defines exports and dependencies for each shared package

**Structure** (not a data entity, but configuration):

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### TypeScript Configuration

**Purpose**: Define module resolution and type checking rules

**Files**:

- `tsconfig.json` (root): Base TypeScript configuration extended by all workspaces
- `tsconfig.json` (per workspace): Workspace-specific TypeScript settings
- Path aliases for `@pact/shared/*` imports

**Configuration** (not a data entity):

```json
{
  "compilerOptions": {
    "paths": {
      "@pact/shared-types": ["./packages/shared/types"],
      "@pact/shared-api": ["./packages/shared/api"],
      "@pact/shared-utils": ["./packages/shared/utils"],
      "@pact/shared-hooks": ["./packages/shared/hooks"]
    }
  }
}
```

## Future Data Model References

When future features introduce data entities, they will be documented in their respective `data-model.md` files. Expected entities include:

- **User** (Epic 2: Authentication) - User accounts and authentication
- **Pact** (Epic 3: Pact Management) - Action-based commitments with frequency and timeframe
- **Completion** (Epic 4: Daily Tracking) - Daily check-offs for pact progress
- **Reflection** (Epic 7: Pact Completion) - User learning notes at pact completion

This feature establishes the infrastructure that will support those data entities.
