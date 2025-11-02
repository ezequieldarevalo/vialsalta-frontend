import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bloquesService } from '../services/bloques.service';
import { plantasService } from '../services/plantas.service';
import type { BloqueObleas, EstadoBloque, Planta } from '../types/bloques.types';

export const BloquesPage = () => {
  const { user, logout } = useAuth();
  const [bloques, setBloques] = useState<BloqueObleas[]>([]);
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBloque, setSelectedBloque] = useState<BloqueObleas | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cantidad: '',
    plantaId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bloquesData, plantasData] = await Promise.all([
        bloquesService.getAll(),
        plantasService.getAll(),
      ]);
      setBloques(bloquesData);
      setPlantas(plantasData);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const payload: { cantidad: number; plantaId?: number } = {
        cantidad: parseInt(formData.cantidad),
      };

      if (formData.plantaId) {
        payload.plantaId = parseInt(formData.plantaId);
      }

      await bloquesService.create(payload);

      setShowCreateModal(false);
      setFormData({ cantidad: '', plantaId: '' });
      loadData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al crear el bloque');
    }
  };

  const handleAssign = async (plantaId: number) => {
    if (!selectedBloque) return;

    try {
      await bloquesService.asignarPlanta(selectedBloque.id, { plantaId });
      setShowAssignModal(false);
      setSelectedBloque(null);
      loadData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Error al asignar el bloque');
    }
  };

  const getEstadoBadgeClass = (estado: EstadoBloque) => {
    switch (estado) {
      case 'CREADO':
        return 'bg-gray-100 text-gray-800';
      case 'ASIGNADO':
        return 'bg-blue-100 text-blue-800';
      case 'EN_USO':
        return 'bg-green-100 text-green-800';
      case 'AGOTADO':
        return 'bg-red-100 text-red-800';
      case 'ANULADO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/dashboard'} 
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                ← Volver
              </button>
              <h1 className="text-xl font-bold text-gray-800">Gestión de Bloques</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                <p className="text-xs text-gray-500">Cámara de RTV</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Bloques de Obleas</h2>
            <p className="text-gray-600 mt-1">
              Total: {bloques.length} bloques registrados
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Crear Nuevo Bloque
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Bloques Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rango
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planta Asignada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bloques.map((bloque) => (
                <tr key={bloque.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{bloque.codigo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {bloque.numeroInicio} - {bloque.numeroFin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{bloque.cantidadTotal} obleas</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {bloque.planta ? bloque.planta.nombre : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClass(bloque.estado)}`}
                    >
                      {bloque.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {bloque.estado === 'CREADO' && (
                      <button
                        onClick={() => {
                          setSelectedBloque(bloque);
                          setShowAssignModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Asignar
                      </button>
                    )}
                    <a href={`/bloques/${bloque.id}`} className="text-gray-600 hover:text-gray-900">
                      Ver detalles
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Crear Nuevo Bloque
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de Obleas
                  </label>
                  <input
                    type="number"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="100"
                    min="1"
                    max="1000"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    El sistema generará automáticamente el código y rango numérico
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planta (Opcional)
                  </label>
                  <select
                    value={formData.plantaId}
                    onChange={(e) => setFormData({ ...formData, plantaId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Sin asignar</option>
                    {plantas.map((planta) => (
                      <option key={planta.id} value={planta.id}>
                        {planta.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setFormData({ cantidad: '', plantaId: '' });
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Crear Bloque
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedBloque && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Asignar Bloque a Planta
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Bloque: <span className="font-semibold">{selectedBloque.codigo}</span>
              </p>
              <div className="space-y-2">
                {plantas.map((planta) => (
                  <button
                    key={planta.id}
                    onClick={() => handleAssign(planta.id)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition"
                  >
                    <div className="font-medium text-gray-900">{planta.nombre}</div>
                    <div className="text-sm text-gray-500">{planta.direccion}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBloque(null);
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
