# Research: Initialize Web App and Shared Packages

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-01-03  
**Status**: Complete

## Overview

This document consolidates research findings for establishing the web development environment and shared packages infrastructure. All technical unknowns from the Technical Context have been resolved through research into best practices for Vite, React, TypeScript monorepos, and pnpm workspaces.

## Research Tasks

### 1. Vite + React + TypeScript Starter Configuration

**Question**: What is the optimal Vite configuration for a React TypeScript SPA with hot module replacement and production optimization?

**Decision**: Use `npm create vite@latest` with `react-ts` template and default configuration

**Rationale**:

- Vite's official `react-ts` template provides optimized defaults for React + TypeScript
- Out-of-the-box HMR using Vite's Fast Refresh plugin (`@vitejs/plugin-react`)
- Production builds automatically include code splitting, tree shaking, and minification
- Default configuration meets performance targets (< 5s dev startup, < 1s HMR per SC-001, SC-002)
- No custom configuration needed for initial setup

**Alternatives considered**:

- **Custom Vite config from scratch**: Rejected - reinvents the wheel, official template is battle-tested
- **Create React App**: Rejected - deprecated, slower build times, webpack-based (Vite is faster)
- **Next.js**: Rejected - overkill for SPA, adds SSR complexity not needed for this project

**Implementation details**:

```bash
cd apps
npm create vite@latest web -- --template react-ts
```

**Configuration files generated**:

- `vite.config.ts`: Minimal config with React plugin
- `tsconfig.json`: React-specific TypeScript settings
- `tsconfig.node.json`: Node.js TypeScript settings for Vite config

---

### 2. pnpm Workspace Configuration for Monorepo

**Question**: How should pnpm-workspace.yaml be configured to link web, mobile, backend, and shared packages?

**Decision**: Use glob patterns to include all apps and packages with proper dependency hoisting

**Rationale**:

- pnpm workspaces automatically link local packages without publishing to npm
- Glob patterns (`apps/*`, `packages/*`) scale as new workspaces are added
- pnpm's symlink-based approach ensures consistent dependency versions across workspaces
- Faster installs than npm/yarn due to content-addressable store

**Implementation**:

```yaml
# pnpm-workspace.yaml (root)
packages:
  - "apps/*"
  - "packages/*"
```

**Root package.json setup**:

```json
{
  "name": "pact-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "build:web": "pnpm --filter web build",
    "dev:mobile": "pnpm --filter mobile start",
    "install:all": "pnpm install"
  }
}
```

**Alternatives considered**:

- **Yarn workspaces**: Rejected - pnpm is faster and more efficient with disk space
- **npm workspaces**: Rejected - slower than pnpm, less sophisticated dependency resolution
- **Lerna**: Rejected - adds complexity, pnpm workspaces handle our needs
- **Turborepo**: Rejected - overkill for current scale, can add later if needed

---

### 3. Shared Packages Structure and Exports

**Question**: How should `/packages/shared` be structured to support independent imports of types, api, utils, and hooks?

**Decision**: Use separate subdirectories with individual package.json files and proper TypeScript exports

**Rationale**:

- Separate packages allow selective imports (`@pact/shared/types` vs `@pact/shared/api`)
- Reduces bundle size - only import what you need
- Clearer separation of concerns (types vs logic vs hooks)
- Each package can have its own dependencies if needed

**Structure**:

```
packages/shared/
├── package.json              # Root shared package
├── types/
│   ├── package.json          # Name: "@pact/shared-types"
│   ├── index.ts              # Export all types
│   └── tsconfig.json         # Types-specific TS config
├── api/
│   ├── package.json          # Name: "@pact/shared-api"
│   ├── index.ts              # Export API client
│   └── tsconfig.json
├── utils/
│   ├── package.json          # Name: "@pact/shared-utils"
│   ├── index.ts              # Export utility functions
│   └── tsconfig.json
└── hooks/
    ├── package.json          # Name: "@pact/shared-hooks"
    ├── index.ts              # Export React hooks
    └── tsconfig.json
```

**Package.json pattern** (example for types):

```json
{
  "name": "@pact/shared-types",
  "version": "0.0.1",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts"
  }
}
```

**Alternatives considered**:

- **Single shared package with all exports**: Rejected - creates large bundles, all-or-nothing imports
- **Barrel exports at root only**: Rejected - harder to maintain, circular dependency risks
- **Per-feature packages**: Rejected - premature optimization, current structure is sufficient

---

### 4. TypeScript Path Aliases and Module Resolution

**Question**: How should TypeScript path aliases be configured for `@pact/shared/*` imports across Vite and Metro bundlers?

**Decision**: Use TypeScript `paths` in tsconfig.json with bundler-specific resolution plugins

**Rationale**:

- TypeScript `paths` provide IDE autocomplete and type checking
- Vite resolves TypeScript paths automatically via `vite-tsconfig-paths` or manual alias config
- Metro requires `metro.config.js` adjustments for path resolution
- Consistent import syntax across all platforms

**TypeScript configuration**:

```json
// Root tsconfig.json (or base config extended by all workspaces)
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pact/shared-types": ["./packages/shared/types"],
      "@pact/shared-api": ["./packages/shared/api"],
      "@pact/shared-utils": ["./packages/shared/utils"],
      "@pact/shared-hooks": ["./packages/shared/hooks"]
    }
  }
}
```

**Vite configuration** (apps/web/vite.config.ts):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@pact/shared-types": path.resolve(
        __dirname,
        "../../packages/shared/types"
      ),
      "@pact/shared-api": path.resolve(__dirname, "../../packages/shared/api"),
      "@pact/shared-utils": path.resolve(
        __dirname,
        "../../packages/shared/utils"
      ),
      "@pact/shared-hooks": path.resolve(
        __dirname,
        "../../packages/shared/hooks"
      ),
    },
  },
});
```

**Metro configuration** (apps/mobile/metro.config.js - to be updated):

```javascript
const path = require("path");

module.exports = {
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, "../../packages")],
  resolver: {
    extraNodeModules: {
      "@pact/shared-types": path.resolve(
        __dirname,
        "../../packages/shared/types"
      ),
      "@pact/shared-api": path.resolve(__dirname, "../../packages/shared/api"),
      "@pact/shared-utils": path.resolve(
        __dirname,
        "../../packages/shared/utils"
      ),
      "@pact/shared-hooks": path.resolve(
        __dirname,
        "../../packages/shared/hooks"
      ),
    },
  },
};
```

**Alternatives considered**:

- **Relative imports only**: Rejected - hard to maintain, ugly paths (`../../../packages/shared`)
- **npm link**: Rejected - doesn't work well with React Native
- **Module aliases at bundler level only**: Rejected - TypeScript wouldn't recognize imports

---

### 5. Hot Module Replacement Configuration

**Question**: What HMR configuration is needed for sub-second update times in Vite?

**Decision**: Use Vite's default HMR with `@vitejs/plugin-react` (no additional config needed)

**Rationale**:

- Vite's Fast Refresh is enabled by default with `@vitejs/plugin-react`
- Native ES modules enable instant HMR without full bundle rebuilds
- Meets SC-002 requirement (< 1 second HMR) out of the box
- React Fast Refresh preserves component state during updates

**Default behavior**:

- File change detected → Vite rebuilds only changed module → Browser updates without reload
- React component changes preserve local state
- CSS changes are instant without state loss

**No custom configuration needed** - Vite defaults are optimal.

**Alternatives considered**:

- **Custom HMR API usage**: Rejected - unnecessary, defaults work perfectly
- **Webpack with React Hot Loader**: Rejected - Vite is significantly faster
- **Disabling HMR**: Rejected - violates SC-002 requirement

---

### 6. Production Build Optimization

**Question**: What Vite build configuration optimizations are needed to meet 30-second build target (SC-003)?

**Decision**: Use Vite's default production optimizations with no custom configuration initially

**Rationale**:

- Vite's default build uses Rollup with optimal settings:
  - Tree shaking removes unused code
  - Code splitting creates optimal chunks
  - Minification via esbuild (extremely fast)
  - Asset optimization (images, fonts)
- Default config easily meets SC-003 (< 30s for starter app)
- Can optimize later if build times increase with scale

**Default build output**:

```
apps/web/dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── vendor-[hash].js     # Third-party code
│   └── index-[hash].css     # Styles
└── vite.svg
```

**Build command**: `pnpm build` (runs `vite build`)

**Alternatives considered**:

- **Manual code splitting config**: Rejected - premature optimization, defaults work
- **Custom minification settings**: Rejected - esbuild defaults are optimal
- **Build caching plugins**: Rejected - can add later if needed

---

### 7. TypeScript Strict Mode Configuration

**Question**: What TypeScript strict mode settings are needed to ensure type safety across workspaces?

**Decision**: Enable all strict mode flags in base tsconfig.json extended by all workspaces

**Rationale**:

- Constitution mandates TypeScript strict mode
- Catches more bugs at compile time
- Enforces better code quality
- Prevents common runtime errors

**Configuration** (tsconfig.json):

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Alternatives considered**:

- **Gradual strict mode adoption**: Rejected - creates inconsistent codebase
- **Loose TypeScript settings**: Rejected - violates constitution

---

## Technology Decisions Summary

| Component         | Technology                         | Version | Rationale                                            |
| ----------------- | ---------------------------------- | ------- | ---------------------------------------------------- |
| Web Framework     | React                              | 18+     | Constitutional requirement, industry standard        |
| Build Tool        | Vite                               | 5+      | Fastest dev server, excellent HMR, optimal builds    |
| Language          | TypeScript                         | 5.3+    | Type safety, constitution requires strict mode       |
| Package Manager   | pnpm                               | 8+      | Fastest, most efficient, excellent workspace support |
| Monorepo Strategy | pnpm workspaces                    | -       | Simple, fast, no extra tools needed                  |
| Module Resolution | TypeScript paths + bundler aliases | -       | Consistent imports across platforms                  |
| Dev Server Port   | 5173                               | -       | Vite default, no conflicts with other services       |

---

## Implementation Checklist

Based on research findings, implementation should follow this order:

1. ✅ Create web app with `npm create vite@latest web -- --template react-ts` in `apps/` directory
2. ✅ Configure `pnpm-workspace.yaml` at root with glob patterns
3. ✅ Update root `package.json` with workspace scripts
4. ✅ Create `/packages/shared` directory structure with subdirectories
5. ✅ Create `package.json` for each shared package (types, api, utils, hooks)
6. ✅ Configure TypeScript paths in root tsconfig.json
7. ✅ Update `vite.config.ts` with path aliases
8. ✅ Create placeholder exports in each shared package
9. ✅ Run `pnpm install` to link all workspaces
10. ✅ Test dev server (`pnpm dev:web`)
11. ✅ Test HMR by modifying a component
12. ✅ Test shared imports by importing from `@pact/shared-types`
13. ✅ Test production build (`pnpm build:web`)

---

## Open Questions

None - all technical unknowns have been resolved.

---

## References

- [Vite Official Guide](https://vitejs.dev/guide/)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [React Fast Refresh](https://github.com/facebook/react/tree/main/packages/react-refresh)
