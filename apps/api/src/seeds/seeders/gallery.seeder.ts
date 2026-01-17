import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GalleryCategory } from '../../modules/gallery-category/schemas/gallery-category.schema';
import { Gallery } from '../../modules/gallery/schemas/gallery.schema';
import { galleryCategoriesData } from '../data/gallery-categories.data';

@Injectable()
export class GallerySeeder {
  private readonly logger = new Logger(GallerySeeder.name);

  constructor(
    @InjectModel(GalleryCategory.name)
    private categoryModel: Model<GalleryCategory>,
    @InjectModel(Gallery.name) private galleryModel: Model<Gallery>,
  ) {}

  async seedCategories(): Promise<GalleryCategory[]> {
    this.logger.log('Seeding gallery categories...');

    // Check if categories already exist
    const existingCount = await this.categoryModel.countDocuments();
    if (existingCount > 0) {
      this.logger.log(
        `ℹ️  Gallery categories already exist (${existingCount} found). Skipping...`,
      );
      return await this.categoryModel.find().exec();
    }

    const categories = await this.categoryModel.insertMany(
      galleryCategoriesData,
    );
    this.logger.log(`✅ Created ${categories.length} gallery categories`);
    return categories;
  }

  async seedGalleryItems(categories: GalleryCategory[]): Promise<Gallery[]> {
    this.logger.log('Seeding gallery items...');

    const titles: Record<string, string[]> = {
      manicure: [
        'Classic French Tips',
        'Gel Polish Shine',
        'Natural Nude Elegance',
        'Red Glamour Nails',
        'Pastel Pink Perfection',
        'Matte Black Chic',
        'Glitter Accent Nails',
        'Minimalist Line Art',
      ],
      pedicure: [
        'Summer Coral Toes',
        'Spa Luxury Pedicure',
        'French Pedicure Classic',
        'Tropical Beach Vibes',
        'Burgundy Wine Elegance',
        'Glitter Toe Sparkle',
        'Natural Nude Pedicure',
        'Hot Stone Treatment',
      ],
      'nail-art': [
        'Floral Garden Design',
        'Geometric Patterns',
        'Abstract Art Nails',
        'Butterfly Wings',
        'Galaxy Star Effect',
        'Marble Swirl Design',
        'Animal Print Chic',
        'Watercolor Blend',
        'Chrome Mirror Finish',
        'Rainbow Ombre',
      ],
      extensions: [
        'Stiletto Acrylic Set',
        'Coffin Shape Extensions',
        'Almond Natural Look',
        'Square Tip Perfection',
        'Dip Powder Strength',
        'Long Gel Extensions',
        'Short Rounded Acrylics',
      ],
      'special-occasions': [
        'Bridal White Elegance',
        'Anniversary Romance',
        'Birthday Celebration',
        'Prom Night Glam',
        'Holiday Party Sparkle',
      ],
      seasonal: [
        'Spring Blossom',
        'Summer Sunshine',
        'Autumn Leaves',
        'Winter Wonderland',
        'Christmas Festive',
        'Valentine Hearts',
      ],
    };

    const items: Array<{
      title: string;
      description: string;
      imageUrl: string;
      categoryId: any;
      price?: string;
      duration?: string;
      featured: boolean;
      isActive: boolean;
      sortIndex: number;
    }> = [];
    let globalSortIndex = 0;

    for (const category of categories) {
      const categoryTitles = titles[category.slug] || [];
      const itemCount = categoryTitles.length;

      for (let i = 0; i < itemCount; i++) {
        const isFeatured = Math.random() > 0.7; // 30% featured
        items.push({
          title: categoryTitles[i],
          description: `Beautiful ${category.name.toLowerCase()} design showcasing our expertise and attention to detail`,
          imageUrl: `https://picsum.photos/800/600?random=${globalSortIndex}`,
          categoryId: category._id,
          price:
            Math.random() > 0.5
              ? `$${Math.floor(Math.random() * 50) + 30}`
              : undefined,
          duration:
            Math.random() > 0.5
              ? `${Math.floor(Math.random() * 3) + 1} hrs`
              : undefined,
          featured: isFeatured,
          isActive: true,
          sortIndex: globalSortIndex++,
        });
      }
    }

    const gallery = await this.galleryModel.insertMany(items);
    this.logger.log(`✅ Created ${gallery.length} gallery items`);
    return gallery;
  }
}
