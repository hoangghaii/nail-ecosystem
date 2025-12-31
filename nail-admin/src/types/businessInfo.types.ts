export type DaySchedule = {
  closed: boolean;
  closeTime: string; // Format: "HH:MM" (24-hour)
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  openTime: string; // Format: "HH:MM" (24-hour)
};

export type BusinessInfo = {
  address: string;
  businessHours: DaySchedule[];
  email: string;
  id: string;
  phone: string;
};
