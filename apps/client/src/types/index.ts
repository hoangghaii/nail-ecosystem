// Re-export shared types from monorepo package
export * from "@repo/types/booking";
export * from "@repo/types/gallery";
export * from "@repo/types/gallery-category";
export * from "@repo/types/pagination";
export * from "@repo/types/service";

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
