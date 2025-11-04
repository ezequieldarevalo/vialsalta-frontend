import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import vehiculosService from '../services/vehiculos.service';
import tiposVehiculoService from '../services/tipos-vehiculo.service';
import type { Vehiculo, CreateVehiculoDto, TipoCombustible } from '../types/vehiculos.types';
import type { TipoVehiculoConfig } from '../types/tipos-vehiculo.types';
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
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Search, Clear } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';

export default function VehiculosPage() {
  const { logout, user } = useAuth();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tiposVehiculo, setTiposVehiculo] = useState<TipoVehiculoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [searchDominio, setSearchDominio] = useState('');
  const [error, setError] = useState('');
  const [fechaMatriculacion, setFechaMatriculacion] = useState<Dayjs | null>(null);
  const [formData, setFormData] = useState<CreateVehiculoDto>({
    dominio: '',
    marca: '',
    modelo: '',
    combustible: 'NAFTA' as TipoCombustible,
    numeroMotor: '',
    numeroChasis: '',
    fechaPrimeraMatriculacion: null,
    tipoVehiculoId: undefined,
  });

  useEffect(() => {
    loadVehiculos();
    loadTiposVehiculo();
  }, []);

  const loadTiposVehiculo = async () => {
    try {
      const tipos = await tiposVehiculoService.getAll(true); // Solo activos
      setTiposVehiculo(tipos);
    } catch (err) {
      console.error('Error al cargar tipos de vehículos:', err);
      // No mostramos error crítico, solo log
    }
  };

  const loadVehiculos = async () => {
    try {
      const data = await vehiculosService.getAll();
      setVehiculos(data);
    } catch (err) {
      console.error('Error al cargar vehículos:', err);
      setError('Error al cargar vehículos');
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
      setError('');
    } catch (err) {
      console.error('Error al buscar vehículo:', err);
      setError('Vehículo no encontrado');
      loadVehiculos();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convertir fecha dayjs a string ISO si existe
      const dataToSend = {
        ...formData,
        fechaPrimeraMatriculacion: fechaMatriculacion ? fechaMatriculacion.toISOString() : null,
      };

      if (editingVehiculo) {
        // Modo edición
        await vehiculosService.update(editingVehiculo.id, dataToSend);
      } else {
        // Modo creación
        await vehiculosService.create(dataToSend);
      }
      setShowForm(false);
      setEditingVehiculo(null);
      setFormData({
        dominio: '',
        marca: '',
        modelo: '',
        combustible: 'NAFTA' as TipoCombustible,
        numeroMotor: '',
        numeroChasis: '',
        fechaPrimeraMatriculacion: null,
        tipoVehiculoId: undefined,
      });
      setFechaMatriculacion(null);
      loadVehiculos();
      setError('');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMsg || `Error al ${editingVehiculo ? 'actualizar' : 'crear'} vehículo`);
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    // Solo PLANTA_ADMIN puede editar
    if (user?.role !== UserRole.PLANTA_ADMIN) {
      setError('Solo los administradores de planta pueden editar vehículos');
      return;
    }

    setEditingVehiculo(vehiculo);
    setFormData({
      dominio: vehiculo.dominio,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      combustible: vehiculo.combustible,
      numeroMotor: vehiculo.numeroMotor || '',
      numeroChasis: vehiculo.numeroChasis || '',
      fechaPrimeraMatriculacion: vehiculo.fechaPrimeraMatriculacion || null,
      tipoVehiculoId: vehiculo.tipoVehiculoId || undefined,
    });
    // Convertir fecha string a dayjs si existe
    setFechaMatriculacion(vehiculo.fechaPrimeraMatriculacion ? dayjs(vehiculo.fechaPrimeraMatriculacion) : null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehiculo(null);
    setFormData({
      dominio: '',
      marca: '',
      modelo: '',
      combustible: 'NAFTA' as TipoCombustible,
      numeroMotor: '',
      numeroChasis: '',
      fechaPrimeraMatriculacion: null,
      tipoVehiculoId: undefined,
    });
    setFechaMatriculacion(null);
    setError('');
  };

  const handleClearSearch = () => {
    setSearchDominio('');
    loadVehiculos();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Gestión de Vehículos
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
          placeholder="Buscar por dominio..."
          value={searchDominio}
          onChange={(e) => setSearchDominio(e.target.value.toUpperCase())}
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
        {searchDominio && (
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
          Nuevo Vehículo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Dominio</TableCell>
              <TableCell>Marca/Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Combustible</TableCell>
              <TableCell>Fecha 1° Matric.</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay vehículos registrados
                </TableCell>
              </TableRow>
            ) : (
              vehiculos.map((vehiculo) => (
                <TableRow key={vehiculo.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {vehiculo.dominio}
                    </Typography>
                  </TableCell>
                  <TableCell>{vehiculo.marca} {vehiculo.modelo}</TableCell>
                  <TableCell>{vehiculo.anio}</TableCell>
                  <TableCell>
                    {vehiculo.tipoVehiculo ? (
                      <Typography variant="body2" fontWeight="600">
                        {vehiculo.tipoVehiculo.nombre}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{vehiculo.combustible}</TableCell>
                  <TableCell>
                    {vehiculo.fechaPrimeraMatriculacion ? (
                      dayjs(vehiculo.fechaPrimeraMatriculacion).format('DD/MM/YYYY')
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {/* Solo PLANTA_ADMIN puede editar vehículos */}
                    {user?.role === UserRole.PLANTA_ADMIN && (
                      <IconButton
                        onClick={() => handleEdit(vehiculo)}
                        size="small"
                        color="primary"
                        title="Editar vehículo"
                      >
                        <Edit />
                      </IconButton>
                    )}
                    {/* Los vehículos NO pueden ser eliminados */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          Total: {vehiculos.length} vehículo(s)
        </Typography>
      </Box>

      {/* Formulario Modal */}
      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2}>
                <TextField
                  label="Dominio / Patente"
                  required
                  fullWidth
                  value={formData.dominio}
                  onChange={(e) => setFormData({ ...formData, dominio: e.target.value.toUpperCase() })}
                  inputProps={{ maxLength: 10 }}
                  placeholder="ABC123"
                  disabled={!!editingVehiculo} // No se puede editar el dominio
                />
                <TextField
                  label="Marca"
                  required
                  fullWidth
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="Toyota"
                />
              </Box>
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Modelo"
                  required
                  fullWidth
                  value={formData.modelo}
                  onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                  placeholder="Corolla"
                />
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    label="Fecha Primera Matriculación"
                    value={fechaMatriculacion}
                    onChange={(newValue) => setFechaMatriculacion(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: 'El año se calculará automáticamente',
                      },
                    }}
                    format="DD/MM/YYYY"
                  />
                </LocalizationProvider>
              </Box>
              
              <TextField
                label="Tipo de Vehículo"
                select
                required
                fullWidth
                value={formData.tipoVehiculoId || ''}
                onChange={(e) => {
                  const tipoId = e.target.value ? Number(e.target.value) : undefined;
                  setFormData({ ...formData, tipoVehiculoId: tipoId });
                }}
                helperText="Tipo configurado por CÁMARA"
              >
                <MenuItem value="">
                  <em>Seleccionar tipo</em>
                </MenuItem>
                {tiposVehiculo.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                    {tipo.descripcion && ` - ${tipo.descripcion}`}
                  </MenuItem>
                ))}
              </TextField>
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Combustible"
                  select
                  required
                  fullWidth
                  value={formData.combustible}
                  onChange={(e) => setFormData({ ...formData, combustible: e.target.value as TipoCombustible })}
                >
                  <MenuItem value="NAFTA">Nafta</MenuItem>
                  <MenuItem value="DIESEL">Diesel</MenuItem>
                  <MenuItem value="GNC">GNC</MenuItem>
                  <MenuItem value="ELECTRICO">Eléctrico</MenuItem>
                  <MenuItem value="HIBRIDO">Híbrido</MenuItem>
                </TextField>
                <Box flexGrow={1} /> {/* Spacer para mantener diseño */}
              </Box>
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Número de Motor"
                  fullWidth
                  value={formData.numeroMotor}
                  onChange={(e) => setFormData({ ...formData, numeroMotor: e.target.value })}
                />
                <TextField
                  label="Número de Chasis"
                  fullWidth
                  value={formData.numeroChasis}
                  onChange={(e) => setFormData({ ...formData, numeroChasis: e.target.value })}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="success">
              {editingVehiculo ? 'Actualizar Vehículo' : 'Crear Vehículo'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
