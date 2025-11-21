import httpClient from './httpClient';
import type { ApiResponse, ExportMarksFilters, ExportStatistics, ExportedMark, Pagination } from '../types';

/**
 * Respuesta de exportación de marcas según el API
 */
interface ExportMarksResponse {
  marks: ExportedMark[];
  pagination: Pagination;
}

/**
 * Obtener marcas para exportación (sistema legado)
 * @param filters - Filtros opcionales (start_date, end_date, only_not_exported, page, per_page)
 * @returns Lista de marcas con paginación
 * El API retorna: { success: true, message: "...", data: { marks: [...], pagination: {...} } }
 */
export const getExportMarks = async (filters?: ExportMarksFilters): Promise<ApiResponse<ExportMarksResponse>> => {
  const response = await httpClient.get<ApiResponse<ExportMarksResponse>>('/export/marks', { params: filters });
  return response.data;
};

/**
 * Marcar marcas como exportadas
 * @param data - IDs de las marcas a marcar como exportadas
 * @returns Respuesta de confirmación
 */
export const markMarksAsExported = async (data: { mark_ids: number[] }): Promise<ApiResponse<{ updated_count: number }>> => {
  const response = await httpClient.post<ApiResponse<{ updated_count: number }>>('/export/marks/mark-as-exported', data);
  return response.data;
};

/**
 * Obtener estadísticas de exportación
 * @param params - Parámetros opcionales (start_date, end_date)
 * @returns Estadísticas de exportación
 */
export const getExportStatistics = async (params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<ExportStatistics>> => {
  const response = await httpClient.get<ApiResponse<ExportStatistics>>('/export/statistics', { params });
  return response.data;
};

