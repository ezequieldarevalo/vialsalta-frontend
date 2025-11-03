import apiClient from './api';
import type { Planta } from '../types/plantas.types';

export const plantasService = {
  async getAll(): Promise<Planta[]> {
    const response = await apiClient.get<Planta[]>('/plantas');
    return response.data;
  },

  async getById(id: number): Promise<Planta> {
    const response = await apiClient.get<Planta>(`/plantas/${id}`);
    return response.data;
  },

  async create(data: Partial<Planta>): Promise<Planta> {
    const response = await apiClient.post<Planta>('/plantas', data);
    return response.data;
  },

  async update(id: number, data: Partial<Planta>): Promise<Planta> {
    const response = await apiClient.put<Planta>(`/plantas/${id}`, data);
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/plantas/${id}`);
  },
};
