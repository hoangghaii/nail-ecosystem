export type BannerType = "image" | "video";

export type Banner = {
  active: boolean;
  createdAt: Date;
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortIndex: number;
  title: string;
  type: BannerType;
  updatedAt: Date;
  videoUrl?: string;
};
