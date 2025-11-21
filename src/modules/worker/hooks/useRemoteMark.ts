import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRemoteMark } from '../../../api/marksApi';
import type { RemoteMarkData } from '../../../types';

/**
 * Hook para crear una marca remota (entrada o salida)
 */
export const useRemoteMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RemoteMarkData) => createRemoteMark(data),
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['workerShifts'] });
      queryClient.invalidateQueries({ queryKey: ['marks'] });
    },
  });
};

