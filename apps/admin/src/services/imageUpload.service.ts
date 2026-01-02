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

export class ImageUploadService {
  async uploadImage(
    file: File,
    folder: "banners" | "services" | "gallery",
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    // Simulate progress start
    onProgress?.(10);

    try {
      const url = await apiClient.upload(file, folder);

      // Simulate progress completion
      onProgress?.(100);

      return url;
    } catch (error) {
      onProgress?.(0);
      throw error;
    }
  }

  async uploadMultiple(
    files: File[],
    folder: "banners" | "services" | "gallery",
  ): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async uploadVideo(
    file: File,
    folder: "banners" | "services" | "gallery",
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    // Simulate progress start
    onProgress?.(10);

    try {
      const url = await apiClient.upload(file, `${folder}/videos`);

      // Simulate progress completion
      onProgress?.(100);

      return url;
    } catch (error) {
      onProgress?.(0);
      throw error;
    }
  }
}

export const imageUploadService = new ImageUploadService();
