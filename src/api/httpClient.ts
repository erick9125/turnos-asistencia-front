import axios, { AxiosError } from 'axios';

// Configuración base del cliente HTTP
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las peticiones
httpClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe token, añadirlo al header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
httpClient.interceptors.response.use(
  (response) => {
    // Retornar la respuesta directamente
    return response;
  },
  (error: AxiosError) => {
    // Si recibimos un 401 (No autorizado), el token expiró o es inválido
    if (error.response?.status === 401) {
      // Limpiar datos de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir a login solo si no estamos ya en esa página
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;

