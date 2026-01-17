# Pact Monorepo - Copilot Instructions

You are an AI coding assistant working in the `pact-monorepo`, a comprehensive workspace containing Backend, Web, and Mobile applications.

## 🏗 Project Architecture

This is a **pnpm monorepo** with the following structure:

- **Apps (`apps/`)**:
  - `backend`: **NestJS** application with **Prisma** (PostgreSQL).
  - `web`: **React 19** application using **Vite**.
  - `mobile`: **React Native** application using **Expo**.
- **Packages (`packages/`)**:
  - `shared`: Common code (types, api, utils, hooks).
- **Specs (`specs/`)**: Documentation-driven planning. detailed specifications and "contracts" for features.
- **BMAD (`_bmad/`)**: Configuration and documentation for the "BMad Method Module" (Agentic standards).

### 🔄 Shared Code Pattern

The frontend applications (`web`) access shared code via granular path aliases defined in `vite.config.ts` and `tsconfig.app.json`.

- **Do not** import from `@pact/shared` directly.
- **Do** use specific aliases:
  - `@pact/shared-types` → `packages/shared/types`
  - `@pact/shared-api` → `packages/shared/api`
  - `@pact/shared-utils` → `packages/shared/utils`
  - `@pact/shared-hooks` → `packages/shared/hooks`

## 🛠 Critical Workflows

- **Package Management**: Use `pnpm` exclusively.
- **Running Commands**: Target specific apps using `--filter`.
  - Example: `pnpm --filter web dev`
  - Example: `pnpm --filter backend start:dev`
- **Database**:
  - Schema location: `apps/backend/prisma/schema.prisma`
  - Migrations: Managed via Prisma CLI in the backend workspace.

## 📝 Conventions & Standards

- **Documentation**:
  - Follow **CommonMark** strictly.
  - **Never** include time estimates in documentation (as per BMAD standards).
- **Backend (NestJS)**:
  - Follow standard module/controller/service architecture.
  - Use DTOs with `class-validator`.
- **Frontend (React)**:
  - Use Functional Components and Hooks.
  - State management should be simple unless otherwise specified.
- **Specs**:
  - Before starting complex tasks, check `specs/` for relevant design documents or data models.
