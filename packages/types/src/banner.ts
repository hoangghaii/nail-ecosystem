/**
 * Banner Type
 *
 * Represents hero section banners and carousel images
 */

export type BannerType = 'image' | 'video';

export interface Banner {
  _id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  type: BannerType;
  isPrimary: boolean;
  active: boolean;
  sortIndex: number;
  createdAt: Date;
  updatedAt: Date;
}
