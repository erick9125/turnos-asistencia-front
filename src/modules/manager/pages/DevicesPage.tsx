import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Alert } from '../../../components/common/Alert';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../../../components/common/Table';
import { Pagination } from '../../../components/common/Pagination';
import {
  useDevicesQuery,
  useCreateDeviceMutation,
  useDisableDeviceMutation,
} from '../hooks/useDevices';
import type { Device, DeviceCreateData, DeviceFilters } from '../../../types';

/**
 * Página de gestión de dispositivos para managers
 */
export const DevicesPage = () => {
  const [filters, setFilters] = useState<DeviceFilters>({
    page: 1,
    per_page: 10,
  });
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<DeviceCreateData>({
    name: '',
    type: '',
    area_id: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const { data: devicesData, isLoading } = useDevicesQuery(filters);
  const createMutation = useCreateDeviceMutation();
  const disableMutation = useDisableDeviceMutation();

  // Áreas (en producción, esto vendría de la API)
  const areas = [
    { id: 1, name: 'Área 1' },
    { id: 2, name: 'Área 2' },
    { id: 3, name: 'Área 3' },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await createMutation.mutateAsync(formData);
      setIsCreating(false);
      setFormData({ name: '', type: '', area_id: 0 });
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al crear el dispositivo');
    }
  };

  const handleDisable = async (device: Device) => {
    if (!window.confirm(`¿Estás seguro de desactivar el dispositivo ${device.name}?`)) {
      return;
    }

    try {
      await disableMutation.mutateAsync(device.id);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al desactivar el dispositivo');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'clock': return '🕐';
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '💻';
    }
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
            Gestión de Dispositivos
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Administra los dispositivos de marcaje
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          style={{
            padding: '0.625rem 1.25rem',
            background: isCreating
              ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          {isCreating ? '✕ Cancelar' : '+ Nuevo Dispositivo'}
        </button>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Formulario de creación */}
      {isCreating && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
            marginBottom: '1.5rem'
          }}>
            Nuevo Dispositivo
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
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
                  <option value="">Seleccione un tipo</option>
                  <option value="clock">Reloj</option>
                  <option value="mobile">Móvil</option>
                  <option value="tablet">Tablet</option>
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
                  Área *
                </label>
                <select
                  value={formData.area_id}
                  onChange={(e) => setFormData({ ...formData, area_id: parseInt(e.target.value) })}
                  required
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
                  <option value="0">Seleccione un área</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
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
                  Dirección IP (opcional)
                </label>
                <input
                  type="text"
                  value={formData.ip_address || ''}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'monospace'
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
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={createMutation.isPending}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: createMutation.isPending ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.2s',
                  opacity: createMutation.isPending ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!createMutation.isPending) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
                }}
              >
                {createMutation.isPending ? 'Creando...' : 'Crear Dispositivo'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setFormData({ name: '', type: '', area_id: 0 });
                }}
                style={{
                  padding: '0.625rem 1.25rem',
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
                Cancelar
              </button>
            </div>
          </form>
        </div>
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
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value || undefined, page: 1 })
              }
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
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Tipo
            </label>
            <select
              value={filters.type || ''}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value || undefined, page: 1 })
              }
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
              <option value="clock">Reloj</option>
              <option value="mobile">Móvil</option>
              <option value="tablet">Tablet</option>
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

      {/* Cards de dispositivos */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          Cargando dispositivos...
        </div>
      ) : devicesData?.data && devicesData.data.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {devicesData.data.map((device) => (
            <div
              key={device.id}
              style={{
                backgroundColor: 'white',
                border: device.status === 'active' ? '2px solid #10b981' : '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: device.status === 'active'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  {getDeviceIcon(device.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    {device.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0,
                    textTransform: 'capitalize'
                  }}>
                    {device.type}
                  </p>
                </div>
                <span style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: device.status === 'active' ? '#d1fae5' : '#fee2e2',
                  color: device.status === 'active' ? '#065f46' : '#991b1b',
                  textTransform: 'capitalize'
                }}>
                  {device.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Área:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                    {device.area?.name || 'Sin área'}
                  </span>
                </div>
                {device.ip_address && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>IP:</span>
                    <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: '#374151' }}>
                      {device.ip_address}
                    </span>
                  </div>
                )}
              </div>

              {device.status === 'active' && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <button
                    onClick={() => handleDisable(device)}
                    disabled={disableMutation.isPending}
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#fee2e2',
                      color: '#991b1b',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: disableMutation.isPending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: disableMutation.isPending ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!disableMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#fecaca';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!disableMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }
                    }}
                  >
                    {disableMutation.isPending ? 'Desactivando...' : 'Desactivar Dispositivo'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          No hay dispositivos disponibles
        </div>
      )}

      {/* Paginación */}
      {devicesData?.pagination && (
        <div style={{ marginTop: '1rem' }}>
          <Pagination
            pagination={devicesData.pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      )}
    </div>
  );
};

