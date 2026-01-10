export type GalleryCategoryItem = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  sortIndex: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateGalleryCategoryDto = {
  name: string;
  slug?: string;
  description?: string;
  sortIndex?: number;
  isActive?: boolean;
};

export type UpdateGalleryCategoryDto = Partial<CreateGalleryCategoryDto>;
