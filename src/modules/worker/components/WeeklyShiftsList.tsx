import { useWorkerWeeklyShifts } from '../hooks/useWorkerShifts';
import { useAuth } from '../../../context/AuthContext';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import { Alert } from '../../../components/common/Alert';

/**
 * Componente para mostrar la lista de turnos semanales del trabajador
 */
export const WeeklyShiftsList = () => {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useWorkerWeeklyShifts(user?.worker_id);

  // Calcular la semana actual (lunes a domingo)
  const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que el lunes sea el primer día
    const monday = new Date(today.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0],
    };
  };

  const weekRange = getWeekRange();

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Formatear hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Cargando turnos...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert type="error">
        Error al cargar los turnos: {error instanceof Error ? error.message : 'Error desconocido'}
      </Alert>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Alert type="info">
        No hay turnos asignados para esta semana ({weekRange.start} a {weekRange.end}).
      </Alert>
    );
  }

  const shifts = data.data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Turnos de la semana
          </h3>
          <span style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '0.375rem 0.75rem',
            borderRadius: '6px'
          }}>
            {weekRange.start} a {weekRange.end}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {shifts.map((shift) => {
            const isToday = new Date(shift.start_at).toDateString() === new Date().toDateString();
            return (
              <div
                key={shift.id}
                style={{
                  backgroundColor: isToday ? '#eff6ff' : 'white',
                  border: isToday ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: isToday ? '0 4px 12px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isToday ? '0 4px 12px rgba(59, 130, 246, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                {isToday && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Hoy
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)'
                  }}>
                    🕐
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#111827',
                      margin: 0
                    }}>
                      {formatDate(shift.start_at)}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '0.25rem 0 0 0'
                    }}>
                      {shift.area?.name || 'Sin área'}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '0 0 0.25rem 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Inicio
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#10b981',
                      margin: 0
                    }}>
                      {formatTime(shift.start_at)}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      margin: '0 0 0.25rem 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Fin
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#ef4444',
                      margin: 0
                    }}>
                      {formatTime(shift.end_at)}
                    </p>
                  </div>
                </div>
                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: shift.status === 'active' ? '#d1fae5' : '#f3f4f6',
                    color: shift.status === 'active' ? '#065f46' : '#374151'
                  }}>
                    {shift.status === 'active' ? 'Activo' : shift.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

