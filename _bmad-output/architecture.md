---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - _bmad-output/prd.md
workflowType: "architecture"
lastStep: 5
project_name: "pact"
user_name: "Nate"
date: "2025-12-29"
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The system encompasses **28 functional requirements** across 6 major categories:

1. **Pact Management (FR1-FR7):** Users create immutable pacts with defined actions, frequency, and timeframe (1 week to 1 month). The system enforces pact immutability once created—no modifications allowed—which reinforces the commitment philosophy. Pacts automatically notify on completion and support immediate next-pact creation.

2. **Daily Tracking (FR8-FR12):** Core daily workflow centers on "Today's Pacts" view showing all pacts due today. Users mark pacts complete with immediate visual feedback. System tracks completion history and displays progress (days completed vs required) throughout pact duration.

3. **Account & Access (FR13-FR19):** Multi-method authentication (email/password, Google OAuth, Apple OAuth) with secure cross-device session management. Users maintain persistent sessions across devices with secure token handling.

4. **Cross-Platform Experience (FR20-FR25):** True cross-platform system with React web app and React Native mobile (iOS + Android). Near real-time sync (< 5 seconds) across all platforms. Full offline capability on mobile—users can view and complete pacts offline with automatic sync on reconnection.

5. **Notifications & Reminders (FR26-FR29):** Mobile push notifications for daily pact reminders (user-customizable timing) and pact completion alerts. Users control notification preferences.

6. **Onboarding & Education (FR30-FR34):** First-run experience explains "pact" concept vs traditional goals/habits. Guided first pact creation with contextual help available throughout.

**Non-Functional Requirements:**

The system specifies **29 NFRs** with particularly demanding targets:

- **Performance (NFR1-NFR5):**

  - Initial "Today's Pacts" load < 2 seconds
  - Cached loads < 200ms (near-instant)
  - Immediate optimistic UI updates on pact check-offs
  - Cross-device sync < 5 seconds
  - Seamless offline transitions
  - **Architectural implication:** TanStack Query for aggressive caching strategy, optimistic updates, stale-while-revalidate pattern

- **Security (NFR6-NFR11):**

  - TLS 1.3+ encryption in transit
  - Industry-standard password hashing (bcrypt/argon2)
  - 30-day token expiration
  - Logical data isolation per user
  - OAuth 2.0 for social auth
  - **Architectural implication:** Secure token management, proper session handling, user data isolation at database/API layers

- **Scalability (NFR12-NFR15):**

  - 10x user growth without code changes
  - Unlimited pacts per user
  - 100 concurrent API requests maintained
  - 1000+ cached pacts on mobile
  - **Architectural implication:** Horizontally scalable backend, efficient database indexing, pagination strategies

- **Reliability & Availability (NFR16-NFR20):**

  - **99.99% uptime (4 nines)** - only 52 minutes downtime/year allowed
  - Mobile crash rate < 0.1%
  - No data loss during connectivity interruptions
  - Automatic retry logic for transient failures
  - Graceful degradation when services unavailable
  - **Architectural implication:** High availability backend infrastructure, robust offline queue, comprehensive error handling, health monitoring

- **Usability & Accessibility (NFR21-NFR25):**

  - Latest 2 versions of major browsers
  - iOS 15+ and Android 10+ support
  - WCAG 2.1 Level AA compliance
  - Minimum touch targets (44x44px iOS, 48x48dp Android)
  - 4.5:1 color contrast ratios
  - **Architectural implication:** Accessibility-first component library, responsive design system

- **Maintainability (NFR26-NFR29):**
  - **70%+ code sharing between React and React Native**
  - RESTful API conventions
  - Comprehensive error logging
  - 30-minute dev environment setup
  - **Architectural implication:** Shared business logic layer, platform-agnostic API client, consistent component patterns

**Scale & Complexity:**

- **Primary domain:** Full-stack cross-platform (React Native mobile + React web + REST API backend)
- **Complexity level:** Medium
  - Not trivial: Cross-platform sync, offline capability, 99.99% uptime, aggressive performance targets
  - Not complex: Bounded MVP scope, standard CRUD operations, no real-time collaboration, no complex business logic
- **Estimated architectural components:** 8-10 major components
  - Mobile app (React Native)
  - Web app (React SPA)
  - Shared business logic layer
  - API client (shared)
  - REST API backend
  - Database layer
  - Authentication service
  - Push notification service
  - Offline sync queue
  - Caching layer (TanStack Query)

### Technical Constraints & Dependencies

**Explicitly Specified Technologies:**

- **Frontend:** React (web) + React Native (mobile) - mandated for code sharing
- **State Management:** TanStack Query - specified for caching and server state
- **Backend:** REST API (implementation language flexible: Node.js/Express, Python/FastAPI, or Spring Boot Java)
- **Database:** Flexible - choice deferred (PostgreSQL, MongoDB, or other)
- **Authentication:** OAuth 2.0 for social login (Google, Apple)
- **Notifications:** Push notification service (Firebase Cloud Messaging or similar)

**Platform Constraints:**

- Mobile-first design philosophy (mobile is primary platform, web is secondary)
- iOS 15+ and Android 10+ minimum support
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- App store compliance required (iOS App Store, Google Play Store)

**Performance Constraints:**

- < 2 second initial load (hard requirement)
- < 200ms cached loads (near-instant expectation)
- < 5 second sync latency across platforms
- 99.99% uptime (business-critical reliability)

**Timeline Constraint:**

- Solo developer with AI assistance
- Target: MVP launch within few months
- **Architectural implication:** Favor proven patterns, leverage existing libraries, minimize custom infrastructure

**Future Growth Considerations:**

- AI coaching features planned (Phase 3) - architecture should accommodate:
  - OpenAI or Anthropic API integration
  - User reflection data processing
  - Pattern recognition across pacts
  - Next-pact suggestion generation
- Calendar integration planned (Phase 2)
- Social features optional (Phase 3)

### Cross-Cutting Concerns Identified

**1. Data Synchronization & Offline Handling**

- Affects: Mobile app, web app, API, database
- Requirements: Near real-time sync (< 5 seconds), full offline capability, conflict resolution
- Key decisions needed: Sync strategy, offline queue implementation, conflict resolution approach
- Risk level: High - critical to user experience and data integrity

**2. Authentication & Session Management**

- Affects: All client platforms, API, database
- Requirements: Multi-method auth, secure cross-device sessions, 30-day token expiration
- Key decisions needed: Token strategy (JWT vs opaque), session storage, refresh token handling
- Risk level: Medium - well-understood patterns exist

**3. Push Notifications**

- Affects: Mobile app, backend service
- Requirements: Daily reminders (customizable timing), pact completion alerts, >99% delivery rate
- Key decisions needed: Notification service selection, scheduling strategy, user preference management
- Risk level: Medium - mobile platform complexity

**4. Caching Strategy (TanStack Query)**

- Affects: Mobile app, web app
- Requirements: < 200ms cached loads, stale-while-revalidate, optimistic updates
- Key decisions needed: Cache invalidation rules, persistence strategy, background refresh timing
- Risk level: Low - TanStack Query handles most complexity

**5. Error Handling & Reliability**

- Affects: All components
- Requirements: 99.99% uptime, <0.1% mobile crash rate, graceful degradation, no data loss
- Key decisions needed: Retry strategies, circuit breakers, error boundaries, monitoring approach
- Risk level: High - demanding reliability targets

**6. Code Sharing Architecture**

- Affects: Mobile app, web app, shared logic layer
- Requirements: 70%+ code sharing between React and React Native
- Key decisions needed: Shared logic boundaries, platform-specific abstractions, component library approach
- Risk level: Medium - requires disciplined architecture

**7. Pact Immutability Enforcement**

- Affects: API, database, client apps
- Requirements: Pacts cannot be modified once created (business rule)
- Key decisions needed: API enforcement strategy, database constraints, client-side validation
- Risk level: Low - straightforward architectural pattern

**8. Scalability & Performance**

- Affects: API, database, infrastructure
- Requirements: 10x growth without code changes, 100 concurrent requests, unlimited pacts per user
- Key decisions needed: Database indexing strategy, API pagination, horizontal scaling approach
- Risk level: Medium - standard patterns but must be designed in from start

## Starter Template Evaluation

### Technical Preferences Discovery

Based on your PRD specifications:

**Language & Framework Decisions (Pre-determined):**

- **Language:** TypeScript (industry standard for cross-platform React development)
- **Mobile:** React Native with Expo (specified for cross-platform efficiency)
- **Web:** React SPA (specified in PRD)
- **State Management:** TanStack Query (explicitly specified for caching)
- **Backend:** REST API (language flexible: Node.js/Python/Java - decision deferred)

**Platform Strategy:**

- Mobile-first approach (primary platform)
- 70%+ code sharing requirement between web and mobile
- Solo developer with AI assistance (favor proven tools, fast iteration)

### Primary Technology Domain

**Full-stack cross-platform** with separate but coordinated starters:

1. **Mobile-first:** React Native with Expo (iOS + Android)
2. **Web secondary:** Vite + React (fast, modern SPA tooling)
3. **Shared logic layer:** Monorepo or shared packages for business logic, API client, and data models

### Starter Options Considered

**For Mobile (React Native):**

1. **Expo (Latest)** - Recommended ✅

   - Current command: `npx create-expo-app@latest`
   - Maintained by Expo team, excellent documentation
   - Handles iOS/Android build complexity
   - Built-in development tools and OTA updates
   - Push notification support included
   - App store deployment streamlined
   - Strong TypeScript support

2. **React Native CLI** - Not recommended for solo MVP
   - More control but significantly more setup complexity
   - Requires native development environment (Xcode, Android Studio)
   - No built-in OTA updates
   - Slower iteration for solo developer

**For Web (React SPA):**

1. **Vite + React** - Recommended ✅

   - Current command: `npm create vite@latest`
   - Extremely fast development server and builds
   - Modern, actively maintained
   - Simple configuration
   - Excellent TypeScript support
   - Production-ready optimization

2. **Create React App** - Not recommended

   - Now in maintenance mode
   - Slower build times than Vite
   - Community moving to Vite

3. **Next.js** - Overkill for this project
   - Current command: `npx create-next-app@latest`
   - Adds SSR complexity not needed for MVP
   - PRD specifies SPA architecture, not SSR
   - More configuration overhead for simple use case

### Selected Starters

**Mobile: Expo (React Native)**

**Rationale for Selection:**

- Expo is the industry standard for solo/small team React Native development
- Eliminates native build environment complexity (major time saver)
- Built-in push notification support aligns with FR26-FR29
- Excellent developer experience with hot reloading and debugging
- Simplified app store deployment for iOS and Android
- Strong community and comprehensive documentation
- Over-the-air (OTA) updates for rapid iteration post-launch

**Initialization Command:**

```bash
npx create-expo-app@latest pact-mobile --template
```

Template options when prompted:

- Choose "blank (TypeScript)" for clean TypeScript setup
- Or "tabs (TypeScript)" if you want tab navigation starter

**Architectural Decisions Provided by Expo:**

**Language & Runtime:**

- TypeScript preconfigured with React Native types
- ES6+ with Babel transpilation
- React Native 0.76+ (latest stable)

**Development Experience:**

- Expo Go app for instant preview on physical devices
- Hot reloading and fast refresh
- Metro bundler for JavaScript bundling
- TypeScript checking integrated

**Platform Support:**

- iOS and Android from single codebase
- Web preview capability (experimental, not for production)
- Native module support through Expo SDK

**Build & Deployment:**

- EAS (Expo Application Services) for cloud builds
- OTA updates via expo-updates
- App store submission tools included

**Built-in Features:**

- Push notifications (expo-notifications)
- Secure storage (expo-secure-store)
- File system access
- Splash screen and app icon management

**Code Organization:**

- `/app` or `/src` for application code
- `/assets` for images, fonts, etc.
- `app.json` for Expo configuration
- TypeScript paths configured

---

**Web: Vite + React**

**Rationale for Selection:**

- Vite is the modern standard for React SPAs, replacing Create React App
- Lightning-fast hot module replacement (HMR) during development
- Optimized production builds with tree-shaking and code splitting
- Minimal configuration needed - solo developer friendly
- Strong TypeScript support out of the box
- Aligns with PRD's SPA architecture requirement (NFR26)
- Excellent performance meets NFR1-NFR5 targets

**Initialization Command:**

```bash
npm create vite@latest pact-web -- --template react-ts
```

This creates a React + TypeScript SPA with Vite tooling.

**Architectural Decisions Provided by Vite:**

**Language & Runtime:**

- TypeScript preconfigured with strict mode options
- React 18+ with TypeScript types
- ES modules (ESM) as default
- Modern JavaScript features supported

**Styling Solution:**

- CSS modules available (scoped by default)
- PostCSS support included
- Tailwind CSS easy to add (popular choice for rapid development)
- CSS-in-JS libraries work seamlessly

**Build Tooling:**

- Vite dev server with instant HMR
- Rollup for production builds
- Automatic code splitting
- Tree-shaking for smaller bundles
- Asset optimization (images, fonts, etc.)

**Development Experience:**

- Hot module replacement (instant updates)
- TypeScript type checking
- React Fast Refresh enabled
- Source maps for debugging
- Environment variable support (.env files)

**Code Organization:**

- `/src` for application code
- `/src/main.tsx` as entry point
- `/src/App.tsx` as root component
- `/public` for static assets
- TypeScript path aliases configurable

**Testing Framework:**

- Easy integration with Vitest (Vite-native test runner)
- React Testing Library compatible
- Jest compatibility if needed

**Note:** Both project initializations should be the first implementation stories. Consider using a monorepo structure (like pnpm workspaces or npm workspaces) to share code between `pact-mobile` and `pact-web` - this supports the NFR26 requirement of 70%+ code sharing.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

1. Database: PostgreSQL (self-hosted) - Required for all data persistence
2. Backend Framework: NestJS - Foundation for API development
3. ORM: Prisma - Database access layer
4. Authentication: Passport.js with JWT - Security foundation
5. Code Organization: pnpm workspaces - Enables 70%+ code sharing requirement

**Important Decisions (Shape Architecture):** 6. Push Notifications: Firebase Cloud Messaging - Critical for user engagement (FR26-FR29) 7. Styling: NativeWind + Tailwind CSS - Cross-platform UI consistency 8. Validation: class-validator + class-transformer - API reliability 9. Deployment: Railway + Vercel + Expo EAS - Infrastructure strategy

**Deferred Decisions (Post-MVP):** 10. Testing tooling specifics - Basic strategy defined, detailed implementation during development 11. Monitoring/observability tools - Will be added as scaling needs emerge 12. CI/CD pipeline details - Will be configured during first deployments

### Data Architecture

**Database: PostgreSQL 16+ (self-hosted)**

- **Decision:** Self-hosted PostgreSQL for primary data store
- **Version:** PostgreSQL 16 or later (latest stable)
- **Rationale:**
  - ACID compliance ensures pact immutability enforcement at database level
  - Proven 99.99% uptime reliability (NFR16)
  - Relational model perfectly fits user → pacts → daily_completions structure
  - Strong constraint system for business rules
  - Mature ecosystem and tooling
- **Affects:** All backend services, data modeling, API performance
- **Hosting:** Railway managed PostgreSQL database

**ORM: Prisma 5+**

- **Decision:** Prisma as database client and ORM
- **Version:** Prisma 5 or later
- **Rationale:**
  - Schema-first approach ideal for defining immutability constraints
  - Auto-generated TypeScript types ensure type safety end-to-end
  - Excellent migration system for schema evolution
  - Native NestJS integration well-documented
  - Great developer experience for solo development
- **Affects:** Backend data access layer, TypeScript type definitions, database migrations
- **Integration:** @nestjs/prisma for NestJS integration

**Data Validation Strategy:**

- **Decision:** class-validator + class-transformer for DTO validation
- **Version:** class-validator 0.14+, class-transformer 0.5+
- **Rationale:**
  - Native NestJS integration with ValidationPipe
  - Decorator-based validation on all DTOs
  - Automatic request validation at API boundary
  - Type-safe with TypeScript
  - Clear error messages for API clients
- **Affects:** All API endpoints, request/response handling
- **Pattern:** Validation at API layer + database constraints for defense in depth

### Authentication & Security

**Authentication: Passport.js with JWT**

- **Decision:** Passport.js with JWT tokens for authentication
- **Version:** @nestjs/passport 10+, passport-jwt 4+, passport-google-oauth20 2+, passport-apple 2+
- **Strategies:**
  - Local strategy: email/password (FR13)
  - Google OAuth 2.0 strategy (FR14)
  - Apple OAuth strategy (FR15)
- **Token Management:**
  - JWT access tokens (30-day expiration per NFR8)
  - Secure token storage: expo-secure-store (mobile), httpOnly cookies (web)
  - Refresh token pattern for long-lived sessions
- **Rationale:**
  - Native NestJS integration (@nestjs/passport)
  - Proven strategy ecosystem for all OAuth providers
  - No recurring costs (vs Auth0)
  - Full control over token lifecycle and security
  - NestJS Guards work seamlessly with Passport
- **Affects:** All protected API endpoints, mobile auth flow, web auth flow
- **Security:** bcrypt for password hashing (NFR7), JWT signed with RS256

**Authorization Pattern:**

- **Decision:** NestJS Guards with role-based access control
- **Pattern:** User ownership validation in Guards (users can only access their own pacts)
- **Rationale:** Logical data isolation requirement (NFR9)
- **Affects:** All API endpoints requiring user context

### API & Communication Patterns

**API Style: RESTful API**

- **Decision:** REST API with NestJS controllers
- **Version:** NestJS 10+
- **Conventions:**
  - Resource-based URLs (/users, /pacts, /completions)
  - Standard HTTP methods (GET, POST, PUT, DELETE)
  - JSON request/response bodies
  - Consistent error response format
- **Rationale:**
  - Specified in PRD requirements
  - Simple, well-understood pattern
  - Excellent NestJS support
  - Works perfectly with TanStack Query on frontend
- **Affects:** All client-server communication, API documentation

**Error Handling:**

- **Decision:** NestJS exception filters with custom business exceptions
- **Pattern:**
  - Global exception filter for consistent error responses
  - Custom exceptions (e.g., `PactImmutableException`, `UnauthorizedException`)
  - Structured error responses: `{ statusCode, message, error, timestamp }`
  - Error logging for debugging
- **Rationale:**
  - Consistent error experience across all endpoints
  - Business rule violations clearly communicated
  - Aids debugging in production
- **Affects:** All API endpoints, client error handling

**API Documentation:**

- **Decision:** OpenAPI/Swagger via @nestjs/swagger
- **Rationale:** Auto-generated from NestJS decorators, aids frontend development
- **Affects:** API development workflow, frontend team (or AI) understanding

### Frontend Architecture

**State Management:**

- **Decision:** TanStack Query for server state (specified in PRD)
- **Version:** @tanstack/react-query 5+ (web), @tanstack/react-query 5+ (mobile)
- **Rationale:**
  - Specified in PRD (NFR requirements)
  - Handles caching, synchronization, and optimistic updates
  - Meets < 200ms cached load requirement (NFR2)
  - Stale-while-revalidate pattern built-in
  - Works identically on web and mobile (code sharing)
- **Affects:** All data fetching, caching strategy, API integration
- **Local State:** React useState/useContext for UI-only state

**Styling Solution:**

- **Decision:** NativeWind (mobile) + Tailwind CSS (web)
- **Version:** NativeWind 4+, Tailwind CSS 3+
- **Rationale:**
  - Same utility classes work across web and mobile
  - Supports 70%+ code sharing requirement (NFR26)
  - Fast development with utility-first approach
  - Responsive design built-in
  - Accessibility utilities meet WCAG 2.1 Level AA (NFR23)
- **Affects:** All UI components, component library, design system
- **Pattern:** Shared component library in `/packages/shared` with platform-specific style overrides when needed

**Component Architecture:**

- **Decision:** Shared component library with platform adapters
- **Structure:**
  - `/packages/shared/components` - Business logic components
  - `/apps/mobile/components` - Native-specific wrappers
  - `/apps/web/components` - Web-specific wrappers
- **Rationale:**
  - Maximizes code reuse (NFR26 - 70%+ sharing)
  - Platform-specific optimizations when needed
  - Clear separation of concerns
- **Affects:** Component development, UI consistency, code sharing

**Routing:**

- **Decision:**
  - Mobile: Expo Router (file-based routing)
  - Web: React Router v6
- **Rationale:**
  - Expo Router is standard for Expo apps
  - React Router is standard for React SPAs
  - Both provide type-safe navigation
- **Affects:** Navigation flow, deep linking, URL structure

### Code Organization & Structure

**Monorepo: pnpm workspaces**

- **Decision:** Monorepo with pnpm workspaces
- **Version:** pnpm 8+
- **Structure:**
  ```
  /apps
    /mobile       # Expo React Native app
    /web          # Vite React SPA
    /backend      # NestJS API
  /packages
    /shared       # Shared business logic, types, API client
      /types      # Prisma-generated + custom TypeScript types
      /api        # API client (axios/fetch wrapper)
      /utils      # Date calculations, validation, etc.
      /hooks      # Shared React hooks
  ```
- **Rationale:**
  - Single repository for all code (simplified version control)
  - No publishing overhead for shared packages
  - Direct imports between packages (`import { Pact } from '@pact/shared'`)
  - pnpm is fast and disk-space efficient
  - Supports 70%+ code sharing requirement (NFR26)
- **Affects:** Development workflow, code imports, build process
- **Configuration:** `pnpm-workspace.yaml` at root

**Shared Code Strategy:**

- **Shared (70%+):**
  - TypeScript types (User, Pact, Completion models)
  - Business logic (pact validation, date calculations)
  - API client (REST endpoint calls)
  - TanStack Query hooks (data fetching)
  - Utility functions
- **Platform-Specific (30%):**
  - UI components (React vs React Native primitives)
  - Navigation (Expo Router vs React Router)
  - Storage (expo-secure-store vs localStorage)
  - Push notifications (expo-notifications vs web notifications)

### Infrastructure & Deployment

**Backend Hosting: Railway**

- **Decision:** Railway for NestJS backend + PostgreSQL database
- **Rationale:**
  - Simple deployment (git push to deploy)
  - Managed PostgreSQL included
  - Free tier for early development
  - Scales easily as user base grows
  - Meets 99.99% uptime requirement (NFR16)
- **Affects:** Backend infrastructure, database hosting, deployment workflow
- **Configuration:** `railway.json` for deployment config

**Web Hosting: Vercel**

- **Decision:** Vercel for React SPA hosting
- **Rationale:**
  - Optimized for React SPAs
  - Global CDN included (meets < 2 second load time NFR1)
  - Automatic deployments from git
  - Generous free tier
  - Perfect for Vite builds
- **Affects:** Web app infrastructure, CDN, deployment workflow
- **Configuration:** `vercel.json` for routing and build config

**Mobile Deployment: Expo EAS Build**

- **Decision:** Expo Application Services (EAS) for mobile builds
- **Rationale:**
  - Cloud builds (no need for local Xcode/Android Studio)
  - Handles iOS and Android app store submissions
  - OTA updates for rapid iteration (expo-updates)
  - Integrated with Expo workflow
- **Affects:** Mobile app builds, app store releases, OTA updates
- **Stores:** Apple App Store (iOS), Google Play Store (Android)

**Push Notifications: Firebase Cloud Messaging**

- **Decision:** FCM for push notification delivery
- **Version:** Firebase SDK 10+
- **Integration:** expo-notifications with FCM backend
- **Rationale:**
  - Native Expo support (expo-notifications built for FCM)
  - Free and reliable (>99% delivery rate per NFR16)
  - Single service handles iOS and Android
  - Excellent React Native documentation
  - Easy scheduling for daily reminders (FR26)
- **Affects:** Mobile app notifications, backend notification scheduling
- **Configuration:** Firebase project, FCM server key in NestJS backend

**Environment Configuration:**

- **Decision:** Environment-based configuration with validation
- **Pattern:**
  - `.env.local` for local development
  - `.env.production` for production (Railway, Vercel)
  - Validation on startup (missing env vars cause startup failure)
- **Rationale:** Security (no secrets in code), environment isolation
- **Affects:** All apps (mobile, web, backend)

### Testing Strategy

**Testing Approach: Pragmatic MVP Testing**

- **Decision:** Focus on critical flows and complex logic, defer comprehensive unit testing
- **Coverage Strategy:**
  - **E2E Tests (Critical User Flows):**
    - User registration and login (all auth methods)
    - Pact creation flow
    - Daily pact check-off
    - Pact completion and reflection
    - Offline sync when reconnecting
  - **Integration Tests (Complex Business Logic):**
    - Pact immutability enforcement (cannot modify pact)
    - Offline queue sync logic
    - Authentication token refresh
    - Push notification scheduling
  - **Unit Tests (Minimal):**
    - Utility functions (date calculations, validation)
    - Critical business logic (pact frequency calculations)
- **Rationale:**
  - Balanced coverage for solo developer
  - Focus on highest-risk functionality
  - Can expand test coverage post-launch
  - AI-assisted development benefits from E2E validation
- **Affects:** Development workflow, deployment confidence

**Testing Tools:**

- **Web:**
  - Vitest (Vite-native test runner)
  - React Testing Library (component testing)
  - Playwright (E2E testing)
- **Mobile:**
  - Jest (React Native default)
  - React Native Testing Library
  - Detox (E2E testing on iOS/Android simulators)
- **Backend:**
  - Jest with NestJS testing utilities
  - Supertest (API endpoint testing)
- **Rationale:** Industry-standard tools for each platform

### Decision Impact Analysis

**Implementation Sequence:**

1. **Foundation (Must be first):**

   - Initialize monorepo structure (pnpm workspaces)
   - Set up mobile app (Expo)
   - Set up web app (Vite)
   - Set up backend (NestJS)

2. **Database & Types (Enables data flow):**

   - Design Prisma schema (User, Pact, Completion models)
   - Run Prisma migrations
   - Generate TypeScript types
   - Share types in `/packages/shared`

3. **Authentication (Required for protected features):**

   - Implement Passport strategies (local, Google, Apple)
   - JWT token generation and validation
   - Auth Guards for protected routes
   - Login/register UI (mobile + web)

4. **Core API (Enables pact features):**

   - Pact CRUD endpoints with immutability enforcement
   - Daily completion endpoints
   - Today's Pacts query endpoint
   - Validation with class-validator

5. **Frontend Integration (User-facing features):**

   - TanStack Query setup with API client
   - Pact creation UI
   - Today's Pacts view
   - Offline sync queue

6. **Notifications (User engagement):**

   - FCM setup
   - Push notification registration
   - Daily reminder scheduling
   - Pact completion alerts

7. **Styling & Polish (User experience):**

   - NativeWind/Tailwind setup
   - Shared component library
   - Responsive design
   - Accessibility improvements

8. **Deployment (Go live):**
   - Railway backend deployment
   - Vercel web deployment
   - EAS mobile builds
   - App store submissions

**Cross-Component Dependencies:**

1. **Database Schema → API → Frontend Types:**

   - Prisma schema defines data structure
   - Prisma generates TypeScript types
   - Types shared to frontend via `/packages/shared`
   - Ensures type safety end-to-end

2. **Authentication → All Protected Features:**

   - Auth must be implemented before protected API endpoints
   - JWT tokens required for all user-specific operations
   - Guards depend on Passport authentication

3. **TanStack Query → Offline Sync:**

   - TanStack Query mutation queue enables offline capability
   - Optimistic updates depend on query cache
   - Sync strategy built on TanStack Query retry logic

4. **Monorepo Structure → Code Sharing:**

   - Proper workspace setup enables all code sharing
   - Shared packages must be configured before app development
   - Build order matters (shared packages build first)

5. **NativeWind → Component Library:**
   - Styling setup must be complete before building shared components
   - Platform-specific style overrides depend on proper NativeWind config
   - Accessibility utilities (contrast, touch targets) depend on Tailwind setup

## Implementation Patterns & Consistency Rules

### Pattern Overview

These patterns ensure AI agents and developers write compatible, consistent code across the entire codebase. **All implementations must follow these patterns without exception.**

### Naming Patterns

**Database Naming Conventions (Prisma Schema):**

- **Tables:** snake_case plural (`users`, `pacts`, `daily_completions`)
- **Columns:** snake_case (`user_id`, `created_at`, `pact_title`)
- **Primary Keys:** `id` (UUID v4)
- **Foreign Keys:** `{model}_id` (`user_id`, `pact_id`)
- **Timestamps:** `created_at`, `updated_at`
- **Mapping:** Use Prisma `@map()` to convert to camelCase in TypeScript

**Example:**

```prisma
model Pact {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("pacts")
}
```

**API Naming Conventions:**

- **Endpoints:** Plural resources (`/users`, `/pacts`, `/completions`)
- **Route Parameters:** `:id`, `:pactId` (camelCase after colon)
- **Query Parameters:** camelCase (`userId`, `startDate`)
- **HTTP Methods:** Standard REST (GET, POST, PUT, PATCH, DELETE)
- **Example Endpoints:**
  - `GET /pacts` - List all pacts for authenticated user
  - `GET /pacts/:id` - Get specific pact
  - `POST /pacts` - Create new pact
  - `PATCH /pacts/:id/complete` - Mark pact complete for today
  - `DELETE /pacts/:id` - Delete pact (if allowed)

**Code Naming Conventions:**

- **Components:** PascalCase files and exports (`UserCard.tsx`, `export const UserCard`)
- **Hooks:** camelCase with `use` prefix (`usePactQuery.ts`, `export const usePactQuery`)
- **Utilities:** camelCase files and exports (`dateUtils.ts`, `export const calculateDaysRemaining`)
- **Types/Interfaces:** PascalCase (`User`, `Pact`, `CreatePactDto`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_PACT_DURATION`, `DEFAULT_REMINDER_TIME`)
- **Variables:** camelCase (`pactList`, `completionCount`)
- **Functions:** camelCase (`getPactById`, `validatePactFrequency`)

### Structure Patterns

**Project Organization:**

```
/apps
  /mobile
    /src
      /components     # React Native components
      /screens        # Expo Router screens
      /hooks          # Mobile-specific hooks
      /utils          # Mobile-specific utilities
      /config         # Mobile configuration
  /web
    /src
      /components     # React components
      /pages          # React Router pages
      /hooks          # Web-specific hooks
      /utils          # Web-specific utilities
      /config         # Web configuration
  /backend
    /src
      /modules        # NestJS modules (users, pacts, auth)
        /{module}
          /{module}.controller.ts
          /{module}.service.ts
          /{module}.module.ts
          /dto        # DTOs for this module
          /entities   # Prisma entity types
      /common         # Shared backend code
        /guards
        /filters
        /interceptors
        /decorators
      /config         # Backend configuration
/packages
  /shared
    /types          # Shared TypeScript types
    /api            # API client
    /utils          # Shared utilities
    /hooks          # Shared React hooks
    /validation     # Shared validation logic
```

**File Structure Patterns:**

- **Tests:** Co-located with source files (`PactCard.test.tsx` next to `PactCard.tsx`)
- **Styles:** Co-located when component-specific (if not using NativeWind/Tailwind)
- **Config Files:** Root of each app/package (`tsconfig.json`, `jest.config.js`)
- **Environment Files:** Root with `.env.local`, `.env.production` naming

**Module Organization (NestJS):**

- Each feature module in `/src/modules/{feature}`
- Module contains: controller, service, module file, dto folder, entities folder
- Example: `/src/modules/pacts/pacts.controller.ts`, `/src/modules/pacts/pacts.service.ts`

### Format Patterns

**API Response Formats:**

**Success Responses:**

- Return data directly (no wrapper)
- HTTP 200 for successful GET
- HTTP 201 for successful POST (resource created)
- HTTP 204 for successful DELETE (no content)

```typescript
// GET /pacts/:id
{
  "id": "uuid",
  "title": "Run 3 days per week",
  "frequency": 3,
  "duration": 4,
  "createdAt": "2025-12-29T14:30:00.000Z"
}
```

**Error Responses:**

- NestJS standard format
- Consistent structure across all errors

```typescript
{
  "statusCode": 400,
  "message": "Pact cannot be modified once created",
  "error": "Bad Request"
}
```

**Validation Errors:**

```typescript
{
  "statusCode": 400,
  "message": ["title must be a string", "frequency must be a number"],
  "error": "Bad Request"
}
```

**Data Exchange Formats:**

- **JSON Fields:** camelCase (`userId`, `createdAt`, `pactTitle`)
- **Dates:** ISO 8601 strings (`"2025-12-29T14:30:00.000Z"`)
- **Booleans:** `true`/`false` (not 1/0 or "true"/"false")
- **Null Values:** Use `null` for missing optional values (not undefined in JSON)
- **Arrays:** Always return array `[]` even if empty (not `null`)

### State Management Patterns

**TanStack Query Patterns:**

**Query Keys:**

- Array format: `['pacts']`, `['pacts', pactId]`, `['pacts', 'today']`
- Hierarchical: `['users', userId, 'pacts']`
- Consistent naming across mobile and web

**Mutation Patterns:**

- Use optimistic updates for immediate UI feedback
- Invalidate related queries on success
- Handle errors with TanStack Query error boundaries

**Example:**

```typescript
const { mutate: createPact } = useMutation({
  mutationFn: (data: CreatePactDto) => apiClient.post("/pacts", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["pacts"] });
  },
  onError: (error) => {
    // TanStack Query handles error state
  },
});
```

**Loading State Pattern:**

- **NEVER** create separate `loading` state variables
- Use TanStack Query's `isLoading`, `isFetching` flags
- Use `isPending` for mutations

**Error State Pattern:**

- **NEVER** create separate `error` state variables
- Use TanStack Query's `error` object
- Display errors from `error.message`

### Error Handling Patterns

**Backend Error Handling:**

**Custom Exceptions:**

```typescript
// Create custom exceptions for business rules
export class PactImmutableException extends BadRequestException {
  constructor() {
    super("Pact cannot be modified once created");
  }
}
```

**Global Exception Filter:**

- All unhandled exceptions caught by global filter
- Consistent error format across all endpoints
- Logging for debugging

**Validation Errors:**

- Use class-validator decorators on DTOs
- ValidationPipe transforms validation errors to standard format
- Clear, user-friendly error messages

**Frontend Error Handling:**

**TanStack Query Error Boundaries:**

```typescript
// Let TanStack Query handle errors
const { data, error } = useQuery({
  queryKey: ["pacts"],
  queryFn: fetchPacts,
});

if (error) {
  return <ErrorMessage message={error.message} />;
}
```

**User-Facing Errors:**

- Show friendly messages (not technical details)
- Provide actionable guidance
- Log technical details for debugging

### Authentication Patterns

**JWT Token Pattern:**

- **Access Token:** 30-day expiration (per NFR8)
- **Storage:**
  - Mobile: expo-secure-store
  - Web: httpOnly cookie (set by backend)
- **Refresh:** Automatic refresh before expiration
- **Header:** `Authorization: Bearer {token}`

**Protected Route Pattern:**

```typescript
// Backend: Use @UseGuards(JwtAuthGuard)
@UseGuards(JwtAuthGuard)
@Get('pacts')
getPacts(@Req() req) {
  const userId = req.user.id; // User from JWT
  return this.pactsService.findByUser(userId);
}

// Frontend: TanStack Query handles 401 responses
```

**User Context Pattern:**

- Backend: Extract user from JWT in Guard
- Frontend: Fetch user profile on app load, cache with TanStack Query
- Share user context via React Context (not in every query)

### Testing Patterns

**Test File Naming:**

- Co-located: `PactCard.test.tsx` next to `PactCard.tsx`
- E2E tests: `/e2e/{feature}.spec.ts`

**Test Structure:**

```typescript
describe("PactCard", () => {
  it("should display pact title", () => {
    // Arrange
    const pact = { id: "1", title: "Run 3x week" };

    // Act
    render(<PactCard pact={pact} />);

    // Assert
    expect(screen.getByText("Run 3x week")).toBeInTheDocument();
  });
});
```

**What to Test:**

- **E2E:** Critical user flows (auth, pact creation, check-off, completion)
- **Integration:** Business logic (immutability, offline sync, validation)
- **Unit:** Utilities and pure functions (date calculations, validation)

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow naming conventions exactly** - Database snake_case, TypeScript camelCase, Components PascalCase
2. **Use TanStack Query for all server state** - No manual loading/error state management
3. **Return direct API responses** - No response wrappers
4. **Use ISO 8601 for all dates** - In database, API, and display
5. **Co-locate tests with source files** - Keep tests next to the code they test
6. **Use Prisma @map()** - For all database → TypeScript conversions
7. **Follow NestJS module structure** - Controller, service, module, dto, entities
8. **Use custom exceptions** - For business rule violations (PactImmutableException)
9. **Never duplicate state** - TanStack Query is single source of truth for server data
10. **Use hierarchical query keys** - `['resource', id, 'sub-resource']` pattern

**Pattern Violations:**

- Will cause type errors (TypeScript)
- Will cause runtime errors (missing data)
- Will cause sync conflicts (different naming)
- Will cause confusion (inconsistent patterns)

**Updating Patterns:**

- Patterns can evolve as project grows
- Document all changes in this section
- Ensure all existing code updated to match new patterns

### Pattern Examples

**✅ GOOD: Prisma Model with Mapping**

```prisma
model Pact {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  title       String
  frequency   Int
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("pacts")
}
```

**❌ BAD: No mapping (causes camelCase in database)**

```prisma
model Pact {
  id          String   @id @default(uuid())
  userId      String   // Wrong: creates "userId" column in database
  title       String
  frequency   Int
  createdAt   DateTime @default(now()) // Wrong: creates "createdAt"

  @@map("pacts")
}
```

**✅ GOOD: TanStack Query Usage**

```typescript
const {
  data: pacts,
  isLoading,
  error,
} = useQuery({
  queryKey: ["pacts"],
  queryFn: () => apiClient.get("/pacts"),
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} />;
```

**❌ BAD: Manual state management**

```typescript
const [pacts, setPacts] = useState([]);
const [loading, setLoading] = useState(false); // Wrong: TanStack Query handles this
const [error, setError] = useState(null); // Wrong: TanStack Query handles this

useEffect(() => {
  setLoading(true); // Don't do this
  fetch("/pacts")
    .then((data) => setPacts(data))
    .catch((err) => setError(err))
    .finally(() => setLoading(false));
}, []);
```

**✅ GOOD: API Response**

```typescript
// Direct response, HTTP 200
return {
  id: "uuid",
  title: "Run 3x week",
  createdAt: "2025-12-29T14:30:00.000Z",
};
```

**❌ BAD: Wrapped response**

```typescript
// Wrong: Unnecessary wrapper
return {
  success: true,
  data: {
    id: "uuid",
    title: "Run 3x week",
  },
};
```

**✅ GOOD: Component File Structure**

```
/components
  /PactCard.tsx          # Component
  /PactCard.test.tsx     # Test co-located
```

**❌ BAD: Separated tests**

```
/components
  /PactCard.tsx
/__tests__
  /components
    /PactCard.test.tsx   # Wrong: Too far from source
```
