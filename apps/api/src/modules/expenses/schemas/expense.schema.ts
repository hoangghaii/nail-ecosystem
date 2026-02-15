import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true, type: 'Decimal128' })
  amount: Types.Decimal128; // Decimal128 prevents floating-point precision errors

  @Prop({
    required: true,
    type: String,
    enum: ['supplies', 'materials', 'utilities', 'other'],
  })
  category: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String, default: 'USD' })
  currency: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);

// Indexes for query performance
ExpenseSchema.index({ date: -1, category: 1 }); // Date DESC + category filter
ExpenseSchema.index({ date: -1 }); // Date range queries
ExpenseSchema.index({ category: 1, date: -1 }); // Category filter + date sort
