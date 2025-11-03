import { useEffect, useState } from 'react';
import { usersService } from '../services/users.service';
import type { User } from '../types/auth.types';
import { UserRole } from '../types/auth.types';
import { useAuth } from '../context/AuthContext';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: UserRole.PLANTA_OPERADOR,
    plantaId: undefined,
    camaraId: undefined,
    municipioId: undefined,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    role: UserRole.PLANTA_OPERADOR,
    plantaId: undefined,
    camaraId: undefined,
    municipioId: undefined,
  });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    usersService.getAll()
      .then((data) => setUsers(data))
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
     
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      if (!form.username || !form.email || !form.password) {
        setFormError('Completá los campos obligatorios');
        setFormLoading(false);
        return;
      }
      await usersService.create(form);
      setShowForm(false);
      setForm({ username: '', email: '', password: '', role: UserRole.PLANTA_OPERADOR, plantaId: undefined, camaraId: undefined, municipioId: undefined });
      fetchUsers();
    } catch (err) {
      setFormError('Error al crear usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (u: User) => {
    setEditId(u.id);
    setEditForm({
      username: u.username,
      email: u.email,
      password: '',
      role: u.role,
      plantaId: u.plantaId,
      camaraId: u.camaraId,
      municipioId: u.municipioId,
    });
    setEditError('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);
    try {
      if (!editForm.username || !editForm.email) {
        setEditError('Completá los campos obligatorios');
        setEditLoading(false);
        return;
      }
      await usersService.update(editId!, editForm);
      setEditId(null);
      fetchUsers();
    } catch (err) {
      setEditError('Error al editar usuario');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que querés eliminar este usuario?')) return;
    try {
      await usersService.remove(id);
      fetchUsers();
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>
        <button
          className="mb-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Usuario *</label>
              <input name="username" value={form.username} onChange={handleInputChange} className="w-full border rounded px-2 py-1" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email *</label>
              <input name="email" value={form.email} onChange={handleInputChange} className="w-full border rounded px-2 py-1" type="email" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Contraseña *</label>
              <input name="password" value={form.password} onChange={handleInputChange} className="w-full border rounded px-2 py-1" type="password" required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Rol *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1"
                required
              >
                <option value={UserRole.PLANTA_ADMIN}>Admin Planta</option>
                <option value={UserRole.PLANTA_OPERADOR}>Operador Planta</option>
                <option value={UserRole.MUNICIPIO}>Municipio</option>
                <option value={UserRole.CAMARA}>Admin Cámara</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-4 items-center mt-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold" disabled={formLoading}>
                {formLoading ? 'Guardando...' : 'Guardar Usuario'}
              </button>
              {formError && <span className="text-red-600 text-sm">{formError}</span>}
            </div>
          </form>
        )}

        {loading && <div>Cargando...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && (
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Usuario</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Planta</th>
                <th className="px-4 py-2 text-left">Cámara</th>
                <th className="px-4 py-2 text-left">Municipio</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                editId === u.id ? (
                  <tr key={u.id} className="border-t bg-yellow-50">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">
                      <input name="username" value={editForm.username} onChange={handleEditInputChange} className="w-full border rounded px-2 py-1" />
                    </td>
                    <td className="px-4 py-2">
                      <input name="email" value={editForm.email} onChange={handleEditInputChange} className="w-full border rounded px-2 py-1" />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        name="role"
                        value={editForm.role}
                        onChange={handleEditInputChange}
                        className="w-full border rounded px-2 py-1"
                        required
                      >
                        <option value={UserRole.PLANTA_ADMIN}>Admin Planta</option>
                        <option value={UserRole.PLANTA_OPERADOR}>Operador Planta</option>
                        <option value={UserRole.MUNICIPIO}>Municipio</option>
                        <option value={UserRole.CAMARA}>Admin Cámara</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">{u.plantaId || '-'}</td>
                    <td className="px-4 py-2">{u.camaraId || '-'}</td>
                    <td className="px-4 py-2">{u.municipioId || '-'}</td>
                    <td className="px-4 py-2 flex flex-col gap-2">
                      <button onClick={handleEditSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm mb-1" disabled={editLoading}>
                        {editLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button onClick={() => setEditId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-sm">Cancelar</button>
                      {editError && <span className="text-red-600 text-xs">{editError}</span>}
                    </td>
                  </tr>
                ) : (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    <td className="px-4 py-2">{u.plantaId || '-'}</td>
                    <td className="px-4 py-2">{u.camaraId || '-'}</td>
                    <td className="px-4 py-2">{u.municipioId || '-'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handleEditClick(u)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm">Editar</button>
                      <button onClick={() => handleDelete(u.id)} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm">Eliminar</button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
