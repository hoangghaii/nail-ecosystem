import type { AuthResponse, LoginCredentials } from "@repo/types/auth";

import { apiClient } from "@/lib/apiClient";

import { storage } from "./storage.service";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      // Always clear local storage even if API call fails
      storage.clear();
    }
  }
}

export const authService = new AuthService();
