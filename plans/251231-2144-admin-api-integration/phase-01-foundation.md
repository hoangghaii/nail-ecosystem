# Phase 1: Foundation - API Client Infrastructure

**Priority**: P0 (Critical Path)
**Estimated Time**: 2-3 hours
**Dependencies**: None

---

## Overview

Create core HTTP client infrastructure with JWT auth, error handling, and TypeScript type safety.

---

## Tasks

### Task 1.1: Create API Error Class

**File**: `apps/admin/src/lib/apiError.ts`

```typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: string[]
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static async fromResponse(response: Response): Promise<ApiError> {
    let body: any
    try {
      body = await response.json()
    } catch {
      body = { message: response.statusText }
    }

    const message = Array.isArray(body.message)
      ? body.message[0]
      : body.message || 'Request failed'

    const errors = Array.isArray(body.message) ? body.message : undefined

    return new ApiError(message, response.status, errors)
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError
  }
}
```

**Why**: Standardized error handling across all API calls.

---

### Task 1.2: Create API Client

**File**: `apps/admin/src/lib/apiClient.ts`

```typescript
import { ApiError } from './apiError'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

class ApiClient {
  private baseUrl: string
  private refreshPromise: Promise<void> | null = null

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  private async refreshAccessToken(): Promise<void> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new ApiError('No refresh token available', 401)
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
        throw new ApiError('Session expired', 401)
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
    })()

    try {
      await this.refreshPromise
    } finally {
      this.refreshPromise = null
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getAuthToken()

    const headers: HeadersInit = {
      ...(options.headers || {})
    }

    // Add auth token if available and not already set
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Handle JSON body
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const config: RequestInit = {
      ...options,
      headers,
      body: options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined
    }

    let response = await fetch(url, config)

    // Handle 401 - try token refresh once
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      await this.refreshAccessToken()

      // Retry with new token
      const newToken = this.getAuthToken()
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        config.headers = headers
        response = await fetch(url, config)
      }
    }

    // Handle non-2xx responses
    if (!response.ok) {
      throw await ApiError.fromResponse(response)
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body })
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body })
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async upload(file: File, folder: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await this.post<{ url: string }>('/storage/upload', formData)
    return response.url
  }
}

export const apiClient = new ApiClient()
```

**Features**:
- Auto JWT injection
- Token refresh on 401
- Error standardization
- File upload support
- TypeScript generics

---

### Task 1.3: Update Auth Store for Refresh Token

**File**: `apps/admin/src/store/authStore.ts`

**Changes**:
1. Add `refreshToken: string | null` to state
2. Update `login` to accept and store refreshToken
3. Update `logout` to clear refreshToken
4. Update `initializeAuth` to load refreshToken

```typescript
type AuthState = {
  user: User | null
  token: string | null
  refreshToken: string | null // ADD
  isAuthenticated: boolean
  login: (user: User, token: string, refreshToken: string) => void // UPDATE
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null, // ADD
  isAuthenticated: false,

  login: (user, token, refreshToken) => { // UPDATE
    storage.set('auth_token', token)
    storage.set('refresh_token', refreshToken) // ADD
    storage.set('auth_user', user)
    set({ user, token, refreshToken, isAuthenticated: true }) // UPDATE
  },

  logout: () => {
    storage.remove('auth_token')
    storage.remove('refresh_token') // ADD
    storage.remove('auth_user')
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false }) // UPDATE
  },

  initializeAuth: () => {
    const token = storage.get<string | null>('auth_token', null)
    const refreshToken = storage.get<string | null>('refresh_token', null) // ADD
    const user = storage.get<User | null>('auth_user', null)

    if (token && refreshToken && user) { // UPDATE
      set({ user, token, refreshToken, isAuthenticated: true }) // UPDATE
    }
  }
}))
```

---

## Validation

### Unit Tests (Manual)

```typescript
// Test API Error
const error = new ApiError('Test error', 400, ['Field required'])
console.assert(error.message === 'Test error')
console.assert(error.statusCode === 400)
console.assert(error.errors?.length === 1)

// Test API Client - GET
await apiClient.get('/health') // Should return { status: 'ok' }

// Test API Client - Error
try {
  await apiClient.get('/invalid-endpoint')
} catch (error) {
  console.assert(ApiError.isApiError(error))
  console.assert(error.statusCode === 404)
}
```

### Integration Test

1. Start API backend
2. Test health endpoint: `apiClient.get('/health')`
3. Verify response: `{ status: 'ok', timestamp: '...' }`
4. Test 404: `apiClient.get('/nonexistent')`
5. Verify ApiError thrown with statusCode 404

---

## Completion Criteria

- [ ] apiError.ts created and exports ApiError class
- [ ] apiClient.ts created and exports singleton
- [ ] authStore.ts updated with refreshToken
- [ ] TypeScript compiles without errors
- [ ] Manual tests pass
- [ ] Health check endpoint works

---

## Next Phase

Proceed to **Phase 2: Authentication** once foundation is complete and validated.
