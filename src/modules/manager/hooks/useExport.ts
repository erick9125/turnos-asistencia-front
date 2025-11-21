import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExportMarks, markMarksAsExported, getExportStatistics } from '../../../api/exportApi';
import type { ExportMarksFilters } from '../../../types';

/**
 * Hook para obtener marcas para exportación
 */
export const useExportMarksQuery = (filters?: ExportMarksFilters) => {
  return useQuery({
    queryKey: ['exportMarks', filters],
    queryFn: () => getExportMarks(filters),
  });
};

/**
 * Hook para marcar marcas como exportadas
 */
export const useMarkAsExportedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (markIds: number[]) => markMarksAsExported({ mark_ids: markIds }),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['exportMarks'] });
      queryClient.invalidateQueries({ queryKey: ['exportStatistics'] });
    },
  });
};

/**
 * Hook para obtener estadísticas de exportación
 */
export const useExportStatisticsQuery = (params?: { start_date?: string; end_date?: string }) => {
  return useQuery({
    queryKey: ['exportStatistics', params],
    queryFn: () => getExportStatistics(params),
  });
};

