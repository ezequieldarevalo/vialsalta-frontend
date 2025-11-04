import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Warning,
  Search,
  DirectionsCar,
  CalendarToday,
  Article,
  Business,
  LocationOn,
  QrCode,
  ArrowBack,
} from '@mui/icons-material';
import certificadosService from '../services/certificados.service';
import type { VerificacionCertificado } from '../services/certificados.service';

export default function VerificarPage() {
  const { codigoQr } = useParams<{ codigoQr?: string }>();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(codigoQr || '');
  const [resultado, setResultado] = useState<VerificacionCertificado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResultado(null);
    setLoading(true);

    try {
      const data = await certificadosService.verificar(codigo);
      setResultado(data);
    } catch (err: unknown) {
      console.error('Error al verificar:', err);
      setError('Certificado no encontrado o código inválido');
    } finally {
      setLoading(false);
    }
  };

  // Auto-verificar si viene código QR en la URL
  useEffect(() => {
    if (codigoQr) {
      const fakeEvent = {
        preventDefault: () => {},
      } as React.FormEvent;
      handleVerificar(fakeEvent);
    }
  }, [codigoQr]); // eslint-disable-line react-hooks/exhaustive-deps

  const esCondicional = resultado?.revision?.resultado === 'CONDICIONAL';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 0 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              variant="text"
              color="primary"
            >
              Volver
            </Button>
            <Divider orientation="vertical" flexItem />
            <QrCode color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Verificación de Certificado
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sistema de Revisión Técnica Vehicular
              </Typography>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Título */}
        <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center' }}>
          <Search color="primary" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Verificación de Certificado RTV
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ingrese el código QR para verificar la autenticidad del certificado
          </Typography>
        </Paper>

        {/* Formulario */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleVerificar}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Código QR del Certificado"
                placeholder="Ejemplo: QR-12345-1234567890-1 o COND-1-1234567890"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: <QrCode sx={{ mr: 1, color: 'action.active' }} />,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !codigo}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Verificando...' : 'Verificar Certificado'}
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* Error */}
        {error && (
          <Alert severity="error" icon={<Cancel />} sx={{ mb: 4 }}>
            <AlertTitle>Error de Verificación</AlertTitle>
            {error}
          </Alert>
        )}

        {/* Resultado Válido */}
        {resultado && resultado.valido && (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              bgcolor: esCondicional ? 'warning.lighter' : 'success.lighter',
              border: 2,
              borderColor: esCondicional ? 'warning.main' : 'success.main',
            }}
          >
            {/* Header del Resultado */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {esCondicional ? (
                <Warning sx={{ fontSize: 50, color: 'warning.main', mr: 2 }} />
              ) : (
                <CheckCircle sx={{ fontSize: 50, color: 'success.main', mr: 2 }} />
              )}
              <Box>
                <Typography variant="h4" fontWeight="bold" color={esCondicional ? 'warning.dark' : 'success.dark'}>
                  {esCondicional ? 'Certificado Temporal' : 'Certificado Válido'}
                </Typography>
                <Typography variant="body1" color={esCondicional ? 'warning.dark' : 'success.dark'}>
                  {esCondicional
                    ? 'Revisión CONDICIONAL - Válido por 60 días'
                    : 'Este certificado es auténtico y está vigente'}
                </Typography>
              </Box>
            </Box>

            {/* Información del Certificado */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Article sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Información del Certificado
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Número de Certificado
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {resultado.certificado.numero}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Emisión
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight="bold">
                        {new Date(resultado.certificado.fechaEmision).toLocaleDateString('es-AR')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Vencimiento
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight="bold">
                        {new Date(resultado.certificado.fechaVencimiento).toLocaleDateString('es-AR')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Estado
                    </Typography>
                    <Box>
                      <Chip
                        icon={<CheckCircle />}
                        label="VIGENTE"
                        color={esCondicional ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Información del Vehículo */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCar sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Datos del Vehículo
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Dominio / Patente
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {resultado.vehiculo.dominio}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="caption" color="text.secondary">
                      Marca y Modelo
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {resultado.vehiculo.marca} {resultado.vehiculo.modelo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="text.secondary">
                      Año
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {resultado.vehiculo.anio}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Información de la Revisión */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Datos de la Revisión
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Fecha de Revisión
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {new Date(resultado.revision.fecha).toLocaleDateString('es-AR')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Resultado
                    </Typography>
                    <Box>
                      <Chip
                        icon={esCondicional ? <Warning /> : <CheckCircle />}
                        label={resultado.revision.resultado}
                        color={esCondicional ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Planta de Revisión
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {resultado.revision.planta}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">
                      Provincia
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn fontSize="small" color="action" />
                      <Typography variant="body1" fontWeight="bold">
                        {resultado.revision.provincia}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Oblea o mensaje de certificado temporal */}
                  {resultado.oblea ? (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        Número de Oblea
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        #{resultado.oblea.numero}
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Alert severity="warning" icon={<Warning />}>
                        <AlertTitle>CERTIFICADO TEMPORAL</AlertTitle>
                        Sin oblea asignada - Válido por 60 días
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            {/* Advertencia */}
            <Alert
              severity={esCondicional ? 'warning' : 'info'}
              icon={<Warning />}
            >
              <AlertTitle>
                {esCondicional ? 'CERTIFICADO TEMPORAL - 60 DÍAS' : 'IMPORTANTE'}
              </AlertTitle>
              {esCondicional
                ? 'Este es un certificado temporal por revisión CONDICIONAL. El vehículo debe corregir los defectos y realizar una nueva revisión antes del vencimiento para obtener la aprobación definitiva y oblea física.'
                : 'Este certificado es válido únicamente con la oblea física adherida al parabrisas del vehículo.'}
            </Alert>
          </Paper>
        )}

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            Sistema de Revisión Técnica Vehicular
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Esta verificación es pública y no requiere autenticación
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
