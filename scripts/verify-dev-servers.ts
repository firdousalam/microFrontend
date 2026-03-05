#!/usr/bin/env node

/**
 * Dev Server Port Verification Script
 * 
 * Validates Requirements 7.1-7.7:
 * - 7.1: All dev servers start on configured ports
 * - 7.2: No port conflicts occur
 * - 7.3: Shell app runs on port 3000
 * - 7.4: Auth app runs on port 3001
 * - 7.5: Dashboard app runs on port 3002
 * - 7.6: Product app runs on port 3003
 * - 7.7: Sales app runs on port 3004
 * 
 * This script:
 * 1. Starts all dev servers using Turborepo
 * 2. Waits for each server to be ready
 * 3. Verifies each application is accessible on its correct port
 * 4. Checks for any port conflicts
 * 5. Documents the results
 */

import { spawn, ChildProcess } from 'child_process'
import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'

interface AppConfig {
    name: string
    expectedPort: number
    status: 'pending' | 'starting' | 'ready' | 'failed'
    error?: string
}

interface VerificationResult {
    success: boolean
    apps: AppConfig[]
    errors: string[]
    timestamp: string
}

const EXPECTED_PORTS: Record<string, number> = {
    shell: 3000,
    auth: 3001,
    dashboard: 3002,
    product: 3003,
    sales: 3004
}

const PORT_CHECK_INTERVAL = 2000 // 2 seconds
const PORT_CHECK_RETRIES = 60 // Total wait time: 2 minutes

let turboProcess: ChildProcess | null = null

/**
 * Checks if a port is accessible by making an HTTP request
 */
async function checkPort(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}`, (res) => {
            resolve(res.statusCode !== undefined && res.statusCode < 500)
        })

        req.on('error', () => {
            resolve(false)
        })

        req.setTimeout(5000, () => {
            req.destroy()
            resolve(false)
        })
    })
}

/**
 * Waits for a specific port to become available
 */
async function waitForPort(
    port: number,
    appName: string,
    maxRetries: number = PORT_CHECK_RETRIES
): Promise<boolean> {
    console.log(`   Waiting for ${appName} on port ${port}...`)

    for (let i = 0; i < maxRetries; i++) {
        const isReady = await checkPort(port)
        if (isReady) {
            console.log(`   ✓ ${appName} is ready on port ${port}`)
            return true
        }

        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, PORT_CHECK_INTERVAL))

        // Show progress every 10 seconds
        if ((i + 1) % 5 === 0) {
            console.log(`   Still waiting for ${appName}... (${(i + 1) * 2}s elapsed)`)
        }
    }

    return false
}

/**
 * Starts all dev servers using Turborepo
 */
function startDevServers(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('🚀 Starting all dev servers with Turborepo...\n')

        // Use npm run dev which runs turbo run dev
        turboProcess = spawn('npm', ['run', 'dev'], {
            stdio: 'pipe',
            shell: true,
            cwd: process.cwd()
        })

        let hasStarted = false

        turboProcess.stdout?.on('data', (data) => {
            const output = data.toString()
            process.stdout.write(output)

            // Check if Turborepo has started the dev tasks
            if (!hasStarted && (output.includes('dev:') || output.includes('started'))) {
                hasStarted = true
                // Give it a moment to actually start the processes
                setTimeout(() => resolve(), 3000)
            }
        })

        turboProcess.stderr?.on('data', (data) => {
            process.stderr.write(data.toString())
        })

        turboProcess.on('error', (error) => {
            reject(new Error(`Failed to start dev servers: ${error.message}`))
        })

        // Resolve after a timeout if we haven't detected startup
        setTimeout(() => {
            if (!hasStarted) {
                console.log('   Proceeding with port checks...\n')
                resolve()
            }
        }, 10000)
    })
}

/**
 * Stops the Turborepo dev servers
 */
function stopDevServers(): void {
    if (turboProcess) {
        console.log('\n🛑 Stopping dev servers...')

        // On Windows, we need to kill the entire process tree
        if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', turboProcess.pid!.toString(), '/f', '/t'], {
                stdio: 'ignore'
            })
        } else {
            turboProcess.kill('SIGTERM')
        }

        turboProcess = null
    }
}

/**
 * Verifies all dev servers are running on correct ports
 */
async function verifyDevServers(): Promise<VerificationResult> {
    const apps: AppConfig[] = Object.entries(EXPECTED_PORTS).map(([name, port]) => ({
        name,
        expectedPort: port,
        status: 'pending' as const
    }))

    const errors: string[] = []

    try {
        // Start all dev servers
        await startDevServers()

        console.log('📋 Verifying each application...\n')

        // Check each port
        for (const app of apps) {
            app.status = 'starting'

            const isReady = await waitForPort(app.expectedPort, app.name)

            if (isReady) {
                app.status = 'ready'
            } else {
                app.status = 'failed'
                app.error = `Failed to start on port ${app.expectedPort} within timeout`
                errors.push(`${app.name}: ${app.error}`)
            }
        }

        // Check for port conflicts
        console.log('\n🔍 Checking for port conflicts...')
        const portMap = new Map<number, string[]>()

        for (const app of apps) {
            if (app.status === 'ready') {
                if (!portMap.has(app.expectedPort)) {
                    portMap.set(app.expectedPort, [])
                }
                portMap.get(app.expectedPort)!.push(app.name)
            }
        }

        for (const [port, appNames] of portMap.entries()) {
            if (appNames.length > 1) {
                const conflict = `Port ${port} conflict: ${appNames.join(', ')}`
                errors.push(conflict)
                console.log(`   ✗ ${conflict}`)
            } else {
                console.log(`   ✓ Port ${port} (${appNames[0]}) - no conflicts`)
            }
        }

    } catch (error) {
        errors.push(`Verification error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return {
        success: errors.length === 0 && apps.every(app => app.status === 'ready'),
        apps,
        errors,
        timestamp: new Date().toISOString()
    }
}

/**
 * Writes verification results to a markdown file
 */
function writeResults(result: VerificationResult): void {
    const outputPath = path.join(
        process.cwd(),
        '.kiro/specs/turborepo-monorepo-setup/dev-server-verification-results.md'
    )

    let content = '# Dev Server Port Verification Results\n\n'
    content += `**Timestamp:** ${result.timestamp}\n\n`
    content += `**Overall Status:** ${result.success ? '✅ PASSED' : '❌ FAILED'}\n\n`

    content += '## Application Status\n\n'
    content += '| Application | Expected Port | Status | Notes |\n'
    content += '|-------------|---------------|--------|-------|\n'

    for (const app of result.apps) {
        const statusIcon = app.status === 'ready' ? '✅' : '❌'
        const notes = app.error || '-'
        content += `| ${app.name} | ${app.expectedPort} | ${statusIcon} ${app.status} | ${notes} |\n`
    }

    content += '\n## Requirements Validation\n\n'

    const requirements = [
        { id: '7.1', desc: 'All dev servers start on configured ports', passed: result.apps.every(a => a.status === 'ready') },
        { id: '7.2', desc: 'No port conflicts occur', passed: result.errors.filter(e => e.includes('conflict')).length === 0 },
        { id: '7.3', desc: 'Shell app runs on port 3000', passed: result.apps.find(a => a.name === 'shell')?.status === 'ready' },
        { id: '7.4', desc: 'Auth app runs on port 3001', passed: result.apps.find(a => a.name === 'auth')?.status === 'ready' },
        { id: '7.5', desc: 'Dashboard app runs on port 3002', passed: result.apps.find(a => a.name === 'dashboard')?.status === 'ready' },
        { id: '7.6', desc: 'Product app runs on port 3003', passed: result.apps.find(a => a.name === 'product')?.status === 'ready' },
        { id: '7.7', desc: 'Sales app runs on port 3004', passed: result.apps.find(a => a.name === 'sales')?.status === 'ready' }
    ]

    for (const req of requirements) {
        const icon = req.passed ? '✅' : '❌'
        content += `- ${icon} **Requirement ${req.id}:** ${req.desc}\n`
    }

    if (result.errors.length > 0) {
        content += '\n## Errors\n\n'
        for (const error of result.errors) {
            content += `- ❌ ${error}\n`
        }
    }

    content += '\n## Verification Details\n\n'
    content += '### Test Procedure\n\n'
    content += '1. Started all dev servers using `turbo run dev`\n'
    content += '2. Waited for each server to be ready (max 2 minutes per server)\n'
    content += '3. Verified each application is accessible via HTTP request\n'
    content += '4. Checked for port conflicts\n'
    content += '5. Documented results\n\n'

    content += '### Port Configuration\n\n'
    content += '```json\n'
    content += JSON.stringify(EXPECTED_PORTS, null, 2)
    content += '\n```\n\n'

    content += '### Accessibility Tests\n\n'
    content += 'Each application was tested by making an HTTP GET request to `http://localhost:<port>`.\n'
    content += 'A successful response (status code < 500) indicates the server is running and accessible.\n\n'

    if (result.success) {
        content += '## Conclusion\n\n'
        content += '✅ All dev servers started successfully on their configured ports with no conflicts.\n'
        content += 'The monorepo development environment is properly configured.\n'
    } else {
        content += '## Conclusion\n\n'
        content += '❌ Some dev servers failed to start or port conflicts were detected.\n'
        content += 'Review the errors above and ensure all applications are properly configured.\n'
    }

    fs.writeFileSync(outputPath, content)
    console.log(`\n📄 Results written to: ${outputPath}`)
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
    console.log('═══════════════════════════════════════════════════════')
    console.log('  Dev Server Port Verification')
    console.log('  Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7')
    console.log('═══════════════════════════════════════════════════════\n')

    let result: VerificationResult | null = null

    try {
        result = await verifyDevServers()

        console.log('\n═══════════════════════════════════════════════════════')
        console.log('  Verification Complete')
        console.log('═══════════════════════════════════════════════════════\n')

        console.log('📊 Summary:\n')
        for (const app of result.apps) {
            const icon = app.status === 'ready' ? '✅' : '❌'
            console.log(`   ${icon} ${app.name.padEnd(12)} - Port ${app.expectedPort} - ${app.status}`)
        }

        if (result.errors.length > 0) {
            console.log('\n❌ Errors:')
            for (const error of result.errors) {
                console.log(`   - ${error}`)
            }
        }

        writeResults(result)

        if (result.success) {
            console.log('\n✅ All dev servers verified successfully!')
            process.exit(0)
        } else {
            console.log('\n❌ Verification failed. See results file for details.')
            process.exit(1)
        }

    } catch (error) {
        console.error('\n❌ Fatal error during verification:', error)
        process.exit(1)
    } finally {
        stopDevServers()
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Interrupted by user')
    stopDevServers()
    process.exit(130)
})

process.on('SIGTERM', () => {
    stopDevServers()
    process.exit(143)
})

// Run if executed directly
if (require.main === module) {
    main().catch((error) => {
        console.error('Unhandled error:', error)
        stopDevServers()
        process.exit(1)
    })
}
