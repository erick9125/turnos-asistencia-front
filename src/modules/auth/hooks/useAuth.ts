import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../../../api/authApi';
import { useAuth as useAuthContext } from '../../../context/AuthContext';
import type { LoginCredentials } from '../../../types';

/**
 * Hook para manejar el login
 * Usa React Query para la mutación y el contexto de autenticación
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthContext();

  const mutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Guardar token y usuario en el contexto
        setAuth(response.data.token, response.data.user);

        // Redirigir según el rol
        const role = response.data.user.role;
        switch (role) {
          case 'admin':
            navigate('/admin/users');
            break;
          case 'manager':
            navigate('/manager/shifts');
            break;
          case 'worker':
            navigate('/worker/shifts');
            break;
          default:
            navigate('/login');
        }
      }
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
};

