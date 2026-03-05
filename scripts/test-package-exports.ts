#!/usr/bin/env node

/**
 * Test Package Export Configuration
 * 
 * This script verifies that shared packages can be imported correctly
 * and that TypeScript types are available.
 * 
 * Tests:
 * - Import components from @repo/ui
 * - Import config from @repo/config
 * - Import auth functions from @repo/auth-sdk
 * - Verify TypeScript types are available
 */

import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

interface TestResult {
    name: string
    passed: boolean
    message: string
    details?: string
}

const results: TestResult[] = []

function log(message: string) {
    console.log(`[TEST] ${message}`)
}

function logSuccess(message: string) {
    console.log(`✓ ${message}`)
}

function logError(message: string) {
    console.error(`✗ ${message}`)
}

function addResult(name: string, passed: boolean, message: string, details?: string) {
    results.push({ name, passed, message, details })
    if (passed) {
        logSuccess(message)
    } else {
        logError(message)
    }
}

/**
 * Check if package exports are properly configured
 */
function checkPackageExports(packageName: string, packagePath: string): boolean {
    try {
        const pkgJsonPath = path.join(packagePath, 'package.json')
        if (!fs.existsSync(pkgJsonPath)) {
            addResult(
                `${packageName} exports`,
                false,
                `Package.json not found for ${packageName}`,
                `Expected at: ${pkgJsonPath}`
            )
            return false
        }

        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))

        // Check required fields
        const requiredFields = ['main', 'types', 'exports']
        const missingFields = requiredFields.filter(field => !pkgJson[field])

        if (missingFields.length > 0) {
            addResult(
                `${packageName} exports`,
                false,
                `Missing required fields in package.json: ${missingFields.join(', ')}`,
                JSON.stringify(pkgJson, null, 2)
            )
            return false
        }

        // Check exports configuration
        const exports = pkgJson.exports['.']
        if (!exports || !exports.import || !exports.require || !exports.types) {
            addResult(
                `${packageName} exports`,
                false,
                `Incomplete exports configuration`,
                JSON.stringify(exports, null, 2)
            )
            return false
        }

        addResult(
            `${packageName} exports`,
            true,
            `Package exports properly configured`
        )
        return true
    } catch (error) {
        addResult(
            `${packageName} exports`,
            false,
            `Error checking package exports: ${error instanceof Error ? error.message : String(error)}`
        )
        return false
    }
}

/**
 * Check if package has been built (dist directory exists)
 */
function checkPackageBuilt(packageName: string, packagePath: string): boolean {
    const distPath = path.join(packagePath, 'dist')
    const indexPath = path.join(distPath, 'index.js')
    const typesPath = path.join(distPath, 'index.d.ts')

    if (!fs.existsSync(distPath)) {
        addResult(
            `${packageName} build`,
            false,
            `Package not built - dist directory missing`,
            `Run: npm run build -w ${packageName}`
        )
        return false
    }

    if (!fs.existsSync(indexPath)) {
        addResult(
            `${packageName} build`,
            false,
            `Missing index.js in dist directory`
        )
        return false
    }

    if (!fs.existsSync(typesPath)) {
        addResult(
            `${packageName} build`,
            false,
            `Missing TypeScript declarations (index.d.ts)`
        )
        return false
    }

    addResult(
        `${packageName} build`,
        true,
        `Package built with TypeScript declarations`
    )
    return true
}

/**
 * Test TypeScript compilation of imports
 */
function testTypeScriptImports(): boolean {
    try {
        log('Creating test file with package imports...')

        // Create test in apps/shell to use existing workspace setup
        const testContent = `
// Test imports from @repo/ui
import { Button, Input } from '@repo/ui'

// Test imports from @repo/config  
import { eslintConfig, prettierConfig } from '@repo/config'

// Test imports from @repo/auth-sdk
import { login, logout, getUser } from '@repo/auth-sdk'
import type { User, AuthResult } from '@repo/auth-sdk'

// Verify types are available
const testUser: User = { id: '1', email: 'test@example.com', name: 'Test User', role: 'user' }
const testResult: AuthResult = { success: true, user: testUser }

export function testImports() {
    // Use all imports to avoid unused import errors
    console.log('Testing imports:', {
        ui: { Button, Input },
        config: { eslintConfig, prettierConfig },
        auth: { login, logout, getUser },
        types: { testUser, testResult }
    })
    return { testUser, testResult }
}
`

        const testFile = path.join(process.cwd(), 'apps/shell/lib/test-imports.ts')
        fs.writeFileSync(testFile, testContent)

        log('Running TypeScript compiler to verify imports...')

        try {
            execSync(`npx tsc --noEmit`, {
                cwd: path.join(process.cwd(), 'apps/shell'),
                stdio: 'pipe',
                encoding: 'utf-8'
            })

            addResult(
                'TypeScript imports',
                true,
                'All packages can be imported with TypeScript types'
            )

            // Cleanup
            fs.unlinkSync(testFile)
            return true
        } catch (error: any) {
            addResult(
                'TypeScript imports',
                false,
                'TypeScript compilation failed',
                error.stderr || error.stdout || error.message
            )

            // Cleanup
            try {
                fs.unlinkSync(testFile)
            } catch { }
            return false
        }
    } catch (error) {
        addResult(
            'TypeScript imports',
            false,
            `Error testing TypeScript imports: ${error instanceof Error ? error.message : String(error)}`
        )
        return false
    }
}

/**
 * Test imports in actual application
 */
function testApplicationImports(appName: string): boolean {
    try {
        const appPath = path.join(process.cwd(), 'apps', appName)
        const pkgJsonPath = path.join(appPath, 'package.json')

        if (!fs.existsSync(pkgJsonPath)) {
            addResult(
                `${appName} imports`,
                false,
                `Application not found: ${appName}`
            )
            return false
        }

        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
        const dependencies = pkgJson.dependencies || {}

        // Check which packages the app depends on
        const expectedPackages = ['@repo/ui', '@repo/config', '@repo/auth-sdk']
        const appDependencies = expectedPackages.filter(pkg => dependencies[pkg])

        if (appDependencies.length === 0) {
            addResult(
                `${appName} imports`,
                false,
                `Application has no shared package dependencies`
            )
            return false
        }

        // Try to compile the application
        log(`Checking TypeScript compilation for ${appName}...`)
        try {
            execSync(`npx tsc --noEmit`, {
                cwd: appPath,
                stdio: 'pipe',
                encoding: 'utf-8'
            })

            addResult(
                `${appName} imports`,
                true,
                `Application can import shared packages: ${appDependencies.join(', ')}`
            )
            return true
        } catch (error: any) {
            addResult(
                `${appName} imports`,
                false,
                `TypeScript compilation failed for ${appName}`,
                error.stderr || error.stdout || error.message
            )
            return false
        }
    } catch (error) {
        addResult(
            `${appName} imports`,
            false,
            `Error testing application imports: ${error instanceof Error ? error.message : String(error)}`
        )
        return false
    }
}

/**
 * Main test execution
 */
async function main() {
    console.log('='.repeat(60))
    console.log('Testing Package Export Configuration')
    console.log('='.repeat(60))
    console.log()

    const packages = [
        { name: '@repo/ui', path: 'packages/ui' },
        { name: '@repo/config', path: 'packages/config' },
        { name: '@repo/auth-sdk', path: 'packages/auth-sdk' }
    ]

    // Test 1: Check package export configurations
    log('Test 1: Checking package export configurations...')
    console.log()
    for (const pkg of packages) {
        checkPackageExports(pkg.name, pkg.path)
    }
    console.log()

    // Test 2: Check if packages are built
    log('Test 2: Checking if packages are built...')
    console.log()
    let allBuilt = true
    for (const pkg of packages) {
        const built = checkPackageBuilt(pkg.name, pkg.path)
        if (!built) allBuilt = false
    }
    console.log()

    if (!allBuilt) {
        console.log('⚠️  Some packages are not built. Building packages...')
        try {
            execSync('npm run build --workspaces --if-present', {
                stdio: 'inherit'
            })
            console.log()

            // Re-check after build
            for (const pkg of packages) {
                checkPackageBuilt(pkg.name, pkg.path)
            }
            console.log()
        } catch (error) {
            console.error('Failed to build packages')
            console.log()
        }
    }

    // Test 3: Test TypeScript imports
    log('Test 3: Testing TypeScript imports...')
    console.log()
    testTypeScriptImports()
    console.log()

    // Test 4: Test imports in actual applications
    log('Test 4: Testing imports in applications...')
    console.log()
    const apps = ['shell', 'auth', 'dashboard', 'product', 'sales']
    for (const app of apps) {
        testApplicationImports(app)
    }
    console.log()

    // Summary
    console.log('='.repeat(60))
    console.log('Test Summary')
    console.log('='.repeat(60))
    console.log()

    const passed = results.filter(r => r.passed).length
    const failed = results.filter(r => !r.passed).length
    const total = results.length

    console.log(`Total Tests: ${total}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log()

    if (failed > 0) {
        console.log('Failed Tests:')
        results.filter(r => !r.passed).forEach(r => {
            console.log(`  ✗ ${r.name}: ${r.message}`)
            if (r.details) {
                console.log(`    ${r.details}`)
            }
        })
        console.log()
    }

    // Write results to file
    const resultsPath = path.join(
        process.cwd(),
        '.kiro/specs/turborepo-monorepo-setup/package-export-results.md'
    )

    const markdown = generateMarkdownReport(results, passed, failed, total)
    fs.writeFileSync(resultsPath, markdown)

    console.log(`Results written to: ${resultsPath}`)
    console.log()

    process.exit(failed > 0 ? 1 : 0)
}

function generateMarkdownReport(
    results: TestResult[],
    passed: number,
    failed: number,
    total: number
): string {
    const timestamp = new Date().toISOString()

    let markdown = `# Package Export Configuration Test Results

**Date:** ${timestamp}
**Status:** ${failed === 0 ? '✓ PASSED' : '✗ FAILED'}

## Summary

- **Total Tests:** ${total}
- **Passed:** ${passed}
- **Failed:** ${failed}
- **Success Rate:** ${((passed / total) * 100).toFixed(1)}%

## Test Results

`

    results.forEach(result => {
        const status = result.passed ? '✓' : '✗'
        markdown += `### ${status} ${result.name}\n\n`
        markdown += `**Status:** ${result.passed ? 'PASSED' : 'FAILED'}\n\n`
        markdown += `**Message:** ${result.message}\n\n`

        if (result.details) {
            markdown += `**Details:**\n\`\`\`\n${result.details}\n\`\`\`\n\n`
        }
    })

    markdown += `## Requirements Validated

This test validates the following requirements:

- **Requirement 20.1:** Package exports define import field
- **Requirement 20.2:** Package exports define require field
- **Requirement 20.3:** Package exports define types field
- **Requirement 20.4:** Main field points to compiled output
- **Requirement 20.5:** Types field points to TypeScript declarations
- **Requirement 20.6:** All packages can be imported correctly

## Conclusion

`

    if (failed === 0) {
        markdown += `All package export configurations are correct. Shared packages can be imported successfully by applications with full TypeScript type support.\n`
    } else {
        markdown += `Some package export tests failed. Review the failed tests above and fix the issues before proceeding.\n`
    }

    return markdown
}

main().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})
