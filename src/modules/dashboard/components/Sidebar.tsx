import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  section?: string;
}

/**
 * Componente de barra lateral (sidebar) con navegación según el rol
 */
export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Definir menú según el rol del usuario
  const getMenuItems = (): MenuItem[] => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { label: 'Usuarios', path: '/admin/users', icon: '👥', section: 'Admin' },
        ];

      case 'manager':
        return [
          { label: 'Dashboard', path: '/manager/dashboard', icon: '📊', section: 'Manager' },
          { label: 'Turnos', path: '/manager/shifts', icon: '🕐', section: 'Manager' },
          { label: 'Dispositivos', path: '/manager/devices', icon: '📱', section: 'Manager' },
          { label: 'Reportes', path: '/manager/reports', icon: '📈', section: 'Manager' },
          { label: 'Exportación', path: '/manager/export', icon: '📤', section: 'Manager' },
        ];

      case 'worker':
        return [
          { label: 'Dashboard', path: '/worker/dashboard', icon: '📊', section: 'Worker' },
          { label: 'Mis Turnos', path: '/worker/shifts', icon: '🕐', section: 'Worker' },
        ];

      default:
        return [];
    }
  };

  const allMenuItems = getMenuItems();

  // Verificar si una ruta está activa
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Agrupar por sección
  const groupedItems = allMenuItems.reduce((acc, item) => {
    const section = item.section || 'Otros';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div style={{
      width: '260px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
          }}>
            <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            margin: 0
          }}>
            Turnos y Asistencia
          </h1>
        </div>
        {user && (
          <p style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '0.875rem',
            margin: 0,
            marginTop: '0.25rem'
          }}>
            {user.name || 'Usuario'} ({user.role || 'guest'})
          </p>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} style={{ marginBottom: '1.5rem' }}>
            <div style={{
              padding: '0 1.5rem 0.5rem',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {section}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path} style={{ margin: '0.25rem 0' }}>
                    <Link
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1.5rem',
                        color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: active ? '600' : '500',
                        background: active
                          ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)'
                          : 'transparent',
                        borderLeft: active ? '3px solid #667eea' : '3px solid transparent',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                        }
                      }}
                    >
                      {item.icon && (
                        <span style={{ marginRight: '0.75rem', fontSize: '1.125rem' }}>
                          {item.icon}
                        </span>
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
};

