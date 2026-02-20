import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type NailShapeDocument = HydratedDocument<NailShape>;

@Schema({ timestamps: true, collection: 'nail_shapes' })
export class NailShape extends Document {
  @Prop({ required: true, unique: true })
  value: string; // URL-safe slug, e.g. "almond"

  @Prop({ required: true })
  label: string; // English label, e.g. "Almond"

  @Prop({ required: true })
  labelVi: string; // Vietnamese label, e.g. "Móng Hạnh Nhân"

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortIndex: number;
}

export const NailShapeSchema = SchemaFactory.createForClass(NailShape);
NailShapeSchema.index({ value: 1 }, { unique: true });
NailShapeSchema.index({ isActive: 1, sortIndex: 1 });
