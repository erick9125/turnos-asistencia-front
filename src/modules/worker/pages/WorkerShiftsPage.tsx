import { WeeklyShiftsList } from '../components/WeeklyShiftsList';
import { RemoteMarkButton } from '../components/RemoteMarkButton';

/**
 * Página principal del trabajador: muestra turnos semanales y botones de marcaje
 */
export const WorkerShiftsPage = () => {
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
          Mis Turnos
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          Visualiza tus turnos semanales y registra tus marcas de entrada y salida
        </p>
      </div>

      {/* Botones de marcaje remoto */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#111827',
          margin: 0,
          marginBottom: '1rem'
        }}>
          Marcaje Remoto
        </h2>
        <RemoteMarkButton />
      </div>

      {/* Lista de turnos semanales */}
      <WeeklyShiftsList />
    </div>
  );
};

