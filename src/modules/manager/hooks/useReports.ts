import { useQuery } from '@tanstack/react-query';
import { getAttendanceReport, getDelaysReport, getOvertimeReport } from '../../../api/reportsApi';
import type { ReportFilters } from '../../../types';

/**
 * Hook para obtener reporte de asistencia
 */
export const useAttendanceReport = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: ['reports', 'attendance', filters],
    queryFn: () => getAttendanceReport(filters),
  });
};

/**
 * Hook para obtener reporte de atrasos
 */
export const useDelaysReport = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: ['reports', 'delays', filters],
    queryFn: () => getDelaysReport(filters),
  });
};

/**
 * Hook para obtener reporte de horas extra
 */
export const useOvertimeReport = (filters?: ReportFilters) => {
  return useQuery({
    queryKey: ['reports', 'overtime', filters],
    queryFn: () => getOvertimeReport(filters),
  });
};

