import apiClient from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth.types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async register(data: { username: string; email: string; password: string; role: string }) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
};
