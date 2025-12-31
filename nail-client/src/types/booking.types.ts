export type Booking = {
  customerInfo: CustomerInfo;
  date: Date;
  id?: string;
  notes?: string;
  serviceId: string;
  status: BookingStatus;
  timeSlot: TimeSlot;
};

export type TimeSlot = {
  available: boolean;
  time: string; // "09:00", "10:00", etc.
};

export type CustomerInfo = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export const BookingStatus = {
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  CONFIRMED: "confirmed",
  PENDING: "pending",
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export type BookingStep = {
  completed: boolean;
  id: number;
  title: string;
};

export type AvailableSlots = {
  date: string; // ISO date
  slots: TimeSlot[];
};
