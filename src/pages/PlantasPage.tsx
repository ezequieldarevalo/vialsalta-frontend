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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import type { Planta } from '../types/plantas.types';
import { plantasService } from '../services/plantas.service';

const initialForm: Partial<Planta> = {
  nombre: '',
  cuit: '',
  codigoHabilitacion: '',
  direccion: '',
  telefono: '',
  email: '',
  activa: true,
};

const PlantasPage: React.FC = () => {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Planta>>(initialForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const fetchPlantas = async () => {
    setLoading(true);
    try {
      const data = await plantasService.getAll();
      setPlantas(data);
    } catch {
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
      setForm({
        nombre: planta.nombre,
        cuit: planta.cuit,
        codigoHabilitacion: planta.codigoHabilitacion,
        direccion: planta.direccion,
        telefono: planta.telefono,
        email: planta.email,
        activa: planta.activa,
      });
      setEditId(planta.id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await plantasService.update(editId, form);
        setSnackbar({ open: true, message: 'Planta actualizada', severity: 'success' });
      } else {
        await plantasService.create(form);
        setSnackbar({ open: true, message: 'Planta creada', severity: 'success' });
      }
      fetchPlantas();
      handleClose();
    } catch {
      setSnackbar({ open: true, message: 'Error al guardar', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar planta?')) return;
    try {
      await plantasService.remove(id);
      setSnackbar({ open: true, message: 'Planta eliminada', severity: 'success' });
      fetchPlantas();
    } catch {
      setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Plantas</h2>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
        Nueva Planta
      </Button>
      {loading ? (
        <CircularProgress style={{ margin: 24 }} />
      ) : (
        <TableContainer component={Paper} style={{ marginTop: 24 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>CUIT</TableCell>
                <TableCell>Código Habilitación</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Activa</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plantas.map((planta) => (
                <TableRow key={planta.id}>
                  <TableCell>{planta.nombre}</TableCell>
                  <TableCell>{planta.cuit}</TableCell>
                  <TableCell>{planta.codigoHabilitacion}</TableCell>
                  <TableCell>{planta.direccion}</TableCell>
                  <TableCell>{planta.telefono}</TableCell>
                  <TableCell>{planta.email}</TableCell>
                  <TableCell>{planta.activa ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpen(planta)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(planta.id)} size="small">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Editar Planta' : 'Nueva Planta'}</DialogTitle>
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
            label="Código Habilitación"
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
            value={form.email || ''}
            onChange={handleChange}
            fullWidth
            type="email"
          />
          <TextField
            margin="dense"
            label="Activa"
            name="activa"
            value={form.activa ? 'Sí' : 'No'}
            onChange={e => setForm({ ...form, activa: e.target.value === 'Sí' })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editId ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PlantasPage;