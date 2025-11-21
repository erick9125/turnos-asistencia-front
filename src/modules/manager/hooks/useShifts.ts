import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getShifts, createShift, updateShift, deleteShift } from '../../../api/shiftsApi';
import type { ShiftFilters, ShiftCreateData, Shift } from '../../../types';

/**
 * Hook para obtener lista de turnos con filtros y paginación
 */
export const useShiftsQuery = (filters?: ShiftFilters) => {
  return useQuery({
    queryKey: ['shifts', filters],
    queryFn: () => getShifts(filters),
  });
};

/**
 * Hook para crear un nuevo turno
 */
export const useCreateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShiftCreateData) => createShift(data),
    onSuccess: () => {
      // Invalidar la query de turnos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

/**
 * Hook para actualizar un turno existente
 */
export const useUpdateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShiftCreateData> }) =>
      updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

/**
 * Hook para eliminar un turno
 */
export const useDeleteShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

