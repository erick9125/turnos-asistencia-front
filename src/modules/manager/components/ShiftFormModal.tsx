import { useEffect, FormEvent } from 'react';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import type { Shift, ShiftCreateData } from '../../../types';

interface ShiftFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ShiftCreateData) => void;
  shift?: Shift | null;
  isLoading?: boolean;
  workers?: Array<{ id: number; name: string }>;
  areas?: Array<{ id: number; name: string }>;
}

/**
 * Modal de formulario para crear o editar un turno
 */
export const ShiftFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  shift,
  isLoading = false,
  workers = [],
  areas = [],
}: ShiftFormModalProps) => {
  // Si no está abierto, no renderizar
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const startAt = formData.get('start_at') as string;
    const endAt = formData.get('end_at') as string;

    // Validación: end_at debe ser mayor que start_at
    if (new Date(endAt) <= new Date(startAt)) {
      alert('La hora de fin debe ser mayor que la hora de inicio');
      return;
    }

    const data: ShiftCreateData = {
      worker_id: parseInt(formData.get('worker_id') as string),
      area_id: parseInt(formData.get('area_id') as string),
      start_at: startAt,
      end_at: endAt,
    };

    onSubmit(data);
  };

  // Formatear fecha y hora para input datetime-local
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {shift ? 'Editar Turno' : 'Nuevo Turno'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Trabajador"
              name="worker_id"
              required
              defaultValue={shift?.worker_id || ''}
            >
              <option value="">Seleccione un trabajador</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </Select>

            <Select
              label="Área"
              name="area_id"
              required
              defaultValue={shift?.area_id || ''}
            >
              <option value="">Seleccione un área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </Select>

            <Input
              type="datetime-local"
              label="Hora de Inicio"
              name="start_at"
              required
              defaultValue={shift ? formatDateTime(shift.start_at) : ''}
            />

            <Input
              type="datetime-local"
              label="Hora de Fin"
              name="end_at"
              required
              defaultValue={shift ? formatDateTime(shift.end_at) : ''}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                {shift ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

