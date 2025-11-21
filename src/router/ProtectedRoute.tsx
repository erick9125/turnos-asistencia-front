import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

/**
 * Componente para proteger rutas según autenticación y rol
 * Redirige a login si no está autenticado
 * Redirige a la página principal del rol si el rol no está permitido
 */
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene un rol permitido, redirigir según su rol
  if (user && !allowedRoles.includes(user.role)) {
    // Redirigir a la página principal según el rol del usuario
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
  }

  return <>{children}</>;
};

