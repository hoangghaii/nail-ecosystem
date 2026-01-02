/**
 * API Client for Admin Dashboard
 *
 * Centralized HTTP client with:
 * - Automatic JWT token injection
 * - Token refresh on 401
 * - Standardized error handling
 * - File upload support
 */

import { ApiError } from "@repo/utils/api";

type RequestOptions = {
  body?: unknown;
} & Omit<RequestInit, "body">;

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  private async refreshAccessToken(): Promise<void> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new ApiError("No refresh token available", 401);
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        body: JSON.stringify({ refreshToken }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
        throw new ApiError("Session expired", 401);
      }

      const data = await response.json();
      localStorage.setItem("auth_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
    })();

    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

    // Add auth token if available and not already set
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Handle JSON body
    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      ...options,
      body:
        options.body instanceof FormData
          ? options.body
          : options.body
            ? JSON.stringify(options.body)
            : undefined,
      headers,
    };

    let response = await fetch(url, config);

    // Handle 401 - try token refresh once
    if (response.status === 401 && endpoint !== "/auth/refresh") {
      await this.refreshAccessToken();

      // Retry with new token
      const newToken = this.getAuthToken();
      if (newToken) {
        const retryHeaders: Record<string, string> = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(url, { ...config, headers: retryHeaders });
      }
    }

    // Handle non-2xx responses
    if (!response.ok) {
      throw await ApiError.fromResponse(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, body, method: "POST" });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, body, method: "PATCH" });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, body, method: "PUT" });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async upload(file: File, folder: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await this.post<{ url: string }>(
      "/storage/upload",
      formData,
    );
    return response.url;
  }
}

export const apiClient = new ApiClient();
