import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import { Button } from '../../../components/common/Button';
import { Pagination } from '../../../components/common/Pagination';
import type { User, Pagination as PaginationType } from '../../../types';

interface UsersTableProps {
  users: User[];
  pagination?: PaginationType;
  onPageChange?: (page: number) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  isLoading?: boolean;
}

/**
 * Tabla de usuarios con acciones de editar y eliminar
 */
export const UsersTable = ({
  users,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false,
}: UsersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Cargando usuarios...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay usuarios disponibles
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead style={{
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <tr>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Usuario</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Email</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Rol</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Estado</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#111827',
                    fontWeight: '500'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {user.name[0].toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      textTransform: 'capitalize'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: user.status === 'active' ? '#d1fae5' : '#fee2e2',
                      color: user.status === 'active' ? '#065f46' : '#991b1b',
                      textTransform: 'capitalize'
                    }}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(user)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            color: '#374151',
                            fontSize: '0.875rem',
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
                          ✏️ Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(user)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fecaca';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                          }}
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};

