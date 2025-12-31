import type { AuthResponse, LoginCredentials, User } from "@/types/auth.types";

const MOCK_USER: User = {
  avatar: undefined,
  email: "admin@pinknail.com",
  id: "admin-1",
  name: "Admin User",
  role: "admin",
};

const MOCK_PASSWORD = "admin123";

export class AuthService {
  private useMockApi = import.meta.env.VITE_USE_MOCK_API === "true";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (this.useMockApi) {
      return this.mockLogin(credentials);
    }

    // Real API call
    const response = await fetch("/api/auth/login", {
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
  }

  private async mockLogin(
    credentials: LoginCredentials,
  ): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network

    if (
      credentials.email === MOCK_USER.email &&
      credentials.password === MOCK_PASSWORD
    ) {
      const token = btoa(
        JSON.stringify({ exp: Date.now() + 86400000, userId: MOCK_USER.id }),
      );

      return {
        expiresAt:
          Date.now() + (credentials.rememberMe ? 2592000000 : 86400000), // 30d or 1d
        token,
        user: MOCK_USER,
      };
    }

    throw new Error("Invalid credentials");
  }

  async logout(): Promise<void> {
    // Clear token from storage
  }

  async validateToken(token: string): Promise<User | null> {
    if (this.useMockApi) {
      try {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp > Date.now()) {
          return MOCK_USER;
        }
      } catch {
        return null;
      }
    }

    // Real API validation
    return null;
  }
}

export const authService = new AuthService();
