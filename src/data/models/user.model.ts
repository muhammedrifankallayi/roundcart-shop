// types/auth.types.ts

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;           // Access token (short-lived)
  refreshToken: string;    // Refresh token (long-lived)
  user: UserData;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  password?: string;       // Usually not included in response
  role: 'user' | 'admin';
  type: 'customer' | 'reseller' | 'owner';
  isActive: boolean;
  avatar?: string;
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface LoginResponse extends RegisterResponse {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: UserData | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}