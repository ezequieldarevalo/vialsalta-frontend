/**
 * Servicio API para gestión de vehículos
 */

import api from './api';
import type { Vehiculo, CreateVehiculoDto, UpdateVehiculoDto } from '../types/vehiculos.types';

class VehiculosService {
  /**
   * Obtener todos los vehículos
   */
  async getAll(disponibles = false): Promise<Vehiculo[]> {
    const url = disponibles ? '/vehiculos?disponibles=true' : '/vehiculos';
    const response = await api.get<Vehiculo[]>(url);
    return response.data;
  }

  /**
   * Buscar vehículo por dominio
   */
  async findByDominio(dominio: string): Promise<Vehiculo> {
    const response = await api.get<Vehiculo>(`/vehiculos/buscar?dominio=${dominio}`);
    return response.data;
  }

  /**
   * Obtener un vehículo por ID
   */
  async getById(id: number): Promise<Vehiculo> {
    const response = await api.get<Vehiculo>(`/vehiculos/${id}`);
    return response.data;
  }

  /**
   * Crear un nuevo vehículo
   */
  async create(data: CreateVehiculoDto): Promise<Vehiculo> {
    const response = await api.post<Vehiculo>('/vehiculos', data);
    return response.data;
  }

  /**
   * Actualizar un vehículo
   */
  async update(id: number, data: UpdateVehiculoDto): Promise<Vehiculo> {
    const response = await api.patch<Vehiculo>(`/vehiculos/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar un vehículo
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/vehiculos/${id}`);
  }
}

export const vehiculosService = new VehiculosService();
export default vehiculosService;
