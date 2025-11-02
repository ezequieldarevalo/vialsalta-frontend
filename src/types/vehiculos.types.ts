/**
 * Tipos y DTOs para Vehículos
 */

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehiculoDto {
  dominio: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: TipoVehiculo;
  combustible: TipoCombustible;
  numeroMotor?: string;
  numeroChasis?: string;
}

export interface UpdateVehiculoDto extends Partial<CreateVehiculoDto> {}
