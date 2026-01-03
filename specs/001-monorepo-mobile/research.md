# Research: Initialize Monorepo and Mobile App Foundation

**Feature**: 001-monorepo-mobile | **Phase**: 0 (Research) | **Date**: 2026-01-03

## Research Tasks

This document consolidates research findings for all technical decisions and unknowns identified during planning.

## 1. Pnpm Workspace Configuration for Expo Monorepo

### Decision

Use minimal pnpm-workspace.yaml configuration with glob patterns for `apps/*` and `packages/*`, allowing Expo's default Metro bundler configuration to work without conflicts.

### Rationale

- Pnpm workspaces natively support monorepo structures with minimal configuration
- Expo's Metro bundler (React Native's JavaScript bundler) needs to resolve dependencies from the workspace root
- Pnpm's symlink strategy is compatible with Expo's module resolution
- Minimal configuration reduces potential conflicts and maintenance burden

### Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Alternatives Considered

1. **Yarn Workspaces**: Rejected because Constitution mandates pnpm for this project
2. **Npm Workspaces**: Rejected because pnpm has better disk space efficiency and stricter dependency resolution
3. **Turborepo/Nx**: Deferred to later stories; overkill for initial setup, can be layered on top

### Implementation Notes

- Root package.json should include `"private": true` to prevent accidental publishing
- Each app/package needs its own package.json with appropriate `name` field (e.g., `@pact/mobile`)
- Workspace protocol (`workspace:*`) can be used for internal dependencies (will be relevant in Story 1.2+)

---

## 2. Expo TypeScript Template Selection

### Decision

Use `expo-template-blank-typescript` as the initialization template via `npx create-expo-app`.

### Rationale

- **Blank template**: Minimal boilerplate, no opinionated navigation or styling (Expo Router added in Story 1.6)
- **TypeScript template**: Includes pre-configured tsconfig.json with React Native types
- **Official Expo template**: Maintained by Expo team, guaranteed compatibility with latest SDK
- **Strict mode compatible**: Can easily enable TypeScript strict mode (Constitution requirement)

### Command

```bash
npx create-expo-app apps/mobile --template expo-template-blank-typescript
```

### Alternatives Considered

1. **expo-template-tabs**: Includes tab navigation and example screens - Rejected because navigation structure should be designed intentionally in Story 1.6
2. **expo-template-blank** (JavaScript): Rejected because TypeScript is a Constitution requirement
3. **Manual Expo setup**: Rejected because official template ensures proper initial configuration

### Post-Creation Configuration

After template initialization, update `apps/mobile/tsconfig.json` to enable strict mode:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

---

## 3. Hot Reload Performance Validation

### Decision

Validate hot reload occurs within 2 seconds using manual testing with visible UI changes.

### Rationale

- Expo's Fast Refresh is enabled by default in development builds
- Metro bundler supports Hot Module Replacement (HMR) out of the box
- Constitution Principle III requires <2s perceived response time
- Automated testing of hot reload timing is complex; manual validation is sufficient for foundational story

### Validation Method

1. Start Expo dev server: `cd apps/mobile && npx expo start`
2. Launch on iOS simulator (press `i`) or Android emulator (press `a`)
3. Modify `App.tsx` with a visible change (e.g., change text color or content)
4. Save the file and observe time until change appears on device
5. Repeat 3-5 times to ensure consistency

### Expected Outcome

Hot reload should complete within 2 seconds in 100% of test cases. If hot reload consistently exceeds 2 seconds, investigate:

- Metro bundler cache issues (clear with `npx expo start --clear`)
- Network latency between dev server and simulator/emulator
- Large bundle size (should not be an issue with blank template)

### Alternatives Considered

1. **Automated E2E testing**: Deferred to later stories; overkill for infrastructure validation
2. **Performance monitoring tools**: Deferred; manual validation sufficient for success criteria

---

## 4. Cross-Platform Simulator/Emulator Setup

### Decision

Document prerequisites for both iOS simulator (Xcode) and Android emulator (Android Studio) but do not automate setup in this story.

### Rationale

- iOS simulator requires macOS and Xcode installation
- Android emulator works on macOS, Linux, and Windows
- Developer environment setup is a prerequisite, not a deliverable of this story
- Expo CLI provides clear error messages if simulators/emulators are not configured

### Prerequisites

**iOS (macOS only):**

- Xcode 14+ installed from Mac App Store
- Xcode Command Line Tools: `xcode-select --install`
- Accept Xcode license: `sudo xcodebuild -license accept`
- iOS simulator automatically available after Xcode installation

**Android (macOS, Linux, Windows):**

- Android Studio installed
- Android SDK Platform 29+ installed via Android Studio SDK Manager
- Android Virtual Device (AVD) created via Android Studio AVD Manager
- Add Android SDK tools to PATH (Expo CLI will guide if not found)

### Validation

- iOS: `npx expo start` → press `i` → App launches on iOS simulator
- Android: `npx expo start` → press `a` → App launches on Android emulator

### Troubleshooting Reference

If simulators/emulators fail to launch:

- iOS: Check Xcode installation with `xcode-select -p` (should output `/Applications/Xcode.app/Contents/Developer`)
- Android: Check SDK installation with `echo $ANDROID_HOME` (should output path to Android SDK)
- Both: Restart Expo dev server and try again

### Alternatives Considered

1. **Expo Go physical device testing**: Valid alternative, but simulators/emulators are required for consistent development workflow
2. **Automated setup script**: Rejected because environment setup varies by OS and existing installations

---

## 5. Dependency Installation Strategy

### Decision

Use `pnpm install` at the root after creating the mobile app to install all workspace dependencies.

### Rationale

- Pnpm resolves dependencies for all workspace packages from the root
- Symlinks are created in each app's node_modules for workspace protocol dependencies
- Single install command ensures all dependencies are cached and deduplicated
- Aligns with pnpm workspace best practices

### Installation Flow

1. Create workspace structure (pnpm-workspace.yaml, root package.json)
2. Initialize mobile app with Expo template (creates apps/mobile/package.json)
3. Run `pnpm install` from root (resolves and installs all dependencies)
4. Verify with `pnpm list` to check dependency tree

### Expected Outcome

- Installation completes within 60 seconds on standard internet connection (SC-001)
- Zero errors or warnings related to peer dependencies or version conflicts
- `apps/mobile/node_modules` contains symlinks to hoisted dependencies

### Error Handling

If `pnpm install` fails:

- Check Node.js version: `node --version` (should be 18+)
- Check pnpm version: `pnpm --version` (should be 8+)
- Clear pnpm cache: `pnpm store prune`
- Retry installation with verbose logging: `pnpm install --verbose`

### Alternatives Considered

1. **Per-app installation**: Rejected because workspace dependencies should be managed from root
2. **Frozen lockfile**: Deferred to CI/CD story; development environment should allow dependency updates

---

## 6. TypeScript Strict Mode Configuration

### Decision

Enable TypeScript strict mode in `apps/mobile/tsconfig.json` immediately after Expo template initialization.

### Rationale

- Constitution requires TypeScript strict mode
- Easier to enable strict mode from the start than to retrofit later
- Expo's TypeScript template includes pre-configured tsconfig.json that can be extended
- Strict mode catches type errors early, reducing debugging time

### Configuration Change

Modify `apps/mobile/tsconfig.json`:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

### Impact

- All TypeScript files in the mobile app will be type-checked with strict rules
- `any` types will trigger warnings (must use `unknown` or explicit types)
- Null/undefined must be explicitly handled
- Function parameters and return types must be annotated

### Alternatives Considered

1. **Gradual strict mode adoption**: Rejected because this is a greenfield project with minimal code
2. **Strict mode only in shared packages**: Rejected because consistency across all TypeScript code is preferred

---

## Summary of Research Findings

All technical unknowns have been resolved:

1. ✅ Pnpm workspace configuration: Minimal YAML with `apps/*` and `packages/*` patterns
2. ✅ Expo template: Use `expo-template-blank-typescript` for minimal, type-safe setup
3. ✅ Hot reload validation: Manual testing with 2-second target, Fast Refresh enabled by default
4. ✅ Cross-platform setup: Document prerequisites, Expo CLI provides clear error messages
5. ✅ Dependency installation: `pnpm install` at root after app creation
6. ✅ TypeScript strict mode: Enable in tsconfig.json immediately after initialization

**No NEEDS CLARIFICATION markers remain.** Ready for Phase 1 (Design & Contracts).
