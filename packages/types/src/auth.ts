export type User = {
  avatar?: string;
  email: string;
  id: string;
  name: string;
  role: "admin" | "staff";
};

export type AuthResponse = {
  expiresAt: number;
  token: string;
  user: User;
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
