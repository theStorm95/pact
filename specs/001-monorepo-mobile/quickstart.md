# Quick Start Guide: Initialize Monorepo and Mobile App Foundation

**Feature**: 001-monorepo-mobile | **Date**: 2026-01-03

## Overview

This guide provides step-by-step instructions for initializing the Pact monorepo structure with a working Expo React Native mobile application. After completing these steps, you will have a development environment ready for building cross-platform mobile features.

## Prerequisites

Before starting, ensure you have the following installed:

### Required for All Platforms

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **pnpm 8+**: Install with `npm install -g pnpm`
- **Git**: For version control

### iOS Development (macOS only)

- **Xcode 14+**: Install from Mac App Store
- **Xcode Command Line Tools**: Run `xcode-select --install`
- Accept Xcode license: `sudo xcodebuild -license accept`

### Android Development (All platforms)

- **Android Studio**: [Download here](https://developer.android.com/studio)
- **Android SDK Platform 29+**: Install via Android Studio SDK Manager
- **Android Virtual Device (AVD)**: Create via Android Studio AVD Manager

### Verify Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check pnpm version (should be 8+)
pnpm --version

# Check Xcode (macOS only)
xcode-select -p

# Check Android SDK (set ANDROID_HOME environment variable)
echo $ANDROID_HOME
```

---

## Step 1: Create Workspace Configuration

**Goal**: Set up pnpm workspace structure at the project root.

### Commands

```bash
# Navigate to project root (assuming you're in the pact directory)
cd /Users/nate/projects/pact

# Create pnpm workspace configuration
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "pact-monorepo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "mobile": "cd apps/mobile && npx expo start",
    "mobile:ios": "cd apps/mobile && npx expo start --ios",
    "mobile:android": "cd apps/mobile && npx expo start --android"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
EOF

# Create directory structure
mkdir -p apps packages
```

### Verification

```bash
# Verify workspace configuration exists
cat pnpm-workspace.yaml

# Verify directory structure
ls -la

# Should see:
# - pnpm-workspace.yaml
# - package.json
# - apps/ directory
# - packages/ directory
```

---

## Step 2: Initialize Mobile App with Expo

**Goal**: Create an Expo React Native app at `/apps/mobile` with TypeScript.

### Commands

```bash
# Create Expo app with TypeScript template
npx create-expo-app apps/mobile --template expo-template-blank-typescript

# Wait for initialization to complete (~30-60 seconds)
```

### Expected Output

```
✔ Downloaded and extracted project files.
✔ Installed JavaScript dependencies.
✅ Your project is ready!
```

### Verification

```bash
# Verify mobile app directory structure
ls -la apps/mobile

# Should see:
# - package.json
# - tsconfig.json
# - App.tsx
# - app.json
# - assets/
```

---

## Step 3: Enable TypeScript Strict Mode

**Goal**: Configure TypeScript with strict mode as required by Constitution Principle VI.

### Commands

```bash
# Update tsconfig.json to enable strict mode
cat > apps/mobile/tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
EOF
```

### Verification

```bash
# Check strict mode is enabled
grep -A 2 '"compilerOptions"' apps/mobile/tsconfig.json

# Should output:
#   "compilerOptions": {
#     "strict": true
#   }
```

---

## Step 4: Install Dependencies

**Goal**: Install all workspace dependencies using pnpm.

### Commands

```bash
# Install from workspace root
cd /Users/nate/projects/pact
pnpm install

# Wait for installation to complete (~30-60 seconds)
```

### Expected Output

```
Progress: resolved X, reused Y, downloaded Z, added W
Done in XXs
```

### Verification

```bash
# Verify no errors or warnings
echo $?
# Should output: 0

# Check installed dependencies
ls -la apps/mobile/node_modules

# Verify workspace linking
pnpm list --depth=0
```

---

## Step 5: Run Mobile App on iOS Simulator (macOS only)

**Goal**: Launch the mobile app on iOS simulator and verify hot reload.

### Commands

```bash
# Start Expo development server
cd apps/mobile
npx expo start

# Wait for QR code and options to appear
# Press 'i' to open iOS simulator
```

### Expected Output

```
› Metro waiting on exp://...
› Scan the QR code above with your phone
› Press i │ open iOS simulator
› Press a │ open Android emulator
```

### Verification

1. iOS simulator should launch automatically
2. App should display "Open up App.tsx to start working on your app!"
3. No error overlays should appear

### Test Hot Reload

```bash
# In a new terminal, edit App.tsx
# Change line 7 from:
#   <Text>Open up App.tsx to start working on your app!</Text>
# To:
#   <Text>Hot reload is working!</Text>

# Save the file
# Observe: iOS simulator should update within 2 seconds
```

---

## Step 6: Run Mobile App on Android Emulator

**Goal**: Launch the mobile app on Android emulator and verify hot reload.

### Commands

```bash
# If Expo dev server is not running:
cd apps/mobile
npx expo start

# Wait for QR code and options to appear
# Press 'a' to open Android emulator
```

### Expected Output

```
› Opening on Android...
› Opening exp://... on EMULATOR_NAME
```

### Verification

1. Android emulator should launch (or use existing instance)
2. App should display the same content as iOS
3. No error overlays should appear

### Test Hot Reload

```bash
# Make another change to App.tsx
# Save the file
# Observe: Android emulator should update within 2 seconds
```

---

## Success Criteria Checklist

After completing all steps, verify these success criteria from the spec:

- [ ] **SC-001**: `pnpm install` completed within 60 seconds
- [ ] **SC-002**: `npx expo start` started within 10 seconds
- [ ] **SC-003**: iOS simulator launched and rendered app within 15 seconds
- [ ] **SC-004**: Android emulator launched and rendered app within 20 seconds
- [ ] **SC-005**: Hot reload changes appeared within 2 seconds
- [ ] **SC-006**: TypeScript errors display in terminal (test by introducing syntax error)
- [ ] **SC-007**: Workspace supports adding packages to `/packages` (directory exists and is configured)
- [ ] **SC-008**: Zero errors or warnings during installation and initialization

---

## Troubleshooting

### Issue: `pnpm: command not found`

**Solution**: Install pnpm globally:

```bash
npm install -g pnpm
```

### Issue: iOS simulator not launching

**Solution**: Verify Xcode installation:

```bash
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer

# If not found:
xcode-select --install
```

### Issue: Android emulator not launching

**Solution**: Verify Android SDK and AVD:

```bash
# Check ANDROID_HOME
echo $ANDROID_HOME

# If not set, add to shell profile (~/.zshrc or ~/.bashrc):
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Restart terminal and try again
```

### Issue: Hot reload not working

**Solution**: Clear Metro bundler cache:

```bash
cd apps/mobile
npx expo start --clear
```

### Issue: TypeScript errors not showing

**Solution**: Verify strict mode is enabled:

```bash
cat apps/mobile/tsconfig.json | grep strict
# Should output: "strict": true
```

### Issue: Port already in use

**Solution**: Kill process using port 8081:

```bash
lsof -ti:8081 | xargs kill -9
npx expo start
```

---

## Next Steps

After successfully completing this guide:

1. **Story 1.2**: Initialize Web App and Shared Packages
2. **Story 1.3**: Initialize Backend API with NestJS
3. **Story 1.4**: Set Up Shared TypeScript Types Package
4. **Story 1.5**: Configure TanStack Query in Shared Package
5. **Story 1.6**: Integrate Expo Router for Mobile Navigation

---

## Reference Commands

### Quick Start (After Initial Setup)

```bash
# Start mobile development server
pnpm mobile

# Or with specific platform:
pnpm mobile:ios
pnpm mobile:android

# Install new dependencies
pnpm add <package-name> --filter @pact/mobile

# Type check
cd apps/mobile && npx tsc --noEmit
```

### Workspace Management

```bash
# List all workspace packages
pnpm list --depth=0

# Run command in specific workspace
pnpm --filter @pact/mobile <command>

# Install dependency in all workspaces
pnpm add <package-name> -r
```

### Clean Reset

```bash
# Remove all node_modules and reinstall
pnpm clean
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

---

## Constitution Compliance

This guide ensures compliance with the following constitution principles:

- **Principle I (Code Sharing)**: Workspace structure supports `/packages` for shared code
- **Principle III (Performance)**: Hot reload validated to complete within 2 seconds
- **Principle VI (Naming)**: Directory names use lowercase (`apps/mobile`), components use PascalCase (`App.tsx`)
