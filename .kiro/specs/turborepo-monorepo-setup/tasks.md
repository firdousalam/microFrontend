# Implementation Plan: Turborepo Monorepo Setup

## Overview

This implementation plan creates a production-grade Turborepo monorepo with 5 independent Next.js applications (shell, auth, dashboard, product, sales) and 3 shared packages (ui, auth-sdk, config). The implementation follows a bottom-up approach: first establishing the monorepo foundation, then creating shared packages, followed by applications, and finally wiring everything together with Turborepo's pipeline configuration.

## Tasks

- [x] 1. Initialize monorepo foundation and root configuration
  - Create root directory structure (apps/, packages/, infra/docker/, infra/k8s/, .github/workflows/)
  - Create root package.json with workspace configuration for apps/* and packages/*
  - Create turbo.json with pipeline configuration for build, dev, lint, and test tasks
  - Create tsconfig.base.json with strict mode and shared compiler options
  - Create .gitignore to exclude node_modules, .next, dist, .env files
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.1, 15.1, 15.2, 15.3, 19.4_

- [x] 2. Create shared packages with proper exports
  - [x] 2.1 Create @repo/ui package structure
    - Create packages/ui directory with src/components/ subdirectory
    - Create package.json with React peer dependencies and proper exports configuration
    - Create tsconfig.json extending base config with declaration output enabled
    - Create src/index.ts exporting Button and Input components
    - Create placeholder Button.tsx and Input.tsx components
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 11.1, 15.7, 15.8, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

  - [ ] 2.2 Write property test for @repo/ui package structure
    - **Property 2: Package Structure Completeness**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6**

  - [x] 2.3 Create @repo/config package structure
    - Create packages/config directory with src/ subdirectory
    - Create package.json with proper exports configuration
    - Create tsconfig.json extending base config with declaration output enabled
    - Create src/index.ts exporting eslintConfig and prettierConfig
    - Create placeholder eslint.ts and prettier.ts configuration files
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.8, 11.2, 15.7, 15.8, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

  - [ ] 2.4 Write property test for @repo/config package structure
    - **Property 2: Package Structure Completeness**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6**

  - [x] 2.5 Create @repo/auth-sdk package structure
    - Create packages/auth-sdk directory with src/ subdirectory
    - Create package.json with proper exports configuration
    - Create tsconfig.json extending base config with declaration output enabled
    - Create src/index.ts exporting login, logout, getUser functions and User, AuthResult types
    - Create placeholder auth.ts and types.ts files
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.9, 11.3, 15.7, 15.8, 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

  - [ ] 2.6 Write property test for @repo/auth-sdk package structure
    - **Property 2: Package Structure Completeness**
    - **Validates: Requirements 3.3, 3.4, 3.5, 3.6**

  - [ ] 2.7 Write property test for package naming convention
    - **Property 4: Package Naming Convention**
    - **Validates: Requirements 3.1, 11.4, 11.5**

- [x] 3. Create Next.js applications with unique ports
  - [x] 3.1 Create shell application on port 3000
    - Create apps/shell directory with app/, components/, lib/, public/ subdirectories
    - Create package.json with dev script using port 3000, dependencies on @repo/ui and @repo/auth-sdk
    - Create next.config.js with transpilePackages for @repo/ui
    - Create tsconfig.json extending base config with @/* path alias
    - Create app/page.tsx and app/layout.tsx with basic shell content
    - _Requirements: 2.1, 2.2, 2.3, 2.8, 2.9, 2.10, 2.11, 2.12, 5.1, 5.2, 5.3, 7.3, 9.2, 9.3, 12.1, 12.2, 12.3, 12.4, 15.4, 15.5, 15.6_

  - [x] 3.2 Create auth application on port 3001
    - Create apps/auth directory with app/, components/, lib/, public/ subdirectories
    - Create package.json with dev script using port 3001, dependencies on @repo/ui and @repo/config
    - Create next.config.js with transpilePackages for @repo/ui
    - Create tsconfig.json extending base config with @/* path alias
    - Create app/page.tsx and app/layout.tsx with basic auth content
    - Create app/login/, app/register/, app/logout/ route directories
    - _Requirements: 2.1, 2.2, 2.4, 2.8, 2.9, 2.10, 2.11, 2.12, 5.1, 5.2, 7.4, 9.2, 9.3, 12.1, 12.2, 12.3, 12.4, 12.5, 15.4, 15.5, 15.6_

  - [x] 3.3 Create dashboard application on port 3002
    - Create apps/dashboard directory with app/, components/, lib/, public/ subdirectories
    - Create package.json with dev script using port 3002, dependencies on @repo/ui and @repo/auth-sdk
    - Create next.config.js with transpilePackages for @repo/ui
    - Create tsconfig.json extending base config with @/* path alias
    - Create app/page.tsx and app/layout.tsx with basic dashboard content
    - _Requirements: 2.1, 2.2, 2.5, 2.8, 2.9, 2.10, 2.11, 2.12, 5.1, 5.2, 5.4, 7.5, 9.2, 9.3, 12.1, 12.2, 12.3, 12.4, 15.4, 15.5, 15.6_

  - [x] 3.4 Create product application on port 3003
    - Create apps/product directory with app/, components/, lib/, public/ subdirectories
    - Create package.json with dev script using port 3003, dependencies on @repo/ui and @repo/auth-sdk
    - Create next.config.js with transpilePackages for @repo/ui
    - Create tsconfig.json extending base config with @/* path alias
    - Create app/page.tsx and app/layout.tsx with basic product content
    - _Requirements: 2.1, 2.2, 2.6, 2.8, 2.9, 2.10, 2.11, 2.12, 5.1, 5.2, 5.5, 7.6, 9.2, 9.3, 12.1, 12.2, 12.3, 12.4, 15.4, 15.5, 15.6_

  - [x] 3.5 Create sales application on port 3004
    - Create apps/sales directory with app/, components/, lib/, public/ subdirectories
    - Create package.json with dev script using port 3004, dependencies on @repo/ui and @repo/auth-sdk
    - Create next.config.js with transpilePackages for @repo/ui
    - Create tsconfig.json extending base config with @/* path alias
    - Create app/page.tsx and app/layout.tsx with basic sales content
    - _Requirements: 2.1, 2.2, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 5.1, 5.2, 5.6, 7.7, 9.2, 9.3, 12.1, 12.2, 12.3, 12.4, 15.4, 15.5, 15.6_

  - [ ]* 3.6 Write property test for application structure completeness
    - **Property 1: Application Structure Completeness**
    - **Validates: Requirements 2.1, 2.8, 2.9, 2.10, 2.11, 2.12, 12.1, 12.2, 12.3, 12.4, 12.6**

  - [ ]* 3.7 Write property test for port uniqueness
    - **Property 3: Port Uniqueness**
    - **Validates: Requirements 2.2, 7.2, 10.3**

- [x] 4. Checkpoint - Verify structure and configuration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Install dependencies and verify workspace resolution
  - [x] 5.1 Install all workspace dependencies
    - Run npm install (or pnpm/yarn) to install all dependencies
    - Verify lock file is created
    - Verify all workspace dependencies resolve correctly
    - _Requirements: 5.7, 10.4, 13.1, 13.4, 13.5, 13.6_

  - [ ]* 5.2 Write property test for workspace dependency resolution
    - **Property 5: Workspace Dependency Resolution**
    - **Validates: Requirements 5.7, 10.4**

  - [ ]* 5.3 Write property test for workspace dependency protocol
    - **Property 24: Workspace Dependency Protocol**
    - **Validates: Requirements 5.1, 5.2**

- [x] 6. Implement validation utilities
  - [x] 6.1 Create validation script for monorepo structure
    - Create scripts/validate.ts to check directory existence, JSON validity, port uniqueness, and dependency resolution
    - Implement validateMonorepoStructure() function with descriptive error messages
    - Add validation script to root package.json
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

  - [ ]* 6.2 Write property test for validation completeness
    - **Property 14: Validation Completeness**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

  - [ ]* 6.3 Write property test for error message descriptiveness
    - **Property 15: Error Message Descriptiveness**
    - **Validates: Requirements 10.5, 10.6, 10.7, 10.8**

- [x] 7. Test independent build capability
  - [x] 7.1 Verify each application builds independently
    - Test building shell app in isolation
    - Test building auth app in isolation
    - Test building dashboard app in isolation
    - Test building product app in isolation
    - Test building sales app in isolation
    - Verify shared packages build before applications
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 14.1, 14.2, 14.3, 14.4, 14.5_

  - [ ]* 7.2 Write property test for workspace isolation
    - **Property 6: Workspace Isolation**
    - **Validates: Requirements 6.1, 6.3, 16.5**

  - [ ]* 7.3 Write property test for build order correctness
    - **Property 7: Build Order Correctness**
    - **Validates: Requirements 6.2, 14.1, 14.2**

  - [ ]* 7.4 Write property test for build artifact generation
    - **Property 8: Build Artifact Generation**
    - **Validates: Requirements 6.4, 6.5**

- [x] 8. Test Turborepo caching behavior
  - [x] 8.1 Verify cache hit/miss behavior
    - Build all applications and verify cache miss on first build
    - Build again without changes and verify cache hit
    - Modify a shared package and verify cache invalidation for dependent apps
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 19.1_

  - [ ]* 8.2 Write property test for cache correctness
    - **Property 9: Cache Correctness (Round-Trip)**
    - **Validates: Requirements 8.1, 8.6**

  - [ ]* 8.3 Write property test for cache invalidation
    - **Property 10: Cache Invalidation**
    - **Validates: Requirements 8.2, 19.1**

- [x] 9. Checkpoint - Ensure all builds and caching work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Test TypeScript configuration inheritance
  - [x] 10.1 Verify TypeScript compilation across workspaces
    - Verify all applications compile without errors
    - Verify all packages compile with declaration output
    - Verify path aliases work in applications
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 10.2 Write property test for TypeScript configuration inheritance
    - **Property 11: TypeScript Configuration Inheritance**
    - **Validates: Requirements 9.2**

  - [ ]* 10.3 Write property test for TypeScript declaration output
    - **Property 12: TypeScript Declaration Output**
    - **Validates: Requirements 9.4, 9.5**

  - [ ]* 10.4 Write property test for application path alias configuration
    - **Property 13: Application Path Alias Configuration**
    - **Validates: Requirements 9.3**

- [x] 11. Test workspace isolation and import restrictions
  - [x] 11.1 Verify cross-application import prevention
    - Attempt to import from shell app in auth app and verify it fails
    - Verify applications can import from shared packages
    - Verify shared packages can import from other shared packages
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

  - [ ]* 11.2 Write property test for cross-application import prevention
    - **Property 16: Cross-Application Import Prevention**
    - **Validates: Requirements 16.1, 16.2**

  - [ ]* 11.3 Write property test for application-to-package import permission
    - **Property 17: Application-to-Package Import Permission**
    - **Validates: Requirements 16.3**

  - [ ]* 11.4 Write property test for package-to-package import permission
    - **Property 18: Package-to-Package Import Permission**
    - **Validates: Requirements 16.4**

- [x] 12. Test development server management
  - [x] 12.1 Verify all dev servers start on correct ports
    - Start all dev servers using turbo run dev
    - Verify shell runs on port 3000
    - Verify auth runs on port 3001
    - Verify dashboard runs on port 3002
    - Verify product runs on port 3003
    - Verify sales runs on port 3004
    - Verify no port conflicts occur
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 12.2 Write property test for shared package rebuild propagation
    - **Property 19: Shared Package Rebuild Propagation**
    - **Validates: Requirements 7.8, 7.9, 17.2, 17.3**

  - [ ]* 12.3 Write property test for hot module replacement responsiveness
    - **Property 20: Hot Module Replacement Responsiveness**
    - **Validates: Requirements 17.1, 17.5**

- [x] 13. Test parallel task execution
  - [x] 13.1 Verify Turborepo executes tasks in parallel
    - Run build task and verify independent apps build in parallel
    - Run lint task and verify it executes in parallel across workspaces
    - Run test task and verify it executes in parallel after builds
    - Verify dependent tasks execute sequentially
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ]* 13.2 Write property test for parallel task execution
    - **Property 21: Parallel Task Execution for Independent Tasks**
    - **Validates: Requirements 18.1, 18.3, 18.4, 18.5**

  - [ ]* 13.3 Write property test for sequential task execution
    - **Property 22: Sequential Task Execution for Dependent Tasks**
    - **Validates: Requirements 18.2**

- [x] 14. Test environment variable handling
  - [x] 14.1 Verify environment variable loading and cache invalidation
    - Create .env.local files in applications
    - Verify environment variables are loaded correctly
    - Modify .env.local and verify cache invalidation
    - Verify .env files are in .gitignore
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 15. Test package export configuration
  - [x] 15.1 Verify shared packages can be imported correctly
    - Import components from @repo/ui in an application
    - Import config from @repo/config in an application
    - Import auth functions from @repo/auth-sdk in an application
    - Verify TypeScript types are available
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

  - [ ]* 15.2 Write property test for package export configuration completeness
    - **Property 23: Package Export Configuration Completeness**
    - **Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**

- [x] 16. Final checkpoint and documentation
  - [x] 16.1 Create README.md with setup and usage instructions
    - Document how to install dependencies
    - Document how to run dev servers
    - Document how to build applications
    - Document how to add new applications or packages
    - Document troubleshooting common issues

  - [ ]* 16.2 Write property test for JSON formatting consistency
    - **Property 25: JSON Formatting Consistency**
    - **Validates: Requirements 15.9**

  - [ ]* 16.3 Write property test for configuration file validity
    - **Property 26: Configuration File Validity**
    - **Validates: Requirements 15.4, 15.5, 15.6, 15.7, 15.8**

  - [x] 16.4 Final verification
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- The implementation uses TypeScript as specified in the design document
- All applications use Next.js 14 with the App Router
- Shared packages use workspace:* protocol for internal dependencies
- Turborepo pipeline configuration enables intelligent caching and parallel execution
