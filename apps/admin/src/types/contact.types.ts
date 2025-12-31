export type Contact = {
  adminNotes?: string;
  createdAt: Date;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  message: string;
  phone?: string;
  respondedAt?: Date;
  status: ContactStatus;
  subject: string;
};

export const ContactStatus = {
  ARCHIVED: "archived",
  NEW: "new",
  READ: "read",
  RESPONDED: "responded",
} as const;

export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];
