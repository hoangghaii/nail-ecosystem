import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type GalleryDocument = HydratedDocument<Gallery>;

@Schema({ timestamps: true })
export class Gallery extends Document {
  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  price?: string; // e.g., "$45", "$60-80"

  @Prop()
  duration?: string; // e.g., "45 min", "1.5 hrs"

  @Prop({ default: false })
  featured?: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  sortIndex: number;

  @Prop({ required: false })
  nailShape?: string; // References NailShape.value

  @Prop({ required: false })
  style?: string; // References NailStyle.value (field kept as 'style' in DB)
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);

GallerySchema.index({ isActive: 1 });
GallerySchema.index({ featured: 1 });
GallerySchema.index({ nailShape: 1 });
GallerySchema.index({ style: 1 });
GallerySchema.index({ sortIndex: 1, createdAt: -1 });
