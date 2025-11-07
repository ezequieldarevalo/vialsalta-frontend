export interface Planta {
  id: number;
  camaraId: number;
  municipioId: number;
  nombre: string;
  direccion: string;
  codigoHabilitacion: string;
  cuit: string;
  telefono: string;
  email: string;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlantaForm {
  camaraId: number;
  municipioId: number;
  nombre: string;
  direccion: string;
  codigoHabilitacion: string;
  cuit: string;
  telefono: string;
  email: string;
}
