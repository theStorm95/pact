# Implementation Plan: Backend API and Database Setup

**Branch**: `003-backend-api-setup` | **Date**: January 4, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-backend-api-setup/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Initialize a NestJS backend API at `/apps/backend` with PostgreSQL database and Prisma ORM, providing a health check endpoint, User model with migrations, and global exception filter for consistent error handling.

## Technical Context

**Language/Version**: TypeScript (strict mode) with Node.js 18+  
**Primary Dependencies**: NestJS 10+, Prisma 5+, class-validator, class-transformer, Passport.js  
**Storage**: PostgreSQL 16+ (Railway hosted or local Docker for development)  
**Testing**: Jest (included with NestJS), Supertest for API integration tests  
**Target Platform**: Node.js server hosted on Railway
**Project Type**: Backend API (part of monorepo)  
**Performance Goals**: Health check responds <100ms, startup <10 seconds, migrations <30 seconds  
**Constraints**: Database connectivity required for startup, graceful failure on missing env vars  
**Scale/Scope**: Foundation for 10k+ users, unlimited pacts per user, 100+ concurrent API requests

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ Code Sharing (70% minimum)

**Status**: N/A - Backend infrastructure only. Future shared types via `/packages/shared/types`.

### ✅ Performance Standards

**Status**: PASS

- Health check: <100ms (exceeds NFR2 requirements)
- Startup: <10 seconds (aligns with NFR1-2 perceived speed)
- No blocking operations on critical paths

### ✅ Security Requirements

**Status**: PASS

- TLS 1.3+ enforced (NFR6) - handled at Railway/infrastructure level
- Environment variables for DATABASE_URL (no credentials in code)
- Foundation for JWT auth (NFR8), Guards (NFR9), OAuth (NFR10) in future stories

### ✅ Naming Consistency

**Status**: PASS

- Database: snake_case (users, created_at)
- TypeScript: camelCase via Prisma @map() (userId, createdAt)
- API endpoints: Plural resources (/health follows convention)
- Following constitutional standards exactly

### ✅ Mandatory Technologies

**Status**: PASS

- NestJS 10+ ✓
- PostgreSQL 16+ ✓
- Prisma 5+ ✓
- TypeScript strict mode ✓
- class-validator + class-transformer ✓

### ✅ Architecture Patterns

**Status**: PASS

- Prisma schema generates TypeScript types ✓
- NestJS Guards for future auth (foundation laid) ✓
- Consistent error format via exception filters ✓
- RESTful conventions (/health endpoint) ✓

## Project Structure

### Documentation (this feature)

```text
specs/003-backend-api-setup/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── health.yaml      # OpenAPI spec for health endpoint
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
apps/backend/
├── src/
│   ├── main.ts                     # NestJS bootstrap + global config
│   ├── app.module.ts               # Root application module
│   ├── app.controller.ts           # Health check endpoint
│   ├── app.service.ts              # Health check logic
│   ├── prisma/
│   │   ├── prisma.module.ts        # Prisma module
│   │   └── prisma.service.ts       # Prisma client singleton
│   └── filters/
│       └── http-exception.filter.ts # Global exception filter
├── prisma/
│   ├── schema.prisma               # Prisma schema with User model
│   └── migrations/                 # Database migrations
├── test/
│   ├── app.e2e-spec.ts            # E2E tests for health endpoint
│   └── jest-e2e.json              # Jest E2E configuration
├── .env.example                    # Environment variable template
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── nest-cli.json                   # NestJS CLI configuration
└── README.md                       # Backend setup documentation

packages/shared/
└── types/
    └── prisma.ts                   # Exported Prisma types (future)
```

**Structure Decision**: Backend API follows NestJS conventions with Prisma integration. The `/apps/backend` directory is created as a new workspace in the existing monorepo structure. Prisma schema lives in `/apps/backend/prisma` per NestJS best practices. Shared types will be exported to `/packages/shared/types` in future stories.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitutional requirements satisfied:

- Using mandatory tech stack (NestJS, PostgreSQL, Prisma)
- Following naming conventions
- Meeting performance targets
- Security foundations in place
