export const HERO_DISPLAY_MODES = {
  CAROUSEL: "carousel",
  IMAGE: "image",
  VIDEO: "video",
} as const;

export type HeroDisplayMode =
  (typeof HERO_DISPLAY_MODES)[keyof typeof HERO_DISPLAY_MODES];

export type HeroSettings = {
  carouselInterval: number;
  displayMode: HeroDisplayMode;
  showControls: boolean;
  updatedAt: Date;
};
