export type User = {
  avatar?: string;
  email: string;
  id: string;
  name: string;
  role: "admin" | "staff";
};

export type AuthResponse = {
  accessToken: string;
  admin: User;
  refreshToken: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
