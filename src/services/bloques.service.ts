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

  /**
   * Descarga CSV con el detalle de obleas de un bloque
   * Incluye: número de oblea, código QR, estado, etc.
   */
  async descargarCSV(bloqueId: number): Promise<void> {
    const response = await apiClient.get(`/bloques/${bloqueId}/csv`, {
      responseType: 'blob',
    });
    
    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `obleas-bloque-${bloqueId}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
