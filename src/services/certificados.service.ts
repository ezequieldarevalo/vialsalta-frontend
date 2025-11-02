import api from './api';

export interface Certificado {
  id: number;
  revisionId: number;
  numeroCertificado: string;
  codigoQr: string;
  urlVerificacion: string;
  fechaEmision: Date;
  fechaVencimiento: Date;
}

export interface VerificacionCertificado {
  valido: boolean;
  certificado: {
    numero: string;
    fechaEmision: Date;
    fechaVencimiento: Date;
  };
  vehiculo: {
    dominio: string;
    marca: string;
    modelo: string;
    anio: number;
  };
  revision: {
    fecha: Date;
    resultado: string;
    planta: string;
    provincia: string;
  };
  oblea: {
    numero: number;
  };
}

const certificadosService = {
  /**
   * Genera el certificado para una revisión
   */
  async generar(revisionId: number): Promise<Certificado> {
    const response = await api.post<Certificado>(`/certificados/revision/${revisionId}`);
    return response.data;
  },

  /**
   * Descarga el PDF del certificado
   */
  async descargarPDF(revisionId: number): Promise<void> {
    const response = await api.get(`/certificados/revision/${revisionId}/pdf`, {
      responseType: 'blob',
    });
    
    // Crear un blob y descargar
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado-revision-${revisionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Verifica un certificado por código QR (público)
   */
  async verificar(codigoQr: string): Promise<VerificacionCertificado> {
    const response = await api.get<VerificacionCertificado>(`/public/verificar/${codigoQr}`);
    return response.data;
  },

  /**
   * Obtiene todos los certificados
   */
  async getAll(): Promise<Certificado[]> {
    const response = await api.get<Certificado[]>('/certificados');
    return response.data;
  },
};

export default certificadosService;
