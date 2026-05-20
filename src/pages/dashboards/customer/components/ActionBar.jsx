import React from 'react';
import { Plus } from 'lucide-react';

const ActionBar = ({ filterStatus, handleFilterChange, navigate }) => {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('all')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
              filterStatus === 'all'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('received')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
              filterStatus === 'received'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Received
          </button>
          <button
            onClick={() => handleFilterChange('allocated')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
              filterStatus === 'allocated'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Allocated
          </button>
          <button
            onClick={() => handleFilterChange('delivered')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
              filterStatus === 'delivered'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => handleFilterChange('cancelled')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
              filterStatus === 'cancelled'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cancelled
          </button>
        </div>

        <button
          onClick={() => navigate('/customer/new-delivery')}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:text-base lg:w-auto lg:px-6"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          Request Delivery
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
