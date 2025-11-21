import httpClient from './httpClient';
import type { ApiResponse } from '../types';

/**
 * Exportar marcas para sistema legado
 * @param params - Parámetros opcionales (start_date, end_date, format)
 * @returns Datos exportados
 */
export const exportMarks = async (params?: { start_date?: string; end_date?: string; format?: string }): Promise<Blob> => {
  const response = await httpClient.get('/export/marks', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Marcar marcas como exportadas
 * @param data - IDs de las marcas a marcar como exportadas
 * @returns Respuesta de confirmación
 */
export const markMarksAsExported = async (data: { mark_ids: number[] }): Promise<ApiResponse<void>> => {
  const response = await httpClient.post<ApiResponse<void>>('/export/marks/mark-as-exported', data);
  return response.data;
};

/**
 * Exportar estadísticas
 * @param params - Parámetros opcionales (start_date, end_date, format)
 * @returns Datos de estadísticas exportados
 */
export const exportStatistics = async (params?: { start_date?: string; end_date?: string; format?: string }): Promise<Blob> => {
  const response = await httpClient.get('/export/statistics', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

