/**
 * Servicio API para gestión de revisiones técnicas
 */

import api from './api';
import type {
  Revision,
  CreateRevisionDto,
  UpdateRevisionDto,
  EstadisticasRevisiones,
} from '../types/revisiones.types';

class RevisionesService {
  /**
   * Obtener todas las revisiones
   */
  async getAll(): Promise<Revision[]> {
    const response = await api.get<Revision[]>('/revisiones');
    return response.data;
  }

  /**
   * Obtener una revisión por ID
   */
  async getById(id: number): Promise<Revision> {
    const response = await api.get<Revision>(`/revisiones/${id}`);
    return response.data;
  }

  /**
   * Crear una nueva revisión
   */
  async create(data: CreateRevisionDto): Promise<Revision> {
    const response = await api.post<Revision>('/revisiones', data);
    return response.data;
  }

  /**
   * Actualizar una revisión
   */
  async update(id: number, data: UpdateRevisionDto): Promise<Revision> {
    const response = await api.patch<Revision>(`/revisiones/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar una revisión
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/revisiones/${id}`);
  }

  /**
   * Asignar oblea a una revisión aprobada
   * @param revisionId ID de la revisión
   * @param numeroOblea Número de la oblea escaneada/ingresada manualmente
   */
  async asignarOblea(revisionId: number, numeroOblea: number): Promise<Revision> {
    const response = await api.post<Revision>(`/revisiones/${revisionId}/asignar-oblea`, {
      numeroOblea,
    });
    return response.data;
  }

  /**
   * Obtener estadísticas de revisiones
   */
  async getEstadisticas(): Promise<EstadisticasRevisiones> {
    const response = await api.get<EstadisticasRevisiones>('/revisiones/estadisticas');
    return response.data;
  }
}

export const revisionesService = new RevisionesService();
export default revisionesService;
