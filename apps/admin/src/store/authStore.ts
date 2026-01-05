import type { User } from "@repo/types/auth";

import { create } from "zustand";

import { storage } from "@/services/storage.service";

type AuthState = {
  initializeAuth: () => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  refreshToken: string | null;
  token: string | null;
  user: User | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  initializeAuth: () => {
    const token = storage.get<string | null>("auth_token", null);
    const refreshToken = storage.get<string | null>("refresh_token", null);
    const user = storage.get<User | null>("auth_user", null);

    if (token && refreshToken && user) {
      set({
        isAuthenticated: true,
        isInitialized: true,
        refreshToken,
        token,
        user,
      });
    } else {
      set({ isInitialized: true });
    }
  },
  isAuthenticated: false,
  isInitialized: false,
  login: (user, token, refreshToken) => {
    storage.set("auth_token", token);
    storage.set("refresh_token", refreshToken);
    storage.set("auth_user", user);
    set({
      isAuthenticated: true,
      isInitialized: true,
      refreshToken,
      token,
      user,
    });
  },

  logout: () => {
    storage.remove("auth_token");
    storage.remove("refresh_token");
    storage.remove("auth_user");
    set({
      isAuthenticated: false,
      isInitialized: true,
      refreshToken: null,
      token: null,
      user: null,
    });
  },

  refreshToken: null,

  token: null,

  user: null,
}));
