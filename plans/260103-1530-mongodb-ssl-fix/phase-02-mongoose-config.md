# Phase 2: Mongoose TLS Configuration Enhancement

**Priority:** HIGH
**Effort:** 15 minutes
**Status:** ⏳ Pending

---

## Overview

Add explicit TLS configuration, connection retry logic, and enhanced error handling to ensure robust MongoDB connectivity.

---

## Changes Required

### 1. Database Configuration (`apps/api/src/config/database.config.ts`)
### 2. App Module (`apps/api/src/app.module.ts`)

---

## File 1: Database Configuration

**File:** `apps/api/src/config/database.config.ts`

**Current Code (6 lines):**
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),
}));
```

**New Code (25 lines):**
```typescript
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI,
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10', 10),

  // Explicit TLS configuration for MongoDB Atlas
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,

  // Connection retry configuration
  retryWrites: true,
  retryReads: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,

  // Connection pool settings
  minPoolSize: 2,
  maxIdleTimeMS: 60000,

  // Heartbeat settings
  heartbeatFrequencyMS: 10000,
}));
```

**Rationale:**
- **tls: true** - Explicitly enable TLS (MongoDB Atlas requires this)
- **tlsAllowInvalidCertificates: false** - Security: reject invalid certs
- **tlsAllowInvalidHostnames: false** - Security: validate hostnames
- **retryWrites/Reads: true** - Auto-retry transient failures
- **serverSelectionTimeoutMS** - Fail fast if MongoDB unavailable
- **connectTimeoutMS** - Timeout for initial connection
- **socketTimeoutMS** - Timeout for ongoing operations
- **minPoolSize** - Maintain minimum connections for performance
- **heartbeatFrequencyMS** - Detect connection issues faster

---

## File 2: App Module Connection Configuration

**File:** `apps/api/src/app.module.ts`

**Current Code (Lines 51-57):**
```typescript
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('database.uri'),
    maxPoolSize: configService.get<number>('database.maxPoolSize'),
  }),
}),
```

**New Code:**
```typescript
MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const dbConfig = {
      uri: configService.get<string>('database.uri'),
      maxPoolSize: configService.get<number>('database.maxPoolSize'),
      minPoolSize: configService.get<number>('database.minPoolSize'),

      // TLS/SSL configuration
      tls: configService.get<boolean>('database.tls'),
      tlsAllowInvalidCertificates: configService.get<boolean>(
        'database.tlsAllowInvalidCertificates',
      ),
      tlsAllowInvalidHostnames: configService.get<boolean>(
        'database.tlsAllowInvalidHostnames',
      ),

      // Retry configuration
      retryWrites: configService.get<boolean>('database.retryWrites'),
      retryReads: configService.get<boolean>('database.retryReads'),
      serverSelectionTimeoutMS: configService.get<number>(
        'database.serverSelectionTimeoutMS',
      ),
      connectTimeoutMS: configService.get<number>('database.connectTimeoutMS'),
      socketTimeoutMS: configService.get<number>('database.socketTimeoutMS'),

      // Heartbeat configuration
      heartbeatFrequencyMS: configService.get<number>(
        'database.heartbeatFrequencyMS',
      ),
      maxIdleTimeMS: configService.get<number>('database.maxIdleTimeMS'),

      // Connection event handlers
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('✅ MongoDB connected successfully');
        });

        connection.on('error', (error) => {
          console.error('❌ MongoDB connection error:', error.message);
        });

        connection.on('disconnected', () => {
          console.warn('⚠️  MongoDB disconnected');
        });

        connection.on('reconnected', () => {
          console.log('🔄 MongoDB reconnected');
        });

        return connection;
      },
    };

    // Log connection attempt (without credentials)
    const sanitizedUri = dbConfig.uri?.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      'mongodb+srv://***:***@',
    );
    console.log(`🔌 Connecting to MongoDB: ${sanitizedUri}`);

    return dbConfig;
  },
}),
```

**Rationale:**
- Pass all TLS config from database.config.ts
- Add connection event handlers for visibility
- Log connection lifecycle events
- Sanitize URI in logs (hide credentials)
- Return connection for Mongoose to use

---

## Implementation Steps

### Step 1: Update Database Config

1. Open `/Users/hainguyen/Documents/nail-project/apps/api/src/config/database.config.ts`
2. Replace entire file content with new code above
3. Save file

### Step 2: Update App Module

1. Open `/Users/hainguyen/Documents/nail-project/apps/api/src/app.module.ts`
2. Locate `MongooseModule.forRootAsync` block (lines 51-57)
3. Replace with new code above
4. Save file

### Step 3: Verify Changes

```bash
# Type-check
cd /Users/hainguyen/Documents/nail-project
npx turbo type-check --filter=api

# Build
npx turbo build --filter=api
```

---

## Environment Variables

**No new env vars required.** All config uses sensible defaults.

**Optional:** Add to `apps/api/.env` for custom timeouts:
```env
# Optional: Override connection timeouts (defaults shown)
# MONGODB_SERVER_SELECTION_TIMEOUT=10000
# MONGODB_CONNECT_TIMEOUT=10000
# MONGODB_SOCKET_TIMEOUT=45000
```

---

## Testing Checklist

- [ ] `database.config.ts` updated with TLS config
- [ ] `app.module.ts` updated with event handlers
- [ ] Type-check passes (`npx turbo type-check --filter=api`)
- [ ] Build succeeds (`npx turbo build --filter=api`)
- [ ] No TypeScript errors

---

## Success Criteria

✅ Database config exports TLS settings
✅ App module uses all TLS settings
✅ Connection event handlers in place
✅ Type-check passes
✅ Build succeeds

---

## Next Steps

After successful verification:
- Proceed to [Phase 3: Testing](./phase-03-testing.md)
