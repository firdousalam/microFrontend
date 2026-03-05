# Micro-Frontend Platform - Turborepo Monorepo

A production-grade Turborepo monorepo setup for a micro-frontend commerce platform with 5 independent Next.js applications and 3 shared packages.

## 📦 What's Inside

### Applications (`apps/`)

- **shell** (port 3000) - Container application that orchestrates micro-frontends
- **auth** (port 3001) - Identity and authentication application
- **dashboard** (port 3002) - Analytics and reporting application
- **product** (port 3003) - Product catalog application
- **sales** (port 3004) - Order and transaction application

### Shared Packages (`packages/`)

- **@repo/ui** - Shared React component library
- **@repo/config** - Shared configuration files (ESLint, Prettier)
- **@repo/auth-sdk** - Shared authentication client library

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0 (or pnpm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd micro-frontend-platform
```

2. Install all dependencies:
```bash
npm install
```

This will install dependencies for all applications and packages in the monorepo.

## 🛠️ Development

### Run All Development Servers

Start all applications simultaneously:

```bash
npm run dev
```

This will start:
- Shell app on http://localhost:3000
- Auth app on http://localhost:3001
- Dashboard app on http://localhost:3002
- Product app on http://localhost:3003
- Sales app on http://localhost:3004

### Run Individual Application

Navigate to the specific app directory and run:

```bash
cd apps/shell
npm run dev
```

### Build All Applications

Build all applications and packages:

```bash
npm run build
```

Turborepo will:
1. Build shared packages first (@repo/ui, @repo/config, @repo/auth-sdk)
2. Build all applications in parallel
3. Cache build outputs for faster subsequent builds

### Build Individual Application

```bash
cd apps/shell
npm run build
```

### Lint All Code

```bash
npm run lint
```

### Run All Tests

```bash
npm run test
```

## 📁 Project Structure

```
.
├── apps/
│   ├── shell/          # Container app (port 3000)
│   ├── auth/           # Auth app (port 3001)
│   ├── dashboard/      # Dashboard app (port 3002)
│   ├── product/        # Product app (port 3003)
│   └── sales/          # Sales app (port 3004)
├── packages/
│   ├── ui/             # @repo/ui - Shared components
│   ├── config/         # @repo/config - Shared configs
│   └── auth-sdk/       # @repo/auth-sdk - Auth client
├── scripts/            # Validation and testing scripts
├── infra/
│   ├── docker/         # Docker configurations
│   └── k8s/            # Kubernetes manifests
├── package.json        # Root workspace configuration
├── turbo.json          # Turborepo pipeline configuration
└── tsconfig.base.json  # Base TypeScript configuration
```

## ➕ Adding New Applications

1. Create a new directory in `apps/`:
```bash
mkdir apps/my-new-app
cd apps/my-new-app
```

2. Create `package.json`:
```json
{
  "name": "my-new-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3005",
    "build": "next build",
    "start": "next start -p 3005",
    "lint": "next lint",
    "test": "jest --passWithNoTests"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@repo/ui": "*",
    "@repo/config": "*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

3. Create `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui'],
  reactStrictMode: true,
}

module.exports = nextConfig
```

4. Create `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

5. Create the app structure:
```bash
mkdir -p app components lib public
```

6. Create `app/page.tsx` and `app/layout.tsx`

7. Install dependencies from the root:
```bash
cd ../..
npm install
```

## ➕ Adding New Shared Packages

1. Create a new directory in `packages/`:
```bash
mkdir packages/my-package
cd packages/my-package
```

2. Create `package.json`:
```json
{
  "name": "@repo/my-package",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src/",
    "test": "jest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "eslint": "^8.0.0"
  }
}
```

3. Create `tsconfig.json`:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

4. Create the package structure:
```bash
mkdir src
touch src/index.ts
```

5. Install dependencies from the root:
```bash
cd ../..
npm install
```

## 🔧 Validation and Testing

### Validate Monorepo Structure

Run the validation script to check:
- Directory structure
- JSON validity
- Port uniqueness
- Dependency resolution

```bash
npm run validate
```

### Test Workspace Isolation

Verify that applications cannot import from each other:

```bash
npm run test:isolation
```

### Verify Development Servers

Check that all dev servers start on correct ports:

```bash
npm run verify:dev-servers
```

### Test Parallel Execution

Verify Turborepo executes tasks in parallel:

```bash
npm run test:parallel
```

### Test Environment Variables

Verify environment variable handling and cache invalidation:

```bash
npm run test:env
```

## 🐛 Troubleshooting

### Port Already in Use

**Problem**: Application fails to start with "Port already in use" error.

**Solution**:
1. Check which process is using the port:
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

2. Either:
   - Kill the process using the port
   - Change the port in the app's `package.json` dev script

### Module Not Found Error

**Problem**: Import fails with "Module not found: @repo/package-name"

**Solution**:
1. Ensure the package exists in `packages/` directory
2. Build the package:
```bash
cd packages/package-name
npm run build
```
3. Reinstall dependencies from root:
```bash
cd ../..
npm install
```

### TypeScript Errors

**Problem**: TypeScript compilation errors across workspaces

**Solution**:
1. Ensure all packages are built:
```bash
npm run build
```
2. Check that `tsconfig.json` extends the base config:
```json
{
  "extends": "../../tsconfig.base.json"
}
```
3. Verify path aliases are configured correctly

### Cache Issues

**Problem**: Stale build outputs or unexpected behavior

**Solution**:
1. Clear Turborepo cache:
```bash
npx turbo run build --force
```
2. Clear Next.js cache:
```bash
rm -rf apps/*/.next
```
3. Reinstall dependencies:
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

### Circular Dependency

**Problem**: Package manager reports circular dependency

**Solution**:
1. Review package dependencies in `package.json` files
2. Refactor to break the circular dependency:
   - Extract shared code to a new package
   - Restructure imports
   - Use dependency injection

### Hot Reload Not Working

**Problem**: Changes don't reflect in the browser

**Solution**:
1. Ensure dev server is running with `npm run dev`
2. Check that `transpilePackages` includes shared packages in `next.config.js`:
```javascript
transpilePackages: ['@repo/ui']
```
3. Restart the dev server
4. Clear browser cache

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Individual Applications

Each application can be deployed independently:

1. Build the specific application:
```bash
cd apps/shell
npm run build
```

2. Start the production server:
```bash
npm run start
```

3. Or deploy to your platform (Vercel, AWS, etc.)

### Environment Variables

Create environment files for each application:

```bash
# apps/shell/.env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

**Important**: `.env` files are excluded from version control. Use `.env.example` to document required variables.

## 🔄 Reverse Proxy Architecture

The Shell application acts as a reverse proxy, providing a unified entry point for all micro-frontend services. Users only need to access `http://localhost:3000`, and the Shell automatically routes requests to the appropriate service.

### How It Works

- Access Shell: `http://localhost:3000`
- Access Auth via Shell: `http://localhost:3000/auth/login`
- Access Dashboard via Shell: `http://localhost:3000/dashboard`
- Access Products via Shell: `http://localhost:3000/products`
- Access Sales via Shell: `http://localhost:3000/sales`

### Benefits

- **Single entry point** - Only one URL to remember
- **No CORS issues** - All requests from same origin
- **Shared authentication** - Cookies work across all services
- **Production-ready** - Same pattern works in production

For detailed information, see [Reverse Proxy Documentation](document/ReverseProxy.md).

## 📚 Key Concepts

### Turborepo Caching

Turborepo caches task outputs to speed up builds:
- First build: Cache miss (builds from source)
- Subsequent builds: Cache hit (restores from cache)
- Changed files: Cache invalidation (rebuilds affected tasks)

### Workspace Protocol

Dependencies between workspace packages use `workspace:*`:
```json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

This ensures packages always use the local workspace version.

### Task Dependencies

Tasks can depend on other tasks using `dependsOn`:
```json
{
  "build": {
    "dependsOn": ["^build"]
  }
}
```

The `^` prefix means "run this task in dependencies first".

## 📖 Additional Resources

- [Architecture Documentation](document/Architecture.md)
- [Local Development Guide](document/LocalDevelopment.md)
- [Reverse Proxy Guide](document/ReverseProxy.md)
- [Data Sharing Between Services](document/DataSharing.md)
- [Deployment Guide](document/Deployment.md)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)

## 📝 License

[Your License Here]
