import { create } from "zustand";

import type { User } from "@/types/auth.types";

import { storage } from "@/services/storage.service";

type AuthState = {
  initializeAuth: () => void;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  token: string | null;
  user: User | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  initializeAuth: () => {
    const token = storage.get<string | null>("auth_token", null);
    const user = storage.get<User | null>("auth_user", null);

    if (token && user) {
      set({ isAuthenticated: true, token, user });
    }
  },
  isAuthenticated: false,
  login: (user, token) => {
    storage.set("auth_token", token);
    storage.set("auth_user", user);
    set({ isAuthenticated: true, token, user });
  },

  logout: () => {
    storage.remove("auth_token");
    storage.remove("auth_user");
    set({ isAuthenticated: false, token: null, user: null });
  },

  token: null,

  user: null,
}));
