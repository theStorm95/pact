# Quickstart: Initialize Web App and Shared Packages

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Research**: [research.md](research.md)  
**Date**: 2026-01-03  
**Estimated Time**: 30-45 minutes

## Prerequisites

Before starting, ensure you have:

- [x] Story 1.1 completed (monorepo structure with `/apps/mobile` exists)
- [x] Node.js 18+ installed (`node --version`)
- [x] pnpm 8+ installed (`pnpm --version`)
- [x] Git repository initialized at project root
- [x] Terminal open at repository root: `/Users/nate/projects/pact`

## Implementation Steps

### Step 1: Create Vite + React Web Application (10 min)

Navigate to the `apps` directory and create the web app using Vite's React TypeScript template:

```bash
cd apps
npm create vite@latest web -- --template react-ts
```

**Expected output**: Creates `apps/web` directory with:

- `src/` folder with `App.tsx`, `main.tsx`, `vite-env.d.ts`
- `index.html` entry point
- `package.json` with React, React DOM, Vite dependencies
- `tsconfig.json` and `tsconfig.node.json`
- `vite.config.ts` with React plugin

**Validation**:

```bash
cd web
ls -la
# Should see: src/, index.html, package.json, vite.config.ts, tsconfig.json
```

---

### Step 2: Install Web App Dependencies (2 min)

Install the web app's npm dependencies:

```bash
# Still in apps/web directory
pnpm install
```

**Expected output**: Creates `node_modules/` and `pnpm-lock.yaml` in `apps/web`

**Validation**:

```bash
# Test dev server starts
pnpm dev
# Should see: "VITE v5.x.x ready in XXX ms"
# Should see: "Local: http://localhost:5173/"
# Open browser to http://localhost:5173/ - should see Vite + React default page
# Press Ctrl+C to stop server
```

---

### Step 3: Configure pnpm Workspace (5 min)

Return to repository root and create/update workspace configuration:

```bash
cd ../..  # Back to /Users/nate/projects/pact
```

Create `pnpm-workspace.yaml` at root (if it doesn't exist):

```bash
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF
```

Update root `package.json` to add workspace scripts. Add or merge these scripts:

```json
{
  "name": "pact-monorepo",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev:web": "pnpm --filter web dev",
    "build:web": "pnpm --filter web build",
    "preview:web": "pnpm --filter web preview",
    "dev:mobile": "pnpm --filter mobile start"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**Validation**:

```bash
# Test workspace script
pnpm dev:web
# Should start Vite dev server
# Press Ctrl+C to stop
```

---

### Step 4: Create Shared Packages Structure (8 min)

Create the shared packages directory structure:

```bash
# From repository root
mkdir -p packages/shared/{types,api,utils,hooks}
```

Create root `package.json` for shared workspace:

```bash
cat > packages/shared/package.json << 'EOF'
{
  "name": "@pact/shared",
  "version": "0.0.1",
  "private": true,
  "description": "Shared code for Pact web and mobile applications"
}
EOF
```

Create `package.json` for each shared package:

```bash
# Types package
cat > packages/shared/types/package.json << 'EOF'
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
EOF

# API package
cat > packages/shared/api/package.json << 'EOF'
{
  "name": "@pact/shared-api",
  "version": "0.0.1",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts"
  }
}
EOF

# Utils package
cat > packages/shared/utils/package.json << 'EOF'
{
  "name": "@pact/shared-utils",
  "version": "0.0.1",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts"
  }
}
EOF

# Hooks package
cat > packages/shared/hooks/package.json << 'EOF'
{
  "name": "@pact/shared-hooks",
  "version": "0.0.1",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    ".": "./index.ts",
  },
  "peerDependencies": {
    "react": "^18.0.0"
  }
}
EOF
```

Create placeholder index files:

```bash
# Types
cat > packages/shared/types/index.ts << 'EOF'
// Shared TypeScript types for Pact application
// Export types here

export type Example = {
  id: string;
  name: string;
};
EOF

# API
cat > packages/shared/api/index.ts << 'EOF'
// Shared API client code
// Export API functions here

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
EOF

# Utils
cat > packages/shared/utils/index.ts << 'EOF'
// Shared utility functions
// Export utilities here

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
EOF

# Hooks
cat > packages/shared/hooks/index.ts << 'EOF'
// Shared React hooks
// Export hooks here

import { useState, useEffect } from 'react';

export const useExample = () => {
  const [value, setValue] = useState('example');
  return { value, setValue };
};
EOF
```

**Validation**:

```bash
tree packages/shared -L 2
# Should show:
# packages/shared
# ├── api
# │   ├── index.ts
# │   └── package.json
# ├── hooks
# │   ├── index.ts
# │   └── package.json
# ├── package.json
# ├── types
# │   ├── index.ts
# │   └── package.json
# └── utils
#     ├── index.ts
#     └── package.json
```

---

### Step 5: Configure TypeScript Path Aliases (10 min)

Create or update root `tsconfig.json` with path mappings:

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@pact/shared-types": ["./packages/shared/types"],
      "@pact/shared-api": ["./packages/shared/api"],
      "@pact/shared-utils": ["./packages/shared/utils"],
      "@pact/shared-hooks": ["./packages/shared/hooks"]
    },
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
EOF
```

Update `apps/web/tsconfig.json` to extend root config:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@pact/shared-types": ["../../packages/shared/types"],
      "@pact/shared-api": ["../../packages/shared/api"],
      "@pact/shared-utils": ["../../packages/shared/utils"],
      "@pact/shared-hooks": ["../../packages/shared/hooks"]
    }
  },
  "include": ["src"]
}
```

Update `apps/web/vite.config.ts` to resolve path aliases:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
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

**Validation**: TypeScript should recognize the path aliases. Create a test file:

```bash
cat > apps/web/src/test-shared-import.ts << 'EOF'
import { Example } from '@pact/shared-types';
import { formatDate } from '@pact/shared-utils';
import { useExample } from '@pact/shared-hooks';

const example: Example = { id: '1', name: 'Test' };
const today = formatDate(new Date());

console.log('Shared imports work!', example, today);
EOF
```

Check for TypeScript errors:

```bash
cd apps/web
pnpm exec tsc --noEmit
# Should complete with no errors
```

---

### Step 6: Link All Workspaces (3 min)

Run pnpm install at root to link all workspaces:

```bash
cd ../..  # Back to root
pnpm install
```

**Expected output**:

- Links `@pact/shared-*` packages to web and mobile apps
- Creates symlinks in node_modules
- Updates lockfile

**Validation**:

```bash
# Check that shared packages are linked
ls -la apps/web/node_modules/@pact/
# Should show symlinks to ../../packages/shared/*
```

---

### Step 7: Test Shared Imports in Web App (5 min)

Update `apps/web/src/App.tsx` to import and use shared code:

```tsx
import { useState } from "react";
import { Example } from "@pact/shared-types";
import { formatDate } from "@pact/shared-utils";
import { useExample } from "@pact/shared-hooks";
import "./App.css";

function App() {
  const { value } = useExample();
  const [count, setCount] = useState(0);

  const example: Example = {
    id: "1",
    name: "Shared Import Test",
  };

  const today = formatDate(new Date());

  return (
    <>
      <h1>Pact Web App</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Shared example: {example.name}</p>
        <p>Today's date: {today}</p>
        <p>Hook value: {value}</p>
      </div>
    </>
  );
}

export default App;
```

Start the dev server:

```bash
pnpm dev:web
```

**Expected result**:

- No TypeScript errors
- App loads at http://localhost:5173/
- Shows "Shared Import Test" text
- Shows formatted date
- Shows hook value "example"
- HMR works when editing files

---

### Step 8: Test Hot Module Replacement (2 min)

With dev server running:

1. Open `apps/web/src/App.tsx` in your editor
2. Change `<h1>Pact Web App</h1>` to `<h1>Pact Web App - HMR Test</h1>`
3. Save the file

**Expected result**:

- Browser updates within 1 second WITHOUT full page reload
- Component state (count) is preserved
- Meets SC-002 requirement

---

### Step 9: Test Production Build (2 min)

Build the web app for production:

```bash
pnpm build:web
```

**Expected output**:

- Build completes in < 30 seconds (SC-003)
- Creates `apps/web/dist/` directory
- Shows bundle sizes in terminal

**Validation**:

```bash
ls -la apps/web/dist/
# Should see: index.html, assets/ directory with JS and CSS files

# Optional: preview production build
pnpm preview:web
# Opens at http://localhost:4173/
```

---

### Step 10: Update Mobile App Configuration (Optional - for Story 1.1 integration)

Update `apps/mobile/metro.config.js` to support shared packages:

```javascript
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add shared packages to watch folders
config.watchFolders = [path.resolve(__dirname, "../../packages")];

// Add path aliases for shared packages
config.resolver.extraNodeModules = {
  "@pact/shared-types": path.resolve(__dirname, "../../packages/shared/types"),
  "@pact/shared-api": path.resolve(__dirname, "../../packages/shared/api"),
  "@pact/shared-utils": path.resolve(__dirname, "../../packages/shared/utils"),
  "@pact/shared-hooks": path.resolve(__dirname, "../../packages/shared/hooks"),
};

module.exports = config;
```

Test mobile app still works:

```bash
pnpm dev:mobile
```

---

## Verification Checklist

Confirm all acceptance criteria are met:

- [x] **SC-001**: Web dev server starts within 5 seconds (`pnpm dev:web`)
- [x] **SC-002**: HMR updates within 1 second of file save
- [x] **SC-003**: Production build completes within 30 seconds (`pnpm build:web`)
- [x] **SC-004**: Shared code imports work with `@pact/shared/*` aliases
- [x] **SC-005**: TypeScript compiles with zero errors (`pnpm exec tsc --noEmit`)
- [x] **SC-006**: `pnpm install` completes within 2 minutes
- [x] **SC-007**: All 4 shared package modules (types, api, utils, hooks) can be imported

- [x] **FR-001**: Vite + React web app created at `/apps/web`
- [x] **FR-002**: Web app runs on port 5173 with HMR
- [x] **FR-003**: Shared packages directory exists with 4 subdirectories
- [x] **FR-004**: pnpm workspace links all packages correctly
- [x] **FR-005**: Path aliases `@pact/shared/*` work across workspaces
- [x] **FR-006**: TypeScript compiles successfully across all workspaces
- [x] **FR-007**: Hot module replacement works in dev mode
- [x] **FR-008**: Production build creates static assets
- [x] **FR-009**: Dependency versions are consistent via pnpm workspace
- [x] **FR-010**: Shared imports work in both web (Vite) and mobile (Metro)

## Troubleshooting

### "Cannot find module '@pact/shared-types'"

**Solution**: Run `pnpm install` at root to link workspaces

### TypeScript errors about path aliases

**Solution**:

1. Check `tsconfig.json` has correct `paths` configuration
2. Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

### Vite build fails with alias resolution errors

**Solution**: Verify `vite.config.ts` has correct `resolve.alias` paths using `path.resolve()`

### Metro bundler can't find shared packages

**Solution**: Update `metro.config.js` with `watchFolders` and `extraNodeModules` as shown in Step 10

### HMR not working

**Solution**:

1. Check `@vitejs/plugin-react` is in `vite.config.ts` plugins
2. Restart dev server
3. Hard refresh browser (Cmd+Shift+R)

## Next Steps

After completing this story:

1. **Story 1.3**: Initialize Backend API and Database
2. **Story 1.4**: Configure Cross-Platform Styling System (Tailwind/NativeWind)
3. **Story 1.5**: Set Up Authentication Infrastructure

The web app and shared packages infrastructure is now ready for feature development!

## Time Tracking

**Estimated**: 30-45 minutes  
**Actual**: _[Fill in after completion]_

## Notes

- This foundation enables 70%+ code sharing as required by Constitution I
- Shared packages will be populated with business logic in Epic 2+ stories
- Path aliases improve developer experience and code maintainability
- pnpm workspace ensures consistent dependencies across all platforms
