export * from "./booking.types";
export * from "./gallery.types";
export * from "./service.types";

export type BusinessHours = {
  close: string;
  closed?: boolean;
  day: string;
  open: string;
};

export type ContactInfo = {
  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
  email: string;
  phone: string;
};
