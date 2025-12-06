import axiosInstance from "../axios/axiosInstance";
import { ApiResponse } from "../models/common.model";
import { LoginResponse, RegisterRequest, RegisterResponse } from "../models/user.model";

export const AuthService = {
  userRegister: (body: RegisterRequest): Promise<RegisterResponse> => {
    return axiosInstance.post('/auth/register', body) as unknown as Promise<RegisterResponse>;
  },

  userLogin: (body: { email: string; password: string }): Promise<LoginResponse> => {
    return axiosInstance.post('/auth/login', body) as unknown as Promise<LoginResponse>;
  },

  refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string }>> => {
    return axiosInstance.post('/auth/refresh', { refreshToken }) as unknown as Promise<ApiResponse<{ token: string }>>;
  },

  logout: (): Promise<ApiResponse<null>> => {
    return axiosInstance.post('/auth/logout', {}) as unknown as Promise<ApiResponse<null>>;
  },
};