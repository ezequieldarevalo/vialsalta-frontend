import api from './api';
import type { EstadisticasResponse } from '../types/estadisticas.types';

/**
 * Servicio para gestionar estadísticas de la planta
 */
class EstadisticasService {
  /**
   * Obtener todas las estadísticas de la planta
   */
  async getEstadisticas(): Promise<EstadisticasResponse> {
    const response = await api.get<EstadisticasResponse>('/estadisticas');
    return response.data;
  }
}

export default new EstadisticasService();
