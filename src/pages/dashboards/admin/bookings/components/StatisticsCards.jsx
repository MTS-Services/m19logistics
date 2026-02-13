import React from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const StatisticsCards = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
      {/* Total */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-gray-600">Total</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <Package className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Received */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-gray-600">Received</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.received}</p>
          </div>
          <div className="rounded-lg bg-red-50 p-2">
            <Clock className="h-5 w-5 text-red-600" />
          </div>
        </div>
      </div>

      {/* Allocated */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-gray-600">Allocated</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.allocated}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Delivered */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-gray-600">Delivered</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.delivered}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>

      {/* Cancelled */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-gray-600">Cancelled</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stats.cancelled}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <XCircle className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;
