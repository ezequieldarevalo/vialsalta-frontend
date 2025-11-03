import React, { useEffect, useState } from 'react';
import { usersService } from '../services/users.service';
import type { User } from '../types/auth.types';
import { UserRole } from '../types/auth.types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit, ArrowBack, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface UserForm {
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  camaraId?: number;
  plantaId?: number;
  municipioId?: number;
}

const emptyForm: UserForm = {
  username: '',
  email: '',
  password: '',
  role: UserRole.PLANTA_OPERADOR,
};

const UsersPage: React.FC = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAll();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user?: User) => {
    if (user) {
      setForm({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        camaraId: user.camaraId,
        plantaId: user.plantaId,
        municipioId: user.municipioId,
      });
      setEditingId(user.id);
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
        await usersService.update(editingId, form);
      } else {
        await usersService.create(form as { username: string; email: string; password: string; role: UserRole });
      }
      await fetchUsers();
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    setLoading(true);
    try {
      await usersService.delete(id);
      await fetchUsers();
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
              Gestión de Usuarios
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
        >
          Nuevo Usuario
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.isActive ? 'Sí' : 'No'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(u)} size="small">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(u.id)} size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {loading ? 'Cargando...' : 'No hay usuarios registrados.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                margin="normal"
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="normal"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                margin="normal"
                label="Contraseña"
                name="password"
                value={form.password || ''}
                onChange={handleChange}
                fullWidth
                type="password"
                required={!editingId}
                helperText={editingId ? 'Dejar vacío para no cambiar' : ''}
              />
              <TextField
                margin="normal"
                label="Rol"
                name="role"
                value={form.role}
                onChange={handleChange}
                select
                fullWidth
                required
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </TextField>
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

export default UsersPage;
