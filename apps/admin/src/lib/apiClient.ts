/**
 * API Client for Admin Dashboard
 *
 * Centralized HTTP client with:
 * - credentials: 'include' for HttpOnly cookie auth (automatic token sending)
 * - Token refresh on 401 (server rotates cookies via POST /auth/refresh)
 * - Standardized error handling
 * - File upload support
 */

import { ApiError } from "@repo/utils/api";

import { storage } from "@/services/storage.service";

type RequestOptions = {
  body?: unknown;
} & Omit<RequestInit, "body">;

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  }

  private async refreshAccessToken(): Promise<void> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include", // browser sends HttpOnly refresh cookie automatically
    })
      .then((res) => {
        if (!res.ok) {
          // Refresh failed — clear user data and redirect to login
          storage.remove("auth_user");
          window.location.href = "/login";
          throw new ApiError("Session expired", 401);
        }
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

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
      credentials: "include", // always send HttpOnly cookies
      headers,
    };

    let response = await fetch(url, config);

    // Handle 401 - try token refresh once (skip for refresh endpoint to avoid loop)
    if (response.status === 401 && endpoint !== "/auth/refresh") {
      await this.refreshAccessToken();
      // Retry with same config — server has set new access cookie
      response = await fetch(url, config);
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
}

export const apiClient = new ApiClient();
