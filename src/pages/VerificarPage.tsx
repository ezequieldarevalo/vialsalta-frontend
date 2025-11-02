import { useState } from 'react';
import { useParams } from 'react-router-dom';
import certificadosService from '../services/certificados.service';
import type { VerificacionCertificado } from '../services/certificados.service';

export default function VerificarPage() {
  const { codigoQr } = useParams<{ codigoQr?: string }>();
  const [codigo, setCodigo] = useState(codigoQr || '');
  const [resultado, setResultado] = useState<VerificacionCertificado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    setLoading(true);

    try {
      const data = await certificadosService.verificar(codigo);
      setResultado(data);
    } catch (err: any) {
      setError('Certificado no encontrado o código inválido');
    } finally {
      setLoading(false);
    }
  };

  // Auto-verificar si viene código QR en la URL
  useState(() => {
    if (codigoQr) {
      handleVerificar(new Event('submit') as any);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Verificación de Certificado RTV
            </h1>
            <p className="text-gray-600">
              Ingrese el código QR para verificar la autenticidad del certificado
            </p>
          </div>

          {/* Formulario de búsqueda */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <form onSubmit={handleVerificar}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código QR del Certificado
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ejemplo: QR-12345-1234567890-1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !codigo}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
              >
                {loading ? 'Verificando...' : 'Verificar Certificado'}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <span className="text-red-600 text-2xl mr-3">❌</span>
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Resultado Válido */}
          {resultado && resultado.valido && (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 shadow-xl">
              <div className="flex items-center mb-4">
                <span className="text-green-600 text-4xl mr-3">✅</span>
                <div>
                  <h2 className="text-2xl font-bold text-green-800">Certificado Válido</h2>
                  <p className="text-green-700">Este certificado es auténtico</p>
                </div>
              </div>

              {/* Información del Certificado */}
              <div className="border-t border-green-200 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Información del Certificado</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Número de Certificado</p>
                    <p className="font-semibold text-gray-900">{resultado.certificado.numero}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Emisión</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(resultado.certificado.fechaEmision).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(resultado.certificado.fechaVencimiento).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className="font-semibold text-green-600">VIGENTE</p>
                  </div>
                </div>
              </div>

              {/* Información del Vehículo */}
              <div className="border-t border-green-200 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Datos del Vehículo</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Dominio</p>
                    <p className="font-semibold text-gray-900 text-lg">{resultado.vehiculo.dominio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Marca y Modelo</p>
                    <p className="font-semibold text-gray-900">
                      {resultado.vehiculo.marca} {resultado.vehiculo.modelo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Año</p>
                    <p className="font-semibold text-gray-900">{resultado.vehiculo.anio}</p>
                  </div>
                </div>
              </div>

              {/* Información de la Revisión */}
              <div className="border-t border-green-200 pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Datos de la Revisión</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Revisión</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(resultado.revision.fecha).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resultado</p>
                    <p className="font-semibold text-green-600">{resultado.revision.resultado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Planta de Revisión</p>
                    <p className="font-semibold text-gray-900">{resultado.revision.planta}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Provincia</p>
                    <p className="font-semibold text-gray-900">{resultado.revision.provincia}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Número de Oblea</p>
                    <p className="font-semibold text-gray-900">#{resultado.oblea.numero}</p>
                  </div>
                </div>
              </div>

              {/* Advertencia */}
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Este certificado es válido únicamente con la oblea física adherida al parabrisas del vehículo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Sistema de Revisión Técnica Vehicular</p>
          <p>Esta verificación es pública y no requiere autenticación</p>
        </div>
      </div>
    </div>
  );
}
