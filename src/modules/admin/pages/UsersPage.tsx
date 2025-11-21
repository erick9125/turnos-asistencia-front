import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Alert } from '../../../components/common/Alert';
import { UsersTable } from '../components/UsersTable';
import { UserFormModal } from '../components/UserFormModal';
import {
  useUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../hooks/useUsers';
import type { User, UserFilters } from '../../../types';

/**
 * Página de gestión de usuarios para administradores
 * Incluye tabla, filtros, y formulario para crear/editar usuarios
 */
export const UsersPage = () => {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    per_page: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener usuarios
  const { data: usersData, isLoading } = useUsersQuery(filters);

  // Mutaciones
  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
    setError(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setError(null);
  };

  const handleDelete = async (user: User) => {
    const confirmMessage = `¿Estás seguro de eliminar al usuario ${user.name}?\n\n` +
      `⚠️ Advertencia: No se puede eliminar un usuario que tenga un trabajador activo asociado.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(user.id);
    } catch (err: any) {
      // Mostrar mensaje de error específico del API
      const errorMessage = err?.response?.data?.message || 'Error al eliminar el usuario';
      setError(errorMessage);
      
      // Si el error menciona worker asociado, mostrarlo de forma destacada
      if (errorMessage.includes('worker') || errorMessage.includes('trabajador')) {
        alert(`❌ ${errorMessage}`);
      }
    }
  };

  const handleSubmit = async (data: Partial<User>) => {
    try {
      if (editingUser) {
        await updateMutation.mutateAsync({ id: editingUser.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al guardar el usuario');
    }
  };

  const handleFilterChange = (key: keyof UserFilters, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Resetear a la primera página al cambiar filtros
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: 0,
            marginBottom: '0.25rem'
          }}>
            Gestión de Usuarios
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Administra los usuarios del sistema
          </p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            padding: '0.625rem 1.25rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
          }}
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre o email..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Rol
            </label>
            <select
              value={filters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Todos</option>
              <option value="admin">Administrador</option>
              <option value="manager">Manager</option>
              <option value="worker">Trabajador</option>
            </select>
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Todos</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilters({ page: 1, per_page: 10 })}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#d1d5db';
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <UsersTable
        users={usersData?.data || []}
        pagination={usersData?.pagination}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Modal de formulario */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        user={editingUser}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

