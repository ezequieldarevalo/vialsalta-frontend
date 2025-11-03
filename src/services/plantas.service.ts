import api from './api';
import type { Planta } from '../types/plantas.types';

export const plantasService = {
  getAll: async (): Promise<Planta[]> => {
    const res = await api.get<Planta[]>('/plantas');
    return res.data;
  },
  get: async (id: number): Promise<Planta> => {
    const res = await api.get<Planta>(`/plantas/${id}`);
    return res.data;
  },
  create: async (data: Partial<Planta>): Promise<Planta> => {
    const res = await api.post<Planta>('/plantas', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Planta>): Promise<Planta> => {
    const res = await api.patch<Planta>(`/plantas/${id}`, data);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/plantas/${id}`);
  },
};
