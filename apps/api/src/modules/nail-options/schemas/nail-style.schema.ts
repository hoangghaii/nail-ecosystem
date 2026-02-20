import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type NailStyleDocument = HydratedDocument<NailStyle>;

@Schema({ timestamps: true, collection: 'nail_styles' })
export class NailStyle extends Document {
  @Prop({ required: true, unique: true })
  value: string; // URL-safe slug, e.g. "3d"

  @Prop({ required: true })
  label: string; // English label, e.g. "3D Art"

  @Prop({ required: true })
  labelVi: string; // Vietnamese label, e.g. "Vẽ 3D"

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortIndex: number;
}

export const NailStyleSchema = SchemaFactory.createForClass(NailStyle);
NailStyleSchema.index({ value: 1 }, { unique: true });
NailStyleSchema.index({ isActive: 1, sortIndex: 1 });
