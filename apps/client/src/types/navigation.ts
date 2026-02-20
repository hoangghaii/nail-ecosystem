import type { GalleryItem } from "@repo/types/gallery";
import type { Service } from "@repo/types/service";

/**
 * Navigation state for BookingPage
 * - fromService: navigating from Services page (service selected)
 * - fromGallery: navigating from Gallery/Lookbook (gallery item selected, no service required)
 */
export type BookingNavigationState =
  | {
      fromService: true;
      service: Service;
    }
  | {
      fromGallery: true;
      galleryItem: GalleryItem;
    };

/**
 * Type guard for validating BookingNavigationState
 */
export function isValidBookingState(
  state: unknown
): state is BookingNavigationState {
  if (!state || typeof state !== "object") return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = state as any;

  if (s.fromService === true) {
    return (
      !!s.service &&
      typeof s.service._id === "string" &&
      typeof s.service.name === "string"
    );
  }

  if (s.fromGallery === true) {
    return !!s.galleryItem && typeof s.galleryItem._id === "string";
  }

  return false;
}

/**
 * Navigation state passed to ServicesPage when entering from Gallery.
 * Carries the gallery item so ServiceCard can forward it to BookingPage.
 */
export type ServicesNavigationState = {
  fromGallery: true;
  galleryItem: GalleryItem;
};

/**
 * Type guard for ServicesNavigationState
 */
export function isValidServicesState(
  state: unknown
): state is ServicesNavigationState {
  if (!state || typeof state !== "object") return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = state as any;
  return (
    s.fromGallery === true &&
    !!s.galleryItem &&
    typeof s.galleryItem._id === "string"
  );
}
