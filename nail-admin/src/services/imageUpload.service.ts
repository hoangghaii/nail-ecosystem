import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { storage } from "@/lib/firebase";

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
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        },
      );
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
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
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/videos/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        },
      );
    });
  }

  async deleteVideo(videoUrl: string): Promise<void> {
    const videoRef = ref(storage, videoUrl);
    await deleteObject(videoRef);
  }
}

export const imageUploadService = new ImageUploadService();
