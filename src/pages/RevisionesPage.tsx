import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import revisionesService from '../services/revisiones.service';
import vehiculosService from '../services/vehiculos.service';
import certificadosService from '../services/certificados.service';
import type { Revision, CreateRevisionDto, ResultadoRevision, EstadisticasRevisiones } from '../types/revisiones.types';
import type { Vehiculo } from '../types/vehiculos.types';
import { UserRole } from '../types/auth.types';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, Logout, CheckCircle, Cancel, Warning, Add, Close, Description } from '@mui/icons-material';

export default function RevisionesPage() {
  const { user, logout } = useAuth();
  const [revisiones, setRevisiones] = useState<Revision[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasRevisiones | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [dominioSearch, setDominioSearch] = useState('');
  const [formData, setFormData] = useState<CreateRevisionDto>({
    vehiculoId: 0,
    resultado: 'APROBADO' as ResultadoRevision,
    observaciones: '',
    kilometraje: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [revisionesData, vehiculosData, stats] = await Promise.all([
        revisionesService.getAll(),
        vehiculosService.getAll(true), // Solo vehículos disponibles para revisión
        revisionesService.getEstadisticas(),
      ]);
      setRevisiones(revisionesData);
      setVehiculos(vehiculosData);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.vehiculoId === 0) {
      alert('Debe seleccionar un vehículo');
      return;
    }
    
    try {
      await revisionesService.create(formData);
      alert('Revisión técnica creada exitosamente');
      setShowForm(false);
      setFormData({
        vehiculoId: 0,
        resultado: 'APROBADO' as ResultadoRevision,
        observaciones: '',
        kilometraje: 0,
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear revisión');
    }
  };

  const handleAsignarOblea = async (revisionId: number) => {
    if (!confirm('¿Desea asignar una oblea a esta revisión aprobada?')) return;
    
    try {
      await revisionesService.asignarOblea(revisionId);
      alert('Oblea asignada y certificado generado exitosamente');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al asignar oblea');
    }
  };

  const handleDescargarCertificado = async (revisionId: number) => {
    try {
      await certificadosService.descargarPDF(revisionId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al descargar certificado');
    }
  };

  const getResultadoBadge = (resultado: ResultadoRevision) => {
    const config = {
      APROBADO: { color: 'success' as const, icon: <CheckCircle sx={{ fontSize: 16 }} /> },
      RECHAZADO: { color: 'error' as const, icon: <Cancel sx={{ fontSize: 16 }} /> },
      CONDICIONAL: { color: 'warning' as const, icon: <Warning sx={{ fontSize: 16 }} /> },
    };
    return config[resultado] || { color: 'default' as const, icon: null };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Determinar permisos
  const isPlantaOperador = user?.role === UserRole.PLANTA_OPERADOR || user?.role === 'PLANTA_OPERADOR';
  const isPlantaAdmin = user?.role === UserRole.PLANTA_ADMIN || user?.role === 'PLANTA_ADMIN';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header unificado */}
      <Box sx={{ bgcolor: 'white', boxShadow: 2, mb: 3 }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: 3, py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{
              background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Revisiones Técnicas Vehiculares (RTV)
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
      <Box px={3} maxWidth="1400px" mx="auto" pb={4}>
        {/* Estadísticas */}
        {estadisticas && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            {/* Total */}
            <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>Total Revisiones</Typography>
                <Typography variant="h3" fontWeight="bold">{estadisticas.total}</Typography>
              </CardContent>
            </Card>
            
            {/* Aprobadas */}
            <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>Aprobadas</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>{estadisticas.aprobadas}</Typography>
                <Chip label={`Tasa: ${estadisticas.tasaAprobacion}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
              </CardContent>
            </Card>
            
            {/* Rechazadas */}
            <Card sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>Rechazadas</Typography>
                <Typography variant="h3" fontWeight="bold">{estadisticas.rechazadas}</Typography>
              </CardContent>
            </Card>
            
            {/* Con Oblea */}
            <Card sx={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>Con Oblea</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>{estadisticas.conOblea}</Typography>
                <Chip label={`Sin oblea: ${estadisticas.sinOblea}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }} />
              </CardContent>
            </Card>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Listado de Revisiones
          </Typography>
          {isPlantaOperador && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="contained"
              color={showForm ? 'error' : 'success'}
              startIcon={showForm ? <Close /> : <Add />}
            >
              {showForm ? 'Cancelar' : 'Nueva Revisión'}
            </Button>
          )}
        </Box>

          {/* Dialog Modal para Nueva Revisión */}
          <Dialog 
            open={showForm && isPlantaOperador} 
            onClose={() => setShowForm(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: 5
              }
            }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              ✨ Nueva Revisión Técnica
            </DialogTitle>
            
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                {/* Autocomplete para Vehículo */}
                <Box>
                  <Autocomplete
                    freeSolo
                    options={vehiculos}
                    getOptionLabel={(option) => 
                      typeof option === 'string' 
                        ? option 
                        : `${option.dominio} - ${option.marca} ${option.modelo} (${option.anio})`
                    }
                    inputValue={dominioSearch}
                    onInputChange={(_, newValue) => {
                      setDominioSearch(newValue.toUpperCase());
                    }}
                    onChange={(_, newValue) => {
                      if (newValue && typeof newValue !== 'string') {
                        setFormData({ ...formData, vehiculoId: newValue.id });
                        setDominioSearch(`${newValue.dominio} - ${newValue.marca} ${newValue.modelo} (${newValue.anio})`);
                      }
                    }}
                    filterOptions={(options) => 
                      options.filter((v) =>
                        v.dominio.toUpperCase().includes(dominioSearch.toUpperCase()) ||
                        `${v.marca} ${v.modelo}`.toUpperCase().includes(dominioSearch.toUpperCase())
                      )
                    }
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography fontWeight="600">{option.dominio}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.marca} {option.modelo} ({option.anio})
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Buscar Vehículo por Dominio"
                        required
                        placeholder="Ej: ABC123"
                        inputProps={{
                          ...params.inputProps,
                          style: { textTransform: 'uppercase' }
                        }}
                      />
                    )}
                  />
                  {formData.vehiculoId > 0 && (
                    <Alert severity="success" sx={{ mt: 1 }} icon={false}>
                      ✓ Vehículo seleccionado
                    </Alert>
                  )}
                </Box>

                {/* Select de Resultado */}
                <Box>
                  <TextField
                    select
                    fullWidth
                    label="Resultado de la Revisión"
                    required
                    value={formData.resultado}
                    onChange={(e) => setFormData({ ...formData, resultado: e.target.value as ResultadoRevision })}
                  >
                    <MenuItem value="APROBADO">✅ APROBADO</MenuItem>
                    <MenuItem value="RECHAZADO">❌ RECHAZADO</MenuItem>
                    <MenuItem value="CONDICIONAL">⚠️ CONDICIONAL</MenuItem>
                  </TextField>
                  {formData.resultado === 'APROBADO' && (
                    <Alert severity="info" sx={{ mt: 1.5 }}>
                      Luego podrá asignar una oblea automáticamente
                    </Alert>
                  )}
                </Box>

                {/* Kilometraje */}
                <TextField
                  type="number"
                  label="Kilometraje"
                  fullWidth
                  inputProps={{ min: 0 }}
                  value={formData.kilometraje || ''}
                  onChange={(e) => setFormData({ ...formData, kilometraje: parseInt(e.target.value) || 0 })}
                  placeholder="45000"
                />

                {/* Observaciones */}
                <TextField
                  label="Observaciones"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Detalles de la revisión..."
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, pt: 1, gap: 1 }}>
              <Button 
                onClick={() => setShowForm(false)}
                variant="outlined"
                color="inherit"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreate}
                variant="contained"
                color="primary"
                sx={{ 
                  px: 3,
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1d4ed8, #4338ca)'
                  }
                }}
              >
                Crear Revisión
              </Button>
            </DialogActions>
          </Dialog>

          {/* Lista de revisiones */}
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vehículo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Resultado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Oblea</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Vencimiento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {revisiones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay revisiones registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  revisiones.map((revision) => {
                    const resultadoConfig = getResultadoBadge(revision.resultado);
                    return (
                      <TableRow key={revision.id} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>#{revision.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="600">
                            {revision.vehiculo?.dominio}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {revision.vehiculo?.marca} {revision.vehiculo?.modelo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={revision.resultado}
                            color={resultadoConfig.color}
                            icon={resultadoConfig.icon}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(revision.fechaRevision).toLocaleDateString('es-AR')}
                        </TableCell>
                        <TableCell>
                          {revision.oblea ? (
                            <Typography color="success.main" fontWeight="600">
                              #{revision.oblea.numero}
                            </Typography>
                          ) : (
                            <Typography color="text.disabled">
                              Sin asignar
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {revision.fechaVencimiento
                            ? new Date(revision.fechaVencimiento).toLocaleDateString('es-AR')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={1}>
                            {revision.resultado === 'APROBADO' && !revision.oleaId && isPlantaAdmin && (
                              <Button
                                onClick={() => handleAsignarOblea(revision.id)}
                                variant="contained"
                                size="small"
                                color="primary"
                              >
                                Asignar Oblea
                              </Button>
                            )}
                            {revision.oleaId && isPlantaAdmin && (
                              <Button
                                onClick={() => handleDescargarCertificado(revision.id)}
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<Description />}
                              >
                                Certificado
                              </Button>
                            )}
                            {revision.observaciones && (
                              <Button
                                onClick={() => alert(revision.observaciones)}
                                variant="text"
                                size="small"
                              >
                                Ver obs.
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Total: {revisiones.length} revisión(es)
          </Typography>
      </Box>
    </Box>
  );
}
