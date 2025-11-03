import apiClient from './api';
import type { User, UserRole } from '../types/auth.types';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  camaraId?: number;
  plantaId?: number;
  municipioId?: number;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  camaraId?: number;
  plantaId?: number;
  municipioId?: number;
  isActive?: boolean;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    const res = await apiClient.get<User[]>('/users');
    return res.data;
  },
  async getById(id: number): Promise<User> {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },
  async create(data: CreateUserDto): Promise<User> {
    const res = await apiClient.post<User>('/users', data);
    return res.data;
  },
  async update(id: number, data: UpdateUserDto): Promise<User> {
    const res = await apiClient.put<User>(`/users/${id}`, data);
    return res.data;
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
