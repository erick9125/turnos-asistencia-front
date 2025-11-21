import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LoginForm } from '../components/LoginForm';

/**
 * Página de inicio de sesión
 * Redirige a la página principal si el usuario ya está autenticado
 */
export const LoginPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir según el rol
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'admin':
          navigate('/admin/users', { replace: true });
          break;
        case 'manager':
          navigate('/manager/shifts', { replace: true });
          break;
        case 'worker':
          navigate('/worker/shifts', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem'
      }}>
        {/* Logo/Icono */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(102, 126, 234, 0.3)'
          }}>
            <svg
              style={{ width: '32px', height: '32px', color: 'white' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Título y subtítulo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            Sistema de Turnos
          </h1>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem',
            margin: 0
          }}>
            y Asistencia
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            margin: 0
          }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        {/* Formulario */}
        <LoginForm />
      </div>
    </div>
  );
};

