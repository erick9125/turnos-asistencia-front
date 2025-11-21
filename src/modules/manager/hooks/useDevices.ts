import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDevices, createDevice, updateDevice, disableDevice } from '../../../api/devicesApi';
import type { DeviceFilters, DeviceCreateData } from '../../../types';

/**
 * Hook para obtener lista de dispositivos con filtros y paginación
 */
export const useDevicesQuery = (filters?: DeviceFilters) => {
  return useQuery({
    queryKey: ['devices', filters],
    queryFn: () => getDevices(filters),
  });
};

/**
 * Hook para crear un nuevo dispositivo
 */
export const useCreateDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeviceCreateData) => createDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

/**
 * Hook para actualizar un dispositivo existente
 */
export const useUpdateDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DeviceCreateData> }) =>
      updateDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

/**
 * Hook para desactivar un dispositivo
 */
export const useDisableDeviceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => disableDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });
};

