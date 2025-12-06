import { UserData } from "@/data/models/user.model";

export const AuthHelper = {
  // Save auth data to localStorage
  saveAuthData: (userId: string, token: string, refreshToken: string, userData: UserData) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
  },

  // Get auth data from localStorage
  getAuthData: () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    const userData = localStorage.getItem("userData");

    return {
      userId,
      token,
      refreshToken,
      userData: userData ? JSON.parse(userData) : null,
    };
  },

  // Get user data
  getUserData: (): UserData | null => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("userId") && !!localStorage.getItem("token");
  },

  // Clear all auth data (logout)
  clearAuthData: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
  },

  // Update user data
  updateUserData: (userData: UserData) => {
    localStorage.setItem("userData", JSON.stringify(userData));
  },
};
