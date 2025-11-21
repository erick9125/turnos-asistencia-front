import { useQuery } from '@tanstack/react-query';
import { getWorkerWeeklyShifts } from '../../../api/workersApi';

/**
 * Hook para obtener los turnos semanales de un trabajador
 * @param workerId - ID del trabajador
 * @param params - Parámetros opcionales (week_start, week_end)
 */
export const useWorkerWeeklyShifts = (
  workerId: number | undefined,
  params?: { week_start?: string; week_end?: string }
) => {
  return useQuery({
    queryKey: ['workerShifts', workerId, params],
    queryFn: () => {
      if (!workerId) {
        throw new Error('Worker ID is required');
      }
      return getWorkerWeeklyShifts(workerId, params);
    },
    enabled: !!workerId, // Solo ejecutar si hay workerId
  });
};

