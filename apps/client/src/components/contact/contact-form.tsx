import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useContactMutation } from "@/hooks/api/useContacts";

// Validation schema
const contactFormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Vui lòng nhập chủ đề"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  // Form setup
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  // Mutation setup
  const { isError, isPending, isSuccess, mutate } = useContactMutation();

  // Form submission handler
  const onSubmit = (data: ContactFormValues) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="rounded-[24px] border border-border bg-card p-8">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
        Gửi Tin Nhắn Cho Chúng Tôi
      </h2>

      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 rounded-[12px] border border-border bg-background p-4">
          <p className="font-sans text-base text-foreground">
            ✓ Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.
          </p>
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="mb-6 rounded-[12px] border border-destructive/50 bg-destructive/10 p-4">
          <p className="font-sans text-sm text-destructive">
            Không thể gửi tin nhắn. Vui lòng thử lại.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block font-sans text-sm font-medium text-foreground mb-2"
          >
            Tên <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            placeholder="Nguyễn"
          />
          {errors.firstName && (
            <p className="mt-1 font-sans text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="block font-sans text-sm font-medium text-foreground mb-2"
          >
            Họ <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            placeholder="Văn A"
          />
          {errors.lastName && (
            <p className="mt-1 font-sans text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-sans text-sm font-medium text-foreground mb-2"
          >
            Địa Chỉ Email <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            placeholder="email@example.com"
          />
          {errors.email && (
            <p className="mt-1 font-sans text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block font-sans text-sm font-medium text-foreground mb-2"
          >
            Số Điện Thoại
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            placeholder="0123 456 789"
          />
          {errors.phone && (
            <p className="mt-1 font-sans text-sm text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block font-sans text-sm font-medium text-foreground mb-2"
          >
            Chủ Đề <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="subject"
            {...register("subject")}
            className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
            placeholder="Câu hỏi về dịch vụ"
          />
          {errors.subject && (
            <p className="mt-1 font-sans text-sm text-destructive">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block font-sans text-sm font-medium text-foreground mb-2"
          >
            Tin Nhắn <span className="text-destructive">*</span>
          </label>
          <textarea
            id="message"
            {...register("message")}
            rows={5}
            className="w-full rounded-[12px] border border-input bg-background px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all resize-none"
            placeholder="Chúng tôi có thể giúp gì cho bạn?"
          />
          {errors.message && (
            <p className="mt-1 font-sans text-sm text-destructive">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Đang gửi..." : "Gửi Tin Nhắn"}
        </Button>
      </form>
    </div>
  );
}
