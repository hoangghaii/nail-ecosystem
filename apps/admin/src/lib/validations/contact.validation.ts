import { z } from "zod";

export const contactStatusUpdateSchema = z.object({
  adminNotes: z.string().optional(),
  status: z.enum(["new", "read", "responded", "archived"]),
});

export type ContactStatusUpdate = z.infer<typeof contactStatusUpdateSchema>;

export const contactNotesUpdateSchema = z.object({
  adminNotes: z.string().min(1, "Admin notes cannot be empty"),
});

export type ContactNotesUpdate = z.infer<typeof contactNotesUpdateSchema>;
