import httpClient from './httpClient';
import type { ApiResponse, Worker, Shift } from '../types';

/**
 * Obtener lista de trabajadores
 * @returns Lista de trabajadores
 */
export const getWorkers = async (): Promise<ApiResponse<Worker[]>> => {
  const response = await httpClient.get<ApiResponse<Worker[]>>('/workers');
  return response.data;
};

/**
 * Obtener un trabajador por ID
 * @param id - ID del trabajador
 * @returns Datos del trabajador
 */
export const getWorkerById = async (id: number): Promise<ApiResponse<Worker>> => {
  const response = await httpClient.get<ApiResponse<Worker>>(`/workers/${id}`);
  return response.data;
};

/**
 * Obtener turnos semanales de un trabajador
 * @param workerId - ID del trabajador
 * @param params - Parámetros opcionales (week_start, week_end)
 * @returns Lista de turnos semanales del trabajador
 */
export const getWorkerWeeklyShifts = async (
  workerId: number,
  params?: { week_start?: string; week_end?: string }
): Promise<ApiResponse<Shift[]>> => {
  const response = await httpClient.get<ApiResponse<Shift[]>>(`/workers/${workerId}/shifts/week`, { params });
  return response.data;
};

