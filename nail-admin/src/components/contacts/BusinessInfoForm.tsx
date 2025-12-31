import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { BusinessInfoFormData } from "@/lib/validations/businessInfo.validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { businessInfoSchema } from "@/lib/validations/businessInfo.validation";
import { businessInfoService } from "@/services/businessInfo.service";
import { useBusinessInfoStore } from "@/store/businessInfoStore";

const dayLabels = {
  friday: "Friday",
  monday: "Monday",
  saturday: "Saturday",
  sunday: "Sunday",
  thursday: "Thursday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
} as const;

export function BusinessInfoForm() {
  const { businessInfo, initializeBusinessInfo } = useBusinessInfoStore();
  const [isEditing, setIsEditing] = useState(false);

  // Initialize business info on mount
  useEffect(() => {
    initializeBusinessInfo();
  }, [initializeBusinessInfo]);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<BusinessInfoFormData>({
    defaultValues: businessInfo
      ? {
          address: businessInfo.address,
          businessHours: businessInfo.businessHours,
          email: businessInfo.email,
          phone: businessInfo.phone,
        }
      : undefined,
    resolver: zodResolver(businessInfoSchema),
  });

  // Reset form when business info changes
  useEffect(() => {
    if (businessInfo) {
      reset({
        address: businessInfo.address,
        businessHours: businessInfo.businessHours,
        email: businessInfo.email,
        phone: businessInfo.phone,
      });
    }
  }, [businessInfo, reset]);

  const onSubmit = async (data: BusinessInfoFormData) => {
    try {
      await businessInfoService.update(data);
      toast.success("Business information updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update business information");
      console.error("Error updating business info:", error);
    }
  };

  const handleCancel = () => {
    if (businessInfo) {
      reset({
        address: businessInfo.address,
        businessHours: businessInfo.businessHours,
        email: businessInfo.email,
        phone: businessInfo.phone,
      });
    }
    setIsEditing(false);
  };

  if (!businessInfo) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        Loading business information...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              disabled={!isEditing}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              disabled={!isEditing}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Business Address *</Label>
          <Input
            id="address"
            type="text"
            placeholder="123 Main St, City, State, ZIP"
            disabled={!isEditing}
            {...register("address")}
          />
          {errors.address && (
            <p className="text-destructive text-sm">{errors.address.message}</p>
          )}
        </div>
      </div>

      {/* Business Hours Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Business Hours</h3>

        <div className="space-y-3">
          {businessInfo.businessHours.map((schedule, index) => {
            // eslint-disable-next-line react-hooks/incompatible-library
            const isClosed = watch(`businessHours.${index}.closed`);

            return (
              <div
                key={schedule.day}
                className="bg-muted/50 flex items-center gap-4 rounded-lg p-4"
              >
                {/* Day Label */}
                <div className="w-28 font-medium">
                  {dayLabels[schedule.day]}
                </div>

                {/* Closed Toggle */}
                <Controller
                  name={`businessHours.${index}.closed`}
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`closed-${schedule.day}`}
                        disabled={!isEditing}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <Label
                        htmlFor={`closed-${schedule.day}`}
                        className="text-muted-foreground text-sm"
                      >
                        Closed
                      </Label>
                    </div>
                  )}
                />

                {/* Time Inputs */}
                {!isClosed && (
                  <>
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`open-${schedule.day}`}
                        className="text-muted-foreground text-sm"
                      >
                        Open:
                      </Label>
                      <Input
                        id={`open-${schedule.day}`}
                        type="time"
                        disabled={!isEditing}
                        className="w-32"
                        {...register(`businessHours.${index}.openTime`)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={`close-${schedule.day}`}
                        className="text-muted-foreground text-sm"
                      >
                        Close:
                      </Label>
                      <Input
                        id={`close-${schedule.day}`}
                        type="time"
                        disabled={!isEditing}
                        className="w-32"
                        {...register(`businessHours.${index}.closeTime`)}
                      />
                    </div>
                  </>
                )}

                {/* Hidden day field */}
                <input
                  type="hidden"
                  {...register(`businessHours.${index}.day`)}
                  value={schedule.day}
                />
              </div>
            );
          })}
        </div>

        {errors.businessHours && (
          <p className="text-destructive text-sm">
            {errors.businessHours.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isEditing ? (
          <Button asChild>
            <input
              type="button"
              onClick={() => setIsEditing(true)}
              value="Edit Information"
            />
          </Button>
        ) : (
          <>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button asChild variant="outline">
              <input
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                value="Cancel"
              />
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
