# Phase 4: Media Upload Migration

**Priority**: P2
**Time**: 1-2 hours
**Depends**: Phase 3 complete

---

## Task 4.1: Update Image Upload Service

**File**: `apps/admin/src/services/imageUpload.service.ts`

### Replace entire file

```typescript
import { apiClient } from "@/lib/apiClient"

export type UploadProgress = {
  progress: number
  url?: string
  error?: string
}

export class ImageUploadService {
  async uploadImage(
    file: File,
    folder: "banners" | "services" | "gallery",
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Note: Basic implementation without progress
    // For progress, need to implement XMLHttpRequest wrapper
    onProgress?.(0)

    const url = await apiClient.upload(file, folder)

    onProgress?.(100)
    return url
  }

  async uploadMultiple(
    files: File[],
    folder: "banners" | "services" | "gallery"
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder))
    return Promise.all(uploadPromises)
  }

  async uploadVideo(
    file: File,
    folder: "banners" | "services" | "gallery",
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Same as uploadImage - API handles both
    return this.uploadImage(file, folder, onProgress)
  }

  // Note: Delete handled via entity deletion (no standalone delete)
}

export const imageUploadService = new ImageUploadService()
```

**Note**: Progress tracking requires XMLHttpRequest. For MVP, progress jumps 0→100.

---

## Optional: Progress Tracking Enhancement

If progress tracking needed, add to apiClient:

```typescript
// In apiClient.ts
async uploadWithProgress(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100
        onProgress?.(progress)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        resolve(response.url)
      } else {
        reject(new ApiError('Upload failed', xhr.status))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new ApiError('Upload failed', 0))
    })

    const token = this.getAuthToken()
    xhr.open('POST', `${this.baseUrl}/storage/upload`)
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    xhr.send(formData)
  })
}
```

---

## Task 4.2: Remove Firebase Dependencies

### Remove file
`apps/admin/src/lib/firebase.ts` - Delete entire file

### Update package.json
```bash
cd apps/admin
npm uninstall firebase
```

### Search for Firebase imports
```bash
grep -r "from.*firebase" apps/admin/src
```

Remove any remaining Firebase imports.

---

## Validation

### Test Image Upload
1. Go to Gallery page
2. Click "Add Gallery Item"
3. Select image file
4. Fill form and submit
5. Verify: Image uploaded to Cloudinary
6. Verify: Gallery item created with Cloudinary URL
7. Check: Network tab shows POST /storage/upload

### Test Multiple Upload
1. Select multiple images
2. Upload
3. Verify: All uploaded successfully
4. Check: Multiple gallery items created

### Test Video Upload (if applicable)
1. Go to Banners page
2. Upload video file
3. Verify: Video uploaded to Cloudinary
4. Verify: Banner created with video URL

### Test Error Handling
1. Upload invalid file type
2. Verify: Error message shown
3. Upload file >10MB
4. Verify: Error message shown (API rejects)

---

## Completion Criteria

- [ ] imageUpload.service.ts updated
- [ ] Firebase dependencies removed
- [ ] Image upload works in Gallery
- [ ] Image upload works in Banners
- [ ] Image upload works in Services
- [ ] Multiple file upload works
- [ ] Error handling works
- [ ] No Firebase imports remain

---

## Next: Phase 5 - Cleanup
