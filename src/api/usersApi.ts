import httpClient from './httpClient';
import type { ApiResponse, User, UserFilters, Pagination } from '../types';

/**
 * Obtener lista de usuarios con filtros y paginación
 * @param filters - Filtros opcionales (role, status, search, page, per_page)
 * @returns Lista de usuarios con paginación
 */
export const getUsers = async (filters?: UserFilters): Promise<ApiResponse<User[]>> => {
  const response = await httpClient.get<ApiResponse<User[]>>('/users', { params: filters });
  return response.data;
};

/**
 * Obtener un usuario por ID
 * @param id - ID del usuario
 * @returns Datos del usuario
 */
export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  const response = await httpClient.get<ApiResponse<User>>(`/users/${id}`);
  return response.data;
};

/**
 * Crear un nuevo usuario
 * @param data - Datos del usuario a crear
 * @returns Usuario creado
 */
export const createUser = async (data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await httpClient.post<ApiResponse<User>>('/users', data);
  return response.data;
};

/**
 * Actualizar un usuario existente
 * @param id - ID del usuario
 * @param data - Datos a actualizar
 * @returns Usuario actualizado
 */
export const updateUser = async (id: number, data: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await httpClient.patch<ApiResponse<User>>(`/users/${id}`, data);
  return response.data;
};

/**
 * Eliminar un usuario
 * @param id - ID del usuario
 * @returns Respuesta de confirmación
 */
export const deleteUser = async (id: number): Promise<ApiResponse<void>> => {
  const response = await httpClient.delete<ApiResponse<void>>(`/users/${id}`);
  return response.data;
};

