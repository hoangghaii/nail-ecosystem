export type NailShapeItem = {
  _id: string;
  value: string;    // slug, e.g. "almond"
  label: string;    // English, e.g. "Almond"
  labelVi: string;  // Vietnamese, e.g. "Móng Hạnh Nhân"
  isActive: boolean;
  sortIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NailStyleItem = {
  _id: string;
  value: string;    // slug, e.g. "3d"
  label: string;    // English, e.g. "3D Art"
  labelVi: string;  // Vietnamese, e.g. "Vẽ 3D"
  isActive: boolean;
  sortIndex: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateNailOptionDto = {
  value: string;
  label: string;
  labelVi: string;
  isActive?: boolean;
  sortIndex?: number;
};

export type UpdateNailOptionDto = Partial<CreateNailOptionDto>;
