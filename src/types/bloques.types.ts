export enum EstadoBloque {
  CREADO = 'CREADO',
  ASIGNADO = 'ASIGNADO',
  EN_USO = 'EN_USO',
  AGOTADO = 'AGOTADO',
  ANULADO = 'ANULADO',
}

export enum EstadoOblea {
  DISPONIBLE = 'DISPONIBLE',
  ASIGNADA = 'ASIGNADA',
  EMITIDA = 'EMITIDA',
  ANULADA = 'ANULADA',
}

export interface Planta {
  id: number;
  camaraId: number;
  municipioId: number;
  nombre: string;
  direccion: string;
  codigoHabilitacion: string;
  telefono: string;
  email: string;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Oblea {
  id: number;
  bloqueId: number;
  plantaId: number | null;
  revisionId: number | null;
  numero: number;
  codigoQr: string | null;
  estado: EstadoOblea;
  createdAt: string;
  fechaEmision: string | null;
  updatedAt: string;
}

export interface BloqueObleas {
  id: number;
  codigo: string;
  camaraId: number | null;
  plantaId: number | null;
  numeroInicio: number;
  numeroFin: number;
  cantidadTotal: number;
  estado: EstadoBloque;
  createdAt: string;
  fechaAsignacion: string | null;
  updatedAt: string;
  planta?: Planta;
  obleas?: Oblea[];
}

export interface CreateBloqueDto {
  cantidad: number;
  plantaId?: number;
}

export interface AsignarBloqueDto {
  plantaId: number;
}

export interface EstadisticasBloquesResponse {
  bloques: {
    total: number;
    porEstado: Array<{ estado: string; cantidad: string }>;
  };
  obleas: {
    total: number;
    porEstado: Array<{ estado: string; cantidad: string }>;
  };
}
