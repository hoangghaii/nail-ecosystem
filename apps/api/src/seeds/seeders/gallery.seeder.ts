import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryCategory } from '../../modules/gallery-category/schemas/gallery-category.schema';
import { Gallery } from '../../modules/gallery/schemas/gallery.schema';
import { NailShape } from '../../modules/nail-options/schemas/nail-shape.schema';
import { NailStyle } from '../../modules/nail-options/schemas/nail-style.schema';
import { galleryCategoriesData } from '../data/gallery-categories.data';
import { galleryItemTitles, galleryImageSizes } from '../data/gallery-items.data';
import { nailShapesSeedData, nailStylesSeedData } from '../data/nail-options.data';

@Injectable()
export class GallerySeeder {
  private readonly logger = new Logger(GallerySeeder.name);

  constructor(
    @InjectModel(GalleryCategory.name)
    private categoryModel: Model<GalleryCategory>,
    @InjectModel(Gallery.name) private galleryModel: Model<Gallery>,
    @InjectModel(NailShape.name) private nailShapeModel: Model<NailShape>,
    @InjectModel(NailStyle.name) private nailStyleModel: Model<NailStyle>,
  ) {}

  async seedNailOptions(): Promise<void> {
    this.logger.log('Seeding nail shapes and styles...');

    const shapesCount = await this.nailShapeModel.countDocuments();
    if (shapesCount === 0) {
      await this.nailShapeModel.insertMany(nailShapesSeedData);
      this.logger.log(`✅ Created ${nailShapesSeedData.length} nail shapes`);
    } else {
      this.logger.log(`ℹ️  Nail shapes already exist (${shapesCount}). Skipping...`);
    }

    const stylesCount = await this.nailStyleModel.countDocuments();
    if (stylesCount === 0) {
      await this.nailStyleModel.insertMany(nailStylesSeedData);
      this.logger.log(`✅ Created ${nailStylesSeedData.length} nail styles`);
    } else {
      this.logger.log(`ℹ️  Nail styles already exist (${stylesCount}). Skipping...`);
    }
  }

  async seedCategories(): Promise<GalleryCategory[]> {
    this.logger.log('Seeding gallery categories...');

    const existingCount = await this.categoryModel.countDocuments();
    if (existingCount > 0) {
      this.logger.log(`ℹ️  Gallery categories already exist (${existingCount}). Skipping...`);
      return await this.categoryModel.find().exec();
    }

    const categories = await this.categoryModel.insertMany(galleryCategoriesData);
    this.logger.log(`✅ Created ${categories.length} gallery categories`);
    return categories;
  }

  async seedGalleryItems(categories: GalleryCategory[]): Promise<Gallery[]> {
    this.logger.log('Seeding gallery items...');

    const shapeValues = nailShapesSeedData.map((s) => s.value);
    const styleValues = nailStylesSeedData.map((s) => s.value);
    const filterSlugs = ['nail-art', 'extensions'];

    const items: Array<{
      title: string;
      description: string;
      imageUrl: string;
      price?: string;
      duration?: string;
      featured: boolean;
      isActive: boolean;
      sortIndex: number;
      nailShape?: string;
      style?: string;
    }> = [];
    let idx = 0;

    for (const category of categories) {
      const titles = galleryItemTitles[category.slug] || [];
      const includeFilters = filterSlugs.includes(category.slug);

      for (let i = 0; i < titles.length; i++) {
        const size = galleryImageSizes[idx % galleryImageSizes.length];
        items.push({
          title: titles[i],
          description: `Beautiful ${category.name.toLowerCase()} design showcasing our expertise and attention to detail`,
          imageUrl: `https://picsum.photos/${size.w}/${size.h}?random=${idx}`,
          price: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 50) + 30}` : undefined,
          duration: Math.random() > 0.5 ? `${Math.floor(Math.random() * 3) + 1} hrs` : undefined,
          featured: Math.random() > 0.7,
          isActive: true,
          sortIndex: idx++,
          nailShape: includeFilters
            ? shapeValues[Math.floor(Math.random() * shapeValues.length)]
            : undefined,
          style: includeFilters
            ? styleValues[Math.floor(Math.random() * styleValues.length)]
            : undefined,
        });
      }
    }

    const gallery = await this.galleryModel.insertMany(items);
    this.logger.log(`✅ Created ${gallery.length} gallery items`);
    return gallery;
  }
}
