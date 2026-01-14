import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: ['new', 'read', 'responded', 'archived'],
    default: 'new',
  })
  status: string;

  @Prop()
  adminNotes?: string;

  @Prop({ type: Date })
  respondedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

// Indexes
// Existing indexes
ContactSchema.index({ status: 1, createdAt: -1 }); // Status filter + sort (keep for common use case)
ContactSchema.index({ email: 1 });

// Text search indexes for all searchable fields
ContactSchema.index({ firstName: 1 });
ContactSchema.index({ lastName: 1 });
ContactSchema.index({ subject: 1 });
ContactSchema.index({ phone: 1 });

// Sorting indexes
ContactSchema.index({ createdAt: -1 }); // Standalone createdAt sort
ContactSchema.index({ firstName: 1, lastName: 1 }); // Sort by firstName first
ContactSchema.index({ lastName: 1, firstName: 1 }); // Sort by lastName first
