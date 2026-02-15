/**
 * Contact Type
 *
 * Represents a customer contact inquiry/message
 */

export type ContactStatus = 'new' | 'read' | 'responded' | 'archived';

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Contact form data (for client submission)
 * Omits server-managed fields
 */
export type ContactFormData = Omit<
  Contact,
  '_id' | 'status' | 'adminNotes' | 'respondedAt' | 'createdAt' | 'updatedAt'
>;
