/**
 * Servicio API para gestión de Tipos de Vehículos
 */

import api from './api';
import type { TipoVehiculoConfig, CreateTipoVehiculoDto, UpdateTipoVehiculoDto } from '../types/tipos-vehiculo.types';

class TiposVehiculoService {
  /**
   * Obtener todos los tipos de vehículos
   */
  async getAll(activos = false): Promise<TipoVehiculoConfig[]> {
    const url = activos ? '/tipos-vehiculo?activos=true' : '/tipos-vehiculo';
    const response = await api.get<TipoVehiculoConfig[]>(url);
    return response.data;
  }

  /**
   * Obtener un tipo de vehículo por ID
   */
  async getById(id: number): Promise<TipoVehiculoConfig> {
    const response = await api.get<TipoVehiculoConfig>(`/tipos-vehiculo/${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo tipo de vehículo
   */
  async create(data: CreateTipoVehiculoDto): Promise<TipoVehiculoConfig> {
    const response = await api.post<TipoVehiculoConfig>('/tipos-vehiculo', data);
    return response.data;
  }

  /**
   * Actualizar un tipo de vehículo
   */
  async update(id: number, data: UpdateTipoVehiculoDto): Promise<TipoVehiculoConfig> {
    const response = await api.patch<TipoVehiculoConfig>(`/tipos-vehiculo/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar (desactivar) un tipo de vehículo
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/tipos-vehiculo/${id}`);
  }
}

export const tiposVehiculoService = new TiposVehiculoService();
export default tiposVehiculoService;
