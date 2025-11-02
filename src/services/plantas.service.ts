import apiClient from './api';
import type { Planta } from '../types/bloques.types';

export const plantasService = {
  async getAll(): Promise<Planta[]> {
    const response = await apiClient.get<Planta[]>('/plantas');
    return response.data;
  },

  async getById(id: number): Promise<Planta> {
    const response = await apiClient.get<Planta>(`/plantas/${id}`);
    return response.data;
  },
};
