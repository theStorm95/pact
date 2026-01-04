# Data Model: Initialize Monorepo and Mobile App Foundation

**Feature**: 001-monorepo-mobile | **Phase**: 1 (Design & Contracts) | **Date**: 2026-01-03

## Overview

This feature is an infrastructure/tooling story focused on project structure initialization. It does not involve user-facing data entities, database schemas, or API data models.

## Entities

**None** - This story creates the monorepo structure and mobile app foundation but does not define any data entities. Data models will be introduced in later stories (e.g., Story 2.x for User and Authentication, Story 3.x for Pact entities).

## Configuration Entities

While there are no data entities, this story does create configuration structures:

### 1. Workspace Configuration

**File**: `pnpm-workspace.yaml`

**Structure**:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Purpose**: Defines which directories are included in the pnpm workspace, enabling dependency resolution and code sharing.

---

### 2. Root Package Metadata

**File**: `package.json` (root)

**Structure**:

```json
{
  "name": "pact-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "mobile": "cd apps/mobile && npx expo start"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

**Purpose**: Defines workspace metadata, shared scripts, and workspace-level dependencies.

---

### 3. Mobile App Package Metadata

**File**: `apps/mobile/package.json`

**Structure** (created by Expo template):

```json
{
  "name": "@pact/mobile",
  "version": "1.0.0",
  "main": "expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Purpose**: Defines mobile app dependencies, scripts, and metadata. The `@pact/mobile` name follows npm scoped package conventions.

---

### 4. TypeScript Configuration

**File**: `apps/mobile/tsconfig.json`

**Structure**:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

**Purpose**: Configures TypeScript compiler with strict mode enabled (Constitution requirement).

---

## Relationships

Since there are no data entities, there are no entity relationships. However, the configuration structures have dependencies:

```
pnpm-workspace.yaml
  ↓ defines workspace structure
package.json (root)
  ↓ manages workspace packages
apps/mobile/package.json
  ↓ depends on workspace dependencies
apps/mobile/tsconfig.json
  ↓ extends Expo TypeScript base config
```

## State Transitions

**None** - Infrastructure configuration is static after initialization. No runtime state transitions.

## Validation Rules

**None** - Configuration files are validated by their respective tools:

- `pnpm-workspace.yaml`: Validated by pnpm CLI
- `package.json`: Validated by pnpm and npm JSON schema
- `tsconfig.json`: Validated by TypeScript compiler

## Future Data Models

Future stories will introduce data entities:

- **Story 2.1** (User Registration): `User` entity with authentication fields
- **Story 3.1** (Create Pact): `Pact` entity with immutable action/frequency/duration fields
- **Story 4.1** (Today's View): `Completion` entity for check-off records
- **Story 5.x** (Sync): Offline queue data structures

These entities will be defined in their respective `data-model.md` files.

---

## Summary

This story does not introduce data models. It establishes the monorepo structure and mobile app foundation that will host future data models and business logic. The configuration structures created in this story are necessary prerequisites for all subsequent development.
