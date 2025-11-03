import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bloquesService } from '../services/bloques.service';
import { plantasService } from '../services/plantas.service';
import type { BloqueObleas, EstadoBloque, Planta } from '../types/bloques.types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';

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

  const getEstadoColor = (estado: EstadoBloque): "default" | "primary" | "success" | "error" | "warning" => {
    switch (estado) {
      case 'CREADO':
        return 'default';
      case 'ASIGNADO':
        return 'primary';
      case 'EN_USO':
        return 'success';
      case 'AGOTADO':
        return 'error';
      case 'ANULADO':
        return 'warning';
      default:
        return 'default';
    }
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
          Gestión de Bloques
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            onClick={() => window.location.href = '/dashboard'}
            variant="outlined"
          >
            ← Volver
          </Button>
          <Button onClick={logout} variant="outlined" color="error">
            Salir
          </Button>
        </Box>
      </Box>

      <Box mb={3}>
        <Typography variant="body1" color="textSecondary">
          Usuario: {user?.username} | Total: {bloques.length} bloques registrados
        </Typography>
      </Box>

      <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setShowCreateModal(true)}
        >
          Crear Nuevo Bloque
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Rango</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Planta Asignada</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bloques.map((bloque) => (
              <TableRow key={bloque.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {bloque.codigo}
                  </Typography>
                </TableCell>
                <TableCell>
                  {bloque.numeroInicio} - {bloque.numeroFin}
                </TableCell>
                <TableCell>{bloque.cantidadTotal} obleas</TableCell>
                <TableCell>
                  {bloque.planta ? bloque.planta.nombre : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={bloque.estado}
                    color={getEstadoColor(bloque.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {bloque.estado === 'CREADO' && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedBloque(bloque);
                        setShowAssignModal(true);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Asignar
                    </Button>
                  )}
                  <Button
                    size="small"
                    href={`/bloques/${bloque.id}`}
                  >
                    Ver detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {bloques.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay bloques registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Bloque</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Cantidad de Obleas"
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              fullWidth
              required
              inputProps={{ min: 1, max: 1000 }}
              helperText="El sistema generará automáticamente el código y rango numérico"
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Planta (Opcional)</InputLabel>
              <Select
                value={formData.plantaId}
                onChange={(e) => setFormData({ ...formData, plantaId: e.target.value })}
                label="Planta (Opcional)"
              >
                <MenuItem value="">Sin asignar</MenuItem>
                {plantas.map((planta) => (
                  <MenuItem key={planta.id} value={planta.id}>
                    {planta.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowCreateModal(false);
                setFormData({ cantidad: '', plantaId: '' });
                setError('');
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Crear Bloque
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Assign Modal */}
      <Dialog open={showAssignModal} onClose={() => setShowAssignModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Asignar Bloque a Planta</DialogTitle>
        <DialogContent>
          {selectedBloque && (
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Bloque: <strong>{selectedBloque.codigo}</strong>
              </Typography>
            </Box>
          )}
          <Box display="flex" flexDirection="column" gap={1}>
            {plantas.map((planta) => (
              <Button
                key={planta.id}
                variant="outlined"
                onClick={() => handleAssign(planta.id)}
                sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {planta.nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {planta.direccion}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAssignModal(false);
              setSelectedBloque(null);
              setError('');
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
