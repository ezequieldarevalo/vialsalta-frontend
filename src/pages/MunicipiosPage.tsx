import React, { useEffect, useState } from 'react';
import { municipiosService } from '../services/municipios.service';
import type { Municipio, MunicipioForm } from '../types/municipios.types';
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Delete, Edit, ArrowBack, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

  const emptyForm: MunicipioForm = {
    nombre: '',
    codigo: '',
    porcentajeReparto: 0,
    activo: true,
  };

const MunicipiosPage: React.FC = () => {
  const { logout } = useAuth();
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<MunicipioForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMunicipios = async () => {
    setLoading(true);
    try {
      const data = await municipiosService.getAll();
      setMunicipios(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  const handleOpen = (municipio?: Municipio) => {
    if (municipio) {
      setForm({
        nombre: municipio.nombre,
        codigo: municipio.codigo,
        porcentajeReparto: municipio.porcentajeReparto,
        activo: municipio.activo,
      });
      setEditingId(municipio.id);
    } else {
      setForm(emptyForm);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await municipiosService.update(editingId, form);
      } else {
        await municipiosService.create(form);
      }
      await fetchMunicipios();
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este municipio?')) return;
    setLoading(true);
    try {
      await municipiosService.remove(id);
      await fetchMunicipios();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', boxShadow: 1, mb: 3 }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3, py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Gestión de Municipios
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
      <Box p={3} maxWidth="1200px" mx="auto">
        <Typography variant="h4" gutterBottom>Municipios</Typography>
        <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Nuevo Municipio
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>% Reparto</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {municipios.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.nombre}</TableCell>
                <TableCell>{m.codigo}</TableCell>
                <TableCell>{m.porcentajeReparto}%</TableCell>
                <TableCell>{m.activo ? 'Sí' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(m)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(m.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {municipios.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {loading ? 'Cargando...' : 'No hay municipios registrados.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Editar Municipio' : 'Nuevo Municipio'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="normal"
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="normal"
              label="Código"
              name="codigo"
              value={form.codigo}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="normal"
              label="Porcentaje de Reparto"
              name="porcentajeReparto"
              type="number"
              value={form.porcentajeReparto}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  name="activo"
                />
              }
              label="Activo"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {editingId ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      </Box>
    </Box>
  );
};

export default MunicipiosPage;
