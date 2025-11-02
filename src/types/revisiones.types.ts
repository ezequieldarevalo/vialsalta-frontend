/**
 * Tipos y DTOs para Revisiones Técnicas
 */

import { Vehiculo } from './vehiculos.types';
import { Planta } from './plantas.types';

export enum ResultadoRevision {
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  CONDICIONAL = 'CONDICIONAL',
}

export interface Revision {
  id: number;
  plantaId: number;
  vehiculoId: number;
  oleaId?: number;
  usuarioId: number;
  resultado: ResultadoRevision;
  fechaRevision: string;
  fechaVencimiento?: string;
  observaciones?: string;
  urlFoto?: string;
  kilometraje?: number;
  createdAt: string;
  updatedAt: string;
  // Relaciones
  vehiculo?: Vehiculo;
  planta?: Planta;
  oblea?: {
    id: number;
    numero: number;
    estado: string;
  };
  usuario?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface CreateRevisionDto {
  vehiculoId: number;
  plantaId?: number;
  resultado: ResultadoRevision;
  observaciones?: string;
  urlFoto?: string;
  kilometraje?: number;
  fechaRevision?: string;
}

export interface UpdateRevisionDto extends Partial<CreateRevisionDto> {}

export interface EstadisticasRevisiones {
  total: number;
  aprobadas: number;
  rechazadas: number;
  condicionales: number;
  conOblea: number;
  sinOblea: number;
  tasaAprobacion: string;
}
