---
description: "Task list for Backend API and Database Setup implementation"
---

# Tasks: Backend API and Database Setup

**Input**: Design documents from `/specs/003-backend-api-setup/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Tests are NOT included in this feature - focus on infrastructure setup and manual verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize NestJS backend project in monorepo

- [x] T001 Create NestJS application using @nestjs/cli in /apps directory with pnpm
- [x] T002 Configure backend as monorepo workspace in root package.json and pnpm-workspace.yaml
- [x] T003 [P] Create .env.example in apps/backend with DATABASE_URL, PORT, NODE_ENV
- [x] T004 [P] Update root .gitignore to exclude apps/backend/.env and node_modules

**Checkpoint**: Backend directory structure created and integrated into monorepo

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Install Prisma CLI and Client: pnpm add -D prisma && pnpm add @prisma/client in apps/backend
- [x] T006 Initialize Prisma with npx prisma init in apps/backend
- [x] T007 [P] Install class-validator and class-transformer in apps/backend
- [x] T008 Configure CORS in apps/backend/src/main.ts with origin: http://localhost:5173

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Backend API Foundation (Priority: P1) 🎯 MVP

**Goal**: Deployable NestJS server with health check endpoint that verifies system is running

**Independent Test**: Start server with `pnpm run start:dev`, access GET http://localhost:3000/health, verify 200 OK response with status and timestamp

### Implementation for User Story 1

- [x] T009 [P] [US1] Create Prisma module in apps/backend/src/prisma/prisma.module.ts
- [x] T010 [P] [US1] Create Prisma service in apps/backend/src/prisma/prisma.service.ts with onModuleInit and onModuleDestroy
- [x] T011 [US1] Update app.module.ts to import PrismaModule with @Global decorator
- [x] T012 [US1] Implement health check endpoint in apps/backend/src/app.controller.ts with database connectivity check
- [x] T013 [US1] Configure global exception filter in apps/backend/src/main.ts
- [x] T014 [US1] Add environment variable validation in apps/backend/src/main.ts bootstrap function
- [x] T015 [US1] Update apps/backend/src/main.ts to enable shutdown hooks and configure port from env
- [x] T016 [US1] Test health endpoint returns 200 OK when database connected
- [ ] T017 [US1] Test health endpoint returns 503 when database unavailable

**Checkpoint**: At this point, backend server starts successfully and health endpoint is accessible

---

## Phase 4: User Story 2 - Database Connection and Schema (Priority: P2)

**Goal**: PostgreSQL database connected with User model and working migrations

**Independent Test**: Run `npx prisma migrate dev`, verify User table exists with correct columns in database, verify TypeScript types generated

### Implementation for User Story 2

- [x] T018 [US2] Define User model in apps/backend/prisma/schema.prisma with UUID id, email, passwordHash, createdAt, updatedAt
- [x] T019 [US2] Add @map() decorators for snake_case database column names (password_hash, created_at, updated_at)
- [x] T020 [US2] Add @@map("users") to User model for table name
- [x] T021 [US2] Add unique index on email field
- [x] T022 [US2] Add index on createdAt field for analytics queries
- [x] T023 [US2] Configure DATABASE_URL in apps/backend/.env (Railway or Docker connection string)
- [x] T024 [US2] Create initial migration with `npx prisma migrate dev --name init`
- [x] T025 [US2] Generate Prisma Client with `npx prisma generate`
- [x] T026 [US2] Verify migration created users table in database
- [x] T027 [US2] Verify TypeScript types available from @prisma/client
- [x] T028 [US2] Test Prisma Client can connect and query users table

**Checkpoint**: At this point, database schema is deployed and ORM is working with type-safe queries

---

## Phase 5: User Story 3 - Error Handling Framework (Priority: P3)

**Goal**: Consistent error responses across all endpoints with global exception filter

**Independent Test**: Trigger 404 (non-existent endpoint), 500 (unhandled error), verify all return consistent JSON error format with statusCode, message, timestamp, path

### Implementation for User Story 3

- [x] T029 [US3] Create HttpExceptionFilter in apps/backend/src/filters/http-exception.filter.ts
- [x] T030 [US3] Implement catch() method to handle HttpException and generic Error types
- [x] T031 [US3] Format error responses with statusCode, message, timestamp, path fields
- [x] T032 [US3] Register filter globally in apps/backend/src/main.ts with app.useGlobalFilters()
- [x] T033 [US3] Test 404 error returns standardized format
- [ ] T034 [US3] Test 500 error returns standardized format without exposing internal details
- [ ] T035 [US3] Test validation errors return 400 with clear messages

**Checkpoint**: All error responses follow consistent format, no internal details leaked

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification

- [x] T036 [P] Create apps/backend/README.md with setup instructions and available scripts
- [x] T037 [P] Document environment variables in README.md
- [x] T038 [P] Add database setup instructions (Railway and Docker options) to README.md
- [x] T039 Verify all tasks from quickstart.md execute successfully
- [x] T040 Test server startup time is under 10 seconds
- [x] T041 Test health endpoint response time is under 100ms
- [x] T042 Verify migrations complete in under 30 seconds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - Can start after Phase 2
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Can start after Phase 2 (parallel with US1)
- **User Story 3 (Phase 5)**: Depends on User Story 1 (Phase 3) - Needs running server to test
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) ← BLOCKING - must complete first
    ↓
    ├─→ User Story 1 (P1) - Backend API Foundation
    │   ↓
    │   └─→ User Story 3 (P3) - Error Handling (needs US1 server)
    │
    └─→ User Story 2 (P2) - Database Schema (parallel with US1)

All complete → Phase 6 (Polish)
```

**Critical Path**: Phase 1 → Phase 2 → US1 → US3 → Polish

**Suggested Execution Order for Solo Developer**:

1. Complete Phase 1 and Phase 2 (foundational - required)
2. Implement User Story 1 (P1) - get working server
3. Implement User Story 2 (P2) - add database
4. Implement User Story 3 (P3) - add error handling
5. Complete Phase 6 (Polish) - documentation

### Within Each User Story

**User Story 1**:

- T009 and T010 can be done in parallel (different files)
- T011 requires both T009 and T010
- T012-T017 are sequential, depending on previous tasks

**User Story 2**:

- T018-T022 can be done in one edit (same schema file)
- T023 is independent (environment setup)
- T024-T028 are sequential (migration workflow)

**User Story 3**:

- T029-T031 can be done together (same filter file)
- T032 updates main.ts
- T033-T035 are verification steps

### Parallel Opportunities

**Phase 1 (Setup)**:

- T003 and T004 can run in parallel (different files)

**Phase 2 (Foundational)**:

- T007 and T008 can run in parallel (different concerns)

**User Story 1**:

- T009 (prisma.module.ts) and T010 (prisma.service.ts) in parallel

**After Phase 2**:

- User Story 1 (T009-T017) and User Story 2 (T018-T028) can be worked on in parallel

**Phase 6 (Polish)**:

- T036, T037, T038 can be done in parallel (all README sections)

---

## Parallel Example: Phases 1-2 Setup

If working with multiple developers or AI agents:

```bash
# Developer/Agent 1: Core NestJS setup
Task T001: Create NestJS app
Task T002: Configure monorepo

# Developer/Agent 2: Configuration files (parallel)
Task T003: Create .env.example
Task T004: Update .gitignore
Task T007: Install validators
Task T008: Configure CORS

# After both complete
Both: Tasks T005-T006 (Prisma setup)
```

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Goal**: Get a deployable backend as quickly as possible

**MVP Scope**: User Story 1 only (Backend API Foundation)

- Tasks T001-T017
- Result: Working NestJS server with health endpoint
- Time estimate: 2-3 hours

**Why**: Establishes deployment pipeline, verifies Railway setup, provides testable endpoint

### Incremental Delivery

After MVP, add capabilities incrementally:

1. **MVP** (US1): Deployable server → Can verify hosting works
2. **+Database** (US2): Add persistence → Can start building data-dependent features
3. **+Error Handling** (US3): Add consistency → Production-ready error responses

Each increment is independently deployable and testable.

### Task Validation

Before marking a task complete:

- [ ] Code compiles without TypeScript errors
- [ ] Manual testing passes per "Independent Test" criteria
- [ ] Follows constitutional naming conventions (snake_case DB, camelCase TS)
- [ ] No credentials in code or version control
- [ ] File paths match plan.md structure exactly

---

## Summary

**Total Tasks**: 42 tasks across 6 phases

- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 4 tasks
- Phase 3 (US1 - Backend Foundation): 9 tasks
- Phase 4 (US2 - Database Schema): 11 tasks
- Phase 5 (US3 - Error Handling): 7 tasks
- Phase 6 (Polish): 7 tasks

**Parallelizable Tasks**: 8 tasks marked with [P]

**Critical Path**: Phase 1 → Phase 2 → US1 → US3 → Polish (minimum 30 tasks)

**MVP Path**: Phase 1 → Phase 2 → US1 (17 tasks, ~2-3 hours)

**Full Feature**: All 42 tasks (~6-8 hours total with testing and verification)

**Next Command**: Begin implementation with Phase 1, Task T001
