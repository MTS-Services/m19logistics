import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
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

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:px-6">
      {/* Items count */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
            currentPage === 1
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-gray-50 hover:text-teal-600'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-2 text-sm font-medium text-gray-400"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
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
          className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
            currentPage === totalPages
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
              : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-gray-50 hover:text-teal-600'
          }`}
          aria-label="Next page"
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
