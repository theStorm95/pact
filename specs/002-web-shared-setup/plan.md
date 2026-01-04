# Implementation Plan: Initialize Web App and Shared Packages

**Branch**: `002-web-shared-setup` | **Date**: 2026-01-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-web-shared-setup/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature establishes the web development environment and shared packages infrastructure for the Pact monorepo. It creates a Vite + React + TypeScript web application at `/apps/web` with hot module replacement and production build capabilities, establishes a shared packages workspace at `/packages/shared` with four module categories (types, api, utils, hooks), and configures TypeScript path aliases (`@pact/shared/*`) and pnpm workspace for seamless cross-platform code sharing. This work enables the 70%+ code sharing architectural requirement and provides a working web development foundation for all future features.

## Technical Context

**Language/Version**: TypeScript 5.3+ with strict mode enabled  
**Primary Dependencies**:

- React 18+ (web framework)
- Vite 5+ (build tool and dev server)
- pnpm 8+ (package manager with workspace support)
- TypeScript 5.3+ (type checking across all workspaces)

**Storage**: N/A (this feature is infrastructure setup, no data storage)  
**Testing**: Manual verification of build/dev processes, TypeScript compilation checks  
**Target Platform**:

- Web: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions per NFR21)
- Node.js 18+ for build tooling
- Cross-platform development environment (macOS, Linux, Windows)

**Project Type**: Web + monorepo infrastructure (establishes structure for web/mobile/backend)  
**Performance Goals**:

- Dev server startup: < 5 seconds (SC-001)
- Hot module replacement: < 1 second (SC-002)
- Production build: < 30 seconds for starter app (SC-003)
- pnpm install: < 2 minutes (SC-006)

**Constraints**:

- Must support 70%+ code sharing via shared packages (Constitution I)
- Must work with both Vite (web) and Metro (mobile) bundlers
- Must maintain TypeScript type checking across all workspaces
- Cached page loads must appear < 200ms (NFR2)

**Scale/Scope**:

- 3 applications (web, mobile, backend - this story creates web)
- 4+ shared package modules (types, api, utils, hooks)
- Foundation for 10x user growth (NFR12)
- Support for unlimited pacts per user (NFR13)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Code Sharing First (Constitution I)

**Status**: ✅ PASS  
**Rationale**: This feature establishes the shared packages infrastructure at `/packages/shared` that enables the mandatory 70%+ code sharing. The directory structure (types, api, utils, hooks) and TypeScript path aliases are specifically designed to facilitate code reuse between web and mobile platforms.

### Immutability as Contract (Constitution II)

**Status**: N/A  
**Rationale**: This feature is infrastructure setup and does not involve pact data or immutability concerns.

### Performance-First Architecture (Constitution III)

**Status**: ✅ PASS  
**Rationale**: Success criteria explicitly define performance targets (5s dev server startup, 1s HMR, 30s builds) that align with constitutional requirements. Vite provides fast build times and HMR out of the box, supporting sub-second response times.

### Offline-First Mobile Experience (Constitution IV)

**Status**: N/A  
**Rationale**: This feature establishes web infrastructure. Offline mobile capabilities will be addressed in future stories (Epic 5).

### Security & Data Isolation (Constitution V)

**Status**: N/A  
**Rationale**: This feature is infrastructure setup without user data or authentication concerns.

### Naming Consistency Across Layers (Constitution VI)

**Status**: ✅ PASS  
**Rationale**: Implementation will follow TypeScript camelCase conventions for components, hooks, and utilities. Directory structure uses lowercase with hyphens (`apps/web`, `packages/shared`).

### Mandatory Technologies

**Status**: ✅ PASS  
**Rationale**: This feature implements the exact technology stack mandated by constitution:

- ✅ React with Vite (Web SPA)
- ✅ TypeScript strict mode
- ✅ pnpm workspaces monorepo
- ✅ `/apps` and `/packages/shared` structure
- ✅ Tailwind CSS 3+ for web styling (to be configured)

**OVERALL GATE STATUS**: ✅ PASS - No violations, all applicable principles satisfied

**Post-Design Re-evaluation** (2026-01-03): Constitution check re-evaluated after Phase 1 completion (research.md, data-model.md, quickstart.md generated). All principles remain satisfied. The implementation plan adheres to:

- Code sharing infrastructure (`/packages/shared` with 4 modules)
- Performance targets (Vite defaults meet all timing requirements)
- Naming conventions (TypeScript camelCase, lowercase directories)
- Mandatory technology stack (React, Vite, TypeScript strict, pnpm workspaces)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
pact/                                    # Repository root
├── package.json                         # Root workspace configuration
├── pnpm-workspace.yaml                  # pnpm workspace definition
├── pnpm-lock.yaml                       # Dependency lock file
├── apps/
│   ├── web/                            # NEW: Vite + React web app
│   │   ├── src/
│   │   │   ├── App.tsx                 # Main app component
│   │   │   ├── main.tsx                # Entry point
│   │   │   └── vite-env.d.ts           # Vite type definitions
│   │   ├── index.html                  # HTML entry point
│   │   ├── package.json                # Web app dependencies
│   │   ├── tsconfig.json               # TypeScript config for web
│   │   ├── tsconfig.node.json          # TypeScript config for Vite
│   │   └── vite.config.ts              # Vite configuration
│   ├── mobile/                         # Existing from Story 1.1
│   │   └── [Expo React Native app]
│   └── backend/                        # To be created in Story 1.3
│       └── [NestJS API - not yet created]
├── packages/
│   └── shared/                         # NEW: Shared code workspace
│       ├── types/                      # NEW: Shared TypeScript types
│       │   ├── index.ts                # Type exports
│       │   └── package.json            # Types package config
│       ├── api/                        # NEW: API client code
│       │   ├── index.ts                # API client exports
│       │   └── package.json            # API package config
│       ├── utils/                      # NEW: Shared utilities
│       │   ├── index.ts                # Utility exports
│       │   └── package.json            # Utils package config
│       ├── hooks/                      # NEW: Shared React hooks
│       │   ├── index.ts                # Hook exports
│       │   └── package.json            # Hooks package config
│       └── package.json                # Shared workspace root config
└── specs/
    └── 002-web-shared-setup/           # This feature's documentation
        ├── spec.md
        ├── plan.md                     # This file
        ├── research.md                 # To be generated
        ├── data-model.md               # To be generated
        ├── quickstart.md               # To be generated
        └── contracts/                  # To be generated (if needed)
```

**Structure Decision**: Monorepo with pnpm workspaces. This feature creates the web application at `/apps/web` and the shared packages workspace at `/packages/shared`. The structure follows constitutional requirements with `/apps` for applications and `/packages/shared` for shared code. TypeScript path aliases will enable imports like `@pact/shared/types` across all workspaces.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
