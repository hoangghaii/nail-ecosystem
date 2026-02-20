import { DayOfWeek } from "@repo/types/business-info";
import { z } from "zod";

// Time format validation (HH:MM in 24-hour format)
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Liberal phone validation - accepts multiple formats
const phoneRegex = /^((\+|)84|0)(3|5|7|8|9)\d{8}$/;

const dayScheduleSchema = z
  .object({
    closed: z.boolean(),
    closeTime: z.string().regex(timeRegex, "Invalid time format (use HH:MM)"),
    day: z.nativeEnum(DayOfWeek),
    openTime: z.string().regex(timeRegex, "Invalid time format (use HH:MM)"),
  })
  .refine(
    (data) => {
      // Skip validation if closed
      if (data.closed) return true;
      // Validate openTime < closeTime
      return data.openTime < data.closeTime;
    },
    {
      message: "Opening time must be before closing time",
      path: ["openTime"],
    },
  );

export const businessInfoSchema = z.object({
  address: z.string().min(1, "Address is required"),
  businessHours: z.array(dayScheduleSchema).length(7, "Must have 7 days"),
  email: z.string().email("Invalid email address"),
  latitude: z.preprocess(
    (v) => (typeof v === "number" && isNaN(v) ? undefined : v),
    z.number().min(-90).max(90).optional(),
  ),
  longitude: z.preprocess(
    (v) => (typeof v === "number" && isNaN(v) ? undefined : v),
    z.number().min(-180).max(180).optional(),
  ),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Invalid phone number format"),
});

// z.preprocess infers output as `unknown` — define the type explicitly
export type BusinessInfoFormData = {
  address: string;
  businessHours: z.infer<typeof dayScheduleSchema>[];
  email: string;
  latitude?: number;
  longitude?: number;
  phone: string;
};
