import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import estadisticasService from '../services/estadisticas.service';
import type { EstadisticasResponse } from '../types/estadisticas.types';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Car,
  Package,
  Calendar,
} from 'lucide-react';

export const EstadisticasPage = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState<EstadisticasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      const data = await estadisticasService.getEstadisticas();
      setEstadisticas(data);
      setError('');
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? ((err as {response?: {data?: {message?: string}}}).response?.data?.message || 'Error al cargar las estadísticas')
        : 'Error al cargar las estadísticas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </Button>
      </Container>
    );
  }

  if (!estadisticas) {
    return null;
  }

  const getTendenciaIcon = (tendencia: 'subida' | 'bajada' | 'estable') => {
    switch (tendencia) {
      case 'subida':
        return <TrendingUp className="w-5 h-5" style={{ color: '#10b981' }} />;
      case 'bajada':
        return <TrendingDown className="w-5 h-5" style={{ color: '#ef4444' }} />;
      default:
        return <Minus className="w-5 h-5" style={{ color: '#6b7280' }} />;
    }
  };

  const getTendenciaColor = (tendencia: 'subida' | 'bajada' | 'estable') => {
    switch (tendencia) {
      case 'subida':
        return '#10b981';
      case 'bajada':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
        >
          Volver
        </Button>
        <Typography variant="h4" fontWeight="bold">
          📊 Estadísticas de la Planta
        </Typography>
      </Box>

      {/* Cards superiores */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Revisiones del Mes */}
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircle className="w-6 h-6" style={{ color: '#10b981' }} />
              <Typography variant="h6" fontWeight="bold">
                Revisiones del Mes
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {estadisticas.revisionesMes.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de revisiones
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle className="w-4 h-4" style={{ color: '#10b981' }} />
                  <Typography variant="body2">Aprobadas</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {estadisticas.revisionesMes.aprobadas}
                  </Typography>
                  <Chip
                    label={`${estadisticas.revisionesMes.porcentajeAprobadas.toFixed(1)}%`}
                    size="small"
                    sx={{ bgcolor: '#10b98120', color: '#10b981', fontWeight: 'bold' }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
                  <Typography variant="body2">Rechazadas</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {estadisticas.revisionesMes.rechazadas}
                  </Typography>
                  <Chip
                    label={`${estadisticas.revisionesMes.porcentajeRechazadas.toFixed(1)}%`}
                    size="small"
                    sx={{ bgcolor: '#ef444420', color: '#ef4444', fontWeight: 'bold' }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: '#eab308' }} />
                  <Typography variant="body2">Condicionales</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1" fontWeight="bold">
                    {estadisticas.revisionesMes.condicionales}
                  </Typography>
                  <Chip
                    label={`${estadisticas.revisionesMes.porcentajeCondicionales.toFixed(1)}%`}
                    size="small"
                    sx={{ bgcolor: '#eab30820', color: '#eab308', fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Obleas */}
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Package className="w-6 h-6" style={{ color: '#3b82f6' }} />
              <Typography variant="h6" fontWeight="bold">
                Estado de Obleas
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {estadisticas.obleas.disponibles}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Obleas disponibles
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Utilizadas este mes</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {estadisticas.obleas.utilizadasMes}
                </Typography>
              </Box>

              {estadisticas.obleas.alertaBajoStock && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  ⚠️ Stock bajo! Quedan menos de {estadisticas.obleas.umbralAlerta} obleas
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Tasa de Aprobación */}
        <Card sx={{ height: '100%', boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {getTendenciaIcon(estadisticas.tasaAprobacion.tendencia)}
              <Typography variant="h6" fontWeight="bold">
                Tasa de Aprobación
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {estadisticas.tasaAprobacion.mesActual.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mes actual
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Mes anterior</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {estadisticas.tasaAprobacion.mesAnterior.toFixed(1)}%
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Diferencia</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getTendenciaIcon(estadisticas.tasaAprobacion.tendencia)}
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: getTendenciaColor(estadisticas.tasaAprobacion.tendencia) }}
                  >
                    {estadisticas.tasaAprobacion.diferencia > 0 ? '+' : ''}
                    {estadisticas.tasaAprobacion.diferencia.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Tablas centrales */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
        {/* Tendencia últimos 6 meses */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              📈 Tendencia de Aprobación (6 meses)
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Mes</strong></TableCell>
                    <TableCell align="right"><strong>Total</strong></TableCell>
                    <TableCell align="right"><strong>% Aprobación</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estadisticas.tasaAprobacion.ultimos6Meses.map((mes, index) => (
                    <TableRow key={index}>
                      <TableCell>{mes.mes} {mes.anio}</TableCell>
                      <TableCell align="right">{mes.total}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${mes.porcentaje.toFixed(1)}%`}
                          size="small"
                          sx={{
                            bgcolor: mes.porcentaje >= 80 ? '#10b98120' : mes.porcentaje >= 60 ? '#eab30820' : '#ef444420',
                            color: mes.porcentaje >= 80 ? '#10b981' : mes.porcentaje >= 60 ? '#eab308' : '#ef4444',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Vehículos por Tipo */}
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Car className="w-6 h-6" style={{ color: '#a855f7' }} />
              <Typography variant="h6" fontWeight="bold">
                Distribución por Tipo de Vehículo
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell align="right"><strong>Cantidad</strong></TableCell>
                    <TableCell align="right"><strong>%</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estadisticas.vehiculosPorTipo.map((tipo, index) => (
                    <TableRow key={index}>
                      <TableCell>{tipo.tipo}</TableCell>
                      <TableCell align="right">
                        <strong>{tipo.cantidad}</strong>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${tipo.porcentaje.toFixed(1)}%`}
                          size="small"
                          sx={{ bgcolor: '#a855f720', color: '#a855f7', fontWeight: 'bold' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Próximos Vencimientos */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Calendar className="w-6 h-6" style={{ color: '#ec4899' }} />
            <Typography variant="h6" fontWeight="bold">
              Próximos Vencimientos (30-60 días)
            </Typography>
          </Box>

          {estadisticas.proximosVencimientos.length === 0 ? (
            <Alert severity="info">
              No hay vehículos con vencimientos próximos en los próximos 60 días
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Dominio</strong></TableCell>
                    <TableCell><strong>Vehículo</strong></TableCell>
                    <TableCell><strong>Tipo</strong></TableCell>
                    <TableCell align="center"><strong>Fecha Vencimiento</strong></TableCell>
                    <TableCell align="center"><strong>Días Restantes</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estadisticas.proximosVencimientos.map((vehiculo) => (
                    <TableRow key={vehiculo.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {vehiculo.dominio}
                        </Typography>
                      </TableCell>
                      <TableCell>{vehiculo.marca} {vehiculo.modelo}</TableCell>
                      <TableCell>{vehiculo.tipoVehiculo || 'N/A'}</TableCell>
                      <TableCell align="center">
                        {new Date(vehiculo.fechaVencimiento).toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${vehiculo.diasRestantes} días`}
                          size="small"
                          sx={{
                            bgcolor: vehiculo.diasRestantes <= 30 ? '#ef444420' : '#eab30820',
                            color: vehiculo.diasRestantes <= 30 ? '#ef4444' : '#eab308',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};
