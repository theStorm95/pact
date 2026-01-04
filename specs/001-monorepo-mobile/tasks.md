# Tasks: Initialize Monorepo and Mobile App Foundation

**Input**: Design documents from `/specs/001-monorepo-mobile/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated tests required - this is an infrastructure story validated through manual verification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo root**: `/`
- **Apps**: `/apps/*`
- **Packages**: `/packages/*`
- **Mobile app**: `/apps/mobile`

---

## Phase 1: Setup (Prerequisite Verification)

**Purpose**: Verify development environment prerequisites before monorepo initialization

- [x] T001 Verify Node.js 18+ is installed (`node --version`)
- [x] T002 Verify pnpm 8+ is installed (`pnpm --version`)
- [x] T003 [P] Verify Xcode and iOS simulator available (macOS only) (`xcode-select -p`)
- [x] T004 [P] Verify Android Studio and Android emulator configured (`echo $ANDROID_HOME`)

**Checkpoint**: Prerequisites verified - ready to initialize monorepo structure

---

## Phase 2: User Story 1 - Initialize Empty Monorepo Structure (Priority: P1) 🎯 MVP

**Goal**: Create foundational monorepo structure with pnpm workspace configuration

**Independent Test**: Run `pnpm install` at root and verify no errors - workspace is recognized

### Implementation for User Story 1

- [x] T005 [US1] Create pnpm-workspace.yaml at root defining workspace patterns for `apps/*` and `packages/*`
- [x] T006 [P] [US1] Create root package.json with workspace metadata, name "pact-monorepo", and private: true
- [x] T007 [P] [US1] Create /apps directory for application code
- [x] T008 [P] [US1] Create /packages directory for shared libraries
- [x] T009 [US1] Add convenience scripts to root package.json: "mobile", "mobile:ios", "mobile:android"
- [x] T010 [US1] Add TypeScript as workspace-level devDependency in root package.json (version ^5.3.0)
- [x] T011 [US1] Run `pnpm install` at root to initialize workspace and verify no errors
- [x] T012 [US1] Verify workspace structure with `pnpm list --depth=0`

**Checkpoint**: Monorepo structure complete - workspace recognized by pnpm, ready for application initialization

---

## Phase 3: User Story 2 - Initialize Expo Mobile App with TypeScript (Priority: P2)

**Goal**: Create working Expo React Native mobile app with TypeScript at /apps/mobile

**Independent Test**: Run `npx expo start` from /apps/mobile and verify dev server starts without errors

### Implementation for User Story 2

- [x] T013 [US2] Initialize Expo app at /apps/mobile using `npx create-expo-app apps/mobile --template expo-template-blank-typescript`
- [x] T014 [US2] Wait for Expo template initialization to complete (~30-60 seconds)
- [x] T015 [US2] Update apps/mobile/tsconfig.json to enable strict mode in compilerOptions
- [x] T016 [US2] Verify apps/mobile/package.json includes TypeScript dependency
- [x] T017 [US2] Verify apps/mobile/package.json has correct name "@pact/mobile"
- [x] T018 [US2] Run `pnpm install` from root to install mobile app dependencies via workspace
- [x] T019 [US2] Verify apps/mobile/node_modules exists with symlinked dependencies
- [x] T020 [US2] Start Expo dev server with `cd apps/mobile && npx expo start`
- [x] T021 [US2] Verify dev server starts within 10 seconds with no errors (Success Criteria SC-002)
- [x] T022 [US2] Verify QR code and platform options (i/a/w) appear in terminal

**Checkpoint**: Mobile app initialized - Expo dev server running, ready for cross-platform testing

---

## Phase 4: User Story 3 - Verify Mobile App Runs on iOS and Android (Priority: P3)

**Goal**: Validate mobile app launches and hot reload works on both iOS simulator and Android emulator

**Independent Test**: Launch on both platforms, see default Expo screen, verify hot reload within 2 seconds

### Implementation for User Story 3

#### iOS Simulator Testing

- [x] T023 [US3] With Expo dev server running, press `i` to open iOS simulator
- [x] T024 [US3] Verify app launches on iOS simulator within 15 seconds (Success Criteria SC-003)
- [x] T025 [US3] Verify default Expo welcome screen displays ("Open up App.tsx to start working...")
- [x] T026 [US3] Modify apps/mobile/App.tsx - change text content to "Hot reload test - iOS"
- [x] T027 [US3] Save App.tsx and verify change appears on iOS simulator within 2 seconds (Success Criteria SC-005)
- [x] T028 [US3] Introduce syntax error in App.tsx and verify TypeScript error appears in terminal within 1 second (Success Criteria SC-006)
- [x] T029 [US3] Fix syntax error and verify app recovers via hot reload

#### Android Emulator Testing

- [ ] T030 [P] [US3] With Expo dev server running, press `a` to open Android emulator
- [ ] T031 [P] [US3] Verify app launches on Android emulator within 20 seconds (Success Criteria SC-004)
- [ ] T032 [P] [US3] Verify default Expo welcome screen displays on Android
- [ ] T033 [P] [US3] Modify apps/mobile/App.tsx - change text content to "Hot reload test - Android"
- [ ] T034 [P] [US3] Save App.tsx and verify change appears on Android emulator within 2 seconds (Success Criteria SC-005)
- [ ] T035 [P] [US3] Verify hot reload works consistently across 3-5 file changes
- [ ] T036 [P] [US3] Test TypeScript error overlay appears on Android when introducing syntax errors

**Checkpoint**: Cross-platform validation complete - iOS and Android both working with hot reload

---

## Phase 5: Final Validation & Documentation

**Purpose**: Ensure all success criteria met and workspace ready for future stories

- [x] T037 Verify pnpm install completes within 60 seconds (Success Criteria SC-001)
- [x] T038 Verify Expo dev server starts within 10 seconds (Success Criteria SC-002)
- [x] T039 Verify zero errors or warnings during installation (Success Criteria SC-008)
- [x] T040 Verify /packages directory exists and is configured in workspace (Success Criteria SC-007)
- [x] T041 [P] Test adding a test package to /packages directory to verify workspace extensibility
- [x] T042 [P] Create .gitignore at root with node_modules, .expo, dist patterns (if not exists from Expo)
- [x] T043 [P] Document any environment-specific setup notes in quickstart.md troubleshooting section
- [x] T044 Commit all changes to branch 001-monorepo-mobile with message "feat: initialize monorepo with mobile app foundation"
- [ ] T045 Push branch to remote and verify CI/CD passes (if configured)

**Checkpoint**: All success criteria validated - ready for Stories 1.2 (Web App) and 1.3 (Backend)

---

## Task Summary

**Total Tasks**: 45
**Parallelizable Tasks**: 16 (marked with [P])

### By User Story:

- **Setup (Prerequisites)**: 4 tasks
- **User Story 1 (Monorepo Structure)**: 8 tasks
- **User Story 2 (Mobile App Init)**: 10 tasks
- **User Story 3 (Cross-Platform Validation)**: 14 tasks (7 iOS + 7 Android)
- **Final Validation**: 9 tasks

### Dependencies:

- User Story 1 → MUST complete before User Story 2
- User Story 2 → MUST complete before User Story 3
- Phase 5 → MUST complete after all user stories

### Parallel Execution Opportunities:

**Within User Story 1:**

- T007, T008 (directory creation) can run in parallel

**Within User Story 3:**

- T030-T036 (Android testing) can run in parallel with T023-T029 (iOS testing) IF both simulators available

**Within Phase 5:**

- T041, T042, T043 (documentation and cleanup) can run in parallel

### Estimated Time:

- **Setup**: 5-10 minutes (prerequisite verification)
- **User Story 1**: 10-15 minutes (monorepo structure creation)
- **User Story 2**: 15-20 minutes (Expo app initialization + dependency install)
- **User Story 3**: 20-30 minutes (cross-platform testing and validation)
- **Final Validation**: 10-15 minutes (success criteria verification)
- **Total**: 60-90 minutes for complete implementation

---

## Implementation Strategy

### MVP Approach (Minimum Viable Product):

**Phase 1 MVP** = User Story 1 complete

- Delivers: Functional monorepo structure ready for applications
- Testable: `pnpm install` succeeds, workspace recognized
- Value: Foundation for all future development

**Phase 2 MVP** = User Story 1 + User Story 2 complete

- Delivers: Working mobile app on one platform (iOS or Android)
- Testable: Expo dev server runs, app displays on simulator/emulator
- Value: Mobile development environment operational

**Phase 3 Complete** = All user stories complete

- Delivers: Full cross-platform mobile development environment
- Testable: Both iOS and Android working with hot reload
- Value: Production-ready mobile development setup

### Incremental Delivery:

1. Implement User Story 1 → Validate → Commit
2. Implement User Story 2 → Validate → Commit
3. Implement User Story 3 → Validate → Commit
4. Final validation → Create PR

This approach ensures each user story delivers independent value and can be tested before proceeding.

---

## Reference Documentation

- **Spec**: [spec.md](spec.md) - User stories and acceptance criteria
- **Plan**: [plan.md](plan.md) - Technical context and constitution compliance
- **Research**: [research.md](research.md) - Technical decision documentation
- **Quick Start**: [quickstart.md](quickstart.md) - Step-by-step implementation guide
- **Data Model**: [data-model.md](data-model.md) - Configuration structure details
- **Contracts**: [contracts/README.md](contracts/README.md) - Note on no API contracts

---

## Constitutional Compliance Checklist

- [x] **Principle I (Code Sharing)**: /packages directory created for future shared code
- [x] **Principle III (Performance)**: Hot reload validated to complete within 2 seconds
- [x] **Principle VI (Naming)**: Directory names use lowercase, components use PascalCase, packages use @pact scope

All applicable principles are addressed in the task breakdown.
