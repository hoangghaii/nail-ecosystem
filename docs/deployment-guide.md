# Deployment Guide

**Last Updated**: 2025-12-03
**Version**: 0.1.0
**Project**: Pink Nail Admin Dashboard

## Overview

This guide covers deploying Pink Nail Admin Dashboard from local development to production environments. The application is a static React build deployable to any static hosting service with minimal configuration.

## Prerequisites

### Required

- Node.js >= 18.0.0
- npm (comes with Node.js)
- Firebase project (for image/video storage)
- Git (for version control)

### Recommended

- Firebase CLI (for Firebase Hosting deployment)
- Vercel CLI or Netlify CLI (for respective platforms)

## Environment Configuration

### Development Environment Variables

Create `.env` file in project root:

```bash
# API Mode Toggle
# Set to "true" for localStorage mock data
# Set to "false" for real backend API
VITE_USE_MOCK_API=true

# Firebase Storage Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important Notes**:

- `.env` file is gitignored - never commit to version control
- Firebase config values are safe for client-side (public read, authenticated write)
- Use `.env.example` as template for team members

### Production Environment Variables

For production deployments:

```bash
# Production mode - use real backend API
VITE_USE_MOCK_API=false

# Production Firebase credentials
VITE_FIREBASE_API_KEY=prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=prod_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=prod_project_id
VITE_FIREBASE_STORAGE_BUCKET=prod_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=prod_sender_id
VITE_FIREBASE_APP_ID=prod_app_id
```

**Best Practices**:

- Use separate Firebase projects for dev/staging/production
- Set environment variables in hosting platform dashboard (Vercel, Netlify, etc.)
- Never hardcode credentials in source code
- Rotate Firebase API keys periodically

## Firebase Setup

### 1. Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "nail-admin-dev", "nail-admin-prod")
4. Disable Google Analytics (optional, not needed for this project)
5. Click "Create project"

### 2. Enable Firebase Storage

1. In Firebase Console, navigate to Storage
2. Click "Get started"
3. Choose "Start in production mode" (we'll configure rules next)
4. Select storage location (choose closest to your users)
5. Click "Done"

### 3. Configure Storage Security Rules

1. In Storage tab, click "Rules"
2. Replace default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }

    // Authenticated write access for admin uploads
    match /{folder}/{filename} {
      allow write: if request.auth != null
        && (folder == 'banners' || folder == 'services' || folder == 'gallery')
        && request.resource.size < 50 * 1024 * 1024;  // Max 50MB
    }
  }
}
```

**Explanation**:

- Public read: Images/videos visible to all users
- Authenticated write: Only logged-in admins can upload
- Folder restrictions: Only allow uploads to specific folders
- Size limit: 50MB max file size

3. Click "Publish" to save rules

### 4. Get Firebase Configuration

1. In Project Overview, click gear icon → Project settings
2. Scroll down to "Your apps" section
3. Click web icon (</>) to add web app
4. Register app name (e.g., "Nail Admin Dashboard")
5. Copy configuration values:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

6. Add these to your `.env` file with `VITE_` prefix

### 5. Test Firebase Connection

Run development server and test image upload:

```bash
npm run dev
# Visit http://localhost:5173
# Login with demo credentials
# Go to Banners page
# Click "Create Banner" and try uploading an image
```

Check Firebase Console → Storage to verify file appears in `/banners/` folder.

## Local Development

### Installation

```bash
# Clone repository
git clone <repository-url>
cd nail-admin

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Firebase credentials
```

### Development Server

```bash
# Start Vite dev server (port 5173)
npm run dev
```

Features:

- Hot Module Replacement (HMR)
- Fast Refresh for React
- TypeScript type checking
- Automatic browser open
- Network access for mobile testing

### Type Checking

```bash
# Check TypeScript types (no build)
npx tsc --noEmit
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Pre-commit hook automatically formats on commit (Husky)
git commit -m "feat: add banner CRUD"  # Auto-formats staged files
```

### Build for Production (Local Test)

```bash
# Build static files to dist/
npm run build

# Preview production build locally
npm run preview  # Serves on port 4173
```

## Production Build

### Build Process

```bash
npm run build
```

Output (`dist/` folder):

```
dist/
├── index.html                          # Entry HTML
├── assets/
│   ├── index-[hash].js                 # Minified JS bundle (~200KB gzipped)
│   ├── index-[hash].css                # Extracted CSS (~15KB gzipped)
│   └── react-[hash].svg                # Static assets
└── vite.svg
```

**Build Optimizations**:

- Tree shaking (removes unused code)
- Minification (UglifyJS)
- Code splitting (vendor chunks)
- CSS extraction and minification
- Asset hashing for cache busting
- Source maps (optional, disabled by default)

**Build Stats** (approximate):

- Total bundle size: ~250KB (gzipped)
- Initial load time: <2s on 3G connection
- Lighthouse score: 95+ performance

### Build Verification

Before deployment, verify:

```bash
# 1. Build succeeds without errors
npm run build

# 2. TypeScript compilation passes
npx tsc --noEmit

# 3. Preview build locally
npm run preview

# 4. Test all features in preview
# - Login authentication
# - Banner CRUD operations
# - Image/video uploads
# - All navigation links
```

## Deployment Options

### Option 1: Vercel (Recommended)

**Advantages**:

- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Git integration (auto-deploy on push)
- Environment variable management
- Free tier available

**Steps**:

1. **Install Vercel CLI** (optional, can use web UI):

```bash
npm i -g vercel
```

2. **Deploy via CLI**:

```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

3. **Configure via Web UI**:
   - Visit [vercel.com](https://vercel.com)
   - Import Git repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - Add environment variables in Settings → Environment Variables
   - Click "Deploy"

4. **Environment Variables** (in Vercel dashboard):

```
VITE_USE_MOCK_API = false
VITE_FIREBASE_API_KEY = [production key]
VITE_FIREBASE_AUTH_DOMAIN = [production domain]
VITE_FIREBASE_PROJECT_ID = [production project]
VITE_FIREBASE_STORAGE_BUCKET = [production bucket]
VITE_FIREBASE_MESSAGING_SENDER_ID = [production sender]
VITE_FIREBASE_APP_ID = [production app id]
```

5. **Custom Domain** (optional):
   - In Vercel dashboard → Domains
   - Add custom domain (e.g., admin.pinknail.com)
   - Configure DNS:
     - A record: 76.76.21.21
     - CNAME: cname.vercel-dns.com
   - Wait for SSL certificate provisioning (~5 minutes)

**Automatic Deployments**:

- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

### Option 2: Netlify

**Advantages**:

- Simple drag-and-drop deployment
- Automatic HTTPS
- Global CDN
- Git integration
- Form handling (if needed later)
- Free tier available

**Steps**:

1. **Install Netlify CLI** (optional):

```bash
npm i -g netlify-cli
```

2. **Deploy via CLI**:

```bash
# Login to Netlify
netlify login

# Initialize site
netlify init

# Build and deploy
netlify deploy --prod
```

3. **Configure via Web UI**:
   - Visit [netlify.com](https://netlify.com)
   - New site from Git
   - Connect repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site settings → Environment
   - Click "Deploy site"

4. **Netlify Configuration** (`netlify.toml` in root):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Redirects**: Required for React Router (SPA) to work correctly.

### Option 3: Firebase Hosting

**Advantages**:

- Integrated with Firebase services
- Fast global CDN
- Automatic SSL
- Free tier with generous limits
- Multi-site hosting

**Steps**:

1. **Install Firebase CLI**:

```bash
npm i -g firebase-tools
```

2. **Login and Initialize**:

```bash
# Login
firebase login

# Initialize hosting (in project root)
firebase init hosting

# Select options:
# - Use existing project or create new
# - Public directory: dist
# - Configure as SPA: Yes
# - Set up automatic builds with GitHub: No (optional)
```

3. **Build and Deploy**:

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

4. **Firebase Configuration** (`firebase.json`):

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|svg|png|jpg|jpeg|webp|woff|woff2)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

5. **Custom Domain**:

```bash
firebase hosting:channel:deploy production --expires 30d
# Or connect custom domain in Firebase Console
```

### Option 4: Traditional Server (Nginx)

**Use Case**: Self-hosted or VPS deployment

**Nginx Configuration** (`/etc/nginx/sites-available/nail-admin`):

```nginx
server {
    listen 80;
    server_name admin.pinknail.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.pinknail.com;

    # SSL certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/admin.pinknail.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.pinknail.com/privkey.pem;

    # Root directory
    root /var/www/nail-admin/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Deployment Steps**:

```bash
# 1. Build locally
npm run build

# 2. Upload to server
scp -r dist/* user@server:/var/www/nail-admin/dist/

# 3. Restart Nginx
ssh user@server
sudo systemctl reload nginx
```

**SSL Certificate** (Let's Encrypt):

```bash
sudo certbot --nginx -d admin.pinknail.com
```

## Backend API Integration

### Switching from Mock to Real API

1. **Update Environment Variable**:

```bash
VITE_USE_MOCK_API=false
```

2. **No Code Changes Required**!

The dual-mode service layer automatically switches based on this variable.

### Expected API Endpoints

#### Authentication

```
POST /api/auth/login
Body: { email, password, rememberMe? }
Response: { token, user: { id, email, name, role, avatar? } }

GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: { id, email, name, role, avatar? }

POST /api/auth/logout
Headers: Authorization: Bearer {token}
Response: { success: true }
```

#### Banners

```
GET /api/banners
Response: Banner[]

GET /api/banners/:id
Response: Banner

POST /api/banners
Headers: Authorization: Bearer {token}
Body: Omit<Banner, "id" | "createdAt" | "updatedAt">
Response: Banner

PUT /api/banners/:id
Headers: Authorization: Bearer {token}
Body: Partial<Banner>
Response: Banner

DELETE /api/banners/:id
Headers: Authorization: Bearer {token}
Response: { success: true }

PUT /api/banners/:id/primary
Headers: Authorization: Bearer {token}
Response: { success: true }

PUT /api/banners/:id/toggle-active
Headers: Authorization: Bearer {token}
Response: Banner

PUT /api/banners/:id/reorder
Headers: Authorization: Bearer {token}
Body: { newIndex: number }
Response: { success: true }
```

#### Hero Settings

```
GET /api/hero-settings
Response: HeroSettings

PUT /api/hero-settings
Headers: Authorization: Bearer {token}
Body: Partial<HeroSettings>
Response: HeroSettings
```

### CORS Configuration (Backend)

Allow admin domain to make requests:

```javascript
// Node.js/Express example
app.use(
  cors({
    origin: [
      "https://admin.pinknail.com",
      "http://localhost:5173", // Development
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### Authentication Flow (Real API)

1. User submits login form
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials
4. Backend returns JWT token + user data
5. Frontend stores token in localStorage
6. All subsequent requests include `Authorization: Bearer {token}` header
7. Backend validates token on protected routes

## Post-Deployment Checklist

### Functionality Testing

- [ ] Application loads without errors
- [ ] Login with demo credentials works (`admin@pinknail.com` / `admin123`)
- [ ] All navigation links work
- [ ] Protected routes redirect to login when not authenticated
- [ ] Banner CRUD operations function correctly
  - [ ] Create banner
  - [ ] Edit banner
  - [ ] Delete banner
  - [ ] Set primary banner
  - [ ] Toggle active status
  - [ ] Drag-and-drop reordering
- [ ] Image upload to Firebase Storage works
- [ ] Video upload to Firebase Storage works
- [ ] Hero settings save correctly
- [ ] Toast notifications appear
- [ ] Responsive design on mobile devices
- [ ] Dark mode works (if enabled)

### Performance Testing

- [ ] Lighthouse score >90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Page load time <3s on 3G connection
- [ ] Images load from Firebase CDN
- [ ] No console errors
- [ ] Bundle size <300KB (gzipped)

### Security Testing

- [ ] HTTPS enabled with valid certificate
- [ ] Protected routes require authentication
- [ ] Firebase Storage rules allow read, require auth for write
- [ ] No credentials visible in client-side code
- [ ] Environment variables not exposed in build
- [ ] CSP headers configured (if applicable)
- [ ] XSS protection enabled

### SEO & Metadata

Update `index.html` before deployment:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO Meta Tags -->
    <title>Pink Nail Admin Dashboard</title>
    <meta
      name="description"
      content="Admin dashboard for Pink Nail salon management"
    />
    <meta name="robots" content="noindex, nofollow" />
    <!-- Private admin panel -->

    <!-- Open Graph (Social Sharing) -->
    <meta property="og:title" content="Pink Nail Admin Dashboard" />
    <meta
      property="og:description"
      content="Manage banners, services, bookings, and gallery"
    />
    <meta property="og:type" content="website" />

    <!-- Security Headers (if not set by server) -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://firebasestorage.googleapis.com;"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Monitoring & Maintenance

### Error Tracking

**Recommended**: Integrate Sentry for production error tracking

```bash
npm install @sentry/react
```

`src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "your-sentry-dsn",
    environment: import.meta.env.MODE,
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

### Analytics

**Recommended**: Google Analytics 4 or Plausible Analytics

```html
<!-- Google Analytics (in index.html) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Performance Monitoring

**Firebase Performance Monitoring**:

```bash
npm install firebase/performance
```

`src/lib/firebase.ts`:

```typescript
import { getPerformance } from "firebase/performance";

const perf = getPerformance(app);
```

### Backup Strategy

**Firebase Storage**:

- Enable daily backups in Firebase Console
- Export storage rules periodically
- Document folder structure

**Database** (when using real API):

- Daily automated backups
- Point-in-time recovery
- Backup retention policy (30 days minimum)

### Update Strategy

**Dependencies**:

```bash
# Check for outdated packages
npm outdated

# Update patch versions (safe)
npm update

# Update major versions (test thoroughly)
npm install react@latest react-dom@latest
npm install tailwindcss@latest
npm install firebase@latest
```

**Deployment**:

1. Test locally after updates
2. Deploy to staging environment
3. Run full test suite
4. Deploy to production
5. Monitor error tracking for 24 hours

## Troubleshooting

### Common Issues

**Build Fails with TypeScript Errors**:

```bash
# Run type checker
npx tsc --noEmit

# Fix errors, common causes:
# - Missing `import type` for type-only imports
# - Strict null checks
# - Incompatible library versions
```

**Firebase Upload Fails**:

```bash
# Check Firebase Storage rules
# Verify environment variables are set
# Check file size limits (<50MB)
# Ensure user is authenticated
```

**Blank Page After Deployment**:

```bash
# Common causes:
# 1. SPA routing not configured (add redirects)
# 2. Incorrect base URL in Vite config
# 3. Environment variables not set
# 4. JavaScript errors (check browser console)

# Solutions:
# - Add SPA redirects (see deployment platform sections above)
# - Check vite.config.ts base option
# - Verify environment variables in hosting platform
# - Check browser console for errors
```

**Protected Routes Not Working**:

```bash
# Verify authStore initialization
# Check localStorage for token
# Ensure ProtectedRoute wraps routes correctly
# Debug with React DevTools
```

**Images Not Loading from Firebase**:

```bash
# Check Firebase Storage CORS configuration
# Verify public read rules
# Check browser network tab for errors
# Ensure URLs are complete (not relative paths)
```

### Debug Mode

Enable debug logs:

`src/services/*.service.ts`:

```typescript
const DEBUG = import.meta.env.DEV;

if (DEBUG) {
  console.log("[BannersService] Creating banner:", data);
}
```

## Rollback Procedures

### Vercel/Netlify

- Navigate to Deployments
- Find previous successful deployment
- Click "Promote to Production"

### Firebase Hosting

```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

### Manual Rollback

```bash
# Revert Git commit
git revert <commit-hash>
git push origin main

# Or reset to previous commit
git reset --hard <commit-hash>
git push origin main --force  # Use with caution!
```

## Cost Estimates

### Firebase Storage (Free Tier)

- 5GB storage
- 1GB/day downloads
- Sufficient for small-medium admin panels

### Firebase Storage (Paid - Blaze Plan)

- $0.026/GB/month storage
- $0.12/GB downloads
- Estimated $5-20/month for typical usage

### Vercel (Hobby - Free)

- 100GB bandwidth
- Unlimited websites
- Automatic SSL
- Sufficient for most admin panels

### Netlify (Free Tier)

- 100GB bandwidth
- 300 build minutes
- Automatic SSL
- Sufficient for most admin panels

## Security Best Practices

- Use HTTPS only (never HTTP)
- Set `robots.txt` to disallow crawlers (admin panel)
- Enable Firebase Storage security rules
- Rotate Firebase API keys quarterly
- Use separate Firebase projects for dev/prod
- Never commit `.env` file
- Enable 2FA for hosting platform accounts
- Monitor Firebase usage for anomalies
- Set up alerts for failed login attempts (in backend)
- Implement rate limiting (in backend)

## Support & Resources

### Official Documentation

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vercel Deployment](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)

### Project Documentation

- [README.md](../README.md) - Project overview
- [CLAUDE.md](../CLAUDE.md) - Development guide
- [Code Standards](./code-standards.md) - Coding guidelines
- [System Architecture](./system-architecture.md) - Architecture details

### Community

- GitHub Issues: [repository-url]/issues
- Firebase Community: [firebase.google.com/community](https://firebase.google.com/community)
- React Community: [react.dev/community](https://react.dev/community)

## Conclusion

This deployment guide covers the complete process from local development to production deployment. Follow the appropriate deployment option for your infrastructure, and ensure all post-deployment checks pass before releasing to users.

For questions or issues not covered here, consult the project documentation or open a GitHub issue.
