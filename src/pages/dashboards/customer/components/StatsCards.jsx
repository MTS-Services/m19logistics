import React from 'react';
import { Clock, Package, CheckCircle, XCircle } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 sm:text-sm">Received</p>
            <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{stats.pending}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-2 sm:p-3">
            <Clock className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 sm:text-sm">Allocated</p>
            <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{stats.allocated}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
            <Package className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 sm:text-sm">Delivered</p>
            <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{stats.completed}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-2 sm:p-3">
            <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 sm:text-sm">Cancelled</p>
            <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{stats.cancelled}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
            <XCircle className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
