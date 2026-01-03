# Implementation Plan: Initialize Monorepo and Mobile App Foundation

**Branch**: `001-monorepo-mobile` | **Date**: 2026-01-03 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-monorepo-mobile/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Initialize a pnpm workspace monorepo structure with a working Expo React Native mobile application using TypeScript. The implementation will create the foundational directory structure (`/apps`, `/packages`), configure pnpm workspaces, initialize the mobile app at `/apps/mobile` with TypeScript template, and verify hot reload functionality works on both iOS simulator and Android emulator. This story establishes the organizational foundation for all subsequent development.

## Technical Context

**Language/Version**: TypeScript (strict mode), Node.js 18+  
**Primary Dependencies**: pnpm 8+, Expo SDK (latest stable), React Native, TypeScript compiler  
**Storage**: N/A (infrastructure story - no data storage)  
**Testing**: Manual verification (Expo dev server, simulator/emulator launches, hot reload)  
**Target Platform**: iOS 15+ (simulator), Android API 29+ (emulator), development tooling (macOS, Linux, Windows)  
**Project Type**: Monorepo (mobile + future web/backend)  
**Performance Goals**: Hot reload within 2 seconds, Expo dev server start within 10 seconds  
**Constraints**: Must use pnpm workspaces (not npm/yarn), must support both iOS and Android, TypeScript strict mode required  
**Scale/Scope**: Foundation for ~50 screens, 70%+ code sharing between platforms, 1M+ LOC potential

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Principle I: Code Sharing First (NON-NEGOTIABLE)

**Status**: PASS - Foundational enablement

**Assessment**: This story creates the `/packages` directory structure and pnpm workspace configuration that will enable 70%+ code sharing in future stories. While no shared code is created yet, the workspace structure is being designed explicitly to support shared packages that can be imported by both mobile and web applications.

**Compliance Actions**: Ensure pnpm-workspace.yaml includes both `apps/*` and `packages/*` patterns. Document workspace structure in research phase.

---

### ✅ Principle III: Performance-First Architecture

**Status**: PASS - Direct requirement

**Assessment**: Success Criteria SC-005 mandates hot reload within 2 seconds, directly aligning with the Constitution's <2s perceived response time mandate. This applies to the development workflow performance.

**Compliance Actions**: Validate hot reload timing during manual testing phase.

---

### ✅ Principle VI: Naming Consistency Across Layers

**Status**: PASS - Establishes conventions

**Assessment**: Directory structure follows required conventions:

- `/apps/mobile` (lowercase kebab-case)
- `App.tsx` (PascalCase for components)
- Package names will follow npm conventions (`@pact/mobile`)

**Compliance Actions**: Document naming conventions in quickstart.md for future reference.

---

### ℹ️ Other Principles

**Principle II (Immutability)**: N/A - No pact data structures in this story  
**Principle IV (Offline-First)**: N/A - No data sync in this story  
**Principle V (Security)**: N/A - No authentication or user data in this story

---

**GATE RESULT**: ✅ **PASS** - All applicable principles satisfied. No violations to justify.

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

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Monorepo structure (pnpm workspaces)
/
├── pnpm-workspace.yaml          # Workspace configuration defining apps/* and packages/*
├── package.json                 # Root package with workspace metadata
├── .gitignore                   # Git ignore (Expo defaults + node_modules)
├── apps/
│   └── mobile/                  # Expo React Native app
│       ├── package.json         # Mobile app dependencies (@pact/mobile)
│       ├── tsconfig.json        # TypeScript config (strict mode)
│       ├── app.json             # Expo configuration
│       ├── App.tsx              # Entry point component
│       ├── assets/              # Images, fonts (Expo defaults)
│       └── node_modules/        # Symlinked dependencies via pnpm
└── packages/                    # Future shared code location (empty for now)
```

**Structure Decision**: Monorepo with mobile-first approach. This story creates only the mobile app at `/apps/mobile` and establishes the `/packages` directory for future shared code. Web app (`/apps/web`) and backend (`/apps/backend`) will be added in Stories 1.2 and 1.3 respectively. The structure uses pnpm workspaces to enable efficient dependency management and code sharing across all applications.

## Complexity Tracking

> **Not applicable - Constitution Check passed without violations**

---

## Phase 0: Research Summary

**Status**: ✅ Complete

All technical unknowns identified in the Technical Context section have been researched and documented in [research.md](research.md):

1. ✅ **Pnpm Workspace Configuration**: Minimal YAML with `apps/*` and `packages/*` patterns
2. ✅ **Expo Template Selection**: Use `expo-template-blank-typescript` for minimal, type-safe setup
3. ✅ **Hot Reload Validation**: Manual testing with 2-second target, Fast Refresh enabled by default
4. ✅ **Cross-Platform Setup**: Prerequisites documented, Expo CLI provides clear error messages
5. ✅ **Dependency Installation**: `pnpm install` at root after app creation
6. ✅ **TypeScript Strict Mode**: Enable in tsconfig.json immediately after initialization

**No NEEDS CLARIFICATION markers remain.**

---

## Phase 1: Design & Contracts Summary

**Status**: ✅ Complete

Design artifacts have been created:

1. ✅ **data-model.md**: Documented configuration structures (no data entities for infrastructure story)
2. ✅ **contracts/README.md**: Noted that no API contracts exist for infrastructure story
3. ✅ **quickstart.md**: Comprehensive developer guide with step-by-step instructions, troubleshooting, and reference commands
4. ✅ **Agent Context Update**: Updated GitHub Copilot instructions with technology stack from this feature

---

## Post-Design Constitution Check

**Re-evaluation after Phase 1 design artifacts:**

### ✅ Principle I: Code Sharing First (NON-NEGOTIABLE)

**Status**: PASS - Design confirms workspace structure

**Assessment**: The project structure documented in quickstart.md and data-model.md explicitly creates:

- `pnpm-workspace.yaml` with `packages/*` pattern
- `/packages` directory for future shared code
- Workspace dependency resolution configured

The design enables future stories to create shared packages (e.g., `@pact/shared`, `@pact/types`) that both mobile and web apps can import.

**No issues identified.**

---

### ✅ Principle III: Performance-First Architecture

**Status**: PASS - Design validates hot reload

**Assessment**: The quickstart.md guide includes:

- Manual hot reload testing procedure
- 2-second timing validation (Step 5 and Step 6)
- Troubleshooting for slow hot reload (`npx expo start --clear`)

Success Criteria SC-005 is directly testable with the provided instructions.

**No issues identified.**

---

### ✅ Principle VI: Naming Consistency Across Layers

**Status**: PASS - Design documents conventions

**Assessment**: The data-model.md and quickstart.md documents establish:

- Directory names: `/apps/mobile` (lowercase)
- Component files: `App.tsx` (PascalCase)
- Package scopes: `@pact/mobile` (npm conventions)
- Workspace name: `pact-monorepo` (kebab-case)

All naming follows Constitution requirements.

**No issues identified.**

---

**POST-DESIGN GATE RESULT**: ✅ **PASS** - Design artifacts maintain constitutional compliance. Ready for implementation (Phase 2: Tasks).

---

## Next Steps

This plan is now complete. To proceed with implementation:

1. **Review artifacts**: Ensure all generated files ([research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md), [contracts/README.md](contracts/README.md)) are accurate
2. **Run `/speckit.tasks`**: Generate implementation tasks from this plan
3. **Execute tasks**: Follow quickstart.md guide to implement the monorepo structure
4. **Validate success criteria**: Verify all 8 success criteria from spec.md are met
5. **Create PR**: Merge branch `001-monorepo-mobile` to main after validation

---

## Plan Metadata

**Plan Created**: 2026-01-03  
**Plan Status**: Complete (Phase 0 + Phase 1)  
**Constitution Compliance**: ✅ PASS (pre-design and post-design)  
**Artifacts Generated**:

- [x] research.md (Phase 0)
- [x] data-model.md (Phase 1)
- [x] contracts/README.md (Phase 1)
- [x] quickstart.md (Phase 1)
- [x] Agent context updated

**Ready for**: Phase 2 - Tasks (`/speckit.tasks` command)
