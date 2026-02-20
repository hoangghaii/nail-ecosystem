export type GalleryItem = {
  _id: string;
  createdAt?: Date;
  description?: string;
  duration?: string;    // e.g., "45 min", "1.5 hrs"
  featured?: boolean;
  imageUrl: string;
  nailShape?: string;   // References NailShapeItem.value
  price?: string;       // e.g., "$45", "$60-80"
  style?: string;       // References NailStyleItem.value (DB field name)
  title: string;
};
