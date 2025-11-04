/**
 * Tipos y DTOs para Tipos de Vehículos (configurables por CAMARA)
 */

export interface TipoVehiculoConfig {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTipoVehiculoDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export type UpdateTipoVehiculoDto = Partial<CreateTipoVehiculoDto>;
