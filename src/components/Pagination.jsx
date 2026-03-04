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
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const containerClass = compact
    ? 'flex flex-col items-center justify-between gap-4 w-full pt-4 border-t border-gray-100 sm:flex-row sm:gap-6'
    : 'flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-3 shadow-sm sm:gap-4 sm:px-6 sm:py-5 sm:flex-row sm:justify-between';

  return (
    <div className={containerClass}>
      {/* Items count */}
      <div className="order-3 w-full text-center text-[11px] font-medium text-gray-700 sm:order-1 sm:w-auto sm:text-left sm:text-sm">
        Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
        <span className="font-bold text-gray-900">{endItem}</span> of{' '}
        <span className="font-bold text-gray-900">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="order-1 sm:order-2 flex items-center justify-center gap-0.5 overflow-x-auto sm:gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center rounded-md border p-1 text-xs transition-all duration-200 shrink-0 sm:px-3 sm:py-2 ${currentPage === 1
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
            : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600'
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {/* Page numbers */}
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
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold transition-all duration-200 sm:h-9 sm:w-9 sm:text-sm ${currentPage === page
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

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center justify-center rounded-md border p-1 text-xs transition-all duration-200 shrink-0 sm:px-3 sm:py-2 ${currentPage === totalPages
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
