/**
 * Image Upload Service
 *
 * Handles file uploads to Cloudinary via API
 */

import { apiClient } from "@/lib/apiClient";

export type UploadProgress = {
  error?: string;
  progress: number;
  url?: string;
};

export type UploadFolder = "banners" | "services" | "gallery";

// Metadata types for each upload type
export type BannerUploadMetadata = {
  active?: boolean;
  isPrimary?: boolean;
  sortIndex?: number;
  title: string;
  type: "image" | "video";
};

export type GalleryUploadMetadata = {
  category?: string;
  categoryId?: string;
  description?: string;
  duration: string;
  featured?: boolean;
  isActive?: boolean;
  price: string;
  sortIndex?: number;
  title: string;
};

export type ServiceUploadMetadata = {
  category: string;
  description: string;
  duration: number;
  featured?: boolean;
  isActive?: boolean;
  name: string;
  price: number;
  sortIndex?: number;
};

export type UploadMetadata =
  | BannerUploadMetadata
  | GalleryUploadMetadata
  | ServiceUploadMetadata;

export class ImageUploadService {
  /**
   * Upload image file to the appropriate endpoint
   * @param file - Image file to upload
   * @param folder - Destination folder (banners/services/gallery)
   * @param metadata - Additional metadata required by the endpoint
   * @param onProgress - Progress callback (optional)
   */
  async uploadImage(
    file: File,
    folder: UploadFolder,
    metadata?: UploadMetadata,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    // Simulate progress start
    onProgress?.(10);

    try {
      const formData = new FormData();

      // Determine endpoint based on folder
      let endpoint: string;
      let fileFieldName: string;

      switch (folder) {
        case "banners":
          endpoint = "/banners/upload/image";
          fileFieldName = "image";
          break;
        case "gallery":
          endpoint = "/gallery/upload";
          fileFieldName = "image";
          break;
        case "services":
          endpoint = "/services/upload";
          fileFieldName = "image";
          break;
        default:
          throw new Error(`Unsupported folder: ${folder}`);
      }

      // Append file with the correct field name
      formData.append(fileFieldName, file);

      // Append metadata fields if provided
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      }

      // Make upload request
      const response = await apiClient.post<{ imageUrl: string }>(
        endpoint,
        formData,
      );

      // Simulate progress completion
      onProgress?.(100);

      return response.imageUrl;
    } catch (error) {
      onProgress?.(0);
      throw error;
    }
  }

  /**
   * Upload multiple images (Note: Each file needs its own metadata)
   * For bulk upload, consider using batch upload endpoints if available
   */
  async uploadMultiple(
    files: File[],
    folder: UploadFolder,
    metadataArray?: UploadMetadata[],
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const metadata = metadataArray?.[index];
      return this.uploadImage(file, folder, metadata);
    });
    return Promise.all(uploadPromises);
  }

  /**
   * Upload video file to the appropriate endpoint
   * @param file - Video file to upload
   * @param folder - Destination folder (currently only banners support video)
   * @param metadata - Additional metadata required by the endpoint
   * @param onProgress - Progress callback (optional)
   */
  async uploadVideo(
    file: File,
    folder: UploadFolder,
    metadata?: UploadMetadata,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    // Simulate progress start
    onProgress?.(10);

    try {
      const formData = new FormData();

      // Determine endpoint based on folder
      let endpoint: string;
      let fileFieldName: string;

      switch (folder) {
        case "banners":
          endpoint = "/banners/upload/video";
          fileFieldName = "video";
          break;
        case "gallery":
          // Gallery doesn't support video yet, fallback to image endpoint
          throw new Error(
            "Video upload not supported for gallery. Use image upload instead.",
          );
        case "services":
          // Services doesn't support video yet
          throw new Error(
            "Video upload not supported for services. Use image upload instead.",
          );
        default:
          throw new Error(`Unsupported folder: ${folder}`);
      }

      // Append file with the correct field name
      formData.append(fileFieldName, file);

      // Append metadata fields if provided
      if (metadata) {
        Object.entries(metadata).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });
      }

      // Make upload request
      const response = await apiClient.post<{
        imageUrl?: string;
        videoUrl?: string;
      }>(endpoint, formData);

      // Simulate progress completion
      onProgress?.(100);

      // Return videoUrl if available, otherwise imageUrl
      return response.videoUrl || response.imageUrl || "";
    } catch (error) {
      onProgress?.(0);
      throw error;
    }
  }
}

export const imageUploadService = new ImageUploadService();
