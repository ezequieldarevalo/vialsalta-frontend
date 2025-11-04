import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  Container,
} from '@mui/material';
import { 
  Car, 
  Package, 
  CheckCircle, 
  Factory, 
  Building2, 
  BarChart3, 
  Users, 
  FileText,
  CreditCard,
  Shield,
  LogOut,
  Sparkles,
  Settings
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  // Normalizar el rol (puede venir como string del localStorage)
  const userRole = (typeof user.role === 'string' ? user.role.toUpperCase() : user.role) as UserRole;

  const getRoleName = (role: UserRole | string) => {
    const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
    switch (normalizedRole) {
      case 'CAMARA':
      case UserRole.CAMARA:
        return 'Cámara de RTV';
      case 'PLANTA_ADMIN':
      case UserRole.PLANTA_ADMIN:
        return 'Admin de Planta';
      case 'PLANTA_OPERADOR':
      case UserRole.PLANTA_OPERADOR:
        return 'Operador de Planta';
      case 'MUNICIPIO':
      case UserRole.MUNICIPIO:
        return 'Municipio';
      default:
        return `${role} (desconocido)`;
    }
  };

  const getDashboardContent = () => {
    switch (userRole) {
      case UserRole.CAMARA:
      case 'CAMARA':
        return (
          <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DashboardCard
                title="Bloques de Obleas"
                description="Gestionar bloques de obleas para asignar a plantas"
                icon={Package}
                color="#3b82f6"
                onClick={() => navigate('/bloques')}
              />
              <DashboardCard
                title="Plantas"
                description="Administrar plantas de revisión técnica"
                icon={Factory}
                color="#14b8a6"
                onClick={() => navigate('/plantas')}
              />
              <DashboardCard
                title="Municipios"
                description="Gestionar municipios y fiscales"
                icon={Building2}
                color="#a855f7"
                onClick={() => navigate('/municipios')}
              />
              <DashboardCard
                title="Usuarios"
                description="Administrar usuarios del sistema"
                icon={Users}
                color="#ec4899"
                onClick={() => navigate('/usuarios')}
              />
              <DashboardCard
                title="Tipos de Vehículos"
                description="Configurar tipos de vehículos del sistema"
                icon={Settings}
                color="#f97316"
                onClick={() => navigate('/tipos-vehiculo')}
              />
            </Box>
          </Box>
        );

      case UserRole.PLANTA_ADMIN:
      case 'PLANTA_ADMIN':
        return (
          <Box sx={{ maxWidth: '900px', mx: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <DashboardCard
                title="Vehículos"
                description="Registrar y gestionar vehículos de la planta"
                icon={Car}
                color="#6366f1"
                onClick={() => navigate('/vehiculos')}
              />
              <DashboardCard
                title="Revisiones Técnicas"
                description="Ver y gestionar revisiones de la planta"
                icon={CheckCircle}
                color="#10b981"
                onClick={() => navigate('/revisiones')}
              />
              <DashboardCard
                title="Estadísticas"
                description="Métricas y rendimiento de la planta"
                icon={BarChart3}
                color="#ec4899"
                onClick={() => navigate('/estadisticas')}
              />
            </Box>
          </Box>
        );

      case UserRole.PLANTA_OPERADOR:
      case 'PLANTA_OPERADOR':
        return (
          <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
              <DashboardCard
                title="Revisiones Técnicas"
                description="Crear y editar revisiones propias"
                icon={CheckCircle}
                color="#10b981"
                onClick={() => navigate('/revisiones')}
              />
            </Box>
          </Box>
        );

      case UserRole.MUNICIPIO:
      case 'MUNICIPIO':
        return (
          <Box sx={{ maxWidth: '1100px', mx: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
              <DashboardCard
                title="Consultar Obleas"
                description="Verificar autenticidad de obleas"
                icon={Package}
                color="#3b82f6"
              />
              <DashboardCard
                title="Certificados"
                description="Consultar certificados emitidos"
                icon={FileText}
                color="#10b981"
              />
              <DashboardCard
                title="Vehículos"
                description="Buscar vehículos por dominio"
                icon={Car}
                color="#a855f7"
              />
              <DashboardCard
                title="Reportes"
                description="Estadísticas del municipio"
                icon={BarChart3}
                color="#eab308"
              />
              <DashboardCard
                title="Infracciones"
                description="Registrar vehículos en infracción"
                icon={CreditCard}
                color="#ef4444"
              />
              <DashboardCard
                title="Mi Perfil"
                description="Datos del fiscal municipal"
                icon={Users}
                color="#6b7280"
              />
            </Box>
          </Box>
        );

      default:
        return (
          <Box sx={{ 
            bgcolor: 'white', 
            borderRadius: 2, 
            boxShadow: 2, 
            p: 3,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 600, mb: 1 }}>
              Rol no reconocido
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rol recibido: {JSON.stringify(user.role)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Usuario: {JSON.stringify(user)}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Navbar */}
      <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 2 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
              p: 1,
              borderRadius: 2,
              boxShadow: 2
            }}>
              <Shield className="w-6 h-6" style={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Sistema VTV
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Revisión Técnica Vehicular
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="600">{user.username}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                <Sparkles className="w-3 h-3" style={{ color: '#eab308' }} />
                <Typography variant="caption" color="text.secondary">
                  {getRoleName(user.role)}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogOut className="w-4 h-4" />}
              onClick={logout}
              sx={{ 
                background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                fontWeight: 600,
                boxShadow: 2
              }}
            >
              Salir
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 5 }}>
          <Box sx={{ 
            maxWidth: '900px',
            mx: 'auto',
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: 4,
            p: 4,
            border: '2px solid',
            borderColor: 'grey.100'
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
                p: 2,
                borderRadius: 3,
                boxShadow: 3
              }}>
                <Users className="w-12 h-12" style={{ color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h3" sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  ¡Bienvenido, {user.username}!
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="500">
                  Panel de control - {getRoleName(user.role)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box>
          {getDashboardContent()}
        </Box>
      </Container>
    </Box>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

const DashboardCard = ({ title, description, icon: Icon, color, onClick }: DashboardCardProps) => {
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        overflow: 'hidden',
        border: '2px solid',
        borderColor: 'grey.100',
        bgcolor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03) translateY(-5px)',
          boxShadow: 8,
          '& .card-bar': {
            height: '12px'
          },
          '& .icon-container': {
            transform: 'scale(1.1) rotate(3deg)'
          },
          '& .card-title': {
            background: 'linear-gradient(90deg, #2563eb, #4f46e5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }
        }
      }}
    >
      <Box 
        className="card-bar"
        sx={{ 
          height: '8px', 
          width: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          transition: 'all 0.3s ease'
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box 
            className="icon-container"
            sx={{ 
              p: 2,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              borderLeft: `4px solid ${color}`,
              boxShadow: 2,
              transition: 'all 0.3s ease'
            }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              className="card-title"
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 1,
                transition: 'all 0.3s ease'
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {description}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
