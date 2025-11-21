import type { Pagination as PaginationType } from '../../types';
import { Button } from './Button';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

/**
 * Componente de paginación reutilizable
 * Muestra información de paginación y botones para navegar entre páginas
 */
export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { current_page, last_page, total, from, to } = pagination;

  // Generar array de números de página a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (last_page <= maxPagesToShow) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar primera página
      pages.push(1);

      // Calcular inicio y fin del rango central
      let start = Math.max(2, current_page - 1);
      let end = Math.min(last_page - 1, current_page + 1);

      // Ajustar si estamos cerca del inicio o fin
      if (current_page <= 3) {
        end = 4;
      } else if (current_page >= last_page - 2) {
        start = last_page - 3;
      }

      // Añadir elipsis si es necesario
      if (start > 2) {
        pages.push('...');
      }

      // Añadir páginas del rango central
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Añadir elipsis si es necesario
      if (end < last_page - 1) {
        pages.push('...');
      }

      // Mostrar última página
      pages.push(last_page);
    }

    return pages;
  };

  if (last_page <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
        >
          Siguiente
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{from}</span> a{' '}
            <span className="font-medium">{to}</span> de{' '}
            <span className="font-medium">{total}</span> resultados
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(current_page - 1)}
              disabled={current_page === 1}
              className="rounded-r-none"
            >
              Anterior
            </Button>
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              const isCurrent = pageNum === current_page;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-semibold
                    ${isCurrent
                      ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(current_page + 1)}
              disabled={current_page === last_page}
              className="rounded-l-none"
            >
              Siguiente
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

