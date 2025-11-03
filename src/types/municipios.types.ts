export interface Municipio {
  id: number;
  camaraId: number;
  nombre: string;
  codigo: string;
  porcentajeReparto: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MunicipioForm = Omit<Municipio, 'id' | 'createdAt' | 'updatedAt'>;
