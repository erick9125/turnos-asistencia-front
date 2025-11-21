import httpClient from './httpClient';
import type { ApiResponse, AttendanceReport, DelayReport, OvertimeReport, ReportFilters } from '../types';

/**
 * Obtener reporte de asistencia
 * @param filters - Filtros opcionales (start_date, end_date, worker_id, area_id)
 * @returns Lista de registros de asistencia
 */
export const getAttendanceReport = async (filters?: ReportFilters): Promise<ApiResponse<AttendanceReport[]>> => {
  const response = await httpClient.get<ApiResponse<AttendanceReport[]>>('/reports/attendance', { params: filters });
  return response.data;
};

/**
 * Obtener reporte de atrasos
 * @param filters - Filtros opcionales (start_date, end_date, worker_id, area_id)
 * @returns Lista de registros de atrasos
 */
export const getDelaysReport = async (filters?: ReportFilters): Promise<ApiResponse<DelayReport[]>> => {
  const response = await httpClient.get<ApiResponse<DelayReport[]>>('/reports/delays', { params: filters });
  return response.data;
};

/**
 * Obtener reporte de horas extra
 * @param filters - Filtros opcionales (start_date, end_date, worker_id, area_id)
 * @returns Lista de registros de horas extra
 */
export const getOvertimeReport = async (filters?: ReportFilters): Promise<ApiResponse<OvertimeReport[]>> => {
  const response = await httpClient.get<ApiResponse<OvertimeReport[]>>('/reports/overtime', { params: filters });
  return response.data;
};

