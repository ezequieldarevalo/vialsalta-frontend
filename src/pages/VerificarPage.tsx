import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import certificadosService from '../services/certificados.service';
import type { VerificacionCertificado } from '../services/certificados.service';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Car,
  Calendar,
  FileText,
  Building,
  MapPin,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerificarPage() {
  const { codigoQr } = useParams<{ codigoQr?: string }>();
  const navigate = useNavigate();
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
    } catch (err: unknown) {
      console.error('Error al verificar:', err);
      setError('Certificado no encontrado o código inválido');
    } finally {
      setLoading(false);
    }
  };

  // Auto-verificar si viene código QR en la URL
  useState(() => {
    if (codigoQr) {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleVerificar(fakeEvent);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header mejorado */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Verificación de Certificado
                </h1>
                <p className="text-xs text-gray-500">Sistema VTV</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-2 border-white/50">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Search className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Verificación de Certificado RTV
              </h1>
              <p className="text-gray-600 font-medium">
                Ingrese el código QR para verificar la autenticidad del certificado
              </p>
            </div>
          </motion.div>

          {/* Formulario de búsqueda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border-2 border-white/50"
          >
            <form onSubmit={handleVerificar}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código QR del Certificado
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ejemplo: QR-12345-1234567890-1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !codigo}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Verificar Certificado
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-red-800 text-lg">Error de Verificación</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resultado Válido */}
          {resultado && resultado.valido && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <div className="bg-green-500 p-4 rounded-2xl shadow-lg mr-4">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-green-800">Certificado Válido</h2>
                  <p className="text-green-700 font-medium">Este certificado es auténtico y está vigente</p>
                </div>
              </div>

              {/* Información del Certificado */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-800 text-lg">Información del Certificado</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Número de Certificado</p>
                    <p className="font-bold text-gray-900">{resultado.certificado.numero}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Fecha de Emisión</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {new Date(resultado.certificado.fechaEmision).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Vencimiento</p>
                        <p className="font-bold text-gray-900 text-sm">
                          {new Date(resultado.certificado.fechaVencimiento).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Estado</p>
                    <p className="font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      VIGENTE
                    </p>
                  </div>
                </div>
              </div>

              {/* Información del Vehículo */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <Car className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-800 text-lg">Datos del Vehículo</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Dominio / Patente</p>
                    <p className="font-bold text-gray-900 text-2xl">{resultado.vehiculo.dominio}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Marca y Modelo</p>
                    <p className="font-bold text-gray-900">
                      {resultado.vehiculo.marca} {resultado.vehiculo.modelo}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Año</p>
                    <p className="font-bold text-gray-900">{resultado.vehiculo.anio}</p>
                  </div>
                </div>
              </div>

              {/* Información de la Revisión */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-gray-800 text-lg">Datos de la Revisión</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Fecha de Revisión</p>
                    <p className="font-bold text-gray-900">
                      {new Date(resultado.revision.fecha).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Resultado</p>
                    <p className="font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {resultado.revision.resultado}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Planta de Revisión</p>
                    <p className="font-bold text-gray-900">{resultado.revision.planta}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Provincia</p>
                        <p className="font-bold text-gray-900">{resultado.revision.provincia}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Número de Oblea</p>
                    <p className="font-bold text-gray-900 text-lg">#{resultado.oblea.numero}</p>
                  </div>
                </div>
              </div>

              {/* Advertencia */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mt-4 flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 font-medium">
                  Este certificado es válido únicamente con la oblea física adherida al parabrisas del vehículo.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-600"
        >
          <p className="font-medium">Sistema de Revisión Técnica Vehicular</p>
          <p className="text-sm">Esta verificación es pública y no requiere autenticación</p>
        </motion.div>
      </div>
    </div>
  );
}
