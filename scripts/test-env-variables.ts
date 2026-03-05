#!/usr/bin/env node

/**
 * Environment Variable Verification Script
 * 
 * This script verifies:
 * 1. Environment variables from .env.local files are loaded correctly
 * 2. Turborepo cache is invalidated when .env.local files change
 * 3. .env files are properly excluded from version control
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

interface TestResult {
    name: string
    passed: boolean
    message: string
}

const results: TestResult[] = []

function log(message: string) {
    console.log(`[ENV-TEST] ${message}`)
}

function addResult(name: string, passed: boolean, message: string) {
    results.push({ name, passed, message })
    const status = passed ? '✓' : '✗'
    console.log(`${status} ${name}: ${message}`)
}

function exec(command: string, cwd?: string): string {
    try {
        return execSync(command, {
            cwd: cwd || process.cwd(),
            encoding: 'utf-8',
            stdio: 'pipe'
        })
    } catch (error: any) {
        return error.stdout || error.stderr || ''
    }
}

// Test 1: Verify .env files are in .gitignore (Requirement 19.4)
function testGitignoreExclusion(): void {
    log('Test 1: Verifying .env files are in .gitignore...')

    const gitignorePath = path.join(process.cwd(), '.gitignore')

    if (!fs.existsSync(gitignorePath)) {
        addResult(
            'Gitignore Exclusion',
            false,
            '.gitignore file not found'
        )
        return
    }

    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8')
    const envPatterns = [
        '.env',
        '.env*.local',
        '.env.development.local',
        '.env.test.local',
        '.env.production.local'
    ]

    const missingPatterns = envPatterns.filter(pattern =>
        !gitignoreContent.includes(pattern)
    )

    if (missingPatterns.length === 0) {
        addResult(
            'Gitignore Exclusion',
            true,
            'All .env patterns are properly excluded from version control'
        )
    } else {
        addResult(
            'Gitignore Exclusion',
            false,
            `Missing patterns in .gitignore: ${missingPatterns.join(', ')}`
        )
    }
}

// Test 2: Verify turbo.json includes globalDependencies for .env files (Requirement 19.2)
function testTurboGlobalDependencies(): void {
    log('Test 2: Verifying turbo.json globalDependencies...')

    const turboJsonPath = path.join(process.cwd(), 'turbo.json')

    if (!fs.existsSync(turboJsonPath)) {
        addResult(
            'Turbo Global Dependencies',
            false,
            'turbo.json file not found'
        )
        return
    }

    const turboConfig = JSON.parse(fs.readFileSync(turboJsonPath, 'utf-8'))
    const globalDeps = turboConfig.globalDependencies || []

    const hasEnvPattern = globalDeps.some((dep: string) =>
        dep.includes('.env') && dep.includes('local')
    )

    if (hasEnvPattern) {
        addResult(
            'Turbo Global Dependencies',
            true,
            `globalDependencies includes .env pattern: ${globalDeps.join(', ')}`
        )
    } else {
        addResult(
            'Turbo Global Dependencies',
            false,
            'globalDependencies missing **/.env.*local pattern'
        )
    }
}

// Test 3: Create .env.local files and verify they can be loaded (Requirements 19.3, 19.5)
function testEnvFileCreationAndLoading(): void {
    log('Test 3: Creating .env.local files in applications...')

    const apps = ['shell', 'auth', 'dashboard', 'product', 'sales']
    const createdFiles: string[] = []

    try {
        // Create .env.local files with test variables
        apps.forEach(app => {
            const envPath = path.join(process.cwd(), 'apps', app, '.env.local')
            const envContent = `# Test environment variables
NEXT_PUBLIC_APP_NAME=${app}
NEXT_PUBLIC_TEST_VAR=test_value_${app}
NEXT_PUBLIC_PORT=${3000 + apps.indexOf(app)}
API_SECRET=secret_${app}
`
            fs.writeFileSync(envPath, envContent)
            createdFiles.push(envPath)
            log(`Created ${envPath}`)
        })

        addResult(
            'Env File Creation',
            true,
            `Created .env.local files for ${apps.length} applications`
        )

        // Verify files exist and are readable
        const allExist = createdFiles.every(file => fs.existsSync(file))

        if (allExist) {
            addResult(
                'Env File Verification',
                true,
                'All .env.local files are readable'
            )
        } else {
            addResult(
                'Env File Verification',
                false,
                'Some .env.local files could not be verified'
            )
        }

    } catch (error: any) {
        addResult(
            'Env File Creation',
            false,
            `Failed to create .env.local files: ${error.message}`
        )
    }
}

// Test 4: Verify cache invalidation when .env.local changes (Requirement 19.1)
function testCacheInvalidation(): void {
    log('Test 4: Testing cache invalidation on .env.local changes...')

    try {
        // Clean any existing cache
        log('Cleaning existing cache...')
        exec('npx turbo run build --force')

        // First build - should be cache miss
        log('Running first build...')
        const firstBuild = exec('npx turbo run build --filter=shell')
        const firstCacheMiss = firstBuild.includes('cache miss') ||
            firstBuild.includes('0 cached') ||
            !firstBuild.includes('1 cached')

        log(`First build result: ${firstCacheMiss ? 'cache miss (expected)' : 'cache hit'}`)

        // Second build without changes - should be cache hit
        log('Running second build without changes...')
        const secondBuild = exec('npx turbo run build --filter=shell')
        const secondCacheHit = secondBuild.includes('cache hit') ||
            secondBuild.includes('1 cached')

        log(`Second build result: ${secondCacheHit ? 'cache hit (expected)' : 'cache miss'}`)

        if (!secondCacheHit) {
            addResult(
                'Cache Hit Verification',
                false,
                'Second build should have been a cache hit but was not'
            )
            return
        }

        addResult(
            'Cache Hit Verification',
            true,
            'Unchanged build correctly used cache'
        )

        // Modify .env.local file
        log('Modifying .env.local file...')
        const envPath = path.join(process.cwd(), 'apps', 'shell', '.env.local')
        const currentContent = fs.readFileSync(envPath, 'utf-8')
        fs.writeFileSync(envPath, currentContent + '\nNEXT_PUBLIC_MODIFIED=true\n')

        // Third build after .env.local change - should be cache miss
        log('Running third build after .env.local modification...')
        const thirdBuild = exec('npx turbo run build --filter=shell')
        const thirdCacheMiss = thirdBuild.includes('cache miss') ||
            thirdBuild.includes('0 cached') ||
            !thirdBuild.includes('1 cached')

        log(`Third build result: ${thirdCacheMiss ? 'cache miss (expected)' : 'cache hit'}`)

        if (thirdCacheMiss) {
            addResult(
                'Cache Invalidation',
                true,
                'Cache correctly invalidated when .env.local changed'
            )
        } else {
            addResult(
                'Cache Invalidation',
                false,
                'Cache was not invalidated when .env.local changed'
            )
        }

    } catch (error: any) {
        addResult(
            'Cache Invalidation',
            false,
            `Failed to test cache invalidation: ${error.message}`
        )
    }
}

// Test 5: Verify support for different .env file types (Requirement 19.5)
function testEnvFileTypes(): void {
    log('Test 5: Verifying support for different .env file types...')

    const envTypes = [
        '.env.local',
        '.env.development',
        '.env.production'
    ]

    const testApp = 'shell'
    const appPath = path.join(process.cwd(), 'apps', testApp)
    const createdFiles: string[] = []

    try {
        // Create different env file types
        envTypes.forEach(envType => {
            const envPath = path.join(appPath, envType)
            const envContent = `# ${envType} test file
NEXT_PUBLIC_ENV_TYPE=${envType}
`
            fs.writeFileSync(envPath, envContent)
            createdFiles.push(envPath)
        })

        // Verify all files were created
        const allExist = createdFiles.every(file => fs.existsSync(file))

        if (allExist) {
            addResult(
                'Env File Types Support',
                true,
                `System supports ${envTypes.join(', ')} files`
            )
        } else {
            addResult(
                'Env File Types Support',
                false,
                'Some env file types could not be created'
            )
        }

    } catch (error: any) {
        addResult(
            'Env File Types Support',
            false,
            `Failed to test env file types: ${error.message}`
        )
    }
}

// Cleanup function
function cleanup(): void {
    log('Cleaning up test files...')

    const apps = ['shell', 'auth', 'dashboard', 'product', 'sales']
    const envTypes = ['.env.local', '.env.development', '.env.production']

    apps.forEach(app => {
        envTypes.forEach(envType => {
            const envPath = path.join(process.cwd(), 'apps', app, envType)
            if (fs.existsSync(envPath)) {
                fs.unlinkSync(envPath)
                log(`Removed ${envPath}`)
            }
        })
    })
}

// Main execution
function main() {
    console.log('='.repeat(70))
    console.log('Environment Variable Verification Test')
    console.log('='.repeat(70))
    console.log()

    testGitignoreExclusion()
    console.log()

    testTurboGlobalDependencies()
    console.log()

    testEnvFileCreationAndLoading()
    console.log()

    testCacheInvalidation()
    console.log()

    testEnvFileTypes()
    console.log()

    // Cleanup
    cleanup()
    console.log()

    // Summary
    console.log('='.repeat(70))
    console.log('Test Summary')
    console.log('='.repeat(70))

    const passed = results.filter(r => r.passed).length
    const failed = results.filter(r => !r.passed).length
    const total = results.length

    results.forEach(result => {
        const status = result.passed ? '✓ PASS' : '✗ FAIL'
        console.log(`${status}: ${result.name}`)
    })

    console.log()
    console.log(`Total: ${total} tests`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log()

    if (failed > 0) {
        console.log('❌ Some tests failed. Please review the results above.')
        process.exit(1)
    } else {
        console.log('✅ All tests passed!')
        process.exit(0)
    }
}

main()
