# Monorepo Validation Scripts

This directory contains utility scripts for validating and maintaining the monorepo structure.

## validate.ts

Validates the monorepo structure to ensure it meets all requirements.

### What it checks

1. **Directory Existence** (Requirement 10.1)
   - Verifies that all required directories exist: `apps/`, `packages/`, `infra/docker/`, `infra/k8s/`

2. **JSON Validity** (Requirement 10.2)
   - Validates that all `package.json` files are valid JSON
   - Checks syntax and structure

3. **Port Uniqueness** (Requirement 10.3, 10.5)
   - Ensures all applications use unique port numbers
   - Reports which applications have conflicting ports

4. **Workspace Dependency Resolution** (Requirement 10.4, 10.6, 10.7)
   - Verifies all workspace dependencies (`workspace:*`) resolve to existing packages
   - Detects circular dependencies and reports the dependency chain
   - Reports which applications reference missing workspace packages

### Usage

```bash
# Run validation
npm run validate

# Or directly with npx
npx ts-node --project scripts/tsconfig.json scripts/validate.ts
```

### Exit Codes

- `0`: Validation passed, monorepo structure is valid
- `1`: Validation failed, see error messages for details

### Error Messages

The script provides descriptive error messages with resolution steps for each issue:

- **Directory errors**: Suggests creating missing directories
- **JSON errors**: Shows syntax errors and file locations
- **Port conflicts**: Lists conflicting applications and suggests available ports
- **Dependency errors**: Identifies missing packages and suggests fixes
- **Circular dependencies**: Shows the dependency chain causing the cycle

### Example Output

**Success:**
```
🔍 Validating monorepo structure...

✅ Validation passed! Monorepo structure is valid.
```

**Failure:**
```
🔍 Validating monorepo structure...

❌ Validation failed! Found the following issues:

[PORT] Port 3000 is used by multiple applications: shell, dashboard
   Resolution: Assign unique ports to each application. Update the 'dev' script in package.json for: shell, dashboard. Available ports: 3000-9999.

[DEPENDENCY] Missing workspace package: 'product' references '@repo/missing-package' which does not exist
   Resolution: Either create the missing package '@repo/missing-package' in the packages/ directory, or remove the dependency from apps/product/package.json.
```

### Requirements Validated

This script validates the following requirements from the specification:

- **10.1**: Check that all required directories exist
- **10.2**: Check that all package.json files are valid JSON
- **10.3**: Check that all application ports are unique
- **10.4**: Check that all workspace dependencies are resolvable
- **10.5**: Report which applications have conflicting ports
- **10.6**: Report the dependency chain for circular dependencies
- **10.7**: Report which application references missing workspace packages
- **10.8**: Provide descriptive error messages with resolution steps

## test-workspace-isolation.ts

Tests workspace isolation and import restrictions to ensure applications cannot import from each other.

### What it tests

1. **Cross-Application Import Prevention** (Requirements 16.1, 16.2)
   - Verifies that applications cannot import from other applications
   - Tests that module resolution fails for cross-app imports

2. **Application-to-Package Imports** (Requirement 16.3)
   - Verifies that applications can successfully import from shared packages
   - Tests that `@repo/*` packages are accessible

3. **Package-to-Package Imports** (Requirement 16.4)
   - Verifies that shared packages can import from other shared packages
   - Tests workspace dependency resolution

### Usage

```bash
# Run workspace isolation tests
npm run test:isolation

# Or directly with npx
npx ts-node --project scripts/tsconfig.json scripts/test-workspace-isolation.ts
```

### Exit Codes

- `0`: All tests passed
- `1`: Some tests failed

## verify-dev-servers.ts

Verifies that all development servers start on their correct ports without conflicts.

### What it verifies

1. **Dev Server Startup** (Requirement 7.1)
   - Starts all dev servers using `turbo run dev`
   - Waits for each server to be ready (max 2 minutes per server)

2. **Port Configuration** (Requirements 7.3-7.7)
   - Shell app on port 3000
   - Auth app on port 3001
   - Dashboard app on port 3002
   - Product app on port 3003
   - Sales app on port 3004

3. **Port Conflict Detection** (Requirement 7.2)
   - Verifies no port conflicts occur
   - Checks each port is used by only one application

4. **Accessibility Testing**
   - Makes HTTP requests to each port
   - Verifies servers respond successfully

### Usage

```bash
# Run dev server verification
npm run verify:dev-servers

# Or directly with npx
npx ts-node --project scripts/tsconfig.json scripts/verify-dev-servers.ts
```

### Exit Codes

- `0`: All dev servers verified successfully
- `1`: Verification failed (see results file for details)

### Output

The script generates a detailed results file at:
`.kiro/specs/turborepo-monorepo-setup/dev-server-verification-results.md`

This file includes:
- Application status table
- Requirements validation checklist
- Error details (if any)
- Test procedure documentation
- Port configuration details

### Example Output

**Success:**
```
═══════════════════════════════════════════════════════
  Dev Server Port Verification
  Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
═══════════════════════════════════════════════════════

🚀 Starting all dev servers with Turborepo...

📋 Verifying each application...

   Waiting for shell on port 3000...
   ✓ shell is ready on port 3000
   Waiting for auth on port 3001...
   ✓ auth is ready on port 3001
   ...

🔍 Checking for port conflicts...
   ✓ Port 3000 (shell) - no conflicts
   ✓ Port 3001 (auth) - no conflicts
   ...

═══════════════════════════════════════════════════════
  Verification Complete
═══════════════════════════════════════════════════════

📊 Summary:

   ✅ shell        - Port 3000 - ready
   ✅ auth         - Port 3001 - ready
   ✅ dashboard    - Port 3002 - ready
   ✅ product      - Port 3003 - ready
   ✅ sales        - Port 3004 - ready

📄 Results written to: .kiro/specs/turborepo-monorepo-setup/dev-server-verification-results.md

✅ All dev servers verified successfully!
```

### Requirements Validated

This script validates the following requirements from the specification:

- **7.1**: All dev servers start on configured ports
- **7.2**: No port conflicts occur
- **7.3**: Shell app runs on port 3000
- **7.4**: Auth app runs on port 3001
- **7.5**: Dashboard app runs on port 3002
- **7.6**: Product app runs on port 3003
- **7.7**: Sales app runs on port 3004

### Notes

- The script automatically stops all dev servers when verification completes
- Handles SIGINT (Ctrl+C) and SIGTERM gracefully
- Waits up to 2 minutes for each server to start
- Uses HTTP requests to verify server accessibility
- Works on both Windows and Unix-like systems

## test-env-variables.ts

Verifies environment variable loading and cache invalidation behavior.

### What it tests

1. **Gitignore Exclusion** (Requirement 19.4)
   - Verifies .env files are excluded from version control
   - Checks .gitignore contains all required patterns

2. **Turbo Global Dependencies** (Requirement 19.2)
   - Verifies turbo.json includes `**/.env.*local` pattern
   - Ensures cache invalidation is configured for .env files

3. **Environment File Creation** (Requirements 19.3, 19.5)
   - Creates .env.local files in all applications
   - Verifies files are readable and properly formatted

4. **Cache Invalidation** (Requirement 19.1)
   - Tests that cache is used for unchanged builds
   - Verifies cache is invalidated when .env.local changes
   - Confirms applications rebuild after .env modifications

5. **Environment File Types** (Requirement 19.5)
   - Tests support for .env.local
   - Tests support for .env.development
   - Tests support for .env.production

### Usage

```bash
# Run environment variable tests
npm run test:env

# Or directly with npx
npx tsx scripts/test-env-variables.ts
```

### Exit Codes

- `0`: All tests passed
- `1`: Some tests failed

### Output

The script generates a detailed results file at:
`.kiro/specs/turborepo-monorepo-setup/env-variables-results.md`

This file includes:
- Test results for each verification
- Requirements validation checklist
- Cache invalidation test procedure
- Compliance status table
- Recommendations for production use

### Test Procedure

1. **Gitignore Check**: Reads .gitignore and verifies .env patterns
2. **Turbo Config Check**: Reads turbo.json and verifies globalDependencies
3. **File Creation**: Creates .env.local files with test variables in all apps
4. **Cache Test**: 
   - Builds with --force (cache miss)
   - Builds again (cache hit)
   - Modifies .env.local
   - Builds again (cache miss - invalidation confirmed)
5. **File Types**: Creates and verifies .env.local, .env.development, .env.production
6. **Cleanup**: Removes all test .env files

### Example Output

**Success:**
```
======================================================================
Environment Variable Verification Test
======================================================================

[ENV-TEST] Test 1: Verifying .env files are in .gitignore...
✓ Gitignore Exclusion: All .env patterns are properly excluded from version control

[ENV-TEST] Test 2: Verifying turbo.json globalDependencies...
✓ Turbo Global Dependencies: globalDependencies includes .env pattern: **/.env.*local

[ENV-TEST] Test 3: Creating .env.local files in applications...
✓ Env File Creation: Created .env.local files for 5 applications
✓ Env File Verification: All .env.local files are readable

[ENV-TEST] Test 4: Testing cache invalidation on .env.local changes...
✓ Cache Hit Verification: Unchanged build correctly used cache
✓ Cache Invalidation: Cache correctly invalidated when .env.local changed

[ENV-TEST] Test 5: Verifying support for different .env file types...
✓ Env File Types Support: System supports .env.local, .env.development, .env.production files

======================================================================
Test Summary
======================================================================
✓ PASS: Gitignore Exclusion
✓ PASS: Turbo Global Dependencies
✓ PASS: Env File Creation
✓ PASS: Env File Verification
✓ PASS: Cache Hit Verification
✓ PASS: Cache Invalidation
✓ PASS: Env File Types Support

Total: 7 tests
Passed: 7
Failed: 0

✅ All tests passed!
```

### Requirements Validated

This script validates the following requirements from the specification:

- **19.1**: Cache invalidates when .env files change
- **19.2**: turbo.json includes **/.env.*local pattern
- **19.3**: Applications load environment variables from .env files
- **19.4**: .env files excluded from version control
- **19.5**: Support for .env.local, .env.development, .env.production

### Notes

- The script automatically cleans up all test .env files after execution
- Uses Turborepo's build command to test cache behavior
- Tests are non-destructive and safe to run multiple times
- Verifies both cache hit and cache miss scenarios
- Works with Next.js environment variable conventions

