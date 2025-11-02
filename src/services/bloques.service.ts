import apiClient from './api';
import type {
  BloqueObleas,
  CreateBloqueDto,
  AsignarBloqueDto,
  EstadisticasBloquesResponse,
} from '../types/bloques.types';

export const bloquesService = {
  async getAll(): Promise<BloqueObleas[]> {
    const response = await apiClient.get<BloqueObleas[]>('/bloques');
    return response.data;
  },

  async getById(id: number): Promise<BloqueObleas> {
    const response = await apiClient.get<BloqueObleas>(`/bloques/${id}`);
    return response.data;
  },

  async getByPlanta(plantaId: number): Promise<BloqueObleas[]> {
    const response = await apiClient.get<BloqueObleas[]>(`/bloques/planta/${plantaId}`);
    return response.data;
  },

  async getEstadisticas(): Promise<EstadisticasBloquesResponse> {
    const response = await apiClient.get<EstadisticasBloquesResponse>('/bloques/estadisticas');
    return response.data;
  },

  async create(data: CreateBloqueDto): Promise<BloqueObleas> {
    const response = await apiClient.post<BloqueObleas>('/bloques', data);
    return response.data;
  },

  async asignarPlanta(id: number, data: AsignarBloqueDto): Promise<BloqueObleas> {
    const response = await apiClient.post<BloqueObleas>(`/bloques/${id}/asignar`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/bloques/${id}`);
  },
};
