# API App - NestJS Backend

**Path**: `/apps/api`
**Port**: 3000
**Framework**: NestJS 11 + TypeScript 5.7 + Node 25

## Purpose

RESTful backend API serving both client and admin applications with MongoDB persistence, Redis caching, JWT authentication, and Cloudinary storage.

## Entry Point

**src/main.ts**:
```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet({ contentSecurityPolicy: { ... } }));

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',  // client
      'http://localhost:5174',  // admin
    ],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Swagger
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
```

## Module Structure (10 Modules)

```
src/modules/
├── auth/              JWT authentication, admin registration/login
├── banners/           Hero banner CRUD, image/video upload
├── bookings/          Appointment booking, status updates
├── business-info/     Business hours, contact info
├── contacts/          Customer inquiries, status tracking
├── gallery/           Portfolio images, category filtering
├── gallery-category/  Gallery category management
├── hero-settings/     Hero section display configuration
├── services/          Nail service CRUD, category management
└── storage/           Cloudinary integration (image/video upload)
```

## Configuration (src/config/)

| File | Purpose | Variables |
|------|---------|-----------|
| app.config.ts | Port, URLs | PORT, FRONTEND_*_URL |
| database.config.ts | MongoDB | MONGODB_URI, MAX_POOL_SIZE |
| jwt.config.ts | JWT secrets | JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, EXPIRY |
| redis.config.ts | Redis cache | REDIS_HOST, REDIS_PORT, REDIS_PASSWORD |
| cloudinary.config.ts | Storage | CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET |
| rate-limit.config.ts | Throttling | RATE_LIMIT_TTL, RATE_LIMIT_MAX |
| validation.schema.ts | Env validation | Joi schema for all env vars |

## Core Files

**app.module.ts**:
```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ ... }),
    MongooseModule.forRootAsync({ ... }),
    ThrottlerModule.forRootAsync({ ... }),
    AuthModule,
    ServicesModule,
    BookingsModule,
    GalleryModule,
    GalleryCategoryModule,
    BannersModule,
    ContactsModule,
    BusinessInfoModule,
    HeroSettingsModule,
    StorageModule,
  ],
})
export class AppModule {}
```

**app.controller.ts**:
```typescript
@Controller()
export class AppController {
  @Get('/health')
  getHealth() {
    return { status: 'ok', timestamp: new Date() };
  }
}
```

## Authentication Module

**Strategy**: JWT (access + refresh tokens)

**Endpoints**:
- `POST /auth/register` - Admin registration
- `POST /auth/login` - Admin login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (invalidate tokens)

**Guards**:
- JwtAuthGuard - Protects routes
- RolesGuard - Role-based access

**Schemas**:
```typescript
@Schema({ timestamps: true })
export class Admin {
  name: string;
  email: string;  // unique, lowercase
  password: string;  // Argon2 hashed
  role: string;  // 'admin' | 'staff'
  isActive: boolean;
}
```

## Key Modules Detail

### Services Module
**Routes**: GET, POST, PATCH, DELETE `/services[/:id]`
**Features**: Category filtering, active status, sorting, image upload

### Bookings Module
**Routes**: GET, POST, PATCH, DELETE `/bookings[/:id]`
**Features**: Status updates, date/time slots, customer info

### Gallery Module
**Routes**: GET, POST, PATCH, DELETE `/gallery[/:id]`
**Features**: Category filtering, active status, image upload, migration scripts

### Banners Module
**Routes**: GET, POST, PATCH, DELETE `/banners[/:id]`
**Features**: Primary flag, type (image/video), active status, uploads

### Contacts Module
**Routes**: GET, POST, PATCH, DELETE `/contacts[/:id]`
**Features**: Status (new/read/responded/archived), search

### Storage Module
**Routes**: POST `/upload`
**Features**: Cloudinary integration, image/video upload, validation

## Database (MongoDB + Mongoose)

**Connection**: MongoDB Atlas (cloud)
**Pool Size**: Configurable (default 10)

**Schemas** (12 total):
```
schemas/
├── admin.schema.ts
├── banner.schema.ts
├── booking.schema.ts
├── business-info.schema.ts
├── contact.schema.ts
├── gallery.schema.ts
├── gallery-category.schema.ts
├── hero-settings.schema.ts
└── service.schema.ts
```

**Features**:
- Timestamps (createdAt, updatedAt)
- Indexes (unique, text search)
- Virtuals (toJSON transform)
- Pre-save hooks

## Caching (Redis)

**Purpose**: Rate limiting, session storage
**Client**: ioredis
**Storage**: @nest-lab/throttler-storage-redis

**Rate Limiting**:
- TTL: 60s (configurable)
- Max requests: 100/min (configurable)

## Security

### Helmet
- CSP headers
- XSS protection
- Frame options

### CORS
- Whitelisted origins (5173, 5174)
- Credentials enabled

### Authentication
- JWT access tokens (15m expiry)
- JWT refresh tokens (7d expiry)
- Argon2 password hashing

### Validation
- class-validator (DTO validation)
- class-transformer (type transformation)
- Joi (environment validation)

### Rate Limiting
- Global throttler
- Per-route overrides

## File Upload (Cloudinary)

**Configuration**:
```typescript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

**Upload Service**:
- Image validation (JPEG, PNG, WebP, max 5MB)
- Video validation (MP4, WebM, max 50MB)
- Automatic optimization
- Folder organization (banners/, services/, gallery/)

## Scripts

**scripts/**:
```
├── seed-gallery-categories.ts      Seed default categories
└── migrate-gallery-categories.ts   Migrate existing data
```

**Run**:
```bash
npm run seed:categories
npm run migrate:categories
```

## API Documentation (Swagger)

**URL**: http://localhost:3000/api
**Features**:
- Auto-generated from decorators
- Request/response schemas
- Try-it-out functionality

## Environment Variables

**.env**:
```bash
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb+srv://...
MONGODB_MAX_POOL_SIZE=10

# JWT
JWT_ACCESS_SECRET=<64-char-secret>
JWT_REFRESH_SECRET=<64-char-secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Frontend URLs
FRONTEND_CLIENT_URL=http://localhost:5173
FRONTEND_ADMIN_URL=http://localhost:5174

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Rate Limiting
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100
```

## Build Output

**dist/**:
```
dist/
├── main.js              Entry point
├── modules/             Compiled modules
├── config/              Compiled configs
└── *.d.ts              Type declarations
```

**Build Time**: ~4s (nest build)

## Docker Configuration

**Dockerfile**:
```dockerfile
FROM node:25-alpine AS base
# Note: Different Node version than frontends (24.12.0)

FROM dependencies AS development
# npm run start:dev (port 3000)

FROM dependencies AS builder
# npm run build --filter=api

FROM production-deps AS production
# node dist/main.js
```

**Key Difference**: Separate production-deps stage (omit dev dependencies)

## Scripts

```json
{
  "build": "nest build",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "type-check": "tsc --noEmit"
}
```

## Dependencies (Key)

```json
{
  "@nestjs/core": "^11.0.1",
  "@nestjs/mongoose": "^11.0.4",
  "@nestjs/jwt": "^11.0.2",
  "@nestjs/passport": "^11.0.5",
  "@nestjs/throttler": "^6.5.0",
  "mongoose": "^9.0.1",
  "ioredis": "^5.8.2",
  "argon2": "^0.44.0",
  "cloudinary": "^2.5.1",
  "passport-jwt": "^4.0.1",
  "class-validator": "^0.14.3",
  "helmet": "^8.1.0",
  "@repo/types": "*"
}
```

## Type Safety Fixes

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "strictPropertyInitialization": false,  // Added for DTO classes
    "verbatimModuleSyntax": false           // NestJS compatibility
  }
}
```

**Error Handling**:
- Changed `error.message` → `(error as Error).message`
- Changed `error.code` → `(error as any).code`

---

**Status**: Production-ready
**Port**: 3000 (dev & prod)
**Database**: MongoDB Atlas (cloud)
**Cache**: Redis (cloud or local)
**Storage**: Cloudinary (cloud)
