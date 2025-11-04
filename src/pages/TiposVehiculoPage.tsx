import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import tiposVehiculoService from '../services/tipos-vehiculo.service';
import type { TipoVehiculoConfig, CreateTipoVehiculoDto } from '../types/tipos-vehiculo.types';
import { UserRole } from '../types/auth.types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, Search, Clear } from '@mui/icons-material';

export default function TiposVehiculoPage() {
  const { logout, user } = useAuth();
  const [tipos, setTipos] = useState<TipoVehiculoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoVehiculoConfig | null>(null);
  const [searchNombre, setSearchNombre] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateTipoVehiculoDto>({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  useEffect(() => {
    // Verificar que solo CAMARA puede acceder
    if (user?.role !== UserRole.CAMARA) {
      setError('Solo los usuarios de CÁMARA pueden gestionar tipos de vehículos');
      setLoading(false);
      return;
    }
    loadTipos();
  }, [user]);

  const loadTipos = async () => {
    try {
      const data = await tiposVehiculoService.getAll();
      setTipos(data);
    } catch (err) {
      console.error('Error al cargar tipos de vehículos:', err);
      setError('Error al cargar tipos de vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchNombre.trim()) {
      loadTipos();
      return;
    }
    
    const filtrados = tipos.filter(tipo => 
      tipo.nombre.toUpperCase().includes(searchNombre.toUpperCase())
    );
    setTipos(filtrados);
  };

  const handleClearSearch = () => {
    setSearchNombre('');
    loadTipos();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTipo) {
        // Modo edición
        await tiposVehiculoService.update(editingTipo.id, formData);
      } else {
        // Modo creación
        await tiposVehiculoService.create(formData);
      }
      handleCloseForm();
      loadTipos();
      setError('');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMsg || `Error al ${editingTipo ? 'actualizar' : 'crear'} tipo de vehículo`);
    }
  };

  const handleEdit = (tipo: TipoVehiculoConfig) => {
    setEditingTipo(tipo);
    setFormData({
      nombre: tipo.nombre,
      descripcion: tipo.descripcion || '',
      activo: tipo.activo,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este tipo de vehículo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await tiposVehiculoService.delete(id);
      loadTipos();
      setError('');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMsg || 'Error al eliminar tipo de vehículo');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTipo(null);
    setFormData({
      nombre: '',
      descripcion: '',
      activo: true,
    });
    setError('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Verificación de permisos
  if (user?.role !== UserRole.CAMARA) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Solo los usuarios de CÁMARA pueden acceder a esta sección.
        </Alert>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outlined" sx={{ mt: 2 }}>
          ← Volver al Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Gestión de Tipos de Vehículos
        </Typography>
        <Box display="flex" gap={2}>
          <Button onClick={() => window.location.href = '/dashboard'} variant="outlined">
            ← Volver
          </Button>
          <Button onClick={logout} variant="outlined" color="error">
            Cerrar Sesión
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box mb={3} display="flex" gap={2} alignItems="center">
        <TextField
          placeholder="Buscar por nombre..."
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearch}
        >
          Buscar
        </Button>
        {searchNombre && (
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearSearch}
          >
            Limpiar
          </Button>
        )}
        <Box flexGrow={1} />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={() => setShowForm(true)}
        >
          Nuevo Tipo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tipos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay tipos de vehículos registrados
                </TableCell>
              </TableRow>
            ) : (
              tipos.map((tipo) => (
                <TableRow key={tipo.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      #{tipo.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="600">
                      {tipo.nombre}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {tipo.descripcion || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tipo.activo ? 'Activo' : 'Inactivo'} 
                      color={tipo.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(tipo.createdAt).toLocaleDateString('es-AR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit(tipo)}
                      size="small"
                      color="primary"
                      title="Editar tipo"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(tipo.id)}
                      size="small"
                      color="error"
                      title="Eliminar tipo"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Total: {tipos.length} tipo(s) de vehículo
        </Typography>
      </Box>

      {/* Formulario Modal */}
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTipo ? 'Editar Tipo de Vehículo' : 'Nuevo Tipo de Vehículo'}
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} pt={1}>
              <TextField
                label="Nombre del Tipo"
                required
                fullWidth
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Automóvil, Camioneta, Camión"
                helperText="Nombre descriptivo del tipo de vehículo"
              />
              
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción opcional del tipo de vehículo"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    color="success"
                  />
                }
                label="Tipo activo"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="success">
              {editingTipo ? 'Actualizar Tipo' : 'Crear Tipo'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
