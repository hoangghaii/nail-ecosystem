import type { AuthResponse, LoginCredentials } from "@repo/types/auth";

import { apiClient } from "@/lib/apiClient";

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", credentials);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("auth_user");
    }
  }
}

export const authService = new AuthService();
