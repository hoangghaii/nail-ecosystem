import type { User } from "@repo/types/auth";

import { create } from "zustand";

import { storage } from "@/services/storage.service";

type AuthState = {
  initializeAuth: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User) => void;
  logout: () => void;
  user: User | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  initializeAuth: () => {
    // Tokens are HttpOnly cookies — not readable from JS.
    // Check localStorage for cached user data to restore display state optimistically.
    // If the cookie session is actually expired, the first API call will 401 → redirect to login.
    const user = storage.get<User | null>("auth_user", null);

    if (user) {
      set({
        isAuthenticated: true,
        isInitialized: true,
        user,
      });
    } else {
      set({ isInitialized: true });
    }
  },
  isAuthenticated: false,
  isInitialized: false,
  login: (user) => {
    storage.set("auth_user", user);
    set({
      isAuthenticated: true,
      isInitialized: true,
      user,
    });
  },

  logout: () => {
    storage.remove("auth_user");
    set({
      isAuthenticated: false,
      isInitialized: true,
      user: null,
    });
  },

  user: null,
}));
