import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDevices } from '../../../api/devicesApi';
import { useRemoteMark } from '../hooks/useRemoteMark';
import { useAuth } from '../../../context/AuthContext';

/**
 * Componente para crear marcas remotas (entrada o salida)
 * Usa el worker_id del usuario autenticado
 */
export const RemoteMarkButton = () => {
  const { user } = useAuth();
  const [markType, setMarkType] = useState<'entry' | 'exit' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const remoteMarkMutation = useRemoteMark();

  // Obtener dispositivo lógico para marcas remotas
  const { data: devicesData } = useQuery({
    queryKey: ['devices', 'logical'],
    queryFn: () => getDevices({ type: 'logical', status: 'active', per_page: 1 }),
  });

  // Obtener el primer dispositivo lógico activo, o usar un valor por defecto
  const remoteDeviceId = devicesData?.data?.[0]?.id || 1; // Fallback a 1 si no hay dispositivo lógico

  // Obtener la ubicación del usuario (opcional)
  const getLocation = (): Promise<{ latitude: number; longitude: number } | undefined> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          resolve(undefined);
        }
      );
    });
  };

  const handleMark = async (type: 'entry' | 'exit') => {
    if (!user?.worker_id) {
      setMessage({ type: 'error', text: 'No se encontró el ID del trabajador' });
      return;
    }

    setMarkType(type);
    setMessage(null);

    try {
      // Intentar obtener ubicación
      const location = await getLocation();

      // Convertir 'entry'/'exit' a 'in'/'out' según API
      const direction: 'in' | 'out' = type === 'entry' ? 'in' : 'out';

      const markData = {
        worker_id: user.worker_id,
        device_id: remoteDeviceId, // Dispositivo lógico para marcas remotas
        direction,
        ...(location && { latitude: location.latitude, longitude: location.longitude }),
      };

      const response = await remoteMarkMutation.mutateAsync(markData);

      if (response.success) {
        setMessage({
          type: 'success',
          text: type === 'entry' ? 'Entrada registrada correctamente' : 'Salida registrada correctamente',
        });
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error: any) {
      // Manejar errores de la API con mensajes específicos
      let errorMessage = 'Error al registrar la marca. Intenta nuevamente.';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Mensajes específicos para errores comunes
        if (errorMessage.includes('duplicada') || errorMessage.includes('duplicado')) {
          errorMessage = '⚠️ Ya existe una marca duplicada para este trabajador, dirección y minuto.';
        } else if (errorMessage.includes('inactivo') || errorMessage.includes('inactive')) {
          errorMessage = '⚠️ El trabajador o dispositivo está inactivo. Contacta al administrador.';
        }
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setMarkType(null);
    }
  };

  if (!user?.worker_id) {
    return (
      <Alert type="warning">
        No se encontró información del trabajador. Contacta al administrador.
      </Alert>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <button
          onClick={() => handleMark('entry')}
          disabled={remoteMarkMutation.isPending}
          style={{
            padding: '2rem 1.5rem',
            background: markType === 'entry' && remoteMarkMutation.isPending
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '1.125rem',
            cursor: remoteMarkMutation.isPending ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            opacity: remoteMarkMutation.isPending ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!remoteMarkMutation.isPending) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
          }}
        >
          {markType === 'entry' && remoteMarkMutation.isPending ? (
            <>
              <svg className="animate-spin" style={{ width: '32px', height: '32px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                ✅
              </div>
              <span>Marcar Entrada</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleMark('exit')}
          disabled={remoteMarkMutation.isPending}
          style={{
            padding: '2rem 1.5rem',
            background: markType === 'exit' && remoteMarkMutation.isPending
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontWeight: '700',
            fontSize: '1.125rem',
            cursor: remoteMarkMutation.isPending ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            opacity: remoteMarkMutation.isPending ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!remoteMarkMutation.isPending) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(239, 68, 68, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(239, 68, 68, 0.3)';
          }}
        >
          {markType === 'exit' && remoteMarkMutation.isPending ? (
            <>
              <svg className="animate-spin" style={{ width: '32px', height: '32px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                🚪
              </div>
              <span>Marcar Salida</span>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

