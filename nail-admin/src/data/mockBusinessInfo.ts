import type { BusinessInfo } from "@/types/businessInfo.types";

export const mockBusinessInfo: BusinessInfo = {
  address: "123 Beauty Avenue, Suite 100, San Francisco, CA 94102",
  businessHours: [
    {
      closed: false,
      closeTime: "19:00",
      day: "monday",
      openTime: "09:00",
    },
    {
      closed: false,
      closeTime: "19:00",
      day: "tuesday",
      openTime: "09:00",
    },
    {
      closed: false,
      closeTime: "19:00",
      day: "wednesday",
      openTime: "09:00",
    },
    {
      closed: false,
      closeTime: "19:00",
      day: "thursday",
      openTime: "09:00",
    },
    {
      closed: false,
      closeTime: "20:00",
      day: "friday",
      openTime: "09:00",
    },
    {
      closed: false,
      closeTime: "20:00",
      day: "saturday",
      openTime: "10:00",
    },
    {
      closed: true,
      closeTime: "17:00",
      day: "sunday",
      openTime: "11:00",
    },
  ],
  email: "contact@pinknailsalon.com",
  id: "business-info-001",
  phone: "+1 (555) 123-4567",
};
