import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        {/* Elementos decorativos flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
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
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
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
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"
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
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Efecto de resplandor detrás del card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-3xl" />
            
            <Card className="relative shadow-2xl border-2 border-white/20 backdrop-blur-xl bg-white/90 overflow-hidden">
              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
              
              <CardHeader className="space-y-3 text-center pb-8 pt-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1 
                  }}
                  className="flex justify-center mb-2"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-60 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-5 rounded-3xl shadow-xl">
                      <Shield className="w-14 h-14 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Sistema VTV
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <CardDescription className="text-base font-medium">
                      Revisión Técnica Vehicular
                    </CardDescription>
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Multi-Provincia • Argentina
                  </p>
                </motion.div>
              </CardHeader>

              <CardContent>
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Correo Electrónico
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative text-base font-medium"
                        placeholder="usuario@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" />
                      Contraseña
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="relative text-base font-medium"
                        placeholder="••••••••••"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-lg"
                    >
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-full h-14 text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-xl"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full" />
                          <span>Ingresando...</span>
                        </motion.div>
                      ) : (
                        <span className="flex items-center gap-3">
                          <LogIn className="h-5 w-5" />
                          Iniciar Sesión
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                {/* Credenciales de prueba */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 pt-6 border-t"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-sm font-semibold text-center">
                      Credenciales de Prueba
                    </p>
                  </div>
                  
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                    {testCredentials.map((cred, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.05 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
                        <button
                          type="button"
                          onClick={() => fillCredentials(cred.email, cred.password)}
                          className="relative w-full text-left px-4 py-3.5 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm hover:from-white/90 hover:to-white/70 transition-all rounded-xl border-2 border-gray-200/50 hover:border-primary/40 shadow-sm hover:shadow-md"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={
                                  cred.role === 'CAMARA' ? 'default' : 
                                  cred.role === 'PLANTA_ADMIN' ? 'secondary' :
                                  cred.role === 'PLANTA_OPERADOR' ? 'outline' :
                                  'outline'
                                }
                                className="font-bold text-xs px-3 py-1 shadow-sm"
                              >
                                {cred.role}
                              </Badge>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">
                                  {cred.provincia}
                                </span>
                                <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                                  {cred.email.split('@')[0]}
                                </span>
                              </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                              <div className="bg-primary/10 p-2 rounded-lg">
                                <LogIn className="w-4 h-4 text-primary" />
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Contraseña para todas: <code className="bg-muted px-2 py-1 rounded font-mono">Password123!</code>
                  </p>
                </motion.div>
              </CardContent>
            </Card>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6 text-white/80 text-sm"
            >
              <p className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                Sistema Seguro con Certificados Criptográficos
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
