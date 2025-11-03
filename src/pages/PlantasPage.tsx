import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { Add, Edit, Delete, ArrowBack, Logout } from '@mui/icons-material';
import type { Planta } from '../types/plantas.types';
import { plantasService } from '../services/plantas.service';
import { useAuth } from '../context/AuthContext';

const initialForm: Partial<Planta> = {
  nombre: '',
  cuit: '',
  codigoHabilitacion: '',
  direccion: '',
  telefono: '',
  email: '',
  activo: true,
};

const PlantasPage: React.FC = () => {
  const { logout } = useAuth();
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Planta>>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const fetchPlantas = async () => {
    setLoading(true);
    try {
      const data = await plantasService.getAll();
      setPlantas(data);
    } catch (error) {
      console.error('Error al cargar plantas:', error);
      setSnackbar({ open: true, message: 'Error al cargar plantas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantas();
  }, []);

  const handleOpen = (planta?: Planta) => {
    if (planta) {
      setForm(planta);
      setEditingId(planta.id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: Partial<Planta>) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await plantasService.update(editingId, form);
        setSnackbar({ open: true, message: 'Planta actualizada exitosamente', severity: 'success' });
      } else {
        await plantasService.create(form as Omit<Planta, 'id' | 'camaraId' | 'createdAt' | 'updatedAt'>);
        setSnackbar({ open: true, message: 'Planta creada exitosamente', severity: 'success' });
      }
      fetchPlantas();
      handleClose();
    } catch (error) {
      console.error('Error al guardar planta:', error);
      setSnackbar({ open: true, message: 'Error al guardar planta', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta planta?')) return;
    setLoading(true);
    try {
      await plantasService.remove(id);
      setSnackbar({ open: true, message: 'Planta eliminada exitosamente', severity: 'success' });
      fetchPlantas();
    } catch (error) {
      console.error('Error al eliminar planta:', error);
      setSnackbar({ open: true, message: 'Error al eliminar planta', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', boxShadow: 1, mb: 3 }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Gestión de Plantas
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="outlined"
                startIcon={<ArrowBack />}
              >
                Volver
              </Button>
              <Button
                onClick={logout}
                variant="outlined"
                color="error"
                startIcon={<Logout />}
              >
                Salir
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box px={3} maxWidth="1400px" mx="auto">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="body1" color="textSecondary">
            Total: {plantas.length} plantas registradas
          </Typography>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
            Nueva Planta
          </Button>
        </Box>

        {loading && <CircularProgress />}

        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>CUIT</TableCell>
              <TableCell>Código Habilitación</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plantas.map((planta) => (
              <TableRow key={planta.id}>
                <TableCell>{planta.id}</TableCell>
                <TableCell>{planta.nombre}</TableCell>
                <TableCell>{planta.cuit}</TableCell>
                <TableCell>{planta.codigoHabilitacion}</TableCell>
                <TableCell>{planta.direccion}</TableCell>
                <TableCell>{planta.telefono}</TableCell>
                <TableCell>{planta.email}</TableCell>
                <TableCell>{planta.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(planta)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(planta.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {plantas.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  {loading ? 'Cargando...' : 'No hay plantas registradas.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editar Planta' : 'Nueva Planta'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nombre"
              name="nombre"
              value={form.nombre || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="CUIT"
              name="cuit"
              value={form.cuit || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Código de Habilitación"
              name="codigoHabilitacion"
              value={form.codigoHabilitacion || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Dirección"
              name="direccion"
              value={form.direccion || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Teléfono"
              name="telefono"
              value={form.telefono || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              type="email"
              value={form.email || ''}
              onChange={handleChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </Box>
  );
};

export default PlantasPage;
