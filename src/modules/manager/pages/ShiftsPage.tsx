import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Alert } from '../../../components/common/Alert';
import { ShiftTable } from '../components/ShiftTable';
import { ShiftFormModal } from '../components/ShiftFormModal';
import {
  useShiftsQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
} from '../hooks/useShifts';
import { useQuery } from '@tanstack/react-query';
import { getWorkers } from '../../../api/workersApi';
import type { Shift, ShiftCreateData, ShiftFilters } from '../../../types';

/**
 * Página de gestión de turnos para managers
 * Incluye tabla, filtros, y formulario para crear/editar turnos
 */
export const ShiftsPage = () => {
  const [filters, setFilters] = useState<ShiftFilters>({
    page: 1,
    per_page: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener turnos
  const { data: shiftsData, isLoading } = useShiftsQuery(filters);

  // Obtener trabajadores para el formulario
  const { data: workersData } = useQuery({
    queryKey: ['workers'],
    queryFn: () => getWorkers(),
  });

  // Mutaciones
  const createMutation = useCreateShiftMutation();
  const updateMutation = useUpdateShiftMutation();
  const deleteMutation = useDeleteShiftMutation();

  // Datos para el formulario
  const workers = workersData?.data || [];
  // Nota: En una implementación real, necesitarías obtener las áreas desde la API
  const areas = [
    { id: 1, name: 'Área 1' },
    { id: 2, name: 'Área 2' },
    { id: 3, name: 'Área 3' },
  ];

  const handleCreate = () => {
    setEditingShift(null);
    setIsModalOpen(true);
    setError(null);
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setIsModalOpen(true);
    setError(null);
  };

  const handleDelete = async (shift: Shift) => {
    if (!window.confirm(`¿Estás seguro de eliminar el turno del trabajador ${shift.worker?.name}?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(shift.id);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar el turno');
    }
  };

  const handleSubmit = async (data: ShiftCreateData) => {
    try {
      if (editingShift) {
        await updateMutation.mutateAsync({ id: editingShift.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingShift(null);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar el turno');
    }
  };

  const handleFilterChange = (key: keyof ShiftFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Resetear a la primera página al cambiar filtros
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            Gestión de Turnos
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Administra los turnos de los trabajadores
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            padding: '0.625rem 1.25rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
          }}
        >
          + Nuevo Turno
        </button>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        border: '1px solid #e5e7eb'
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
              onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
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
              onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
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
                handleFilterChange('worker_id', e.target.value ? parseInt(e.target.value) : undefined)
              }
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
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
              onClick={() => setFilters({ page: 1, per_page: 10 })}
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

      {/* Tabla de turnos */}
      <ShiftTable
        shifts={shiftsData?.data || []}
        pagination={shiftsData?.pagination}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Modal de formulario */}
      <ShiftFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingShift(null);
        }}
        onSubmit={handleSubmit}
        shift={editingShift}
        isLoading={createMutation.isPending || updateMutation.isPending}
        workers={workers}
        areas={areas}
      />
    </div>
  );
};

