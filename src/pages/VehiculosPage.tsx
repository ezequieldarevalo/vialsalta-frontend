import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import vehiculosService from '../services/vehiculos.service';
import type { Vehiculo, CreateVehiculoDto, TipoVehiculo, TipoCombustible } from '../types/vehiculos.types';
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
import { Add, Delete, Search, Clear } from '@mui/icons-material';

export default function VehiculosPage() {
  const { logout } = useAuth();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchDominio, setSearchDominio] = useState('');
  const [error, setError] = useState('');
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
      await vehiculosService.create(formData);
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
      setError('');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMsg || 'Error al crear vehículo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;
    
    try {
      await vehiculosService.delete(id);
      loadVehiculos();
      setError('');
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(errorMsg || 'Error al eliminar vehículo');
    }
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
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
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
                  <TableCell>{vehiculo.tipo}</TableCell>
                  <TableCell>{vehiculo.combustible}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleDelete(vehiculo.id)}
                      size="small"
                      color="error"
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
          Total: {vehiculos.length} vehículo(s)
        </Typography>
      </Box>

      {/* Formulario Modal */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Vehículo</DialogTitle>
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
                <TextField
                  label="Año"
                  type="number"
                  required
                  fullWidth
                  value={formData.anio}
                  onChange={(e) => setFormData({ ...formData, anio: parseInt(e.target.value) })}
                  inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
                />
              </Box>
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Tipo de Vehículo"
                  select
                  required
                  fullWidth
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoVehiculo })}
                >
                  <MenuItem value="AUTOMOVIL">Automóvil</MenuItem>
                  <MenuItem value="CAMIONETA">Camioneta</MenuItem>
                  <MenuItem value="CAMION">Camión</MenuItem>
                  <MenuItem value="MOTO">Moto</MenuItem>
                  <MenuItem value="COLECTIVO">Colectivo</MenuItem>
                  <MenuItem value="OTRO">Otro</MenuItem>
                </TextField>
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
            <Button onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="success">
              Crear Vehículo
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
