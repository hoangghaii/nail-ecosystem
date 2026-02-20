export const DayOfWeek = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export type DaySchedule = {
  day: DayOfWeek;
  openTime: string; // 24-hour format "HH:MM"
  closeTime: string; // 24-hour format "HH:MM"
  closed: boolean;
};

export type BusinessInfo = {
  _id: string;
  phone: string;
  email: string;
  address: string;
  latitude?: number;   // WGS84 decimal degrees
  longitude?: number;  // WGS84 decimal degrees
  businessHours: DaySchedule[];
  createdAt: string;
  updatedAt: string;
};

export type BusinessInfoResponse = BusinessInfo;
