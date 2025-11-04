/**
 * Tipos y DTOs para Vehículos
 */

import type { TipoVehiculoConfig } from './tipos-vehiculo.types';

export enum TipoVehiculo {
  AUTOMOVIL = 'AUTOMOVIL',
  CAMIONETA = 'CAMIONETA',
  CAMION = 'CAMION',
  MOTO = 'MOTO',
  COLECTIVO = 'COLECTIVO',
  OTRO = 'OTRO',
}

export enum TipoCombustible {
  NAFTA = 'NAFTA',
  DIESEL = 'DIESEL',
  GNC = 'GNC',
  ELECTRICO = 'ELECTRICO',
  HIBRIDO = 'HIBRIDO',
}

export interface Vehiculo {
  id: number;
  dominio: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: TipoVehiculo;
  combustible: TipoCombustible;
  numeroMotor?: string;
  numeroChasis?: string;
  fechaPrimeraMatriculacion?: string | null; // Fecha de primera inscripción del vehículo
  tipoVehiculoId?: number; // Relación con TipoVehiculoConfig
  tipoVehiculo?: TipoVehiculoConfig; // Objeto completo del tipo
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehiculoDto {
  dominio: string;
  marca: string;
  modelo: string;
  anio?: number; // Opcional - se calcula automáticamente en el backend desde fechaPrimeraMatriculacion
  tipo?: TipoVehiculo; // Opcional - campo legacy
  combustible: TipoCombustible;
  numeroMotor?: string;
  numeroChasis?: string;
  fechaPrimeraMatriculacion?: string | null;
  tipoVehiculoId?: number; // ID del tipo de vehículo configurado por CAMARA
}

export type UpdateVehiculoDto = Partial<CreateVehiculoDto>;
