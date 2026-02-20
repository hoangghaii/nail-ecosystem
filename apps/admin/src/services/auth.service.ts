import type { LoginCredentials, User } from "@repo/types/auth";

import { apiClient } from "@/lib/apiClient";

import { storage } from "./storage.service";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<{ admin: User }> {
    return apiClient.post<{ admin: User }>("/auth/login", credentials);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout"); // server clears HttpOnly cookies
    } finally {
      // Always clear local user data even if API call fails
      storage.clear();
    }
  }
}

export const authService = new AuthService();
