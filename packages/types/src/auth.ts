export type User = {
  avatar?: string;
  email: string;
  _id: string;
  name: string;
  role: 'admin' | 'staff';
};

export type AuthResponse = {
  admin: User;
};

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};
