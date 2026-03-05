#!/usr/bin/env node

/**
 * Monorepo Structure Validation Script
 * 
 * Validates:
 * - Required directories exist (Requirements 10.1)
 * - All package.json files are valid JSON (Requirements 10.2)
 * - Application ports are unique (Requirements 10.3)
 * - Workspace dependencies are resolvable (Requirements 10.4)
 * 
 * Provides descriptive error messages with resolution steps (Requirements 10.5-10.8)
 */

import * as fs from 'fs'
import * as path from 'path'

interface ValidationError {
    type: 'directory' | 'json' | 'port' | 'dependency'
    message: string
    resolution: string
}

interface ValidationResult {
    success: boolean
    errors: ValidationError[]
}

interface PackageJson {
    name: string
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
    scripts?: Record<string, string>
}

/**
 * Validates the monorepo structure
 * 
 * Preconditions:
 * - rootPath is absolute path to monorepo root
 * - rootPath directory exists and is readable
 * - User has read permissions for all subdirectories
 * 
 * Postconditions:
 * - Returns ValidationResult with success boolean
 * - If successful: result.errors is empty array
 * - If failed: result.errors contains descriptive messages
 * - No modifications to file system
 * - No side effects
 */
export function validateMonorepoStructure(rootPath: string): ValidationResult {
    const errors: ValidationError[] = []

    // Step 1: Check required directories exist (Requirement 10.1)
    const requiredDirs = [
        'apps',
        'packages',
        'infra/docker',
        'infra/k8s'
    ]

    for (const dir of requiredDirs) {
        const dirPath = path.join(rootPath, dir)
        if (!fs.existsSync(dirPath)) {
            errors.push({
                type: 'directory',
                message: `Required directory '${dir}' does not exist`,
                resolution: `Create the directory by running: mkdir -p ${dir}`
            })
        }
    }

    // Step 2: Validate all package.json files are valid JSON (Requirement 10.2)
    const packageJsonPaths = findPackageJsonFiles(rootPath)
    const validPackages: Map<string, PackageJson> = new Map()

    for (const pkgPath of packageJsonPaths) {
        try {
            const content = fs.readFileSync(pkgPath, 'utf-8')
            const parsed = JSON.parse(content) as PackageJson
            validPackages.set(pkgPath, parsed)
        } catch (error) {
            const relativePath = path.relative(rootPath, pkgPath)
            errors.push({
                type: 'json',
                message: `Invalid JSON in ${relativePath}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                resolution: `Fix the JSON syntax in ${relativePath}. Ensure all brackets, quotes, and commas are properly placed.`
            })
        }
    }

    // Step 3: Check port uniqueness across applications (Requirement 10.3, 10.5)
    const portMap = new Map<number, string[]>()
    const appsDir = path.join(rootPath, 'apps')

    if (fs.existsSync(appsDir)) {
        const apps = fs.readdirSync(appsDir).filter(name => {
            const appPath = path.join(appsDir, name)
            return fs.statSync(appPath).isDirectory()
        })

        for (const app of apps) {
            const pkgPath = path.join(appsDir, app, 'package.json')
            const pkg = validPackages.get(pkgPath)

            if (pkg && pkg.scripts) {
                const devScript = pkg.scripts.dev
                if (devScript) {
                    const portMatch = devScript.match(/-p\s+(\d+)/)
                    if (portMatch) {
                        const port = parseInt(portMatch[1], 10)
                        if (!portMap.has(port)) {
                            portMap.set(port, [])
                        }
                        portMap.get(port)!.push(app)
                    }
                }
            }
        }

        // Report port conflicts (Requirement 10.5)
        for (const [port, apps] of portMap.entries()) {
            if (apps.length > 1) {
                errors.push({
                    type: 'port',
                    message: `Port ${port} is used by multiple applications: ${apps.join(', ')}`,
                    resolution: `Assign unique ports to each application. Update the 'dev' script in package.json for: ${apps.join(', ')}. Available ports: 3000-9999.`
                })
            }
        }
    }

    // Step 4: Check workspace dependencies are resolvable (Requirement 10.4, 10.6, 10.7)
    const workspacePackages = new Set<string>()
    const packagesDir = path.join(rootPath, 'packages')

    if (fs.existsSync(packagesDir)) {
        const packages = fs.readdirSync(packagesDir).filter(name => {
            const pkgPath = path.join(packagesDir, name)
            return fs.statSync(pkgPath).isDirectory()
        })

        for (const pkg of packages) {
            const pkgJsonPath = path.join(packagesDir, pkg, 'package.json')
            const pkgJson = validPackages.get(pkgJsonPath)
            if (pkgJson && pkgJson.name) {
                workspacePackages.add(pkgJson.name)
            }
        }
    }

    // Check all workspace dependencies resolve
    for (const [pkgPath, pkg] of validPackages.entries()) {
        const allDeps = {
            ...pkg.dependencies,
            ...pkg.devDependencies
        }

        for (const [depName, depVersion] of Object.entries(allDeps)) {
            // Check if it's a workspace dependency
            if (depVersion.startsWith('workspace:')) {
                if (!workspacePackages.has(depName)) {
                    const relativePath = path.relative(rootPath, pkgPath)
                    const appOrPkg = relativePath.includes('apps/')
                        ? relativePath.split('/')[1]
                        : relativePath.split('/')[1]

                    errors.push({
                        type: 'dependency',
                        message: `Missing workspace package: '${appOrPkg}' references '${depName}' which does not exist`,
                        resolution: `Either create the missing package '${depName}' in the packages/ directory, or remove the dependency from ${relativePath}.`
                    })
                }
            }
        }
    }

    // Check for circular dependencies (Requirement 10.6)
    const dependencyGraph = buildDependencyGraph(validPackages)
    const cycles = findCircularDependencies(dependencyGraph)

    for (const cycle of cycles) {
        errors.push({
            type: 'dependency',
            message: `Circular dependency detected: ${cycle.join(' -> ')} -> ${cycle[0]}`,
            resolution: `Refactor the packages to break the circular dependency. Consider extracting shared code into a new package, or restructure imports to remove the cycle.`
        })
    }

    return {
        success: errors.length === 0,
        errors
    }
}

/**
 * Finds all package.json files in the monorepo
 */
function findPackageJsonFiles(rootPath: string): string[] {
    const packageJsonFiles: string[] = []

    // Add root package.json
    const rootPkg = path.join(rootPath, 'package.json')
    if (fs.existsSync(rootPkg)) {
        packageJsonFiles.push(rootPkg)
    }

    // Add apps package.json files
    const appsDir = path.join(rootPath, 'apps')
    if (fs.existsSync(appsDir)) {
        const apps = fs.readdirSync(appsDir).filter(name => {
            const appPath = path.join(appsDir, name)
            return fs.statSync(appPath).isDirectory()
        })

        for (const app of apps) {
            const pkgPath = path.join(appsDir, app, 'package.json')
            if (fs.existsSync(pkgPath)) {
                packageJsonFiles.push(pkgPath)
            }
        }
    }

    // Add packages package.json files
    const packagesDir = path.join(rootPath, 'packages')
    if (fs.existsSync(packagesDir)) {
        const packages = fs.readdirSync(packagesDir).filter(name => {
            const pkgPath = path.join(packagesDir, name)
            return fs.statSync(pkgPath).isDirectory()
        })

        for (const pkg of packages) {
            const pkgPath = path.join(packagesDir, pkg, 'package.json')
            if (fs.existsSync(pkgPath)) {
                packageJsonFiles.push(pkgPath)
            }
        }
    }

    return packageJsonFiles
}

/**
 * Builds a dependency graph from package.json files
 */
function buildDependencyGraph(
    packages: Map<string, PackageJson>
): Map<string, Set<string>> {
    const graph = new Map<string, Set<string>>()

    for (const [, pkg] of packages.entries()) {
        if (!pkg.name) continue

        const deps = new Set<string>()
        const allDeps = {
            ...pkg.dependencies,
            ...pkg.devDependencies
        }

        for (const [depName, depVersion] of Object.entries(allDeps)) {
            if (depVersion.startsWith('workspace:')) {
                deps.add(depName)
            }
        }

        graph.set(pkg.name, deps)
    }

    return graph
}

/**
 * Finds circular dependencies using depth-first search
 */
function findCircularDependencies(graph: Map<string, Set<string>>): string[][] {
    const cycles: string[][] = []
    const visited = new Set<string>()
    const recursionStack = new Set<string>()
    const path: string[] = []

    function dfs(node: string): void {
        visited.add(node)
        recursionStack.add(node)
        path.push(node)

        const neighbors = graph.get(node) || new Set()
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                dfs(neighbor)
            } else if (recursionStack.has(neighbor)) {
                // Found a cycle
                const cycleStart = path.indexOf(neighbor)
                const cycle = path.slice(cycleStart)
                cycles.push(cycle)
            }
        }

        path.pop()
        recursionStack.delete(node)
    }

    for (const node of graph.keys()) {
        if (!visited.has(node)) {
            dfs(node)
        }
    }

    return cycles
}

/**
 * Main execution function
 */
function main(): void {
    const rootPath = process.cwd()

    console.log('🔍 Validating monorepo structure...\n')

    const result = validateMonorepoStructure(rootPath)

    if (result.success) {
        console.log('✅ Validation passed! Monorepo structure is valid.\n')
        process.exit(0)
    } else {
        console.log('❌ Validation failed! Found the following issues:\n')

        for (const error of result.errors) {
            console.log(`[${error.type.toUpperCase()}] ${error.message}`)
            console.log(`   Resolution: ${error.resolution}\n`)
        }

        process.exit(1)
    }
}

// Run if executed directly
if (require.main === module) {
    main()
}
