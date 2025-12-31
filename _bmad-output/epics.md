---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/architecture.md
project_name: pact
user_name: Nate
date: 2025-12-30
workflowComplete: true
---

# pact - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for pact, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Pact Management (FR1-FR7):**

- **FR1:** Users can create a new pact by defining an action, frequency, and timeframe
- **FR2:** Users can view all their active pacts
- **FR3:** Users can view details of a specific pact including definition and progress
- **FR4:** System prevents modification of pact parameters once created
- **FR5:** System automatically notifies users when a pact period ends
- **FR6:** Users can record learning reflections at pact completion
- **FR7:** Users can create a new pact immediately after completing one

**Daily Tracking (FR8-FR12):**

- **FR8:** Users can view all pacts due today in a consolidated view
- **FR9:** Users can mark a pact as complete for the current day
- **FR10:** System provides immediate visual feedback when pact is checked off
- **FR11:** Users can view completion status (days completed vs required) for active pacts
- **FR12:** System tracks completion history for each pact throughout its duration

**Account & Access (FR13-FR19):**

- **FR13:** Users can create an account using email and password
- **FR14:** Users can authenticate using Google social login
- **FR15:** Users can authenticate using Apple social login
- **FR16:** Users can securely access their account across multiple devices
- **FR17:** System maintains user session across app closures and device switches
- **FR18:** Users can log out of their account
- **FR19:** Users can reset their password if forgotten

**Cross-Platform Experience (FR20-FR25):**

- **FR20:** Users can access the pact application via web browser
- **FR21:** Users can access the pact application via iOS mobile app
- **FR22:** Users can access the pact application via Android mobile app
- **FR23:** System synchronizes pact data across all platforms within seconds
- **FR24:** Users can complete pacts while offline on mobile
- **FR25:** System automatically syncs offline changes when connection is restored

**Notifications & Reminders (FR26-FR29):**

- **FR26:** Users can receive daily reminder notifications to check Today's Pacts
- **FR27:** Users can customize the time they receive daily reminders
- **FR28:** Users can receive notifications when a pact period completes
- **FR29:** Users can enable or disable notifications

**Onboarding & Education (FR30-FR34):**

- **FR30:** New users see an explanation of what a "pact" is on first launch
- **FR31:** New users receive guidance on how to create their first pact
- **FR32:** Users can access information explaining pact methodology vs goals/habits
- **FR33:** System provides helpful hints during first pact creation
- **FR34:** Users can view instructions or help content at any time

### Non-Functional Requirements

**Performance (NFR1-NFR5):**

- **NFR1:** Initial page/screen load completes within 2 seconds on standard connections
- **NFR2:** Cached page/screen loads appear instantly (< 200ms)
- **NFR3:** Pact check-off actions provide immediate UI feedback (optimistic updates)
- **NFR4:** Data synchronization across devices completes within 5 seconds when online
- **NFR5:** Offline mode transitions are seamless with no user-visible errors

**Security (NFR6-NFR11):**

- **NFR6:** All data is encrypted in transit using TLS 1.3 or higher
- **NFR7:** User passwords are hashed using industry-standard algorithms (bcrypt/argon2)
- **NFR8:** Authentication tokens expire after 30 days of inactivity
- **NFR9:** User data is logically isolated - users can only access their own pacts
- **NFR10:** Social authentication (Google, Apple) follows OAuth 2.0 security standards
- **NFR11:** Session management prevents concurrent access from unauthorized devices

**Scalability (NFR12-NFR15):**

- **NFR12:** System architecture supports 10x user growth without code changes
- **NFR13:** Database design accommodates unlimited pacts per user
- **NFR14:** API endpoints maintain performance with 100 concurrent requests
- **NFR15:** Mobile apps handle offline operation with 1000+ cached pacts

**Reliability & Availability (NFR16-NFR20):**

- **NFR16:** System maintains 99.99% uptime (four nines) - maximum 52 minutes downtime per year
- **NFR17:** Mobile apps maintain <0.1% crash rate across iOS and Android
- **NFR18:** Offline queue ensures no data loss during connectivity interruptions
- **NFR19:** Automatic retry logic handles transient sync failures
- **NFR20:** System degrades gracefully when backend services are unavailable

**Usability & Accessibility (NFR21-NFR25):**

- **NFR21:** Web application supports Chrome, Firefox, Safari, and Edge (latest 2 versions)
- **NFR22:** Mobile apps support iOS 15+ and Android 10+
- **NFR23:** Interface meets WCAG 2.1 Level AA accessibility standards
- **NFR24:** Touch targets meet minimum size requirements (44x44px iOS, 48x48dp Android)
- **NFR25:** Color contrast ratios meet accessibility guidelines (4.5:1 for normal text)

**Maintainability (NFR26-NFR29):**

- **NFR26:** Codebase maintains significant sharing between React and React Native (70%+ shared logic)
- **NFR27:** API follows RESTful conventions for consistency
- **NFR28:** Error logging captures sufficient context for debugging production issues
- **NFR29:** Development environment setup completes within 30 minutes for new developers

### Additional Requirements

**From Architecture Document:**

**Starter Templates:**

- **Mobile:** Expo (React Native) with TypeScript - Command: `npx create-expo-app@latest pact-mobile --template` (blank TypeScript)
- **Web:** Vite + React with TypeScript - Command: `npm create vite@latest pact-web -- --template react-ts`
- **Backend:** NestJS with TypeScript - Standard NestJS starter
- **Monorepo:** pnpm workspaces for 70%+ code sharing requirement

**Technology Stack:**

- **Database:** PostgreSQL 16+ (self-hosted on Railway)
- **ORM:** Prisma 5+ with schema-first approach
- **Authentication:** Passport.js with JWT (local, Google OAuth, Apple OAuth strategies)
- **State Management:** TanStack Query 5+ for server state (web and mobile)
- **Styling:** NativeWind 4+ (mobile) + Tailwind CSS 3+ (web) for unified styling
- **Push Notifications:** Firebase Cloud Messaging integrated with expo-notifications
- **Validation:** class-validator + class-transformer for API DTOs

**Infrastructure & Deployment:**

- **Backend Hosting:** Railway (NestJS + PostgreSQL database)
- **Web Hosting:** Vercel (React SPA with global CDN)
- **Mobile Deployment:** Expo EAS Build (iOS and Android app stores)

**Code Organization:**

- Monorepo structure with `/apps` (mobile, web, backend) and `/packages` (shared code)
- 70%+ code sharing: TypeScript types, business logic, API client, TanStack Query hooks
- Platform-specific (30%): UI components, navigation, storage, notifications

**Implementation Patterns:**

- Database naming: snake_case tables/columns with Prisma @map() to camelCase TypeScript
- API endpoints: RESTful with plural resources (/users, /pacts, /completions)
- Error handling: NestJS exception filters with custom business exceptions
- Testing: E2E for critical flows, integration for business logic, minimal unit tests

**Data Model Requirements:**

- UUID primary keys for all entities
- Pact immutability enforced at database level (constraints)
- Timestamps: created_at, updated_at on all entities
- User → Pacts → Daily Completions relational structure

**Security Implementation:**

- JWT tokens with 30-day expiration
- Token storage: expo-secure-store (mobile), httpOnly cookies (web)
- Bcrypt/Argon2 password hashing
- OAuth 2.0 for social authentication
- User data isolation enforced by API Guards

### FR Coverage Map

**Epic 1 (Foundation):** No FRs directly - Architecture requirements (starter templates, monorepo, database, auth infrastructure)

**Epic 2 (Auth):**

- FR13: Users can create an account using email and password
- FR14: Users can authenticate using Google social login
- FR15: Users can authenticate using Apple social login
- FR16: Users can securely access their account across multiple devices
- FR17: System maintains user session across app closures and device switches
- FR18: Users can log out of their account
- FR19: Users can reset their password if forgotten

**Epic 3 (Pact Management):**

- FR1: Users can create a new pact by defining an action, frequency, and timeframe
- FR2: Users can view all their active pacts
- FR3: Users can view details of a specific pact including definition and progress
- FR4: System prevents modification of pact parameters once created

**Epic 4 (Daily Tracking):**

- FR8: Users can view all pacts due today in a consolidated view
- FR9: Users can mark a pact as complete for the current day
- FR10: System provides immediate visual feedback when pact is checked off
- FR11: Users can view completion status (days completed vs required) for active pacts
- FR12: System tracks completion history for each pact throughout its duration

**Epic 5 (Cross-Platform):**

- FR20: Users can access the pact application via web browser
- FR21: Users can access the pact application via iOS mobile app
- FR22: Users can access the pact application via Android mobile app
- FR23: System synchronizes pact data across all platforms within seconds
- FR24: Users can complete pacts while offline on mobile
- FR25: System automatically syncs offline changes when connection is restored

**Epic 6 (Notifications):**

- FR26: Users can receive daily reminder notifications to check Today's Pacts
- FR27: Users can customize the time they receive daily reminders
- FR28: Users can receive notifications when a pact period completes
- FR29: Users can enable or disable notifications

**Epic 7 (Completion):**

- FR5: System automatically notifies users when a pact period ends
- FR6: Users can record learning reflections at pact completion
- FR7: Users can create a new pact immediately after completing one

**Epic 8 (Onboarding):**

- FR30: New users see an explanation of what a "pact" is on first launch
- FR31: New users receive guidance on how to create their first pact
- FR32: Users can access information explaining pact methodology vs goals/habits
- FR33: System provides helpful hints during first pact creation
- FR34: Users can view instructions or help content at any time

**Total: 34 FRs - All requirements covered ✅**

## Epic List

### Epic 1: Project Foundation & Development Environment

Development team has a complete, working foundation with all platforms initialized, code sharing configured, and core infrastructure ready for feature development.

**FRs covered:** None directly (enables all future epics)
**Architecture Requirements:** Starter templates (Expo, Vite, NestJS), monorepo (pnpm workspaces), PostgreSQL + Prisma, authentication infrastructure (Passport.js + JWT), styling setup (NativeWind + Tailwind), TanStack Query configuration

### Epic 2: User Authentication & Account Management

Users can create accounts, authenticate securely via multiple methods (email/password, Google, Apple), maintain sessions across devices, and manage their credentials.

**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19
**NFRs addressed:** NFR6-NFR11 (security), NFR8 (token expiration), NFR9 (data isolation)

### Epic 3: Pact Creation & Management

Authenticated users can create action-based pacts with defined frequency and timeframe, view all their active pacts, see pact details and progress, with system enforcing immutability once created.

**FRs covered:** FR1, FR2, FR3, FR4
**NFRs addressed:** NFR1-NFR5 (performance), NFR3 (optimistic updates), NFR12-NFR15 (scalability)

### Epic 4: Daily Tracking & Progress Monitoring

Users can view today's pacts in a consolidated view, mark pacts complete with immediate feedback, see completion status and history throughout the pact duration.

**FRs covered:** FR8, FR9, FR10, FR11, FR12
**NFRs addressed:** NFR2-NFR3 (cached loads, immediate feedback), NFR4 (sync)

### Epic 5: Cross-Platform Access & Offline Sync

Users can access their pacts from web browsers, iOS devices, and Android devices with automatic synchronization across all platforms, including offline capability and automatic reconnection sync on mobile.

**FRs covered:** FR20, FR21, FR22, FR23, FR24, FR25
**NFRs addressed:** NFR4-NFR5 (sync, offline transitions), NFR18-NFR19 (offline queue, retry logic), NFR26 (code sharing)

### Epic 6: Push Notifications & Reminders

Users receive daily reminder notifications at customizable times, get notified when pacts complete, and can control notification preferences on mobile devices.

**FRs covered:** FR26, FR27, FR28, FR29
**NFRs addressed:** NFR16 (reliability), Architecture requirements (FCM integration)

### Epic 7: Pact Completion & Reflection

Users receive automatic notifications when pacts end, can record learning reflections at completion, and immediately create a new pact to continue momentum.

**FRs covered:** FR5, FR6, FR7
**Architecture requirements:** Notification scheduling, reflection storage

### Epic 8: Onboarding & User Education

New users understand what a "pact" is versus traditional goals/habits, receive guided first pact creation, and can access help content anytime to learn the methodology.

**FRs covered:** FR30, FR31, FR32, FR33, FR34
**NFRs addressed:** NFR29 (maintainability - new user experience)

---

## Epic 1: Project Foundation & Development Environment

Development team has a complete, working foundation with all platforms initialized, code sharing configured, and core infrastructure ready for feature development.

### Story 1.1: Initialize Monorepo and Mobile App Foundation

As a **developer**,
I want **a monorepo structure with a working React Native mobile app initialized**,
So that **I can build cross-platform mobile features with proper code organization**.

**Acceptance Criteria:**

**Given** I am starting a new project
**When** I execute the initialization commands
**Then** A pnpm workspace is created at the project root
**And** An Expo React Native app exists at `/apps/mobile` with TypeScript template
**And** The mobile app runs successfully on iOS simulator with `npx expo start`
**And** The mobile app runs successfully on Android emulator
**And** Hot reload works when making code changes
**And** `package.json` at root defines the workspace structure
**And** All dependencies install without errors

### Story 1.2: Initialize Web App and Shared Packages

As a **developer**,
I want **a Vite React web app and shared packages workspace initialized**,
So that **I can build web features and share code between platforms**.

**Acceptance Criteria:**

**Given** The monorepo structure from Story 1.1 exists
**When** I execute the web app and shared package initialization
**Then** A Vite React SPA exists at `/apps/web` with TypeScript template
**And** A shared packages directory exists at `/packages/shared` with subdirectories: `/types`, `/api`, `/utils`, `/hooks`
**And** The web app runs successfully at `http://localhost:5173` with `npm run dev`
**And** Hot module replacement works when making code changes
**And** Shared packages can be imported using `@pact/shared/*` path aliases
**And** TypeScript compilation works across all workspaces
**And** pnpm workspace configuration correctly links all packages

### Story 1.3: Initialize Backend API and Database

As a **developer**,
I want **a NestJS backend API with PostgreSQL database configured**,
So that **I can build API endpoints with type-safe database access**.

**Acceptance Criteria:**

**Given** The monorepo structure exists
**When** I set up the backend workspace
**Then** A NestJS application exists at `/apps/backend` with TypeScript
**And** PostgreSQL database is configured (Railway or local Docker)
**And** Prisma ORM is installed and configured with initial schema
**And** Prisma schema defines `User` model with: id (UUID), email, passwordHash, createdAt, updatedAt
**And** Database migrations run successfully with `npx prisma migrate dev`
**And** Prisma Client generates TypeScript types
**And** NestJS server starts successfully at `http://localhost:3000`
**And** Health check endpoint `/health` returns 200 OK
**And** Environment variables are configured for database connection
**And** Global exception filter is configured for consistent error responses

### Story 1.4: Configure Cross-Platform Styling System

As a **developer**,
I want **NativeWind and Tailwind CSS configured across platforms**,
So that **I can use consistent utility classes for styling on web and mobile**.

**Acceptance Criteria:**

**Given** Mobile and web apps exist from previous stories
**When** I configure the styling systems
**Then** Tailwind CSS is installed and configured in `/apps/web` with `tailwind.config.js`
**And** NativeWind is installed and configured in `/apps/mobile` with Tailwind-compatible config
**And** A test component using Tailwind utilities (e.g., `className="bg-blue-500 p-4"`) renders correctly on web
**And** The same component renders correctly on mobile using NativeWind
**And** Accessibility utilities are available (contrast ratios, touch target sizes per NFR23-NFR25)
**And** CSS build process is optimized for production (unused classes purged)
**And** Dark mode support is configured (optional but recommended)

### Story 1.5: Set Up Authentication Infrastructure

As a **developer**,
I want **Passport.js with JWT strategy configured in the backend**,
So that **I can secure API endpoints and manage user authentication**.

**Acceptance Criteria:**

**Given** The NestJS backend exists from Story 1.3
**When** I configure authentication infrastructure
**Then** Passport.js is installed with `@nestjs/passport` and `passport-jwt`
**And** JWT strategy is configured with RS256 signing
**And** Auth module exists at `/apps/backend/src/modules/auth` with controller, service, module
**And** JWT tokens have 30-day expiration (NFR8)
**And** `JwtAuthGuard` is created for protecting routes
**And** User can be extracted from JWT in protected routes via `@Req() req` → `req.user`
**And** Token generation function exists that creates valid JWT tokens
**And** Token validation works and rejects expired/invalid tokens
**And** Bcrypt is configured for password hashing (NFR7)
**And** Environment variables are set for JWT secret keys

### Story 1.6: Configure State Management and API Client

As a **developer**,
I want **TanStack Query configured with a shared API client**,
So that **I can fetch and cache server state consistently across platforms**.

**Acceptance Criteria:**

**Given** Mobile and web apps exist with shared packages
**When** I configure state management
**Then** TanStack Query (@tanstack/react-query) is installed in mobile and web apps
**And** QueryClient is configured with appropriate cache settings (stale time, cache time)
**And** QueryClientProvider wraps the app root in both mobile and web
**And** An API client exists at `/packages/shared/api/client.ts` using axios or fetch
**And** API client is configured with base URL from environment variables
**And** API client automatically attaches JWT token to requests (Authorization header)
**And** API client handles 401 responses with token refresh logic
**And** A test query hook exists (e.g., `useHealthCheck`) that successfully fetches from `/health` endpoint
**And** The test query works on both mobile and web
**And** React Query DevTools are configured for development debugging

---

## Epic 2: User Authentication & Account Management

Users can create accounts, authenticate securely via multiple methods (email/password, Google, Apple), maintain sessions across devices, and manage their credentials.

### Story 2.1: User Registration with Email and Password

As a **new user**,
I want **to create an account using my email and password**,
So that **I can securely access the pact application**.

**Acceptance Criteria:**

**Given** I am on the registration screen
**When** I enter a valid email address and a password with 8+ characters
**Then** A POST request is sent to `/api/auth/register` with email and password
**And** The backend creates a new User record in the database with hashed password (bcrypt, NFR7)
**And** The backend returns a JWT token with 30-day expiration (NFR8)
**And** The token is stored securely (expo-secure-store on mobile, httpOnly cookie on web)
**And** I am redirected to the main app view
**And** My authentication state persists across app restarts (FR17)
**And** If the email already exists, I receive an error message "Email already registered"
**And** If the password is too short, I receive an error message "Password must be at least 8 characters"
**And** If the email format is invalid, I receive an error message "Invalid email format"

### Story 2.2: User Login with Email and Password

As a **registered user**,
I want **to log in using my email and password**,
So that **I can access my pacts on any device**.

**Acceptance Criteria:**

**Given** I have a registered account
**When** I enter my email and password on the login screen
**Then** A POST request is sent to `/api/auth/login` with credentials
**And** The backend validates the password against the stored hash
**And** The backend returns a JWT token with 30-day expiration (NFR8)
**And** The token is stored securely (expo-secure-store on mobile, httpOnly cookie on web)
**And** I am redirected to the main app view
**And** My session persists across app closures and device switches (FR16, FR17)
**And** If credentials are incorrect, I receive an error message "Invalid email or password"
**And** If the account doesn't exist, I receive the same error message for security
**And** The login form provides a link to password reset
**And** The login form provides a link to registration

### Story 2.3: Google OAuth Authentication

As a **user**,
I want **to sign in using my Google account**,
So that **I can access the app quickly without managing another password**.

**Acceptance Criteria:**

**Given** I am on the login screen
**When** I tap/click "Sign in with Google"
**Then** The Google OAuth 2.0 flow is initiated using passport-google-oauth20 strategy
**And** I am redirected to Google's authentication page
**And** After successful Google authentication, I am redirected back to the app
**And** The backend receives the Google user profile (email, name, Google ID)
**And** If this is my first login, a new User record is created with the Google email
**And** If I've logged in before, my existing account is retrieved
**And** A JWT token is generated and returned (30-day expiration per NFR8)
**And** The token is stored securely
**And** I am redirected to the main app view
**And** My session persists across app closures (FR17)
**And** OAuth flow follows OAuth 2.0 security standards (NFR10)

### Story 2.4: Apple OAuth Authentication

As a **user**,
I want **to sign in using my Apple ID**,
So that **I can use Apple's privacy features and quick sign-in on iOS devices**.

**Acceptance Criteria:**

**Given** I am on the login screen
**When** I tap/click "Sign in with Apple"
**Then** The Apple OAuth flow is initiated using passport-apple strategy
**And** I am shown Apple's authentication dialog
**And** After successful Apple authentication, the app receives the Apple user token
**And** The backend receives the Apple user profile (email or private relay email, Apple ID)
**And** If this is my first login, a new User record is created
**And** If I've logged in before, my existing account is retrieved
**And** A JWT token is generated and returned (30-day expiration per NFR8)
**And** The token is stored securely
**And** I am redirected to the main app view
**And** My session persists across app closures (FR17)
**And** OAuth flow follows OAuth 2.0 security standards (NFR10)
**And** Apple's "Hide My Email" feature is supported if user chooses it

### Story 2.5: Session Management and Token Refresh

As a **logged-in user**,
I want **my session to remain active and automatically refresh when needed**,
So that **I don't have to log in repeatedly while using the app**.

**Acceptance Criteria:**

**Given** I am logged in with a valid JWT token
**When** The app starts or comes to foreground
**Then** The stored token is validated
**And** If the token is valid, I remain logged in
**And** If the token is within 7 days of expiration, it is automatically refreshed
**And** Token refresh endpoint `/api/auth/refresh` generates a new 30-day token
**And** The new token replaces the old token in secure storage
**And** If the token is expired (>30 days), I am logged out and shown the login screen
**And** If API returns 401 Unauthorized, the token is cleared and I'm logged out
**And** Session management prevents concurrent access from unauthorized devices (NFR11)
**And** All data requests include the current token in Authorization header
**And** I can remain logged in across multiple devices simultaneously (FR16)

### Story 2.6: User Logout

As a **logged-in user**,
I want **to log out of my account**,
So that **I can secure my account when using a shared device**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I tap/click the "Log out" button in settings or profile
**Then** A POST request is sent to `/api/auth/logout`
**And** The JWT token is cleared from secure storage (expo-secure-store or cookies)
**And** TanStack Query cache is cleared
**And** I am redirected to the login screen
**And** I cannot access protected routes without logging in again
**And** The logout action completes within 1 second
**And** If I'm offline, logout still clears local token and redirects to login

### Story 2.7: Password Reset Flow

As a **registered user who forgot their password**,
I want **to reset my password via email**,
So that **I can regain access to my account**.

**Acceptance Criteria:**

**Given** I am on the login screen
**When** I click "Forgot password?" and enter my email address
**Then** A POST request is sent to `/api/auth/forgot-password` with my email
**And** The backend generates a secure password reset token (expires in 1 hour)
**And** A password reset email is sent to my email address with a reset link
**And** The reset link contains the token as a URL parameter
**And** When I click the reset link, I am taken to a password reset page
**And** I enter a new password (8+ characters)
**And** A POST request is sent to `/api/auth/reset-password` with token and new password
**And** The backend validates the token and checks expiration
**And** If valid, the password is hashed with bcrypt and updated in the database
**And** I receive a confirmation message "Password reset successful"
**And** I am redirected to the login screen
**And** I can log in with my new password
**And** If the token is expired or invalid, I receive an error "Reset link expired or invalid"
**And** If the email doesn't exist, the system returns success for security (doesn't reveal account existence)

---

## Epic 3: Pact Creation & Management

Authenticated users can create action-based pacts with defined frequency and timeframe, view all their active pacts, see pact details and progress, with system enforcing immutability once created.

### Story 3.1: Create Pact Data Model and API Endpoints

As a **developer**,
I want **the Pact data model and CRUD API endpoints created**,
So that **users can create and manage their pacts through the API**.

**Acceptance Criteria:**

**Given** The database and backend infrastructure exist from Epic 1
**When** I implement the Pact data model
**Then** Prisma schema includes a `Pact` model with fields: id (UUID), userId (FK to User), title (String), action (String), frequency (Int), durationType (Enum: days/weeks/months), durationValue (Int), startDate (DateTime), endDate (DateTime), status (Enum: active/completed/abandoned), createdAt, updatedAt
**And** Database migration creates the `pacts` table with snake_case columns
**And** Prisma @map decorators convert to camelCase in TypeScript
**And** Foreign key relationship exists: User hasMany Pacts
**And** Database constraints enforce: frequency > 0, durationValue > 0
**And** POST `/api/pacts` endpoint creates a new pact (requires authentication)
**And** GET `/api/pacts` endpoint returns all pacts for authenticated user
**And** GET `/api/pacts/:id` endpoint returns a specific pact (only if user owns it, NFR9)
**And** DELETE `/api/pacts/:id` endpoint exists (only for pacts not yet started)
**And** All endpoints are protected with JwtAuthGuard
**And** Endpoints return 401 if not authenticated, 403 if accessing another user's pact
**And** TypeScript types are generated and shared to `/packages/shared/types`

### Story 3.2: Create New Pact UI and Validation

As a **user**,
I want **to create a new pact by defining my action, frequency, and timeframe**,
So that **I can commit to specific actions I'll take**.

**Acceptance Criteria:**

**Given** I am logged in and on the create pact screen
**When** I fill out the pact creation form
**Then** The form includes fields: Pact Title (text), Action Description (text area), Frequency (number with unit selector: times per day/week/month), Duration (number with unit selector: weeks/months, max 1 month as per PRD)
**And** Title is required with max 100 characters
**And** Action description is required with max 500 characters
**And** Frequency must be at least 1
**And** Duration must be 1-4 weeks OR 1 month maximum
**And** Start date defaults to today but can be set to a future date (max 7 days ahead)
**And** End date is automatically calculated based on duration
**And** When I tap/click "Create Pact", a POST request is sent to `/api/pacts`
**And** The UI shows a loading state during creation
**And** On success, the pact is created in the database with status "active"
**And** I see an immediate success message with optimistic UI update (NFR3)
**And** I am redirected to the pacts list showing my new pact
**And** The new pact appears in the list within 200ms (cached load, NFR2)
**And** If validation fails, I see specific error messages for each field
**And** The form is accessible (WCAG 2.1 Level AA, NFR23)

### Story 3.3: View All Active Pacts List

As a **user**,
I want **to view all my active pacts in a list**,
So that **I can see all my current commitments at a glance**.

**Acceptance Criteria:**

**Given** I am logged in and have created pacts
**When** I navigate to the "My Pacts" screen
**Then** A GET request is sent to `/api/pacts` with my authentication token
**And** The list displays all my pacts with status "active"
**And** Each pact card shows: title, frequency description (e.g., "3 times per week"), days remaining, progress percentage
**And** Pacts are sorted by end date (soonest ending first)
**And** The initial load completes within 2 seconds (NFR1)
**And** Cached loads appear instantly < 200ms (NFR2)
**And** If I have no pacts, I see an empty state with "Create Your First Pact" button
**And** I can tap/click a pact card to view its details
**And** The list uses TanStack Query with query key `['pacts']`
**And** The list automatically refreshes when returning to the screen
**And** The list works offline with cached data (mobile)
**And** A floating action button (FAB) or "Create New Pact" button is always visible
**And** Pull-to-refresh manually refreshes the list (mobile)

### Story 3.4: View Pact Details and Progress

As a **user**,
I want **to view detailed information about a specific pact including my progress**,
So that **I can track how I'm doing on my commitment**.

**Acceptance Criteria:**

**Given** I am viewing my pacts list
**When** I tap/click on a specific pact
**Then** I am taken to the pact detail screen
**And** A GET request is sent to `/api/pacts/:id`
**And** The detail screen shows: title, full action description, frequency, duration, start date, end date, days elapsed, days remaining
**And** Progress section shows: total completions so far, required completions, completion percentage, streak (consecutive completions)
**And** A calendar or timeline view shows completed vs missed days
**And** Each day is color-coded: green (completed), red (missed), gray (not due yet), white (rest day based on frequency)
**And** The detail screen loads within 2 seconds (NFR1)
**And** If cached, it appears instantly < 200ms (NFR2)
**And** I can navigate back to the pacts list
**And** The data is read-only (no edit functionality per FR4)
**And** If I don't own the pact, I get a 403 error (NFR9 - data isolation)
**And** The screen is accessible (WCAG 2.1 Level AA, NFR23)

### Story 3.5: Enforce Pact Immutability

As a **system**,
I want **to prevent users from modifying pact parameters once created**,
So that **the commitment integrity is maintained per the pact philosophy**.

**Acceptance Criteria:**

**Given** A pact exists in the database with status "active"
**When** Any attempt is made to modify core pact fields (title, action, frequency, duration, dates)
**Then** The backend API rejects PUT/PATCH requests to `/api/pacts/:id` with 400 Bad Request
**And** The error message states "Pact cannot be modified once created"
**And** A custom `PactImmutableException` is thrown in the backend
**And** The UI does not provide any edit buttons or forms for active pacts
**And** The pact detail screen clearly shows data as read-only
**And** Database-level constraints prevent updates to immutable fields (optional but recommended)
**And** Users can only DELETE a pact if it hasn't started yet (startDate > today)
**And** Once a pact has started (startDate <= today), deletion is not allowed
**And** The only allowed modification is marking daily completions (handled in Epic 4)
**And** The only status changes allowed are: active → completed, active → abandoned
**And** Immutability is enforced consistently across web and mobile platforms

---

## Epic 4: Daily Tracking & Progress Monitoring

Users can view today's pacts in a consolidated view, mark pacts complete with immediate feedback, see completion status and history throughout the pact duration.

### Story 4.1: Create Daily Completion Data Model and API

As a **developer**,
I want **the DailyCompletion data model and API endpoints created**,
So that **users can track their daily pact completions**.

**Acceptance Criteria:**

**Given** The Pact model exists from Epic 3
**When** I implement the DailyCompletion data model
**Then** Prisma schema includes a `DailyCompletion` model with fields: id (UUID), pactId (FK to Pact), userId (FK to User), completionDate (Date), completedAt (DateTime), createdAt, updatedAt
**And** Database migration creates the `daily_completions` table with snake_case columns
**And** Foreign key relationships exist: Pact hasMany DailyCompletions, User hasMany DailyCompletions
**And** Unique constraint exists on (pactId, completionDate) to prevent duplicate completions for same day
**And** POST `/api/pacts/:pactId/complete` endpoint creates a completion for today
**And** GET `/api/pacts/:pactId/completions` endpoint returns all completions for a pact
**And** GET `/api/completions/today` endpoint returns today's completions across all pacts
**And** DELETE `/api/completions/:id` endpoint allows unmarking completion (same day only)
**And** All endpoints are protected with JwtAuthGuard
**And** Endpoints enforce user ownership (NFR9 - data isolation)
**And** TypeScript types are generated and shared to `/packages/shared/types`

### Story 4.2: Today's Pacts View

As a **user**,
I want **to see all my pacts that are due today in one consolidated view**,
So that **I immediately know what I need to do without thinking**.

**Acceptance Criteria:**

**Given** I am logged in with active pacts
**When** I open the app or navigate to "Today" screen
**Then** A GET request is sent to `/api/pacts/today` (filtered for today's required pacts)
**And** The view displays all pacts that require action today based on frequency
**And** Each pact card shows: title, action description, checkbox for completion, current streak
**And** Pacts are sorted: incomplete first, then completed
**And** Completed pacts today are visually distinguished (checkmark, green background, strikethrough)
**And** The count shows "X of Y pacts completed today"
**And** If all pacts are complete, I see a celebration message "All done for today! 🎉"
**And** If no pacts are due today, I see "No pacts due today - rest day!"
**And** The initial load completes within 2 seconds (NFR1)
**And** Cached loads appear instantly < 200ms (NFR2)
**And** The view auto-refreshes when app comes to foreground
**And** The view works offline with cached data (mobile)
**And** Pull-to-refresh manually refreshes the data (mobile)

### Story 4.3: Mark Pact Complete with Immediate Feedback

As a **user**,
I want **to mark a pact as complete for today with immediate visual feedback**,
So that **I feel the satisfaction of completing my commitment right away**.

**Acceptance Criteria:**

**Given** I am viewing Today's Pacts with incomplete pacts
**When** I tap/click the checkbox next to a pact
**Then** The UI immediately updates with optimistic rendering (NFR3)
**And** The checkbox shows checked state instantly
**And** The pact card background changes to green/completed state
**And** A brief success animation plays (checkmark bounce or similar)
**And** A POST request is sent to `/api/pacts/:pactId/complete` with today's date
**And** The completion is saved with current timestamp
**And** The "X of Y completed" counter increments immediately
**And** If all pacts are now complete, the celebration message appears
**And** If the API call fails, the UI reverts to unchecked state with error message
**And** The action completes within 500ms perceived time (optimistic update)
**And** The completion syncs to server within 5 seconds when online (NFR4)
**And** If offline, the completion is queued and syncs when connection restored (FR25)
**And** I can uncheck the same pact today to undo (DELETE `/api/completions/:id`)
**And** Once it's the next day, I cannot modify yesterday's completions

### Story 4.4: View Completion History

As a **user**,
I want **to view my completion history for each pact**,
So that **I can see my progress and identify patterns over time**.

**Acceptance Criteria:**

**Given** I have completed pacts on multiple days
**When** I view a pact's detail screen
**Then** A completion history section is displayed below the pact details
**And** A GET request is sent to `/api/pacts/:pactId/completions`
**And** The history shows a calendar or timeline view of the entire pact duration
**And** Each day is color-coded: green (completed), red (missed and was due), gray (not due based on frequency), white (not yet reached)
**And** Completed days show the timestamp of completion
**And** The current week is highlighted or prominently displayed
**And** I can see my current streak (consecutive completions)
**And** I can see my best streak during this pact
**And** Completion percentage is calculated: (completions / required completions) × 100
**And** The history loads within 2 seconds (NFR1)
**And** If cached, it appears instantly < 200ms (NFR2)
**And** The history updates immediately when I complete today's pact
**And** The history works offline with cached data
**And** I can scroll through the entire pact duration

### Story 4.5: Real-time Progress Updates

As a **user**,
I want **my progress to update in real-time across all views**,
So that **I always see accurate completion status without manual refreshing**.

**Acceptance Criteria:**

**Given** I have multiple views open or switch between screens
**When** I mark a pact complete in Today's view
**Then** The completion is reflected immediately via TanStack Query cache updates
**And** The pact detail screen updates progress percentage automatically
**And** The "My Pacts" list shows updated progress for that pact
**And** The Today's view completion counter updates
**And** All views use shared TanStack Query cache with query key patterns
**And** Completing a pact invalidates related queries: `['pacts']`, `['pacts', pactId]`, `['completions', 'today']`
**And** Progress updates appear within 200ms (NFR2)
**And** No full page refresh is required
**And** Updates sync across devices within 5 seconds when online (NFR4)
**And** If I complete a pact on mobile, it appears on web within 5 seconds (and vice versa)
**And** Background sync fetches updates every 30 seconds when app is active
**And** Cache invalidation follows TanStack Query best practices (stale-while-revalidate)

---

## Epic 5: Cross-Platform Access & Offline Sync

Users can access their pacts from web browsers, iOS devices, and Android devices with automatic synchronization across all platforms, including offline capability and automatic reconnection sync on mobile.

### Story 5.1: Web Browser Access and Responsive Design

As a **user**,
I want **to access the pact application from any web browser with responsive design**,
So that **I can manage my pacts from my desktop or laptop**.

**Acceptance Criteria:**

**Given** The Vite React web app is deployed to Vercel
**When** I navigate to the application URL in a web browser
**Then** The app loads and displays correctly in Chrome, Firefox, Safari, and Edge (latest 2 versions per NFR21)
**And** The app is fully responsive across desktop (1920px+), tablet (768px-1024px), and mobile web (320px-767px)
**And** All features work identically to mobile app (auth, pact creation, Today's view, completions)
**And** Navigation is optimized for desktop (sidebar or top nav)
**And** Touch targets meet minimum size on mobile web (44x44px per NFR24)
**And** Color contrast ratios meet WCAG 2.1 Level AA (4.5:1 per NFR25)
**And** The app is keyboard accessible (tab navigation, enter to submit)
**And** Screen readers can navigate all content (WCAG 2.1 Level AA per NFR23)
**And** Initial page load completes within 2 seconds (NFR1)
**And** The app works with JavaScript enabled (SPA architecture)
**And** HTTPS is enforced (TLS 1.3+ per NFR6)
**And** The web app shares 70%+ code with mobile via `/packages/shared` (NFR26)

### Story 5.2: iOS App Build and Deployment

As a **user with an iPhone or iPad**,
I want **to download and install the pact app from the iOS App Store**,
So that **I can use the app natively on my Apple devices**.

**Acceptance Criteria:**

**Given** The React Native mobile app is built with Expo
**When** The iOS build process is executed via EAS Build
**Then** An iOS app bundle (.ipa) is generated for App Store submission
**And** The app supports iOS 15+ (per NFR22)
**And** The app is tested on iPhone (multiple sizes) and iPad
**And** All app functionality works on iOS devices (auth, pacts, tracking, offline)
**And** Apple Sign In OAuth integration works correctly
**And** The app follows iOS Human Interface Guidelines
**And** Touch targets meet iOS minimum (44x44px per NFR24)
**And** The app supports iOS dark mode
**And** App icons and splash screens are configured for all iOS device sizes
**And** The app is submitted to App Store Connect for review
**And** App Store metadata includes: description, screenshots, privacy policy
**And** The app passes Apple's review process
**And** Users can download from App Store and install successfully
**And** The app maintains <0.1% crash rate on iOS (NFR17)
**And** OTA updates via expo-updates work for non-native code changes

### Story 5.3: Android App Build and Deployment

As a **user with an Android device**,
I want **to download and install the pact app from Google Play Store**,
So that **I can use the app natively on my Android devices**.

**Acceptance Criteria:**

**Given** The React Native mobile app is built with Expo
**When** The Android build process is executed via EAS Build
**Then** An Android app bundle (.aab) is generated for Play Store submission
**And** The app supports Android 10+ (API level 29+, per NFR22)
**And** The app is tested on multiple Android devices and screen sizes
**And** All app functionality works on Android devices (auth, pacts, tracking, offline)
**And** Google OAuth integration works correctly
**And** The app follows Material Design guidelines
**And** Touch targets meet Android minimum (48x48dp per NFR24)
**And** The app supports Android dark mode
**And** App icons and splash screens are configured for Android
**And** The app is submitted to Google Play Console for review
**And** Play Store metadata includes: description, screenshots, privacy policy
**And** The app passes Google's review process
**And** Users can download from Play Store and install successfully
**And** The app maintains <0.1% crash rate on Android (NFR17)
**And** OTA updates via expo-updates work for non-native code changes

### Story 5.4: Cross-Platform Data Synchronization

As a **user with multiple devices**,
I want **my pact data to automatically sync across all my devices**,
So that **I see the same data whether I use web, iOS, or Android**.

**Acceptance Criteria:**

**Given** I am logged in on multiple devices (e.g., iPhone and web browser)
**When** I create a pact on one device
**Then** The pact appears on all other logged-in devices within 5 seconds (NFR4)
**And** When I complete a pact on mobile, it shows as completed on web within 5 seconds
**And** When I complete a pact on web, it shows as completed on mobile within 5 seconds
**And** TanStack Query handles sync via automatic background refetching
**And** Query cache is invalidated appropriately on mutations
**And** Background polling occurs every 30 seconds when app is active
**And** Sync uses the shared API client from `/packages/shared/api`
**And** Authentication state syncs across platforms (login on one device, all devices reflect it)
**And** Logout on one device does not affect other device sessions
**And** Data conflicts are resolved (last write wins strategy)
**And** No data loss occurs during sync operations (NFR18)
**And** Sync operations are logged for debugging (NFR28)
**And** Users can manually refresh via pull-to-refresh (mobile) or refresh button (web)

### Story 5.5: Offline Mode and Queue System

As a **mobile user**,
I want **to view and complete pacts while offline**,
So that **I can use the app without internet connectivity**.

**Acceptance Criteria:**

**Given** I am using the mobile app with no internet connection
**When** I open the app offline
**Then** The app detects offline status and displays cached data
**And** I see my most recent pacts list (from TanStack Query cache)
**And** I see Today's Pacts with cached completion status
**And** I can view pact details with cached data
**And** I can mark pacts as complete while offline
**And** Completions are stored in local queue (AsyncStorage on mobile)
**And** The UI shows "Offline" indicator but remains fully functional
**And** Optimistic updates work identically to online mode
**And** No error messages appear due to offline status (NFR5 - seamless transitions)
**And** The app handles 1000+ cached pacts without performance degradation (NFR15)
**And** I cannot create new pacts while offline (requires server validation)
**And** I cannot perform authentication actions while offline
**And** The offline experience is identical on iOS and Android
**And** Offline mode is automatically detected (no manual switching)

### Story 5.6: Automatic Reconnection Sync

As a **mobile user**,
I want **my offline actions to automatically sync when I reconnect**,
So that **I never lose data and don't have to manually sync**.

**Acceptance Criteria:**

**Given** I completed pacts while offline and now have internet connection
**When** The app detects network connectivity
**Then** The offline queue is automatically processed
**And** All queued completions are sent to the server via POST requests
**And** The queue processes items in chronological order (oldest first)
**And** Successfully synced items are removed from the queue
**And** Failed sync items remain in queue for retry (NFR19 - automatic retry logic)
**And** The UI shows "Syncing..." indicator during sync
**And** Once sync completes, the UI shows "Synced" confirmation
**And** The sync completes within 5 seconds for typical queue size (NFR4)
**And** No data is lost during the sync process (NFR18)
**And** If a sync conflict occurs (e.g., completion already exists), it's resolved gracefully
**And** After successful sync, fresh data is fetched from server
**And** TanStack Query cache is updated with server data
**And** The sync process works identically on iOS and Android
**And** Sync errors are logged for debugging (NFR28)
**And** If sync fails after retries, user is notified with actionable message

---

## Epic 6: Push Notifications & Reminders

Users receive daily reminder notifications at customizable times, get notified when pacts complete, and can control notification preferences on mobile devices.

### Story 6.1: Firebase Cloud Messaging Setup and Integration

As a **developer**,
I want **Firebase Cloud Messaging integrated with the backend and mobile app**,
So that **the system can send push notifications to users' devices**.

**Acceptance Criteria:**

**Given** The mobile app and backend exist
**When** I configure Firebase Cloud Messaging
**Then** A Firebase project is created with iOS and Android apps configured
**And** FCM server key is stored in backend environment variables
**And** expo-notifications is installed and configured in the mobile app
**And** The mobile app requests notification permissions on first launch
**And** When permission is granted, the device FCM token is generated
**And** The FCM token is sent to backend via POST `/api/users/notification-token`
**And** A `NotificationToken` model exists in Prisma schema: id, userId, token, platform (iOS/Android), createdAt, updatedAt
**And** Multiple tokens per user are supported (user can have multiple devices)
**And** The backend has a notifications module with send notification functionality
**And** Test notification endpoint exists: POST `/api/notifications/test` (development only)
**And** Notifications appear correctly on iOS lock screen and notification center
**And** Notifications appear correctly on Android notification shade
**And** Tapping a notification opens the app to the relevant screen
**And** Background notifications work when app is closed
**And** FCM delivery rate is >99% (NFR16 - reliability)
**And** Notification failures are logged for debugging (NFR28)

### Story 6.2: Daily Reminder Notifications

As a **user**,
I want **to receive a daily reminder notification to check my pacts**,
So that **I don't forget to complete my commitments**.

**Acceptance Criteria:**

**Given** I have granted notification permissions and have active pacts
**When** The scheduled reminder time arrives
**Then** I receive a push notification with title "Time to check your pacts!"
**And** The notification body shows "You have X pacts to complete today"
**And** The notification is sent at the user's preferred time (default: 9:00 AM local time)
**And** The backend has a scheduled job that runs daily to send reminders
**And** Only users with active pacts due today receive reminders
**And** Users without pacts due today don't receive reminders (rest day)
**And** The notification appears on the device lock screen
**And** Tapping the notification opens the app to "Today's Pacts" screen
**And** The notification sound plays (if not in silent mode)
**And** The notification respects device Do Not Disturb settings
**And** Reminders are sent at the correct local timezone for each user
**And** If the user has already completed all today's pacts, the notification states "All pacts complete! Great work 🎉"
**And** Failed notification sends are retried once (NFR19 - retry logic)
**And** Notification delivery is tracked in backend logs

### Story 6.3: Customizable Notification Timing

As a **user**,
I want **to customize what time I receive my daily reminder**,
So that **the notification arrives at the most convenient time for me**.

**Acceptance Criteria:**

**Given** I am logged in and viewing settings
**When** I navigate to notification settings
**Then** I see a "Daily Reminder Time" setting with a time picker
**And** The default time is 9:00 AM local time
**And** I can select any hour and minute for my reminder
**And** When I change the time, a PATCH request is sent to `/api/users/preferences`
**And** The User model includes a `reminderTime` field (stored as time or minutes since midnight)
**And** The User model includes a `timezone` field (auto-detected from device)
**And** The new reminder time is saved to the database
**And** The UI shows a confirmation "Reminder time updated to [time]"
**And** Starting the next day, reminders arrive at the new time
**And** The time picker shows 12-hour format with AM/PM (US) or 24-hour format (based on device locale)
**And** The setting persists across devices (synced via backend)
**And** I can set different times for weekdays vs weekends (optional enhancement)
**And** The time picker is accessible (WCAG 2.1 Level AA per NFR23)

### Story 6.4: Pact Completion Notifications

As a **user**,
I want **to receive a notification when my pact period ends**,
So that **I know it's time to reflect and create my next pact**.

**Acceptance Criteria:**

**Given** I have an active pact with an end date
**When** The pact end date is reached
**Then** I receive a push notification with title "Pact Complete!"
**And** The notification body shows "Your [pact title] is complete. Time to reflect!"
**And** The notification is sent when the pact end date arrives (at 9:00 AM local time or custom reminder time)
**And** The backend has a scheduled job that checks for completed pacts daily
**And** Pact status is updated from "active" to "completed" when end date is reached
**And** Tapping the notification opens the app to the pact detail screen showing reflection form
**And** The notification sound plays (celebration sound if possible)
**And** Only pacts that have actually ended trigger this notification
**And** If multiple pacts end on the same day, one notification lists all of them
**And** The notification includes completion percentage (e.g., "You completed 85% of required actions")
**And** Failed notification sends are retried once (NFR19)
**And** Completion notifications are sent regardless of whether reminders are enabled
**And** The notification respects device Do Not Disturb settings

### Story 6.5: Notification Preferences Management

As a **user**,
I want **to enable or disable notifications and control which types I receive**,
So that **I have control over my notification experience**.

**Acceptance Criteria:**

**Given** I am logged in and viewing settings
**When** I navigate to notification settings screen
**Then** I see a master "Enable Notifications" toggle switch
**And** I see individual toggles for "Daily Reminders" and "Pact Completion Alerts"
**And** All notification settings default to ON when notifications are first granted
**And** When I toggle any setting, a PATCH request is sent to `/api/users/preferences`
**And** The User model includes: `notificationsEnabled` (boolean), `dailyRemindersEnabled` (boolean), `completionAlertsEnabled` (boolean)
**And** The settings are saved to the database
**And** The UI shows immediate feedback when toggling (optimistic update)
**And** If I disable "Enable Notifications", all notification types are disabled
**And** If I disable "Daily Reminders", I stop receiving daily reminder notifications
**And** If I disable "Pact Completion Alerts", I stop receiving completion notifications
**And** The settings sync across devices (same user, multiple devices)
**And** If OS-level notification permissions are denied, I see a message: "Enable notifications in device settings"
**And** I can tap to open device notification settings directly (deep link)
**And** The settings persist even after app reinstall (stored on server)
**And** The settings screen is accessible (WCAG 2.1 Level AA per NFR23)
**And** Changes take effect immediately (no app restart required)

---

## Epic 7: Pact Completion & Reflection

Users receive automatic notifications when pacts end, can record learning reflections at completion, and immediately create a new pact to continue momentum.

### Story 7.1: Automatic Pact Status Updates at End Date

As a **system**,
I want **to automatically update pact status when the end date is reached**,
So that **users are notified and can proceed with reflection**.

**Acceptance Criteria:**

**Given** Active pacts exist with various end dates
**When** A scheduled job runs daily (e.g., cron job at 00:00 UTC)
**Then** The system queries all pacts where `endDate` <= current date and `status` = 'active'
**And** Each matching pact status is updated from 'active' to 'completed'
**And** The `completedAt` timestamp is set to the end date
**And** Final completion statistics are calculated: totalCompletions, requiredCompletions, completionPercentage
**And** These statistics are stored in the Pact record
**And** A notification is queued for the user (handled by Epic 6 Story 6.4)
**And** The update happens atomically (database transaction)
**And** If the job fails, it is retried on the next run
**And** The job logs all pact status updates for debugging (NFR28)
**And** The job processes pacts in batches to handle scale (NFR12-NFR15)
**And** Updated pacts appear in the user's "Completed Pacts" view
**And** Completed pacts are no longer shown in "Active Pacts" list
**And** The system maintains 99.99% uptime during these operations (NFR16)

### Story 7.2: Reflection Form and Data Model

As a **developer**,
I want **a reflection data model and form structure created**,
So that **users can record their learnings at pact completion**.

**Acceptance Criteria:**

**Given** The Pact model exists
**When** I implement the reflection data model
**Then** Prisma schema includes a `Reflection` model with fields: id (UUID), pactId (FK to Pact, unique), userId (FK to User), whatWorked (Text), whatDidntWork (Text), keyLearnings (Text), nextSteps (Text), overallSatisfaction (Int 1-5), createdAt, updatedAt
**And** Database migration creates the `reflections` table with snake_case columns
**And** One-to-one relationship exists: Pact hasOne Reflection
**And** POST `/api/pacts/:pactId/reflection` endpoint creates a reflection
**And** GET `/api/pacts/:pactId/reflection` endpoint retrieves a reflection
**And** PATCH `/api/pacts/:pactId/reflection` endpoint updates a reflection (users can edit)
**And** All endpoints are protected with JwtAuthGuard
**And** Endpoints enforce user ownership (NFR9 - data isolation)
**And** Reflection can only be created for pacts with status 'completed'
**And** TypeScript types are generated and shared to `/packages/shared/types`
**And** The reflection form component is created in `/packages/shared/components` (70% code sharing, NFR26)

### Story 7.3: Record Learning Reflections

As a **user**,
I want **to record what I learned from my completed pact**,
So that **I can gain insights and improve my next pact**.

**Acceptance Criteria:**

**Given** My pact has ended and status is 'completed'
**When** I tap the notification or navigate to the completed pact
**Then** I see the pact detail screen with a "Reflect on Your Pact" section
**And** The reflection form includes fields:

- "What worked well?" (text area, optional)
- "What didn't work?" (text area, optional)
- "Key learnings" (text area, optional)
- "What will you do next?" (text area, optional)
- "Overall satisfaction" (1-5 star rating, required)
  **And** Each text area has a character limit of 1000 characters
  **And** I can save a partial reflection (only star rating required)
  **And** When I tap "Save Reflection", a POST request is sent to `/api/pacts/:pactId/reflection`
  **And** The reflection is saved to the database
  **And** I see a success message "Reflection saved!"
  **And** The form shows "Last saved: [timestamp]"
  **And** I can edit my reflection later (PATCH endpoint)
  **And** After saving, I see a prompt "Create your next pact?" with a button
  **And** If I navigate away without saving, I see a confirmation dialog "Save your reflection first?"
  **And** The reflection form is accessible (WCAG 2.1 Level AA per NFR23)
  **And** The form works on both web and mobile
  **And** Optimistic updates show immediate feedback (NFR3)

### Story 7.4: Immediate Next Pact Creation Flow

As a **user**,
I want **to create a new pact immediately after completing one**,
So that **I can maintain momentum and continue making progress**.

**Acceptance Criteria:**

**Given** I have completed a pact and saved my reflection
**When** I tap/click "Create Next Pact" button
**Then** I am taken to the pact creation screen
**And** The form is pre-filled with suggestions based on my completed pact:

- Similar action/title as inspiration
- Same frequency (if satisfaction was 4-5 stars)
- Adjusted frequency (if satisfaction was 1-3 stars, suggest easier frequency)
  **And** I can accept the suggestions or modify them
  **And** The form clearly shows these are suggestions (not locked)
  **And** All pact creation validation applies (same as Story 3.2)
  **And** When I create the new pact, it is linked to the previous pact via `previousPactId` field (optional FK)
  **And** The new pact starts immediately or on a date I specify
  **And** After creation, I am redirected to Today's Pacts view
  **And** I see the new pact in my active pacts list
  **And** The completed pact remains visible in "Completed Pacts" history
  **And** I can also skip and create a next pact later from the main view
  **And** The flow works identically on web and mobile
  **And** The entire flow (reflection + next pact creation) feels seamless and encouraging
  **And** If I don't want to create a next pact, I can tap "Maybe Later" and return to main view

---

## Epic 8: Onboarding & User Education

New users understand what a "pact" is versus traditional goals/habits, receive guided first pact creation, and can access help content anytime to learn the methodology.

### Story 8.1: First-Run Onboarding Flow

As a **new user**,
I want **to see an introduction to pacts when I first open the app**,
So that **I understand the core concept before getting started**.

**Acceptance Criteria:**

**Given** I have just registered or logged in for the first time
**When** I reach the main app screen
**Then** I am shown an onboarding carousel or modal (not the main app view)
**And** The onboarding has 3-4 screens explaining:

- Screen 1: "What is a Pact?" - Focus on ACTION not outcomes
- Screen 2: "How it Works" - Create, track daily, complete, reflect
- Screen 3: "Why Pacts Work" - Time-boxed experiments, learning mindset
- Screen 4 (optional): "Let's Create Your First Pact"
  **And** Each screen has clear, concise copy (max 50 words per screen)
  **And** Each screen has relevant illustration or animation
  **And** I can swipe/click "Next" to advance through screens
  **And** I can tap "Skip" to jump to the app (available on all screens except last)
  **And** On the last screen, I tap "Create My First Pact" to proceed
  **And** The onboarding is shown only once (tracked via User model: `hasCompletedOnboarding` boolean)
  **And** I can access the onboarding again later from settings via "View Introduction"
  **And** The onboarding is accessible (WCAG 2.1 Level AA per NFR23)
  **And** The onboarding works identically on web and mobile
  **And** The onboarding respects the user's language preference
  **And** After completing onboarding, I'm taken to guided first pact creation (Story 8.3)

### Story 8.2: Pact Methodology Explanation

As a **user**,
I want **to understand what makes pacts different from goals and habits**,
So that **I can use the app with the right mindset**.

**Acceptance Criteria:**

**Given** I want to learn more about the pact methodology
**When** I access the "About Pacts" section (from onboarding or help menu)
**Then** I see a clear explanation of the pact philosophy with sections:

- "Pacts vs Goals" - Pacts focus on DOING, goals focus on achieving
- "Pacts vs Habits" - Pacts are time-boxed experiments, habits are indefinite
- "The Pact Mindset" - Action-first, learning from results, no perfectionism
- "Why Time-Boxing Matters" - Psychological safety, easier commitment
- "Success = Execution" - Doing what you commit to, regardless of outcome
  **And** Each section has 2-3 short paragraphs of explanation
  **And** Real examples are provided (e.g., "Run 3 times per week for 4 weeks")
  **And** The content emphasizes the anti-perfectionism philosophy
  **And** The content is written in an encouraging, non-judgmental tone
  **And** I can access this content from the main menu under "How Pacts Work"
  **And** The content is available as a scrollable page (not requiring internet after first load)
  **And** The content works on both web and mobile
  **And** The content is accessible (proper heading hierarchy, readable font sizes per NFR23)
  **And** I can return to this content anytime I need a reminder
  **And** At the bottom, there's a "Create a Pact" button to take action

### Story 8.3: Guided First Pact Creation

As a **new user creating my first pact**,
I want **helpful hints and examples during the creation process**,
So that **I create a well-formed pact and understand what makes a good commitment**.

**Acceptance Criteria:**

**Given** I am creating my first pact (hasCreatedFirstPact = false in User model)
**When** I am on the pact creation screen
**Then** I see additional guidance elements not shown to experienced users:

- Tooltip on Title field: "Keep it simple and action-focused, e.g., 'Morning run'"
- Tooltip on Action field: "Be specific about WHAT you'll do, e.g., 'Run for 20 minutes before work'"
- Tooltip on Frequency: "Start small! It's better to complete 2/week than fail at 7/week"
- Tooltip on Duration: "We recommend starting with 2-3 weeks for your first pact"
  **And** Example pacts are shown above the form:
- "Run 3 times per week for 3 weeks"
- "Write for 30 minutes, 5 days per week, for 4 weeks"
- "Meditate 10 minutes daily for 2 weeks"
  **And** I can tap an example to pre-fill the form with that pact
  **And** Each field shows placeholder text with good examples
  **And** When I select a high frequency (e.g., 7 days/week), I see a friendly warning: "Daily pacts are challenging - consider starting with 3-5 days"
  **And** When I select a long duration (4 weeks), I see: "Remember, shorter pacts are easier to complete!"
  **And** After creating my first pact, I see a celebration message: "Great! You've created your first pact 🎉"
  **And** The User model is updated: `hasCreatedFirstPact` = true, `firstPactCreatedAt` = now
  **And** Future pact creations don't show these hints (cleaner UI for experienced users)
  **And** All hints are non-intrusive (don't block the form, can be dismissed)
  **And** The guided experience works on both web and mobile

### Story 8.4: Help Content and Documentation

As a **user**,
I want **to access help content and documentation at any time**,
So that **I can learn how to use features and troubleshoot issues**.

**Acceptance Criteria:**

**Given** I am using the app and need help
**When** I access the help/support section from the main menu
**Then** I see a comprehensive help center with sections:

- "Getting Started" - Account setup, first pact
- "Creating Pacts" - Best practices, examples, tips
- "Tracking Daily" - How to use Today's view, marking complete
- "Completing Pacts" - Reflection process, creating next pact
- "Notifications" - Setting up reminders, customizing timing
- "Syncing & Offline" - How cross-platform sync works
- "FAQ" - Common questions and answers
- "Contact Support" - Email or feedback form
  **And** Each section has clear, searchable content
  **And** Content includes screenshots or videos where helpful
  **And** I can search the help center with a search bar
  **And** Search results are relevant and highlighted
  **And** Articles have "Was this helpful?" feedback buttons
  **And** I can access help content offline (cached after first visit)
  **And** The help center opens in-app (not external browser)
  **And** I can return to the app easily from help (back button or close icon)
  **And** Help content is written in clear, simple language
  **And** The help center is accessible (WCAG 2.1 Level AA per NFR23)
  **And** Help content works on both web and mobile

### Story 8.5: Contextual Hints and Tips

As a **user**,
I want **to see helpful hints relevant to what I'm doing**,
So that **I can learn features naturally as I use the app**.

**Acceptance Criteria:**

**Given** I am using various features in the app
**When** I interact with key screens for the first time
**Then** I see contextual hints that appear once and don't interrupt:

- First time on Today's view: "Tap the checkbox to mark pacts complete"
- First time viewing pact details: "Swipe through the calendar to see your history"
- First time a pact ends: "Now's the time to reflect on what you learned"
- First time on empty state: "Create your first pact to get started!"
  **And** Each hint appears as a subtle tooltip or small info card
  **And** Hints can be dismissed with a tap/click
  **And** Once dismissed, hints don't reappear (tracked in User preferences)
  **And** Hints don't block critical UI elements
  **And** Hints timeout after 5 seconds if not dismissed
  **And** I can disable all hints in settings via "Show Tips" toggle
  **And** Hints are accessible (announced by screen readers per NFR23)
  **And** Hints match the app's visual design (not jarring)
  **And** Hints work on both web and mobile with appropriate positioning
  **And** Advanced users (10+ pacts created) don't see basic hints
  **And** Hints are stored in a hints config that can be easily updated without app release
