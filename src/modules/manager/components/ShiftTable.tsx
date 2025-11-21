import { useState } from 'react';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import { Button } from '../../../components/common/Button';
import { Pagination } from '../../../components/common/Pagination';
import type { Shift, Pagination as PaginationType } from '../../../types';

interface ShiftTableProps {
  shifts: Shift[];
  pagination?: PaginationType;
  onPageChange?: (page: number) => void;
  onEdit?: (shift: Shift) => void;
  onDelete?: (shift: Shift) => void;
  isLoading?: boolean;
}

/**
 * Tabla de turnos con acciones de editar y eliminar
 */
export const ShiftTable = ({
  shifts,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false,
}: ShiftTableProps) => {
  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Cargando turnos...</div>
      </div>
    );
  }

  if (shifts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay turnos disponibles
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <tr>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Trabajador</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Área</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Inicio</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Fin</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Estado</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, index) => (
                <tr
                  key={shift.id}
                  style={{
                    borderBottom: index < shifts.length - 1 ? '1px solid #e5e7eb' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    {shift.worker?.name || 'N/A'}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {shift.area?.name || 'N/A'}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {formatDateTime(shift.start_at)}
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    fontWeight: '600',
                    fontFamily: 'monospace'
                  }}>
                    {formatDateTime(shift.end_at)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: shift.status === 'active' ? '#d1fae5' : '#f3f4f6',
                      color: shift.status === 'active' ? '#065f46' : '#374151',
                      textTransform: 'capitalize'
                    }}>
                      {shift.status === 'active' ? 'Activo' : shift.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(shift)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#374151',
                            fontSize: '0.875rem',
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
                          ✏️ Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(shift)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecaca';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};

