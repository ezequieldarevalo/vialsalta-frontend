import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Car, 
  Package, 
  CheckCircle, 
  Factory, 
  Building2, 
  BarChart3, 
  Users, 
  Settings,
  FileText,
  CreditCard
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
      case 'PLANTA':
      case UserRole.PLANTA:
        return 'Planta de RTV';
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Bloques de Obleas"
              description="Gestionar bloques de obleas para asignar a plantas"
              icon={Package}
              color="#3b82f6"
              onClick={() => navigate('/bloques')}
            />
            <DashboardCard
              title="Vehículos"
              description="Registrar y gestionar vehículos"
              icon={Car}
              color="#6366f1"
              onClick={() => navigate('/vehiculos')}
            />
            <DashboardCard
              title="Revisiones Técnicas"
              description="Crear revisiones y asignar obleas"
              icon={CheckCircle}
              color="#10b981"
              onClick={() => navigate('/revisiones')}
            />
            <DashboardCard
              title="Plantas"
              description="Administrar plantas de revisión técnica"
              icon={Factory}
              color="#14b8a6"
            />
            <DashboardCard
              title="Municipios"
              description="Gestionar municipios y fiscales"
              icon={Building2}
              color="#a855f7"
            />
            <DashboardCard
              title="Reportes"
              description="Visualizar estadísticas y reportes generales"
              icon={BarChart3}
              color="#eab308"
            />
            <DashboardCard
              title="Usuarios"
              description="Administrar usuarios del sistema"
              icon={Users}
              color="#ec4899"
            />
            <DashboardCard
              title="Configuración"
              description="Configuración general del sistema"
              icon={Settings}
              color="#6b7280"
            />
          </div>
        );

      case UserRole.PLANTA:
      case 'PLANTA':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard
              title="Revisiones Técnicas"
              description="Crear y gestionar revisiones"
              icon={CheckCircle}
              color="#10b981"
              onClick={() => navigate('/revisiones')}
            />
            <DashboardCard
              title="Vehículos"
              description="Registrar y consultar vehículos"
              icon={Car}
              color="#6366f1"
              onClick={() => navigate('/vehiculos')}
            />
            <DashboardCard
              title="Mis Obleas"
              description="Ver obleas disponibles y asignadas"
              icon={FileText}
              color="#3b82f6"
            />
            <DashboardCard
              title="Certificados"
              description="Gestionar certificados emitidos"
              icon={FileText}
              color="#eab308"
            />
            <DashboardCard
              title="Estadísticas"
              description="Ver rendimiento de la planta"
              icon={BarChart3}
              color="#ec4899"
            />
          </div>
        );

      case UserRole.MUNICIPIO:
      case 'MUNICIPIO':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Rol no reconocido</h3>
            <p className="text-gray-600">Rol recibido: {JSON.stringify(user.role)}</p>
            <p className="text-gray-600 mt-2">Usuario: {JSON.stringify(user)}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Sistema de Obleas RTV</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500">{getRoleName(user.role)}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {user.username}
          </h2>
          <p className="text-gray-600">Panel de control - {getRoleName(user.role)}</p>
        </div>

        {getDashboardContent()}
      </main>
    </div>
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
      className="cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden border-t-4 group"
      style={{ borderTopColor: color }}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div 
            className="p-3 rounded-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
