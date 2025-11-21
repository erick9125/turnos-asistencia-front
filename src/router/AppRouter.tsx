import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

// Páginas de autenticación
import { LoginPage } from '../modules/auth/pages/LoginPage';

// Layouts
import { DashboardLayout } from '../modules/dashboard/layout/DashboardLayout';

// Páginas de Admin
import { UsersPage } from '../modules/admin/pages/UsersPage';

// Páginas de Manager
import { ManagerDashboard } from '../modules/manager/pages/ManagerDashboard';
import { ShiftsPage } from '../modules/manager/pages/ShiftsPage';
import { DevicesPage } from '../modules/manager/pages/DevicesPage';
import { ReportsPage } from '../modules/manager/pages/ReportsPage';
import { ExportPage } from '../modules/manager/pages/ExportPage';

// Páginas de Worker
import { WorkerDashboard } from '../modules/worker/pages/WorkerDashboard';
import { WorkerShiftsPage } from '../modules/worker/pages/WorkerShiftsPage';

/**
 * Componente que redirige según el rol del usuario autenticado
 * Debe estar dentro del AuthProvider para usar useAuth
 */
const RoleRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirigir según el rol
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/users" replace />;
    case 'manager':
      return <Navigate to="/manager/shifts" replace />;
    case 'worker':
      return <Navigate to="/worker/shifts" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

/**
 * Router principal de la aplicación
 * Define todas las rutas públicas y protegidas según roles
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta pública: Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ruta raíz: redirige a login por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas protegidas para Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="users" element={<UsersPage />} />
                    <Route path="*" element={<Navigate to="/admin/users" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para Manager */}
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<ManagerDashboard />} />
                    <Route path="shifts" element={<ShiftsPage />} />
                    <Route path="devices" element={<DevicesPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route path="export" element={<ExportPage />} />
                    <Route path="*" element={<Navigate to="/manager/shifts" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para Worker */}
          <Route
            path="/worker/*"
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <DashboardLayout>
                  <Routes>
                    <Route path="dashboard" element={<WorkerDashboard />} />
                    <Route path="shifts" element={<WorkerShiftsPage />} />
                    <Route path="*" element={<Navigate to="/worker/shifts" replace />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Ruta 404: redirige a login o según rol */}
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

