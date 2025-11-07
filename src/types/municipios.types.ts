export interface Municipio {
  id: number;
  codigo: string;
  nombre: string;
  porcentajeReparto: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MunicipioForm {
  codigo: string;
  nombre: string;
  porcentajeReparto: number;
  activo: boolean;
}
