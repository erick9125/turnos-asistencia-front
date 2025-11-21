import { QueryClient } from '@tanstack/react-query';

// Configuración del cliente de React Query
// Define opciones por defecto para todas las queries y mutaciones
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reintentar 1 vez en caso de error
      retry: 1,
      // Refetch cuando la ventana recupera el foco
      refetchOnWindowFocus: false,
      // Tiempo de cache por defecto: 5 minutos
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      // Reintentar 1 vez en caso de error
      retry: 1,
    },
  },
});

