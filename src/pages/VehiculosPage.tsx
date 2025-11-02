import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import vehiculosService from '../services/vehiculos.service';
import type { Vehiculo, CreateVehiculoDto, TipoVehiculo, TipoCombustible } from '../types/vehiculos.types';

export default function VehiculosPage() {
  const { logout } = useAuth();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchDominio, setSearchDominio] = useState('');
  const [formData, setFormData] = useState<CreateVehiculoDto>({
    dominio: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    tipo: 'AUTOMOVIL' as TipoVehiculo,
    combustible: 'NAFTA' as TipoCombustible,
    numeroMotor: '',
    numeroChasis: '',
  });

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll();
      setVehiculos(data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchDominio.trim()) {
      loadVehiculos();
      return;
    }
    
    try {
      const vehiculo = await vehiculosService.findByDominio(searchDominio);
      setVehiculos([vehiculo]);
    } catch (error) {
      alert('Vehículo no encontrado');
      loadVehiculos();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await vehiculosService.create(formData);
      alert('Vehículo creado exitosamente');
      setShowForm(false);
      setFormData({
        dominio: '',
        marca: '',
        modelo: '',
        anio: new Date().getFullYear(),
        tipo: 'AUTOMOVIL' as TipoVehiculo,
        combustible: 'NAFTA' as TipoCombustible,
        numeroMotor: '',
        numeroChasis: '',
      });
      loadVehiculos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear vehículo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
    
    try {
      await vehiculosService.delete(id);
      alert('Vehículo eliminado');
      loadVehiculos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar vehículo');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-xl">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                ← Volver
              </button>
              <h1 className="text-xl font-semibold">Gestión de Vehículos</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Búsqueda y botón crear */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar por dominio..."
                value={searchDominio}
                onChange={(e) => setSearchDominio(e.target.value.toUpperCase())}
                className="px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Buscar
              </button>
              {searchDominio && (
                <button
                  onClick={() => { setSearchDominio(''); loadVehiculos(); }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Limpiar
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              {showForm ? 'Cancelar' : '+ Nuevo Vehículo'}
            </button>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Nuevo Vehículo</h2>
              <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dominio / Patente *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.dominio}
                    onChange={(e) => setFormData({ ...formData, dominio: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="ABC123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Toyota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Corolla"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Año *
                  </label>
                  <input
                    type="number"
                    required
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    value={formData.anio}
                    onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Vehículo *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoVehiculo })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="AUTOMOVIL">Automóvil</option>
                    <option value="CAMIONETA">Camioneta</option>
                    <option value="CAMION">Camión</option>
                    <option value="MOTO">Moto</option>
                    <option value="COLECTIVO">Colectivo</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Combustible *
                  </label>
                  <select
                    value={formData.combustible}
                    onChange={(e) => setFormData({ ...formData, combustible: e.target.value as TipoCombustible })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="NAFTA">Nafta</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="GNC">GNC</option>
                    <option value="ELECTRICO">Eléctrico</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Motor
                  </label>
                  <input
                    type="text"
                    value={formData.numeroMotor}
                    onChange={(e) => setFormData({ ...formData, numeroMotor: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Chasis
                  </label>
                  <input
                    type="text"
                    value={formData.numeroChasis}
                    onChange={(e) => setFormData({ ...formData, numeroChasis: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  >
                    Crear Vehículo
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de vehículos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dominio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Combustible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehiculos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No hay vehículos registrados
                    </td>
                  </tr>
                ) : (
                  vehiculos.map((vehiculo) => (
                    <tr key={vehiculo.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{vehiculo.dominio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vehiculo.marca} {vehiculo.modelo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vehiculo.anio}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vehiculo.tipo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{vehiculo.combustible}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(vehiculo.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Total: {vehiculos.length} vehículo(s)
          </div>
        </div>
      </div>
    </div>
  );
}
