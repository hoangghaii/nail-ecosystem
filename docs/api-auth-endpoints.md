# API Endpoints — Authentication

**Base URL**: `http://localhost:3000` (dev) | `/api` (prod)

---

## Register
```
POST /auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}

Response: 201 Created
{
  "accessToken": "jwt_token",
  "refreshToken": "nail_admin_refresh_token"
}
```

## Login
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "accessToken": "jwt_token",
  "refreshToken": "nail_admin_refresh_token"
}
```

## Refresh Token
```
POST /auth/refresh
Content-Type: application/json

Body:
{
  "refreshToken": "nail_admin_refresh_token"
}

Response: 200 OK
{
  "accessToken": "new_jwt_token"
}
```

## Logout
```
POST /auth/logout
Authorization: Bearer {accessToken}

Response: 200 OK
```
