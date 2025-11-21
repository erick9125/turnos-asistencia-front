import { ReactNode } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * Layout principal del dashboard
 * Incluye sidebar, topbar y área de contenido
 */
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        {/* Topbar */}
        <Topbar />

        {/* Área de contenido */}
        <main style={{
          flex: 1,
          padding: '1.5rem',
          overflow: 'auto'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

