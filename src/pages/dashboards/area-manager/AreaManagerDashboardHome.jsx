import React, { useState } from 'react';
import { Package, DollarSign, TrendingUp, BarChart3, Building2, Eye, Calendar } from 'lucide-react';

const AreaManagerDashboardHome = () => {
  const [timeFilter, setTimeFilter] = useState('week');

  const stats = {
    totalDeliveries: 1243,
    totalRevenue: 45230,
    thisMonth: 234,
    avgPerDelivery: 48.5,
  };

  const stores = [
    {
      name: 'Topps Chester',
      address: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
      deliveries: 156,
      revenue: 7020,
      status: 'Active',
    },
    {
      name: 'Topps Nantwich',
      address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
      deliveries: 98,
      revenue: 4410,
      status: 'Active',
    },
    {
      name: 'Topps Newcastle',
      address: 'Unit 4, Lyme Court, ST5 3TF',
      deliveries: 210,
      revenue: 10500,
      status: 'Active',
    },
    {
      name: 'Topps Northwich',
      address: 'Wadebrook Retail Park, CW9 5NN',
      deliveries: 134,
      revenue: 6030,
      status: 'Active',
    },
    {
      name: 'Topps Rhyl',
      address: '152 Vale Road, Rhyl, LL18 2PD',
      deliveries: 89,
      revenue: 4005,
      status: 'Active',
    },
    {
      name: 'Topps Wrexham',
      address: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
      deliveries: 112,
      revenue: 5040,
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of Topps Tiles stores performance</p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
        {['week', 'month', 'year'].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              timeFilter === filter
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            This {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deliveries</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                £{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg per Delivery</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                £{stats.avgPerDelivery.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Store Performance */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Store Performance - Topps Tiles</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {stores.map((store, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md lg:flex-row lg:items-start lg:justify-between"
              >
                {/* Store Info */}
                <div className="flex items-start gap-4 lg:flex-1">
                  <div className="rounded-lg bg-teal-50 p-3">
                    <Building2 className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{store.address}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          store.status === 'Active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {store.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats and Actions Container */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
                  {/* Stats */}
                  <div className="flex flex-col gap-2 lg:w-[220px]">
                    <div className="flex items-center justify-between rounded-md bg-blue-50 px-4 py-2.5">
                      <span className="text-sm font-medium text-blue-900">Deliveries</span>
                      <span className="text-base font-bold text-blue-600">{store.deliveries}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-green-50 px-4 py-2.5">
                      <span className="text-sm font-medium text-green-900">Revenue</span>
                      <span className="text-base font-bold text-green-600">
                        £{store.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-start lg:w-[140px]">
                    <button className="flex w-full items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Read-Only Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Read-Only Access</h3>
            <p className="mt-1 text-sm text-blue-700">
              You have view-only permissions for assigned store data. Contact an administrator to
              make changes to deliveries, invoices, or pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaManagerDashboardHome;
