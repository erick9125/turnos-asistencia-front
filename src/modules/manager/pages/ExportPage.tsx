import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWorkers } from '../../../api/workersApi';
import {
  useExportMarksQuery,
  useMarkAsExportedMutation,
  useExportStatisticsQuery,
} from '../hooks/useExport';
import type { ExportMarksFilters } from '../../../types';

/**
 * Página de exportación para managers
 * Permite ver marcas para exportar, marcarlas como exportadas y ver estadísticas
 */
export const ExportPage = () => {
  const [activeTab, setActiveTab] = useState<'marks' | 'statistics'>('marks');
  const [filters, setFilters] = useState<ExportMarksFilters>({
    only_not_exported: true,
    page: 1,
    per_page: 15,
  });
  const [selectedMarks, setSelectedMarks] = useState<number[]>([]);

  // Obtener trabajadores para el filtro
  const { data: workersData } = useQuery({
    queryKey: ['workers'],
    queryFn: () => getWorkers(),
  });

  // Queries
  const exportMarksQuery = useExportMarksQuery(filters);
  const statisticsQuery = useExportStatisticsQuery({
    start_date: filters.start_date,
    end_date: filters.end_date,
  });
  const markAsExportedMutation = useMarkAsExportedMutation();

  const workers = workersData?.data || [];
  // El API retorna { data: { marks: [...], pagination: {...} } }
  // El API retorna { data: { marks: [...], pagination: {...} } }
  const marks = exportMarksQuery.data?.data?.marks || [];
  const pagination = exportMarksQuery.data?.data?.pagination;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectMark = (markId: number) => {
    setSelectedMarks((prev) =>
      prev.includes(markId) ? prev.filter((id) => id !== markId) : [...prev, markId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMarks.length === marks.length) {
      setSelectedMarks([]);
    } else {
      setSelectedMarks(marks.map((mark) => mark.id));
    }
  };

  const handleMarkAsExported = async () => {
    if (selectedMarks.length === 0) {
      alert('Selecciona al menos una marca para marcar como exportada');
      return;
    }

    if (!window.confirm(`¿Marcar ${selectedMarks.length} marca(s) como exportada(s)?`)) {
      return;
    }

    try {
      await markAsExportedMutation.mutateAsync(selectedMarks);
      setSelectedMarks([]);
      alert(`Se marcaron ${selectedMarks.length} marca(s) como exportada(s) exitosamente`);
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Error al marcar las marcas como exportadas');
    }
  };

  const tabs = [
    { id: 'marks' as const, label: 'Marcas para Exportar', icon: '📤' },
    { id: 'statistics' as const, label: 'Estadísticas', icon: '📊' },
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
          Exportación
        </h1>
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0
        }}>
          Gestiona la exportación de marcas para sistemas legados
        </p>
      </div>

      {/* Tabs */}
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
                  borderBottom: isActive ? '3px solid #667eea' : '3px solid transparent',
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

        {/* Contenido del tab de Marcas */}
        {activeTab === 'marks' && (
          <div style={{ padding: '1.5rem' }}>
            {/* Filtros */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #e5e7eb'
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
                  onChange={(e) => setFilters({ ...filters, start_date: e.target.value || undefined, page: 1 })}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
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
                  onChange={(e) => setFilters({ ...filters, end_date: e.target.value || undefined, page: 1 })}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#374151',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filters.only_not_exported ?? true}
                    onChange={(e) => setFilters({ ...filters, only_not_exported: e.target.checked, page: 1 })}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  Solo no exportadas
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <button
                  onClick={() => setFilters({ only_not_exported: true, page: 1, per_page: 15 })}
                  style={{
                    padding: '0.625rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Limpiar
                </button>
                {selectedMarks.length > 0 && (
                  <button
                    onClick={handleMarkAsExported}
                    disabled={markAsExportedMutation.isPending}
                    style={{
                      padding: '0.625rem 1rem',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      fontWeight: '600',
                      cursor: markAsExportedMutation.isPending ? 'not-allowed' : 'pointer',
                      fontSize: '0.875rem',
                      opacity: markAsExportedMutation.isPending ? 0.7 : 1
                    }}
                  >
                    {markAsExportedMutation.isPending ? 'Marcando...' : `Marcar ${selectedMarks.length} como exportada(s)`}
                  </button>
                )}
              </div>
            </div>

            {/* Tabla de marcas */}
            {exportMarksQuery.isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                Cargando marcas...
              </div>
            ) : exportMarksQuery.isError ? (
              <div style={{
                backgroundColor: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                padding: '1rem',
                borderRadius: '0 8px 8px 0',
                color: '#b91c1c'
              }}>
                Error al cargar las marcas: {exportMarksQuery.error instanceof Error ? exportMarksQuery.error.message : 'Error desconocido'}
              </div>
            ) : marks.length === 0 ? (
              <div style={{
                backgroundColor: '#eff6ff',
                borderLeft: '4px solid #3b82f6',
                padding: '1rem',
                borderRadius: '0 8px 8px 0',
                color: '#1e40af',
                textAlign: 'center'
              }}>
                No hay marcas disponibles para exportar
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedMarks.length === marks.length && marks.length > 0}
                      onChange={handleSelectAll}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                      Seleccionar todas ({marks.length})
                    </span>
                  </label>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {selectedMarks.length} seleccionada(s)
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}></th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Trabajador</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Fecha/Hora</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Dirección</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Dispositivo</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Área</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280' }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.map((mark) => (
                        <tr
                          key={mark.id}
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                          }}
                        >
                          <td style={{ padding: '0.75rem' }}>
                            <input
                              type="checkbox"
                              checked={selectedMarks.includes(mark.id)}
                              onChange={() => handleSelectMark(mark.id)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827' }}>
                            {mark.worker_name} ({mark.worker_rut})
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#111827', fontFamily: 'monospace' }}>
                            {formatDateTime(mark.marked_at)}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              backgroundColor: mark.direction === 'in' ? '#d1fae5' : '#fee2e2',
                              color: mark.direction === 'in' ? '#065f46' : '#991b1b'
                            }}>
                              {mark.direction === 'in' ? 'Entrada' : 'Salida'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            {mark.device_name} ({mark.device_key})
                          </td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            {mark.area_name}
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            {mark.exported_at ? (
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af'
                              }}>
                                Exportada
                              </span>
                            ) : (
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: '#fef3c7',
                                color: '#92400e'
                              }}>
                                Pendiente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {pagination && pagination.last_page > 1 && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => setFilters({ ...filters, page: (pagination.current_page || 1) - 1 })}
                      disabled={pagination.current_page === 1}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: pagination.current_page === 1 ? 'not-allowed' : 'pointer',
                        opacity: pagination.current_page === 1 ? 0.5 : 1
                      }}
                    >
                      Anterior
                    </button>
                    <span style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>
                      Página {pagination.current_page} de {pagination.last_page}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: (pagination.current_page || 1) + 1 })}
                      disabled={pagination.current_page === pagination.last_page}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        cursor: pagination.current_page === pagination.last_page ? 'not-allowed' : 'pointer',
                        opacity: pagination.current_page === pagination.last_page ? 0.5 : 1
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Contenido del tab de Estadísticas */}
        {activeTab === 'statistics' && (
          <div style={{ padding: '1.5rem' }}>
            {statisticsQuery.isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                Cargando estadísticas...
              </div>
            ) : statisticsQuery.isError ? (
              <div style={{
                backgroundColor: '#fef2f2',
                borderLeft: '4px solid #ef4444',
                padding: '1rem',
                borderRadius: '0 8px 8px 0',
                color: '#b91c1c'
              }}>
                Error al cargar las estadísticas
              </div>
            ) : statisticsQuery.data?.data ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                    {statisticsQuery.data.data.total}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total de Marcas</div>
                </div>
                <div style={{
                  backgroundColor: '#d1fae5',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#065f46', marginBottom: '0.5rem' }}>
                    {statisticsQuery.data.data.exported}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exportadas</div>
                </div>
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
                    {statisticsQuery.data.data.not_exported}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pendientes</div>
                </div>
                <div style={{
                  backgroundColor: '#ede9fe',
                  border: '2px solid #8b5cf6',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6d28d9', marginBottom: '0.5rem' }}>
                    {statisticsQuery.data.data.export_percentage.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Porcentaje Exportado</div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

