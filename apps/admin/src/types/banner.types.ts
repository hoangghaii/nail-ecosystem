export type BannerType = "image" | "video";

export type Banner = {
  _id: string;
  active: boolean;
  createdAt: Date;
  imageUrl: string;
  isPrimary: boolean;
  sortIndex: number;
  title: string;
  type: BannerType;
  updatedAt: Date;
  videoUrl?: string;
};
