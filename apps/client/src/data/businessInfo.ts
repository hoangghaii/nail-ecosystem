import type { BusinessHours, ContactInfo } from "@/types";

export const businessHours: BusinessHours[] = [
  { close: "07:00 PM", day: "Monday", open: "09:00 AM" },
  { close: "07:00 PM", day: "Tuesday", open: "09:00 AM" },
  { close: "07:00 PM", day: "Wednesday", open: "09:00 AM" },
  { close: "08:00 PM", day: "Thursday", open: "09:00 AM" },
  { close: "08:00 PM", day: "Friday", open: "09:00 AM" },
  { close: "06:00 PM", day: "Saturday", open: "10:00 AM" },
  { close: "", closed: true, day: "Sunday", open: "" },
];

export const contactInfo: ContactInfo = {
  address: {
    city: "San Francisco",
    state: "CA",
    street: "123 Beauty Lane",
    zip: "94102",
  },
  email: "hello@pinknail.com",
  phone: "(555) 123-4567",
};

export const availableTimeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

// Generate some unavailable slots for realism
export const getAvailableSlots = () => {
  const unavailableSlots = ["10:30", "14:00", "15:30", "17:00"]; // Mock unavailable times

  return availableTimeSlots.map((time) => ({
    available: !unavailableSlots.includes(time),
    time,
  }));
};
