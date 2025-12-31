import { z } from "zod";

/**
 * Customer information validation schema
 */
export const customerInfoSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Địa chỉ email không hợp lệ"),
  firstName: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái"),
  lastName: z
    .string()
    .min(1, "Họ là bắt buộc")
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ không được vượt quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Họ chỉ được chứa chữ cái"),
  phone: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(
      /^[\d\s()+-]+$/,
      "Số điện thoại không hợp lệ. Chỉ chấp nhận số và các ký tự đặc biệt: (), +, -",
    )
    .length(10, "Số điện thoại phải có 10 ký tự"),
});

/**
 * Complete booking form validation schema
 */
export const bookingFormSchema = z.object({
  customerInfo: customerInfoSchema,
  date: z.date({
    message: "Ngày hẹn là bắt buộc và phải hợp lệ",
  }),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  timeSlot: z.string().min(1, "Vui lòng chọn giờ hẹn"),
});

/**
 * Type inference for customer info form data
 */
export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

/**
 * Type inference for complete booking form data
 */
export type BookingFormData = z.infer<typeof bookingFormSchema>;
