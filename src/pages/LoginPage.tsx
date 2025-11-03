import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Container,
  InputAdornment,
} from '@mui/material';
import { LogIn, Mail, Lock, AlertCircle, Shield, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('¡Inicio de sesión exitoso!', {
        icon: '🎉',
        duration: 2000,
      });
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      toast.error(errorMessage, {
        icon: '🚫',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Credenciales de ejemplo para facilitar el testing
  const testCredentials = [
    // Salta - Cámara
    { email: 'admin@camarasalta.gob.ar', password: 'Password123!', role: 'CAMARA', provincia: 'Salta' },
    // Salta - Plantas
    { email: 'admin.salta.centro@vtvsalta.com.ar', password: 'Password123!', role: 'PLANTA_ADMIN', provincia: 'Salta' },
    { email: 'operador.salta.centro@vtvsalta.com.ar', password: 'Password123!', role: 'PLANTA_OPERADOR', provincia: 'Salta' },
    { email: 'admin.salta.norte@vtvsalta.com.ar', password: 'Password123!', role: 'PLANTA_ADMIN', provincia: 'Salta' },
    { email: 'operador.salta.norte@vtvsalta.com.ar', password: 'Password123!', role: 'PLANTA_OPERADOR', provincia: 'Salta' },
    { email: 'admin.salta.oran@vtvoran.com.ar', password: 'Password123!', role: 'PLANTA_ADMIN', provincia: 'Salta' },
    { email: 'operador.salta.oran@vtvoran.com.ar', password: 'Password123!', role: 'PLANTA_OPERADOR', provincia: 'Salta' },
    // Salta - Municipio
    { email: 'fiscal@saltacapital.gob.ar', password: 'Password123!', role: 'MUNICIPIO', provincia: 'Salta' },
    // Córdoba - Cámara
    { email: 'admin@camaracordoba.org.ar', password: 'Password123!', role: 'CAMARA', provincia: 'Córdoba' },
    // Córdoba - Plantas
    { email: 'admin.cordoba.centro@rtocordoba.com.ar', password: 'Password123!', role: 'PLANTA_ADMIN', provincia: 'Córdoba' },
    { email: 'operador.cordoba.centro@rtocordoba.com.ar', password: 'Password123!', role: 'PLANTA_OPERADOR', provincia: 'Córdoba' },
    { email: 'admin.cordoba.villamaria@rtovmaria.com.ar', password: 'Password123!', role: 'PLANTA_ADMIN', provincia: 'Córdoba' },
    { email: 'operador.cordoba.villamaria@rtovmaria.com.ar', password: 'Password123!', role: 'PLANTA_OPERADOR', provincia: 'Córdoba' },
    // Córdoba - Municipio
    { email: 'fiscal@cordobacapital.gob.ar', password: 'Password123!', role: 'MUNICIPIO', provincia: 'Córdoba' },
    // Tucumán - Cámara
    { email: 'admin@camaratucuman.gob.ar', password: 'Password123!', role: 'CAMARA', provincia: 'Tucumán' },
    // Tucumán - Planta
    { email: 'admin.tucuman.centro@vtvtucuman.com.ar', password: 'Password123!', role: 'PLANTA_ADMIN', provincia: 'Tucumán' },
    { email: 'operador.tucuman.centro@vtvtucuman.com.ar', password: 'Password123!', role: 'PLANTA_OPERADOR', provincia: 'Tucumán' },
    // Tucumán - Municipio
    { email: 'fiscal@smtucuman.gob.ar', password: 'Password123!', role: 'MUNICIPIO', provincia: 'Tucumán' },
  ];

  const fillCredentials = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    toast.success('Credenciales cargadas', {
      icon: '✅',
      duration: 1500,
    });
  };

  const getRoleColor = (role: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    if (role === 'CAMARA') return 'primary';
    if (role === 'PLANTA_ADMIN') return 'secondary';
    if (role === 'PLANTA_OPERADOR') return 'info';
    if (role === 'MUNICIPIO') return 'success';
    return 'default';
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'font-medium',
          style: {
            background: '#fff',
            color: '#363636',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          },
        }}
      />
      
      {/* Background con gradiente animado */}
      <Box sx={{ 
        minHeight: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)'
      }}>
        {/* Elementos decorativos flotantes */}
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <motion.div
            style={{
              position: 'absolute',
              top: '5rem',
              left: '2.5rem',
              width: '18rem',
              height: '18rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              filter: 'blur(80px)'
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: '2.5rem',
              width: '24rem',
              height: '24rem',
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '50%',
              filter: 'blur(80px)'
            }}
            animate={{
              x: [0, -100, 0],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '16rem',
              height: '16rem',
              background: 'rgba(129, 140, 248, 0.1)',
              borderRadius: '50%',
              filter: 'blur(80px)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </Box>

        {/* Contenido principal */}
        <Container sx={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '28rem', position: 'relative' }}
          >
            {/* Efecto de resplandor detrás del card */}
            <Box sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(96,165,250,0.2), rgba(129,140,248,0.2), rgba(168,85,247,0.2))',
              borderRadius: 6,
              filter: 'blur(80px)'
            }} />
            
            <Card sx={{ 
              position: 'relative', 
              boxShadow: 8, 
              border: '2px solid rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(40px)',
              bgcolor: 'rgba(255,255,255,0.9)',
              overflow: 'hidden'
            }}>
              {/* Línea decorativa superior */}
              <Box sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)'
              }} />
              
              {/* Header */}
              <Box sx={{ pt: 5, pb: 4, px: 3, textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1 
                  }}
                  style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
                      borderRadius: 6,
                      filter: 'blur(24px)',
                      opacity: 0.6,
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    <Box sx={{ 
                      position: 'relative',
                      background: 'linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)',
                      p: 2.5,
                      borderRadius: 6,
                      boxShadow: 3
                    }}>
                      <Shield style={{ width: '3.5rem', height: '3.5rem', color: 'white', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
                    </Box>
                  </Box>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}>
                    Sistema VTV
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                    <Sparkles className="w-4 h-4" style={{ color: '#eab308' }} />
                    <Typography variant="body1" fontWeight="500">
                      Revisión Técnica Vehicular
                    </Typography>
                    <Sparkles className="w-4 h-4" style={{ color: '#eab308' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Multi-Provincia • Argentina
                  </Typography>
                </motion.div>
              </Box>

              <CardContent sx={{ px: 3, pb: 3 }}>
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail className="w-4 h-4" style={{ color: '#2563eb' }} />
                      Correo Electrónico
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail className="w-5 h-5" style={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover': {
                            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)',
                          }
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="600" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lock className="w-4 h-4" style={{ color: '#2563eb' }} />
                      Contraseña
                    </Typography>
                    <TextField
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock className="w-5 h-5" style={{ color: '#9ca3af' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover': {
                            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.2)',
                          }
                        }
                      }}
                    />
                  </Box>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert severity="error" icon={<AlertCircle className="h-5 w-5" />}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ 
                        height: '56px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        background: 'linear-gradient(90deg, #2563eb, #4f46e5, #7c3aed)',
                        boxShadow: 3,
                        '&:hover': {
                          background: 'linear-gradient(90deg, #1d4ed8, #4338ca, #6d28d9)',
                          boxShadow: 5,
                        }
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{
                              width: '20px',
                              height: '20px',
                              border: '3px solid white',
                              borderTop: '3px solid transparent',
                              borderRadius: '50%'
                            }}
                          />
                          <span>Ingresando...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LogIn className="h-5 w-5" />
                          <span>Iniciar Sesión</span>
                        </Box>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                {/* Credenciales de prueba */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#10b981' }} />
                      <Typography variant="body2" fontWeight="600" textAlign="center">
                        Credenciales de Prueba
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      maxHeight: '320px', 
                      overflowY: 'auto', 
                      pr: 0.5,
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                      },
                    }}>
                      {testCredentials.map((cred, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ position: 'relative', marginBottom: '0.5rem' }}
                        >
                          <Box
                            component="button"
                            type="button"
                            onClick={() => fillCredentials(cred.email, cred.password)}
                            sx={{
                              position: 'relative',
                              width: '100%',
                              textAlign: 'left',
                              px: 2,
                              py: 1.75,
                              background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.6))',
                              backdropFilter: 'blur(4px)',
                              borderRadius: 3,
                              border: '2px solid rgba(229,231,235,0.5)',
                              boxShadow: 1,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              '&:hover': {
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                                borderColor: 'primary.main',
                                boxShadow: 2,
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Chip 
                                  label={cred.role}
                                  color={getRoleColor(cred.role)}
                                  size="small"
                                  sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight="bold" color="text.primary">
                                    {cred.provincia}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" sx={{ transition: 'color 0.2s' }}>
                                    {cred.email.split('@')[0]}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ 
                                opacity: 0, 
                                transition: 'all 0.2s',
                                'button:hover &': {
                                  opacity: 1,
                                  transform: 'translateX(0)',
                                },
                                transform: 'translateX(8px)'
                              }}>
                                <Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 2 }}>
                                  <LogIn className="w-4 h-4" style={{ color: '#2563eb' }} />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                    
                    <Typography variant="caption" textAlign="center" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Contraseña para todas: <Box component="code" sx={{ bgcolor: 'grey.100', px: 1, py: 0.5, borderRadius: 1, fontFamily: 'monospace' }}>Password123!</Box>
                    </Typography>
                  </Box>
                </motion.div>
              </CardContent>
            </Card>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography 
                variant="body2" 
                textAlign="center" 
                sx={{ 
                  mt: 3, 
                  color: 'rgba(255,255,255,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <Shield className="w-4 h-4" />
                Sistema Seguro con Certificados Criptográficos
              </Typography>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};
