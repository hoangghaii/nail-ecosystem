import { create } from "zustand";

import type { Booking, BookingStatus } from "@/types/booking.types";

import { MOCK_BOOKINGS } from "@/data/mockBookings";

type BookingsState = {
  bookings: Booking[];
  initializeBookings: () => void;
  isInitialized: boolean;
  setBookings: (bookings: Booking[]) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
};

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],

  initializeBookings: () => {
    if (!get().isInitialized) {
      set({ bookings: MOCK_BOOKINGS, isInitialized: true });
    }
  },

  isInitialized: false,

  setBookings: (bookings) => {
    set({ bookings });
  },

  updateBooking: (id, data) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, ...data } : booking,
      ),
    }));
  },

  updateBookingStatus: (id, status) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    }));
  },
}));
