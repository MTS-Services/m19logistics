import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  compact = false,
}) => {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeTotalItems = totalItems || 0;
  const startItem = safeTotalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, safeTotalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (safeTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(safeTotalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }

      if (currentPage >= safeTotalPages - 2) {
        startPage = safeTotalPages - 3;
      }

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < safeTotalPages - 1) {
        pages.push('...');
      }

      pages.push(safeTotalPages);
    }

    return pages;
  };

  if (safeTotalItems <= 0) return null;

  const containerClass = compact
    ? 'flex flex-col items-stretch justify-between gap-3 w-full px-0 py-3 sm:flex-row sm:items-center sm:gap-4'
    : 'flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-3 shadow-sm sm:gap-4 sm:px-6 sm:py-5 sm:flex-row sm:justify-between';

  return (
    <div className={containerClass}>
      <div className="order-3 w-full text-left text-[11px] font-medium text-gray-700 sm:order-1 sm:w-auto sm:text-sm">
        Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
        <span className="font-bold text-gray-900">{endItem}</span> of{' '}
        <span className="font-bold text-gray-900">{safeTotalItems}</span> results
      </div>

      <div className="order-1 flex items-center justify-end gap-0.5 overflow-x-auto sm:order-2 sm:gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center rounded-md border p-1 text-xs transition-all duration-200 shrink-0 sm:px-3 sm:py-2 ${
            currentPage === 1
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 py-1 text-xs font-medium text-gray-400 sm:px-2 sm:py-2"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                type="button"
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold transition-all duration-200 sm:h-9 sm:w-9 sm:text-sm ${
                  currentPage === page
                    ? 'bg-teal-600 text-white shadow-md hover:bg-teal-700'
                    : 'border border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
          className={`inline-flex items-center justify-center rounded-md border p-1 text-xs transition-all duration-200 shrink-0 sm:px-3 sm:py-2 ${
            currentPage === safeTotalPages
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
