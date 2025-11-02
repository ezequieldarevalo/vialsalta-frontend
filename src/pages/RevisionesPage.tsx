import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import revisionesService from '../services/revisiones.service';
import vehiculosService from '../services/vehiculos.service';
import certificadosService from '../services/certificados.service';
import type { Revision, CreateRevisionDto, ResultadoRevision, EstadisticasRevisiones } from '../types/revisiones.types';
import type { Vehiculo } from '../types/vehiculos.types';
import { UserRole } from '../types/auth.types';

export default function RevisionesPage() {
  const { user, logout } = useAuth();
  const [revisiones, setRevisiones] = useState<Revision[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasRevisiones | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dominioSearch, setDominioSearch] = useState('');
  const [showVehiculosList, setShowVehiculosList] = useState(false);
  const [formData, setFormData] = useState<CreateRevisionDto>({
    vehiculoId: 0,
    resultado: 'APROBADO' as ResultadoRevision,
    observaciones: '',
    kilometraje: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [revisionesData, vehiculosData, stats] = await Promise.all([
        revisionesService.getAll(),
        vehiculosService.getAll(true), // Solo vehículos disponibles para revisión
        revisionesService.getEstadisticas(),
      ]);
      setRevisiones(revisionesData);
      setVehiculos(vehiculosData);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.vehiculoId === 0) {
      alert('Debe seleccionar un vehículo');
      return;
    }
    
    try {
      await revisionesService.create(formData);
      alert('Revisión técnica creada exitosamente');
      setShowForm(false);
      setFormData({
        vehiculoId: 0,
        resultado: 'APROBADO' as ResultadoRevision,
        observaciones: '',
        kilometraje: 0,
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear revisión');
    }
  };

  const handleAsignarOblea = async (revisionId: number) => {
    if (!confirm('¿Desea asignar una oblea a esta revisión aprobada?')) return;
    
    try {
      await revisionesService.asignarOblea(revisionId);
      alert('Oblea asignada y certificado generado exitosamente');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al asignar oblea');
    }
  };

  const handleDescargarCertificado = async (revisionId: number) => {
    try {
      await certificadosService.descargarPDF(revisionId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al descargar certificado');
    }
  };

  const getResultadoBadge = (resultado: ResultadoRevision) => {
    const colors = {
      APROBADO: 'bg-green-100 text-green-800',
      RECHAZADO: 'bg-red-100 text-red-800',
      CONDICIONAL: 'bg-yellow-100 text-yellow-800',
    };
    return colors[resultado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">Cargando...</div>
    </div>;
  }

  // Determinar permisos
  const isPlantaOperador = user?.role === UserRole.PLANTA_OPERADOR || user?.role === 'PLANTA_OPERADOR';
  const isPlantaAdmin = user?.role === UserRole.PLANTA_ADMIN || user?.role === 'PLANTA_ADMIN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                ← Volver
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Revisiones Técnicas Vehiculares (RTV)
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white">
              <div className="text-sm font-medium opacity-90 mb-1">Total Revisiones</div>
              <div className="text-4xl font-bold">{estadisticas.total}</div>
            </div>
            
            {/* Aprobadas */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white">
              <div className="text-sm font-medium opacity-90 mb-1">Aprobadas</div>
              <div className="text-4xl font-bold mb-2">{estadisticas.aprobadas}</div>
              <div className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                Tasa: {estadisticas.tasaAprobacion}
              </div>
            </div>
            
            {/* Rechazadas */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-6 rounded-2xl shadow-xl text-white">
              <div className="text-sm font-medium opacity-90 mb-1">Rechazadas</div>
              <div className="text-4xl font-bold">{estadisticas.rechazadas}</div>
            </div>
            
            {/* Con Oblea */}
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-2xl shadow-xl text-white">
              <div className="text-sm font-medium opacity-90 mb-1">Con Oblea</div>
              <div className="text-4xl font-bold mb-2">{estadisticas.conOblea}</div>
              <div className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                Sin oblea: {estadisticas.sinOblea}
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Listado de Revisiones
            </h2>
            {isPlantaOperador && (
              <button
                onClick={() => setShowForm(!showForm)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200
                  ${showForm 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }
                `}
              >
                {showForm ? '✕ Cancelar' : '+ Nueva Revisión'}
              </button>
            )}
          </div>

          {/* Formulario */}
          {showForm && isPlantaOperador && (
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border-2 border-blue-100 mb-8">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Nueva Revisión Técnica
              </h2>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Buscar Vehículo por Dominio *
                  </label>
                  <input
                    type="text"
                    required
                    value={dominioSearch}
                    onChange={(e) => {
                      setDominioSearch(e.target.value.toUpperCase());
                      setShowVehiculosList(true);
                    }}
                    onFocus={() => setShowVehiculosList(true)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl uppercase focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="Ej: ABC123"
                  />
                  
                  {/* Lista desplegable de vehículos filtrados */}
                  {showVehiculosList && vehiculos.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {vehiculos
                        .filter((v) =>
                          v.dominio.toUpperCase().includes(dominioSearch.toUpperCase()) ||
                          `${v.marca} ${v.modelo}`.toUpperCase().includes(dominioSearch.toUpperCase())
                        )
                        .map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, vehiculoId: v.id });
                              setDominioSearch(`${v.dominio} - ${v.marca} ${v.modelo} (${v.anio})`);
                              setShowVehiculosList(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                          >
                            <div className="font-semibold">{v.dominio}</div>
                            <div className="text-sm text-gray-600">
                              {v.marca} {v.modelo} ({v.anio})
                            </div>
                          </button>
                        ))}
                      {vehiculos.filter((v) =>
                        v.dominio.toUpperCase().includes(dominioSearch.toUpperCase()) ||
                        `${v.marca} ${v.modelo}`.toUpperCase().includes(dominioSearch.toUpperCase())
                      ).length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No se encontraron vehículos. <a href="/vehiculos" className="text-blue-600 underline">Registrar nuevo vehículo</a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {formData.vehiculoId > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Vehículo seleccionado
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resultado de la Revisión *
                  </label>
                  <select
                    value={formData.resultado}
                    onChange={(e) => setFormData({ ...formData, resultado: e.target.value as ResultadoRevision })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option value="APROBADO">✅ APROBADO</option>
                    <option value="RECHAZADO">❌ RECHAZADO</option>
                    <option value="CONDICIONAL">⚠️ CONDICIONAL</option>
                  </select>
                  {formData.resultado === 'APROBADO' && (
                    <p className="text-sm text-green-600 mt-2 bg-green-50 px-3 py-2 rounded-lg">
                      ✓ Luego de crear la revisión, podrá asignar una oblea automáticamente
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.kilometraje || ''}
                    onChange={(e) => setFormData({ ...formData, kilometraje: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                    placeholder="45000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                    rows={3}
                    placeholder="Detalles de la revisión..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200"
                >
                  Crear Revisión Técnica
                </button>
              </form>
            </div>
          )}

          {/* Lista de revisiones */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oblea</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revisiones.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No hay revisiones registradas
                    </td>
                  </tr>
                ) : (
                  revisiones.map((revision) => (
                    <tr key={revision.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">#{revision.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-semibold">{revision.vehiculo?.dominio}</div>
                        <div className="text-sm text-gray-600">
                          {revision.vehiculo?.marca} {revision.vehiculo?.modelo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getResultadoBadge(revision.resultado)}`}>
                          {revision.resultado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(revision.fechaRevision).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {revision.oblea ? (
                          <span className="text-green-600 font-semibold">
                            #{revision.oblea.numero}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sin asignar</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {revision.fechaVencimiento
                          ? new Date(revision.fechaVencimiento).toLocaleDateString('es-AR')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {revision.resultado === 'APROBADO' && !revision.oleaId && isPlantaAdmin && (
                          <button
                            onClick={() => handleAsignarOblea(revision.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Asignar Oblea
                          </button>
                        )}
                        {revision.oleaId && isPlantaAdmin && (
                          <button
                            onClick={() => handleDescargarCertificado(revision.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 ml-2"
                          >
                            📄 Certificado
                          </button>
                        )}
                        {revision.observaciones && (
                          <button
                            onClick={() => alert(revision.observaciones)}
                            className="ml-2 text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Ver obs.
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Total: {revisiones.length} revisión(es)
          </div>
        </div>
      </div>
    </div>
  );
}
