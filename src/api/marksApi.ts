import httpClient from './httpClient';
import type { ApiResponse, RemoteMarkData, Mark } from '../types';

/**
 * Crear una marca remota (entrada o salida)
 * @param data - Datos de la marca (worker_id, type, device_id opcional, coordenadas opcionales)
 * @returns Marca creada
 */
export const createRemoteMark = async (data: RemoteMarkData): Promise<ApiResponse<Mark>> => {
  const response = await httpClient.post<ApiResponse<Mark>>('/marks/remote', data);
  return response.data;
};

/**
 * Crear marca por lotes desde dispositivo de reloj
 * @param data - Datos de la marca en lote
 * @returns Respuesta con las marcas creadas
 */
export const createBatchClockMark = async (data: any): Promise<ApiResponse<Mark[]>> => {
  const response = await httpClient.post<ApiResponse<Mark[]>>('/marks/batch/clock', data);
  return response.data;
};

/**
 * Crear marca externa
 * @param data - Datos de la marca externa
 * @returns Marca creada
 */
export const createExternalMark = async (data: any): Promise<ApiResponse<Mark>> => {
  const response = await httpClient.post<ApiResponse<Mark>>('/marks/external', data);
  return response.data;
};

