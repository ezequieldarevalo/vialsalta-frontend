/**
 * Tipos para el módulo de estadísticas
 */

/**
 * Estadísticas de revisiones del mes
 */
export interface RevisionesMes {
  total: number;
  aprobadas: number;
  rechazadas: number;
  condicionales: number;
  porcentajeAprobadas: number;
  porcentajeRechazadas: number;
  porcentajeCondicionales: number;
}

/**
 * Estadísticas de obleas
 */
export interface ObleasStats {
  utilizadasMes: number;
  disponibles: number;
  alertaBajoStock: boolean;
  umbralAlerta: number;
}

/**
 * Tasa de aprobación con comparativa
 */
export interface TasaAprobacion {
  mesActual: number;
  mesAnterior: number;
  diferencia: number;
  tendencia: 'subida' | 'bajada' | 'estable';
  ultimos6Meses: MesAprobacion[];
}

/**
 * Aprobación por mes
 */
export interface MesAprobacion {
  mes: string;
  anio: number;
  porcentaje: number;
  total: number;
}

/**
 * Distribución de vehículos por tipo
 */
export interface VehiculosPorTipo {
  tipo: string;
  cantidad: number;
  porcentaje: number;
}

/**
 * Vehículo próximo a vencer
 */
export interface VehiculoProximoVencer {
  id: number;
  dominio: string;
  marca: string;
  modelo: string;
  tipoVehiculo?: string;
  fechaVencimiento: string;
  diasRestantes: number;
}

/**
 * Respuesta completa de estadísticas
 */
export interface EstadisticasResponse {
  revisionesMes: RevisionesMes;
  obleas: ObleasStats;
  tasaAprobacion: TasaAprobacion;
  vehiculosPorTipo: VehiculosPorTipo[];
  proximosVencimientos: VehiculoProximoVencer[];
}
