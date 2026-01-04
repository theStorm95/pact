<!--
Sync Impact Report:
Version: 1.0.0 (Initial constitution)
Modified Principles: N/A (Initial creation)
Added Sections: All sections created
Removed Sections: None
Templates Requiring Updates:
  ✅ Constitution created from template
  ⚠ plan-template.md - Should be reviewed for consistency
  ⚠ spec-template.md - Should be reviewed for consistency
  ⚠ tasks-template.md - Should be reviewed for consistency
Follow-up TODOs: None
-->

# Pact Constitution

## Core Principles

### I. Code Sharing First (NON-NEGOTIABLE)

**Minimum 70% code sharing between mobile and mobile platforms is mandatory.**

All business logic, types, utilities, API clients, and TanStack Query hooks MUST be implemented in `/packages/shared` and reused across web and mobile applications. Platform-specific code (React vs React Native components, navigation, storage, notifications) is limited to 30% of the codebase.

**Rationale:** This ensures consistency, reduces maintenance burden, accelerates feature development, and prevents platform drift. Any feature that can be shared MUST be shared.

### II. Immutability as Contract

**Pacts cannot be modified once created - this is enforced at all layers.**

The immutability of pacts is a core product principle. Once a pact is created, its parameters (action, frequency, duration, dates) cannot be changed. This MUST be enforced at:

- Database level (constraints where possible)
- API level (reject PUT/PATCH requests with clear error messages)
- UI level (no edit UI for active pacts, read-only displays)

**Rationale:** Immutability reinforces the commitment philosophy and psychological safety of time-boxed experiments. Users commit to the action, execute, then learn and iterate in the next pact.

### III. Performance-First Architecture

**Sub-second perceived response times are mandatory.**

- Initial loads MUST complete within 2 seconds (NFR1)
- Cached loads MUST appear within 200ms (NFR2)
- Pact check-offs MUST provide immediate visual feedback via optimistic updates (NFR3)
- Cross-device sync MUST complete within 5 seconds when online (NFR4)
- Offline transitions MUST be seamless with no error messages (NFR5)

All data fetching uses TanStack Query with aggressive caching (stale-while-revalidate), optimistic updates, and background refetching. Loading states and error boundaries are handled by TanStack Query - never create separate state variables for these.

**Rationale:** Fast, responsive UI reinforces the action-first philosophy and maintains user momentum. Delays create friction that contradicts the product vision.

### IV. Offline-First Mobile Experience

**Mobile users must be able to view and complete pacts while offline.**

Mobile apps MUST:

- Display cached pacts and Today's view when offline
- Allow pact check-offs while offline (stored in local queue)
- Automatically sync queued actions when connection restored
- Handle 1000+ cached pacts without performance degradation (NFR15)
- Provide clear offline indicators without blocking functionality

**Rationale:** Users shouldn't be blocked from taking action due to connectivity. The queue-and-sync pattern ensures no data loss and maintains user trust.

### V. Security & Data Isolation

**User data must be logically isolated and encrypted in transit.**

- All data transmitted over TLS 1.3+ (NFR6)
- Passwords hashed with bcrypt or argon2 (NFR7)
- JWT tokens expire after 30 days of inactivity (NFR8)
- Users can ONLY access their own pacts - enforced via NestJS Guards (NFR9)
- OAuth 2.0 standards for Google and Apple authentication (NFR10)
- Token storage: expo-secure-store (mobile), httpOnly cookies (web)

**Rationale:** User trust is paramount. Security failures destroy product credibility and user retention.

### VI. Naming Consistency Across Layers

**Database snake_case converts to TypeScript camelCase; API uses plural resources.**

- **Database:** snake_case tables/columns (`users`, `pacts`, `created_at`)
- **TypeScript:** camelCase mapped via Prisma `@map()` (`userId`, `createdAt`)
- **API Endpoints:** Plural resources (`/users`, `/pacts`, `/completions`)
- **Components:** PascalCase (`PactCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`usePactQuery.ts`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_PACT_DURATION`)

All implementations MUST follow these conventions without exception.

**Rationale:** Consistent naming eliminates cognitive overhead and prevents bugs from naming mismatches across layers.

## Technology Stack Requirements

### Mandatory Technologies

The following technology choices are fixed and MUST be used:

**Frontend:**

- React Native with Expo (Mobile: iOS + Android)
- React with Vite (Web SPA)
- TypeScript (strict mode)
- TanStack Query 5+ for server state
- NativeWind 4+ (mobile) + Tailwind CSS 3+ (web) for styling
- Expo Router (mobile navigation) + React Router v6 (web navigation)

**Backend:**

- NestJS 10+ with TypeScript
- PostgreSQL 16+ for database
- Prisma 5+ as ORM
- Passport.js for authentication (local, Google OAuth, Apple OAuth)
- class-validator + class-transformer for validation

**Infrastructure:**

- Railway (backend + PostgreSQL hosting)
- Vercel (web app hosting with CDN)
- Expo EAS Build (mobile builds + OTA updates)
- Firebase Cloud Messaging (push notifications)

**Code Organization:**

- pnpm workspaces monorepo
- `/apps` for mobile, web, backend
- `/packages/shared` for shared code (types, API client, hooks, utils)

### Architecture Patterns

The following patterns are mandatory:

**Data Flow:**

- Prisma schema generates TypeScript types
- Types exported from `/packages/shared/types`
- API endpoints use DTOs with class-validator
- Frontend uses generated types from Prisma

**Authentication:**

- JWT access tokens (30-day expiration)
- NestJS Guards protect all user-specific routes
- User ownership validation in Guards

**API Conventions:**

- RESTful endpoints (GET, POST, PUT, DELETE)
- Resource-based URLs (`/pacts/:id`)
- JSON request/response bodies
- Consistent error format via NestJS exception filters

**State Management:**

- TanStack Query for ALL server state
- Query keys: array format `['pacts']`, `['pacts', id]`
- Optimistic updates for mutations
- Invalidate queries on mutation success
- React useState/useContext ONLY for UI-only state

## Performance & Reliability Standards

### Uptime & Availability

- **99.99% uptime** (4 nines) - maximum 52 minutes downtime per year (NFR16)
- Mobile crash rate MUST be < 0.1% (NFR17)
- No data loss during connectivity interruptions (NFR18)
- Automatic retry logic for transient sync failures (NFR19)
- Graceful degradation when backend unavailable (NFR20)

### Scalability

- System architecture MUST support 10x user growth without code changes (NFR12)
- Database design MUST accommodate unlimited pacts per user (NFR13)
- API endpoints MUST maintain performance with 100 concurrent requests (NFR14)
- Mobile apps MUST handle 1000+ cached pacts offline (NFR15)

### Accessibility

- WCAG 2.1 Level AA compliance (NFR23)
- Touch targets: minimum 44x44px (iOS), 48x48dp (Android) (NFR24)
- Color contrast ratios: minimum 4.5:1 for text (NFR25)
- Screen reader compatibility on all platforms
- Keyboard navigation support on web

## Testing Strategy

### Pragmatic Test Coverage

Focus on critical flows and complex business logic; defer exhaustive unit testing.

**E2E Tests (Critical Flows):**

- User registration and login (all auth methods)
- Pact creation flow
- Daily pact check-off
- Pact completion and reflection
- Offline sync when reconnecting

**Integration Tests (Complex Logic):**

- Pact immutability enforcement
- Offline queue sync logic
- Authentication token refresh
- Push notification scheduling

**Unit Tests (Minimal):**

- Utility functions (date calculations, validation)
- Critical business logic (pact frequency calculations)

**Rationale:** Balanced coverage for solo development with AI assistance. Focus on highest-risk functionality. Can expand post-launch.

## Governance

### Constitutional Authority

This constitution supersedes all other development practices, style guides, and architectural preferences. Any code that violates these principles MUST be refactored before merge.

### Amendment Process

1. Proposed amendments documented with rationale
2. Impact analysis on existing codebase
3. Migration plan if breaking changes required
4. Version bump according to semantic versioning:
   - **MAJOR:** Backward incompatible principle changes
   - **MINOR:** New principle additions or expansions
   - **PATCH:** Clarifications, typo fixes, non-semantic refinements

### Compliance Verification

- All pull requests MUST verify constitutional compliance
- AI agents MUST reference constitution when making architectural decisions
- Any added complexity MUST be justified against principle of simplicity
- Templates in `.specify/templates/` MUST align with constitutional requirements

### Version Control

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
