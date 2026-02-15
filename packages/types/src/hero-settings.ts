/**
 * Hero Settings Type
 *
 * Configuration for hero section display modes
 */

export type HeroDisplayMode = 'image' | 'video' | 'carousel';

export interface HeroSettings {
  _id: string;
  displayMode: HeroDisplayMode;
  carouselInterval: number; // in milliseconds
  showControls: boolean;
  createdAt: Date;
  updatedAt: Date;
}
