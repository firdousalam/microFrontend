export interface User {
    id: string
    email: string
    name: string
    role: string
}

export interface AuthResult {
    success: boolean
    user?: User
    token?: string
    error?: string
}
