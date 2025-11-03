export interface Planta {
  id: number;
  camaraId: number;
  municipioId: number;
  nombre: string;
  cuit: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  codigoHabilitacion: string;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
  camara?: any;
  municipio?: any;
}
