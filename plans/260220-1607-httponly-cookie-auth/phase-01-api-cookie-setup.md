# Phase 01 — API: HttpOnly Cookie Setup

## Context Links

- Parent plan: [plan.md](./plan.md)
- Controller: `apps/api/src/modules/auth/auth.controller.ts`
- Service: `apps/api/src/modules/auth/auth.service.ts`
- Strategies: `apps/api/src/modules/auth/strategies/`
- Entry point: `apps/api/src/main.ts`

## Overview

- **Date**: 2026-02-20
- **Priority**: High (must complete before Phase 02)
- **Status**: ✅ Complete

The API currently returns `accessToken` and `refreshToken` in JSON body. Strategies extract tokens from `Authorization: Bearer` header. This phase moves token transport to HttpOnly cookies.

## Key Insights

- `cookie-parser` is NOT installed — must add to API deps
- CORS already has `credentials: true` + specific origins in `main.ts` ✅
- `RefreshTokenStrategy.validate()` extracts raw token from header to pass to `authService.refreshTokens()` for argon2 verification — must now read from `req.cookies` instead
- `AccessTokenStrategy` reads from `Authorization` header — must read from cookie
- `auth.service.ts` returns `{ admin, accessToken, refreshToken }` — after migration controller handles cookie-setting, service can return `{ admin }` only (or still return tokens internally for the controller to set)
- `rememberMe` affects JWT expiry (1d vs 30d) → cookie `maxAge` must match
- Cookie name: `nail_admin_access_token` and `nail_admin_refresh_token` (consistent with existing prefix)

## Requirements

1. Install `cookie-parser` + `@types/cookie-parser`
2. Enable `cookieParser()` middleware in `main.ts`
3. `login` endpoint: set two HttpOnly cookies + return `{ admin }` (no tokens in body)
4. `refresh` endpoint: set two new HttpOnly cookies + return `{ message: 'ok' }` or just 200
5. `logout` endpoint: clear both cookies
6. `AccessTokenStrategy`: extract JWT from `nail_admin_access_token` cookie
7. `RefreshTokenStrategy`: extract JWT from `nail_admin_refresh_token` cookie; pass raw token via `req.cookies` for argon2 verify

## Cookie Attributes

```
HttpOnly
Secure (only on https)
SameSite=Strict
Path=/
maxAge = JWT expiry in seconds (1d = 86400, 30d = 2592000)
```

## Implementation Steps

### Step 1 — Install cookie-parser

```bash
pnpm add cookie-parser --filter api
pnpm add -D @types/cookie-parser --filter api
```

### Step 2 — Enable cookie-parser in main.ts

```typescript
import cookieParser from 'cookie-parser';
// After app creation:
app.use(cookieParser());
```

### Step 3 — Update AccessTokenStrategy

Change `jwtFromRequest` to read from cookie instead of Authorization header:

```typescript
import { Request } from 'express';

super({
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => req?.cookies?.nail_admin_access_token ?? null,
  ]),
  secretOrKey: secret,
  ignoreExpiration: false,
});
```

### Step 4 — Update RefreshTokenStrategy

Change to extract from cookie; pass raw token for argon2 verification:

```typescript
super({
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: Request) => req?.cookies?.nail_admin_refresh_token ?? null,
  ]),
  secretOrKey: secret,
  passReqToCallback: true,
  ignoreExpiration: false,
});

validate(req: Request, payload: { sub: string; email: string }) {
  const refreshToken = req.cookies?.nail_admin_refresh_token;
  if (!refreshToken) {
    throw new UnauthorizedException('Refresh token missing');
  }
  return { ...payload, refreshToken };
}
```

### Step 5 — Add cookie helper to AuthController

Inject `Response` from express. Add private helper method:

```typescript
import { Response } from 'express';
import { Res } from '@nestjs/common';

private setCookies(res: Response, accessToken: string, refreshToken: string, rememberMe = false): void {
  const isProd = process.env.NODE_ENV === 'production';
  const accessMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // ms
  const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // ms

  const baseOpts = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict' as const,
    path: '/',
  };

  res.cookie('nail_admin_access_token', accessToken, { ...baseOpts, maxAge: accessMaxAge });
  res.cookie('nail_admin_refresh_token', refreshToken, { ...baseOpts, maxAge: refreshMaxAge });
}

private clearCookies(res: Response): void {
  const isProd = process.env.NODE_ENV === 'production';
  const baseOpts = { httpOnly: true, secure: isProd, sameSite: 'strict' as const, path: '/' };
  res.clearCookie('nail_admin_access_token', baseOpts);
  res.clearCookie('nail_admin_refresh_token', baseOpts);
}
```

### Step 6 — Update login endpoint

```typescript
@Post('login')
@HttpCode(HttpStatus.OK)
login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  return this.authService.login(dto).then((result) => {
    this.setCookies(res, result.accessToken, result.refreshToken, dto.rememberMe);
    return { admin: result.admin };
  });
}
```

> Note: `@Res({ passthrough: true })` lets NestJS still handle the response pipeline while giving access to res for cookie-setting.

### Step 7 — Update refresh endpoint

```typescript
@Post('refresh')
@HttpCode(HttpStatus.OK)
async refresh(
  @CurrentUser('sub') adminId: string,
  @CurrentUser('refreshToken') refreshToken: string,
  @Res({ passthrough: true }) res: Response,
) {
  const tokens = await this.authService.refreshTokens(adminId, refreshToken);
  this.setCookies(res, tokens.accessToken, tokens.refreshToken);
  return { message: 'Tokens refreshed' };
}
```

### Step 8 — Update logout endpoint

```typescript
@Post('logout')
@HttpCode(HttpStatus.OK)
async logout(
  @CurrentUser('id') adminId: string,
  @Res({ passthrough: true }) res: Response,
) {
  await this.authService.logout(adminId);
  this.clearCookies(res);
  return { message: 'Logged out successfully' };
}
```

## Todo

- [x] `pnpm add cookie-parser @types/cookie-parser --filter api`
- [x] `main.ts`: import and enable `cookieParser()`
- [x] `access-token.strategy.ts`: read from `nail_admin_access_token` cookie
- [x] `refresh-token.strategy.ts`: read from `nail_admin_refresh_token` cookie
- [x] `auth.controller.ts`: inject `Response`, add `setCookies`/`clearCookies` helpers, update `login`/`refresh`/`logout`

## Success Criteria

- POST /auth/login response has `Set-Cookie` headers with HttpOnly cookies (no tokens in body)
- POST /auth/refresh rotates both cookies without client sending Authorization header
- POST /auth/logout clears both cookies
- Protected endpoints accept access token from cookie (no Authorization header needed)
- TypeScript compiles with 0 errors

## Risk Assessment

Medium. Changing token transport mechanism affects all API authentication. Must ensure:
- Swagger UI still works (may need to switch from Bearer to cookie auth in Swagger — acceptable trade-off)
- No other clients (e.g. client site) rely on bearer-token auth to admin API (they don't)

## Security Considerations

- `HttpOnly`: JS cannot read token → XSS cannot steal tokens ✅
- `SameSite=Strict`: CSRF blocked for cross-site requests ✅
- `Secure`: only sent over HTTPS in production ✅
- `Path=/`: cookie sent with all API requests ✅
- Token rotation on refresh still in place (argon2 verify + new tokens) ✅

## Next Steps

Proceed to [Phase 02 — Admin Frontend Simplification](./phase-02-admin-frontend.md).
