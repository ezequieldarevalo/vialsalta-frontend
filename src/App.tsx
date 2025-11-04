import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BloquesPage } from './pages/BloquesPage';
import VerificarPage from './pages/VerificarPage';
import { UserRole } from './types/auth.types';
import RevisionesPage from './pages/RevisionesPage';
import VehiculosPage from './pages/VehiculosPage';
import PlantasPage from './pages/PlantasPage';
import MunicipiosPage from './pages/MunicipiosPage';
import UsersPage from './pages/UsersPage';
import TiposVehiculoPage from './pages/TiposVehiculoPage';
import { EstadisticasPage } from './pages/EstadisticasPage';


function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bloques"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CAMARA]}>
                <BloquesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/revisiones"
            element={
              <ProtectedRoute allowedRoles={[UserRole.PLANTA_ADMIN, UserRole.PLANTA_OPERADOR]}>
                <RevisionesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehiculos"
            element={
              <ProtectedRoute allowedRoles={[UserRole.PLANTA_ADMIN, UserRole.PLANTA_OPERADOR]}>
                <VehiculosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plantas"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CAMARA]}>
                <PlantasPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/municipios"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CAMARA]}>
                <MunicipiosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CAMARA]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tipos-vehiculo"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CAMARA]}>
                <TiposVehiculoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estadisticas"
            element={
              <ProtectedRoute allowedRoles={[UserRole.PLANTA_ADMIN]}>
                <EstadisticasPage />
              </ProtectedRoute>
            }
          />
          <Route path="/verificar/:codigoQr?" element={<VerificarPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
