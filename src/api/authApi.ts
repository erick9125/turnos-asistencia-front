import httpClient from './httpClient';
import type { ApiResponse, LoginCredentials, LoginResponse } from '../types';

/**
 * Iniciar sesión en el sistema
 * @param credentials - Credenciales de usuario (email y password)
 * @returns Respuesta con token y datos del usuario
 */
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
  const response = await httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  return response.data;
};

/**
 * Cerrar sesión (limpiar datos del localStorage)
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

