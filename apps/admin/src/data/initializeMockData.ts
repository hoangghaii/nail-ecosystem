import { useBannersStore } from "@/store/bannersStore";
import { useBookingsStore } from "@/store/bookingsStore";
import { useBusinessInfoStore } from "@/store/businessInfoStore";
import { useContactsStore } from "@/store/contactsStore";
import { useGalleryStore } from "@/store/galleryStore";
import { useHeroSettingsStore } from "@/store/heroSettingsStore";

export function initializeMockData(): void {
  // Clean up deprecated localStorage keys from older versions
  const deprecatedKeys = [
    "nail_admin_banners",
    "nail_admin_gallery",
    "nail_admin_hero_settings",
    "nail_admin_bookings",
    "nail_admin_contacts",
    "nail_admin_business_info",
    "nail_admin_mock_data_initialized",
  ];

  deprecatedKeys.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`Cleaned up deprecated key: ${key}`);
    }
  });

  // Initialize banners store
  useBannersStore.getState().initializeBanners();

  // Initialize hero settings store
  useHeroSettingsStore.getState().initializeSettings();

  // Initialize gallery store
  useGalleryStore.getState().initializeGallery();

  // Initialize bookings store
  useBookingsStore.getState().initializeBookings();

  // Initialize contacts store
  useContactsStore.getState().initializeContacts();

  // Initialize business info store
  useBusinessInfoStore.getState().initializeBusinessInfo();

  console.log("Mock data initialized successfully");
}
