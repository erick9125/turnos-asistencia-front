import { useEffect, FormEvent } from 'react';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import type { User } from '../../../types';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
  user?: User | null;
  isLoading?: boolean;
}

/**
 * Modal de formulario para crear o editar un usuario
 */
export const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: UserFormModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const password = formData.get('password') as string;

    // Validación de contraseña para nuevos usuarios
    if (!user && password && password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    const data: Partial<User> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as 'admin' | 'manager' | 'worker',
      status: formData.get('status') as 'active' | 'inactive',
    };

    // Solo incluir password si es un nuevo usuario
    if (!user && password) {
      data.password = password;
    }

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              name="name"
              required
              defaultValue={user?.name || ''}
            />

            <Input
              type="email"
              label="Correo electrónico"
              name="email"
              required
              defaultValue={user?.email || ''}
            />

            {!user && (
              <Input
                type="password"
                label="Contraseña (mínimo 8 caracteres)"
                name="password"
                required={!user}
                minLength={8}
              />
            )}

            <Select
              label="Rol"
              name="role"
              required
              defaultValue={user?.role || ''}
            >
              <option value="">Seleccione un rol</option>
              <option value="admin">Administrador</option>
              <option value="manager">Manager</option>
              <option value="worker">Trabajador</option>
            </Select>

            <Select
              label="Estado"
              name="status"
              required
              defaultValue={user?.status || 'active'}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </Select>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                {user ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

