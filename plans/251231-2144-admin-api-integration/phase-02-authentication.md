# Phase 2: Authentication Implementation

**Priority**: P0
**Time**: 1-2 hours
**Depends**: Phase 1 complete

---

## Task 2.1: Update Auth Service

**File**: `apps/admin/src/services/auth.service.ts`

### Remove
- Mock login logic
- Mock user constant
- `useMockApi` check
- `validateToken` method (API handles)

### Update `login` method

```typescript
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<{
    accessToken: string
    refreshToken: string
    admin: User
  }>('/auth/login', {
    email: credentials.email,
    password: credentials.password
  })

  // Map API response to app AuthResponse
  return {
    token: response.accessToken,
    user: response.admin,
    expiresAt: Date.now() + (credentials.rememberMe ? 2592000000 : 86400000)
  }
}
```

### Update `logout` method

```typescript
async logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } catch (error) {
    // Ignore errors - clear local state anyway
  }
  // Auth store will handle token cleanup
}
```

### Add import

```typescript
import { apiClient } from '@/lib/apiClient'
```

---

## Task 2.2: Update Login Page

**File**: `apps/admin/src/pages/LoginPage.tsx`

### Update login handler

```typescript
const handleLogin = async (values: LoginFormValues) => {
  try {
    setIsLoading(true)
    const response = await authService.login({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe
    })

    // Update auth store with tokens
    login(response.user, response.token, response.refreshToken) // Pass refreshToken

    navigate('/dashboard')
  } catch (error) {
    if (ApiError.isApiError(error)) {
      toast.error(error.message)
    } else {
      toast.error('Login failed')
    }
  } finally {
    setIsLoading(false)
  }
}
```

### Add import

```typescript
import { ApiError } from '@/lib/apiError'
```

---

## Validation

### Test Login Flow
1. Open admin app: http://localhost:5174/login
2. Enter test credentials
3. Click login
4. Verify: localStorage has nail_admin_auth_token, nail_admin_refresh_token
5. Verify: Redirected to /dashboard
6. Verify: authStore.isAuthenticated === true

### Test Token Refresh
1. Manually expire accessToken in localStorage (set invalid value)
2. Make API request
3. Verify: Token auto-refreshed
4. Verify: Request succeeded

### Test Logout
1. Click logout button
2. Verify: Tokens cleared from localStorage
3. Verify: Redirected to /login
4. Verify: authStore.isAuthenticated === false

---

## Completion Criteria

- [ ] auth.service.ts updated (mock removed)
- [ ] Login works with real API
- [ ] Tokens stored correctly
- [ ] Token refresh works on 401
- [ ] Logout clears tokens
- [ ] Error messages displayed
- [ ] No TypeScript errors

---

## Next: Phase 3 - Core Services
