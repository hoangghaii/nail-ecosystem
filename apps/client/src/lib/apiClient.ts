/**
 * API Client for Customer-Facing App
 *
 * Centralized HTTP client with:
 * - Public endpoints (no auth required)
 * - Standardized error handling
 */

import { ApiError } from "@repo/utils/api";

type RequestOptions = {
  body?: unknown;
} & Omit<RequestInit, "body">;

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
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
      headers,
    };

    const response = await fetch(url, config);

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
}

export const apiClient = new ApiClient();
