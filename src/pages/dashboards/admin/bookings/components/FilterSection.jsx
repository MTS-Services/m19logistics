import React from 'react';
import { Search } from 'lucide-react';

const FilterSection = ({ searchQuery, onSearchChange, filterStatus, onFilterChange }) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="flex-1 md:max-w-md">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SPO, customer, or address..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`rounded-lg px-3 py-2 text-base font-medium transition-all sm:px-4 ${filterStatus === 'all'
                ? 'bg-teal-600 text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('received')}
            className={`rounded-lg px-3 py-2 text-base font-medium transition-all sm:px-4 ${filterStatus === 'received'
                ? 'bg-teal-600 text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Received
          </button>
          <button
            onClick={() => onFilterChange('allocated')}
            className={`rounded-lg px-3 py-2 text-base font-medium transition-all sm:px-4 ${filterStatus === 'allocated'
                ? 'bg-teal-600 text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Allocated
          </button>
          <button
            onClick={() => onFilterChange('delivered')}
            className={`rounded-lg px-3 py-2 text-base font-medium transition-all sm:px-4 ${filterStatus === 'delivered'
                ? 'bg-teal-600 text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Delivered
          </button>
          <button
            onClick={() => onFilterChange('cancelled')}
            className={`rounded-lg px-3 py-2 text-base font-medium transition-all sm:px-4 ${filterStatus === 'cancelled'
                ? 'bg-teal-600 text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            Cancelled
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
