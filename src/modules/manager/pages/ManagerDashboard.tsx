import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';

/**
 * Dashboard del manager con acceso rápido a funciones principales
 */
export const ManagerDashboard = () => {
  const cards = [
    {
      title: 'Turnos',
      description: 'Gestiona los turnos de los trabajadores',
      path: '/manager/shifts',
      icon: '🕐',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Dispositivos',
      description: 'Administra los dispositivos de marcaje',
      path: '/manager/devices',
      icon: '📱',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Reportes',
      description: 'Visualiza reportes de asistencia y rendimiento',
      path: '/manager/reports',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#111827',
          margin: 0,
          marginBottom: '0.25rem'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          Bienvenido al panel de gestión
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            style={{
              textDecoration: 'none',
              display: 'block'
            }}
          >
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '1.5rem',
              transition: 'all 0.2s',
              border: '1px solid #e5e7eb'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: card.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                {card.icon}
              </div>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                {card.title}
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0,
                marginBottom: '1rem'
              }}>
                {card.description}
              </p>
              <div style={{
                padding: '0.5rem 1rem',
                background: card.gradient,
                color: 'white',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                textAlign: 'center',
                display: 'inline-block',
                width: '100%'
              }}>
                Acceder
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

