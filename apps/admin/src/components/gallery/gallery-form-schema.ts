import { z } from "zod";

export const gallerySchema = z.object({
  description: z.string().max(500).optional(),
  duration: z.string().max(20).optional(),
  featured: z.boolean(),
  nailShape: z.string().optional(),
  nailStyle: z.string().optional(),
  price: z.string().max(20).optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
});

export type GalleryFormData = z.infer<typeof gallerySchema>;

export const galleryFormDefaults: GalleryFormData = {
  description: "",
  duration: "",
  featured: false,
  nailShape: "",
  nailStyle: "",
  price: "",
  title: "",
};
