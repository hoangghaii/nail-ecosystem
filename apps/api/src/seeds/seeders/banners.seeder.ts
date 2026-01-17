import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner } from '../../modules/banners/schemas/banner.schema';

@Injectable()
export class BannersSeeder {
  private readonly logger = new Logger(BannersSeeder.name);

  constructor(@InjectModel(Banner.name) private bannerModel: Model<Banner>) {}

  async seed(count: number = 25): Promise<Banner[]> {
    this.logger.log('Seeding banners...');

    const banners: Array<{
      title: string;
      imageUrl: string;
      videoUrl?: string;
      type: string;
      isPrimary: boolean;
      active: boolean;
      sortIndex: number;
    }> = [];
    const imageCount = Math.floor(count * 0.9); // 90% images
    const videoCount = count - imageCount; // 10% videos

    // Image banners
    for (let i = 0; i < imageCount; i++) {
      banners.push({
        title: this.generateBannerTitle(i),
        imageUrl: `https://picsum.photos/1920/600?random=${i}`,
        type: 'image',
        isPrimary: i === 0, // First banner is primary
        active: Math.random() > 0.2, // 80% active
        sortIndex: i,
      });
    }

    // Video banners
    for (let i = 0; i < videoCount; i++) {
      const index = imageCount + i;
      banners.push({
        title: this.generateVideoBannerTitle(i),
        imageUrl: `https://picsum.photos/1920/600?random=${index}`, // Thumbnail
        videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, // Placeholder
        type: 'video',
        isPrimary: false,
        active: Math.random() > 0.2, // 80% active
        sortIndex: index,
      });
    }

    const created = await this.bannerModel.insertMany(banners);
    this.logger.log(
      `✅ Created ${created.length} banners (${imageCount} images, ${videoCount} videos)`,
    );
    return created;
  }

  private generateBannerTitle(index: number): string {
    const titles = [
      'Welcome to Pink Nail Salon - Premium Nail Care',
      'New Spring Collection - Vibrant Colors',
      'Luxury Spa Pedicure - Relax & Rejuvenate',
      'Gel Manicure Special - $40 This Month',
      'Custom Nail Art - Express Your Style',
      'Acrylic Extensions - Natural Look',
      'Bridal Packages - Perfect Wedding Nails',
      "Men's Grooming Services Available",
      'Gift Certificates - Perfect Gift Idea',
      'Walk-Ins Welcome - No Appointment Needed',
      'Student Discount - 15% Off',
      'Loyalty Program - Earn Rewards',
      'Organic Polish Options - Eco-Friendly',
      "Kids' Manicure - Fun & Safe",
      'Seasonal Special - Fall Colors',
      "Valentine's Day Romance Collection",
      'Summer Beach Vibes - Bright Nails',
      'Holiday Glitter & Glam',
      'French Tips - Classic Elegance',
      'Ombre Nails - Trendy Gradient',
      '3D Nail Art - Stunning Designs',
      'Chrome Nails - Futuristic Shine',
      'Matte Finish - Modern & Chic',
      'Nail Care Tips - Healthy Nails',
      'Group Bookings - Parties Welcome',
    ];

    return titles[index % titles.length];
  }

  private generateVideoBannerTitle(index: number): string {
    const titles = [
      'Watch: Behind the Scenes at Pink Nail Salon',
      'Video Tutorial: Perfect Gel Manicure at Home',
      'Customer Transformations - Before & After',
    ];

    return titles[index % titles.length];
  }
}
