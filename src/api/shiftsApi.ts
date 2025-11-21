import httpClient from './httpClient';
import type { ApiResponse, Shift, ShiftCreateData, ShiftFilters } from '../types';

/**
 * Obtener lista de turnos con filtros y paginación
 * @param filters - Filtros opcionales (worker_id, area_id, start_date, end_date, page, per_page)
 * @returns Lista de turnos con paginación
 */
export const getShifts = async (filters?: ShiftFilters): Promise<ApiResponse<Shift[]>> => {
  const response = await httpClient.get<ApiResponse<Shift[]>>('/shifts', { params: filters });
  return response.data;
};

/**
 * Obtener un turno por ID
 * @param id - ID del turno
 * @returns Datos del turno
 */
export const getShiftById = async (id: number): Promise<ApiResponse<Shift>> => {
  const response = await httpClient.get<ApiResponse<Shift>>(`/shifts/${id}`);
  return response.data;
};

/**
 * Crear un nuevo turno
 * @param data - Datos del turno a crear
 * @returns Turno creado
 */
export const createShift = async (data: ShiftCreateData): Promise<ApiResponse<Shift>> => {
  const response = await httpClient.post<ApiResponse<Shift>>('/shifts', data);
  return response.data;
};

/**
 * Actualizar un turno existente
 * @param id - ID del turno
 * @param data - Datos a actualizar
 * @returns Turno actualizado
 */
export const updateShift = async (id: number, data: Partial<ShiftCreateData>): Promise<ApiResponse<Shift>> => {
  const response = await httpClient.put<ApiResponse<Shift>>(`/shifts/${id}`, data);
  return response.data;
};

/**
 * Eliminar un turno
 * @param id - ID del turno
 * @returns Respuesta de confirmación
 */
export const deleteShift = async (id: number): Promise<ApiResponse<void>> => {
  const response = await httpClient.delete<ApiResponse<void>>(`/shifts/${id}`);
  return response.data;
};

