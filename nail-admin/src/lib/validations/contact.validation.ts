import { z } from "zod";

export const contactStatusUpdateSchema = z.object({
  adminNotes: z.string().optional(),
  status: z.enum(["new", "read", "responded", "archived"]),
});

export type ContactStatusUpdate = z.infer<typeof contactStatusUpdateSchema>;
