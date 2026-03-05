# 🚀 Local Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **npm**: v10.0.0 or higher (comes with Node.js)
- **Git**: For version control

Check your versions:
```bash
node --version
npm --version
git --version
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd micro-frontend-platform
```

### 2. Install Dependencies

The project uses npm workspaces, so a single install command will install dependencies for all modules:

```bash
npm install
```

This will install dependencies for:
- Root workspace
- All apps (shell, auth, dashboard, product, sales)
- All packages (ui, auth-sdk, config)

### 3. Verify Installation

Check that Turborepo is installed:
```bash
npx turbo --version
```

## Running the Application

### Option 1: Run All Modules (Recommended)

Start all applications simultaneously using Turborepo:

```bash
npm run dev
```

This command will start:
- Shell on `http://localhost:3000`
- Auth on `http://localhost:3001`
- Dashboard on `http://localhost:3002`
- Product on `http://localhost:3003`
- Sales on `http://localhost:3004`

**Access the application**: Open `http://localhost:3000` in your browser

### Option 2: Run Individual Modules

If you want to work on a specific module:

```bash
# Run only Shell
cd apps/shell
npm run dev

# Run only Auth
cd apps/auth
npm run dev

# Run only Dashboard
cd apps/dashboard
npm run dev

# Run only Product
cd apps/product
npm run dev

# Run only Sales
cd apps/sales
npm run dev
```

### Option 3: Run Specific Modules with Turbo

```bash
# Run only shell and auth
npx turbo run dev --filter=shell --filter=auth

# Run all except sales
npx turbo run dev --filter=!sales
```

## Port Configuration

Each module runs on a dedicated port:

| Module    | Port | URL                      |
|-----------|------|--------------------------|
| Shell     | 3000 | http://localhost:3000    |
| Auth      | 3001 | http://localhost:3001    |
| Dashboard | 3002 | http://localhost:3002    |
| Product   | 3003 | http://localhost:3003    |
| Sales     | 3004 | http://localhost:3004    |

**Note**: The Shell acts as a reverse proxy, so you typically only need to access `http://localhost:3000`

## Development Workflow

### Making Changes

1. **Edit files** in any module
2. **Hot reload** automatically updates the browser
3. **TypeScript** checks types in real-time
4. **ESLint** shows linting errors

### Building for Production

Build all modules:
```bash
npm run build
```

Build specific module:
```bash
cd apps/shell
npm run build
```

Build with Turbo (parallel):
```bash
npx turbo run build
```

### Running Production Build Locally

After building, start production servers:

```bash
# Start all in production mode
cd apps/shell && npm start &
cd apps/auth && npm start &
cd apps/dashboard && npm start &
cd apps/product && npm start &
cd apps/sales && npm start &
```

Or individually:
```bash
cd apps/shell
npm start
```

## Testing

### Run All Tests

```bash
npm run test
```

### Run Tests for Specific Module

```bash
cd apps/auth
npm run test
```

### Run Validation Scripts

The project includes custom validation scripts:

```bash
# Validate entire setup
npm run validate

# Test workspace isolation
npm run test:isolation

# Verify dev servers
npm run verify:dev-servers

# Test parallel execution
npm run test:parallel

# Test environment variables
npm run test:env
```

## Linting

### Lint All Modules

```bash
npm run lint
```

### Lint Specific Module

```bash
cd apps/dashboard
npm run lint
```

### Auto-fix Linting Issues

```bash
cd apps/dashboard
npm run lint -- --fix
```

## Working with Shared Packages

### Using @repo/ui Components

```typescript
import { Button, Input, Card } from '@repo/ui';

export default function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

### Using @repo/auth-sdk

```typescript
import { login, getUser, logout } from '@repo/auth-sdk';

// Login user
await login({ email, password });

// Get current user
const user = await getUser();

// Logout
await logout();
```

### Modifying Shared Packages

1. Navigate to package:
```bash
cd packages/ui
```

2. Make changes to components

3. Rebuild package:
```bash
npm run build
```

4. Changes automatically reflect in all apps using the package

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use":

```bash
# Find process using port
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <process-id> /F

# Or change port in package.json
"dev": "next dev -p 3005"
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install
```

### Turbo Cache Issues

```bash
# Clear Turbo cache
rm -rf .turbo
npx turbo run build --force
```

### TypeScript Errors

```bash
# Rebuild TypeScript
npx turbo run build --force

# Check specific module
cd apps/shell
npx tsc --noEmit
```

### Hot Reload Not Working

1. Check if dev server is running
2. Clear browser cache
3. Restart dev server:
```bash
# Stop all (Ctrl+C)
# Restart
npm run dev
```

## Environment Variables

### Creating Environment Files

Create `.env.local` files in each app:

```bash
# apps/auth/.env.local
JWT_SECRET=your-secret-key-here
DATABASE_URL=your-database-url

# apps/shell/.env.local
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3002
```

**Note**: `.env.local` files are gitignored and should never be committed

### Accessing Environment Variables

```typescript
// Server-side
const secret = process.env.JWT_SECRET;

// Client-side (must be prefixed with NEXT_PUBLIC_)
const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
```

## Development Tips

### 1. Use Turbo for Speed
Turborepo caches build outputs, making subsequent builds much faster.

### 2. Work on One Module at a Time
Focus on one module to reduce cognitive load:
```bash
cd apps/product
npm run dev
```

### 3. Use TypeScript Strictly
Enable strict mode in `tsconfig.json` for better type safety.

### 4. Leverage Shared Components
Before creating new components, check `packages/ui` for reusable ones.

### 5. Test Locally Before Committing
```bash
npm run lint
npm run test
npm run build
```

## IDE Setup (VS Code Recommended)

### Recommended Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense (if using Tailwind)

### Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Next Steps

1. **Explore the codebase**: Start with `apps/shell/app/page.tsx`
2. **Make a small change**: Edit a component and see hot reload
3. **Create a new feature**: Add a new page or component
4. **Run tests**: Ensure everything works
5. **Build for production**: Test production build locally

## Getting Help

- Check `document/Story.md` for project context
- Review `document/Architecture.md` for system design
- Check individual app README files (if available)
- Review Turborepo docs: https://turbo.build/repo/docs

## Summary

You're now ready to develop locally! The typical workflow is:

1. `npm install` (first time only)
2. `npm run dev` (start all modules)
3. Open `http://localhost:3000`
4. Make changes and see them live
5. `npm run lint && npm run test` (before committing)
6. `npm run build` (verify production build)

Happy coding! 🎉
