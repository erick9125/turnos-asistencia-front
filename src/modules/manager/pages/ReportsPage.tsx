import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Alert } from '../../../components/common/Alert';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import {
  useAttendanceReport,
  useDelaysReport,
  useOvertimeReport,
} from '../hooks/useReports';
import { useQuery } from '@tanstack/react-query';
import { getWorkers } from '../../../api/workersApi';
import type { ReportFilters } from '../../../types';

/**
 * Página de reportes para managers
 * Incluye tabs para asistencia, atrasos y horas extra
 */
export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'delays' | 'overtime'>('attendance');
  const [filters, setFilters] = useState<ReportFilters>({});

  // Obtener trabajadores para el filtro
  const { data: workersData } = useQuery({
    queryKey: ['workers'],
    queryFn: () => getWorkers(),
  });

  // Queries de reportes
  const attendanceQuery = useAttendanceReport(filters);
  const delaysQuery = useDelaysReport(filters);
  const overtimeQuery = useOvertimeReport(filters);

  const workers = workersData?.data || [];
  const areas = [
    { id: 1, name: 'Área 1' },
    { id: 2, name: 'Área 2' },
    { id: 3, name: 'Área 3' },
  ];

  // Obtener datos según el tab activo
  const getCurrentData = () => {
    switch (activeTab) {
      case 'attendance':
        return attendanceQuery;
      case 'delays':
        return delaysQuery;
      case 'overtime':
        return overtimeQuery;
    }
  };

  const currentQuery = getCurrentData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tabs = [
    { id: 'attendance' as const, label: 'Asistencia', icon: '✅', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    { id: 'delays' as const, label: 'Atrasos', icon: '⏰', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
    { id: 'overtime' as const, label: 'Horas Extra', icon: '⏱️', color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
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
          Reportes
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          Visualiza reportes de asistencia, atrasos y horas extra
        </p>
      </div>

      {/* Tabs modernos */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: isActive ? 'white' : 'transparent',
                  color: isActive ? '#111827' : '#6b7280',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  borderBottom: isActive ? `3px solid ${tab.color.includes('10b981') ? '#10b981' : tab.color.includes('f59e0b') ? '#f59e0b' : '#3b82f6'}` : '3px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '1.125rem' }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filtros */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value || undefined })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value || undefined })}
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Trabajador
              </label>
              <select
                value={filters.worker_id?.toString() || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    worker_id: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Todos</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => setFilters({})}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del tab */}
        <div style={{ padding: '1.5rem' }}>
          {currentQuery.isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg className="animate-spin" style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando reporte...
              </div>
            </div>
          ) : currentQuery.isError ? (
            <div style={{
              backgroundColor: '#fef2f2',
              borderLeft: '4px solid #ef4444',
              padding: '1rem',
              borderRadius: '0 8px 8px 0',
              color: '#b91c1c'
            }}>
              Error al cargar el reporte: {currentQuery.error instanceof Error ? currentQuery.error.message : 'Error desconocido'}
            </div>
          ) : !currentQuery.data?.data || currentQuery.data.data.length === 0 ? (
            <div style={{
              backgroundColor: '#eff6ff',
              borderLeft: '4px solid #3b82f6',
              padding: '1rem',
              borderRadius: '0 8px 8px 0',
              color: '#1e40af'
            }}>
              No hay datos disponibles para los filtros seleccionados
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1rem'
            }}>
              {activeTab === 'attendance' &&
                currentQuery.data.data.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {item.worker_name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: item.status === 'present' ? '#d1fae5' : '#fee2e2',
                        color: item.status === 'present' ? '#065f46' : '#991b1b'
                      }}>
                        {item.status === 'present' ? 'Presente' : 'Ausente'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Entrada</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {item.entry_time ? formatTime(item.entry_time) : 'N/A'}
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Salida</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {item.exit_time ? formatTime(item.exit_time) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              {activeTab === 'delays' &&
                currentQuery.data.data.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #fef3c7',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      borderLeft: '4px solid #f59e0b',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {item.worker_name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                      }}>
                        {item.delay_minutes} min
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Turno Inicio</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {formatTime(item.shift_start)}
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Entrada Real</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626', margin: 0 }}>
                          {formatTime(item.entry_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              {activeTab === 'overtime' &&
                currentQuery.data.data.map((item: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #dbeafe',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      borderLeft: '4px solid #3b82f6',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {item.worker_name}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                          {formatDate(item.date)}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                      }}>
                        {item.overtime_minutes} min
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Turno Fin</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {formatTime(item.shift_end)}
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.25rem 0' }}>Salida Real</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb', margin: 0 }}>
                          {formatTime(item.exit_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

