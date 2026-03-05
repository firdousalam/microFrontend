import fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Property 2: Package Structure Completeness
 * 
 * **Validates: Requirements 3.3, 3.4, 3.5, 3.6**
 * 
 * For any created shared package, it must contain all required elements:
 * - src/ directory (Requirement 3.3)
 * - package.json with proper exports configuration (Requirement 3.4)
 * - tsconfig.json with declaration output enabled (Requirement 3.5)
 * - index.ts file with exports (Requirement 3.6)
 */

describe('Property 2: Package Structure Completeness for @repo/config', () => {
    const packageRoot = path.resolve(__dirname, '..')

    it('should have src/ directory', () => {
        fc.assert(
            fc.property(fc.constant(packageRoot), (pkgPath) => {
                const srcPath = path.join(pkgPath, 'src')
                const exists = fs.existsSync(srcPath)
                const isDirectory = exists && fs.statSync(srcPath).isDirectory()
                return exists && isDirectory
            })
        )
    })

    it('should have package.json with proper exports configuration', () => {
        fc.assert(
            fc.property(fc.constant(packageRoot), (pkgPath) => {
                const packageJsonPath = path.join(pkgPath, 'package.json')

                // Check file exists
                if (!fs.existsSync(packageJsonPath)) {
                    return false
                }

                // Parse and validate structure
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

                // Check exports field exists and has required properties
                const hasExports = packageJson.exports && typeof packageJson.exports === 'object'
                if (!hasExports) {
                    return false
                }

                // Check main export has import, require, and types
                const mainExport = packageJson.exports['.']
                if (!mainExport) {
                    return false
                }

                const hasImport = typeof mainExport.import === 'string'
                const hasRequire = typeof mainExport.require === 'string'
                const hasTypes = typeof mainExport.types === 'string'

                return hasImport && hasRequire && hasTypes
            })
        )
    })

    it('should have tsconfig.json with declaration output enabled', () => {
        fc.assert(
            fc.property(fc.constant(packageRoot), (pkgPath) => {
                const tsconfigPath = path.join(pkgPath, 'tsconfig.json')

                // Check file exists
                if (!fs.existsSync(tsconfigPath)) {
                    return false
                }

                // Parse and validate structure
                const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))

                // Check compilerOptions exists
                if (!tsconfig.compilerOptions) {
                    return false
                }

                // Check declaration and declarationMap are enabled
                const hasDeclaration = tsconfig.compilerOptions.declaration === true
                const hasDeclarationMap = tsconfig.compilerOptions.declarationMap === true

                return hasDeclaration && hasDeclarationMap
            })
        )
    })

    it('should have src/index.ts file', () => {
        fc.assert(
            fc.property(fc.constant(packageRoot), (pkgPath) => {
                const indexPath = path.join(pkgPath, 'src', 'index.ts')
                const exists = fs.existsSync(indexPath)
                const isFile = exists && fs.statSync(indexPath).isFile()
                return exists && isFile
            })
        )
    })

    it('should have all required elements together (completeness property)', () => {
        fc.assert(
            fc.property(fc.constant(packageRoot), (pkgPath) => {
                // Check all required elements exist
                const srcExists = fs.existsSync(path.join(pkgPath, 'src')) &&
                    fs.statSync(path.join(pkgPath, 'src')).isDirectory()

                const packageJsonPath = path.join(pkgPath, 'package.json')
                const packageJsonExists = fs.existsSync(packageJsonPath)
                let hasProperExports = false
                if (packageJsonExists) {
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
                    const mainExport = packageJson.exports?.['.']
                    hasProperExports = !!(
                        mainExport?.import &&
                        mainExport?.require &&
                        mainExport?.types
                    )
                }

                const tsconfigPath = path.join(pkgPath, 'tsconfig.json')
                const tsconfigExists = fs.existsSync(tsconfigPath)
                let hasDeclarationOutput = false
                if (tsconfigExists) {
                    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
                    hasDeclarationOutput = !!(
                        tsconfig.compilerOptions?.declaration === true &&
                        tsconfig.compilerOptions?.declarationMap === true
                    )
                }

                const indexExists = fs.existsSync(path.join(pkgPath, 'src', 'index.ts')) &&
                    fs.statSync(path.join(pkgPath, 'src', 'index.ts')).isFile()

                // All elements must exist for the property to hold
                return srcExists && packageJsonExists && hasProperExports &&
                    tsconfigExists && hasDeclarationOutput && indexExists
            })
        )
    })
})
