/** Shared multipart/form-data schema for gallery image upload endpoints */
export const galleryUploadSchema = {
  type: 'object',
  required: ['image', 'title', 'price', 'duration'],
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'Gallery image (max 10MB, jpg/jpeg/png/webp)',
    },
    title: { type: 'string', example: 'Summer Floral Design' },
    description: { type: 'string', example: 'Beautiful floral nail art design' },
    price: { type: 'string', example: '$45' },
    duration: { type: 'string', example: '60 minutes' },
    featured: { type: 'boolean', example: false },
    isActive: { type: 'boolean', example: true },
    sortIndex: { type: 'number', example: 1 },
    nailShape: { type: 'string', example: 'almond', description: 'Nail shape value' },
    style: { type: 'string', example: '3d', description: 'Nail style value' },
  },
};
