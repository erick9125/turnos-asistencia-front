import httpClient from './httpClient';
import type { ApiResponse, Device, DeviceCreateData, DeviceFilters } from '../types';

/**
 * Obtener lista de dispositivos con filtros y paginación
 * @param filters - Filtros opcionales (area_id, type, status, page, per_page)
 * @returns Lista de dispositivos con paginación
 */
export const getDevices = async (filters?: DeviceFilters): Promise<ApiResponse<Device[]>> => {
  const response = await httpClient.get<ApiResponse<Device[]>>('/devices', { params: filters });
  return response.data;
};

/**
 * Obtener un dispositivo por ID
 * @param id - ID del dispositivo
 * @returns Datos del dispositivo
 */
export const getDeviceById = async (id: number): Promise<ApiResponse<Device>> => {
  const response = await httpClient.get<ApiResponse<Device>>(`/devices/${id}`);
  return response.data;
};

/**
 * Crear un nuevo dispositivo
 * @param data - Datos del dispositivo a crear
 * @returns Dispositivo creado
 */
export const createDevice = async (data: DeviceCreateData): Promise<ApiResponse<Device>> => {
  const response = await httpClient.post<ApiResponse<Device>>('/devices', data);
  return response.data;
};

/**
 * Actualizar un dispositivo existente
 * @param id - ID del dispositivo
 * @param data - Datos a actualizar
 * @returns Dispositivo actualizado
 */
export const updateDevice = async (id: number, data: Partial<DeviceCreateData>): Promise<ApiResponse<Device>> => {
  const response = await httpClient.patch<ApiResponse<Device>>(`/devices/${id}`, data);
  return response.data;
};

/**
 * Desactivar un dispositivo
 * @param id - ID del dispositivo
 * @returns Respuesta de confirmación
 */
export const disableDevice = async (id: number): Promise<ApiResponse<Device>> => {
  const response = await httpClient.patch<ApiResponse<Device>>(`/devices/${id}/disable`);
  return response.data;
};

