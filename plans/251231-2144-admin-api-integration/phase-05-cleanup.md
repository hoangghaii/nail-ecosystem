# Phase 5: Cleanup & Final Testing

**Priority**: P3
**Time**: 1-2 hours
**Depends**: Phases 1-4 complete

---

## Task 5.1: Remove Mock Infrastructure

### Delete mock data files
```bash
cd apps/admin/src/data
rm -f mockContacts.ts
# Delete any other mock*.ts files found
```

### Update Zustand stores

Remove mock-related actions from:
- `store/bannersStore.ts`
- `store/bookingsStore.ts`
- `store/businessInfoStore.ts`
- `store/contactsStore.ts`
- `store/galleryStore.ts`
- `store/heroSettingsStore.ts`

**Keep**: UI state management (loading, filters, sorting)
**Remove**: Mock data mutation methods (addBanner, updateBooking, etc.)

Example cleanup for `galleryStore.ts`:
```typescript
// REMOVE these actions
addGalleryItem: (item) => {...}
updateGalleryItem: (id, data) => {...}
deleteGalleryItem: (id) => {...}
toggleFeatured: (id) => {...}

// KEEP these actions
setGalleryItems: (items) => set({ items })
setLoading: (loading) => set({ loading })
setFilter: (filter) => set({ filter })
```

---

## Task 5.2: Environment Configuration

### Update .env.example
```bash
# apps/admin/.env.example

# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# REMOVE: VITE_USE_MOCK_API (no longer used)
```

### Update .env files
```bash
# Development
cp apps/admin/.env.example apps/admin/.env

# Production (.env.production)
VITE_API_BASE_URL=/api
```

---

## Task 5.3: Documentation Updates

### Update README.md

Add section on API integration:
```markdown
## API Integration

Admin dashboard connects to NestJS backend API.

### Prerequisites
- API backend running on port 3000
- MongoDB connected
- Redis connected
- Test admin user created

### Environment Setup
```bash
# Copy environment template
cp apps/admin/.env.example apps/admin/.env

# Update API URL if needed (defaults to localhost:3000)
nano apps/admin/.env
```

### Creating Test Admin
```bash
# Using API endpoint
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pinknail.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Troubleshooting

**Login fails with network error**
- Verify API is running: `curl http://localhost:3000/health`
- Check CORS configuration
- Verify VITE_API_BASE_URL in .env

**Token expired errors**
- Check token refresh logic
- Verify refresh token in localStorage
- Clear localStorage and re-login

**CRUD operations fail**
- Check auth token in request headers
- Verify admin permissions
- Check API logs for errors
```

---

## Task 5.4: Final Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (shows error)
- [ ] Token auto-refresh works
- [ ] Logout clears tokens
- [ ] Page refresh maintains session
- [ ] Token expiry logs out user

### Services Module
- [ ] List all services
- [ ] Create new service
- [ ] Update service
- [ ] Delete service
- [ ] Toggle featured
- [ ] Filter by category

### Gallery Module
- [ ] List all items
- [ ] Create gallery item with image upload
- [ ] Update gallery item
- [ ] Delete gallery item
- [ ] Toggle featured
- [ ] Filter by category
- [ ] Bulk operations

### Bookings Module
- [ ] List all bookings
- [ ] View booking details
- [ ] Update booking status
- [ ] Filter by status
- [ ] Filter by date

### Banners Module
- [ ] List all banners
- [ ] Create banner with image/video upload
- [ ] Update banner
- [ ] Delete banner
- [ ] Toggle active
- [ ] Set primary
- [ ] Reorder banners

### Contacts Module
- [ ] List all contacts
- [ ] View contact details
- [ ] Update status
- [ ] Add admin notes
- [ ] Filter by status

### Business Info
- [ ] View current info
- [ ] Update business info

### Hero Settings
- [ ] View current settings
- [ ] Update settings
- [ ] Reset to defaults

### Error Handling
- [ ] 400 errors show validation messages
- [ ] 401 errors trigger token refresh
- [ ] 404 errors handled gracefully
- [ ] 500 errors show generic message
- [ ] Network errors show offline message
- [ ] Rate limiting (429) shows retry message

### Performance
- [ ] Initial load < 2s
- [ ] API responses < 500ms
- [ ] No memory leaks (check DevTools)
- [ ] Bundle size reduced (check build output)

---

## Task 5.5: Build Verification

```bash
# Type check
cd apps/admin
npm run type-check

# Build
npm run build

# Check bundle size
ls -lh dist/assets/*.js

# Verify no Firebase in bundle
grep -r "firebase" dist/ || echo "✓ Firebase removed"
```

---

## Completion Criteria

- [ ] All mock code removed
- [ ] Environment files updated
- [ ] Documentation updated
- [ ] All test checklist items pass
- [ ] TypeScript compiles without errors
- [ ] Production build succeeds
- [ ] Bundle size reduced by ~150KB
- [ ] No console errors in production mode

---

## Final Validation

1. Fresh clone repository
2. Follow setup instructions from README
3. Verify entire flow works
4. Check for any remaining TODOs or console.logs
5. Review git diff for unintended changes

---

## Success Criteria Met

✅ All admin pages load real data from API
✅ Authentication flow complete
✅ CRUD operations work on all modules
✅ Image uploads via Cloudinary
✅ Error handling graceful
✅ Zero TypeScript errors
✅ Zero breaking changes to UI
✅ Bundle size reduced
✅ Production-ready

---

## Project Complete

Admin API integration finished. Proceed to deployment or next feature.
