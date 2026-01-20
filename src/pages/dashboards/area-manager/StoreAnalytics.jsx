import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Package,
  DollarSign,
  Calendar,
  Download,
  Building2,
  Eye,
} from 'lucide-react';

const StoreAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedStore, setSelectedStore] = useState('All');

  const stores = [
    'All',
    'Topps Chester',
    'Topps Nantwich',
    'Topps Newcastle',
    'Topps Northwich',
    'Topps Rhyl',
    'Topps Wrexham',
  ];

  // Analytics data for different time periods
  const analyticsData = {
    week: [
      {
        name: 'Topps Chester',
        deliveries: 38,
        revenue: 1710,
        avgPerDelivery: 45.0,
        growth: 12.5,
      },
      {
        name: 'Topps Nantwich',
        deliveries: 24,
        revenue: 1080,
        avgPerDelivery: 45.0,
        growth: 8.3,
      },
      {
        name: 'Topps Newcastle',
        deliveries: 52,
        revenue: 2340,
        avgPerDelivery: 45.0,
        growth: 15.2,
      },
      {
        name: 'Topps Northwich',
        deliveries: 33,
        revenue: 1485,
        avgPerDelivery: 45.0,
        growth: 6.7,
      },
      {
        name: 'Topps Rhyl',
        deliveries: 22,
        revenue: 990,
        avgPerDelivery: 45.0,
        growth: 4.2,
      },
      {
        name: 'Topps Wrexham',
        deliveries: 28,
        revenue: 1260,
        avgPerDelivery: 45.0,
        growth: 9.8,
      },
    ],
    month: [
      {
        name: 'Topps Chester',
        deliveries: 156,
        revenue: 7020,
        avgPerDelivery: 45.0,
        growth: 12.5,
      },
      {
        name: 'Topps Nantwich',
        deliveries: 98,
        revenue: 4410,
        avgPerDelivery: 45.0,
        growth: 8.3,
      },
      {
        name: 'Topps Newcastle',
        deliveries: 210,
        revenue: 9450,
        avgPerDelivery: 45.0,
        growth: 15.2,
      },
      {
        name: 'Topps Northwich',
        deliveries: 134,
        revenue: 6030,
        avgPerDelivery: 45.0,
        growth: 6.7,
      },
      {
        name: 'Topps Rhyl',
        deliveries: 89,
        revenue: 4005,
        avgPerDelivery: 45.0,
        growth: 4.2,
      },
      {
        name: 'Topps Wrexham',
        deliveries: 112,
        revenue: 5040,
        avgPerDelivery: 45.0,
        growth: 9.8,
      },
    ],
    year: [
      {
        name: 'Topps Chester',
        deliveries: 1872,
        revenue: 84240,
        avgPerDelivery: 45.0,
        growth: 12.5,
      },
      {
        name: 'Topps Nantwich',
        deliveries: 1176,
        revenue: 52920,
        avgPerDelivery: 45.0,
        growth: 8.3,
      },
      {
        name: 'Topps Newcastle',
        deliveries: 2520,
        revenue: 113400,
        avgPerDelivery: 45.0,
        growth: 15.2,
      },
      {
        name: 'Topps Northwich',
        deliveries: 1608,
        revenue: 72360,
        avgPerDelivery: 45.0,
        growth: 6.7,
      },
      {
        name: 'Topps Rhyl',
        deliveries: 1068,
        revenue: 48060,
        avgPerDelivery: 45.0,
        growth: 4.2,
      },
      {
        name: 'Topps Wrexham',
        deliveries: 1344,
        revenue: 60480,
        avgPerDelivery: 45.0,
        growth: 9.8,
      },
    ],
  };

  // Get current data based on time filter
  const storeData = useMemo(() => analyticsData[timeFilter], [timeFilter]);

  const filteredData =
    selectedStore === 'All' ? storeData : storeData.filter((store) => store.name === selectedStore);

  const totalStats = {
    deliveries: filteredData.reduce((sum, store) => sum + store.deliveries, 0),
    revenue: filteredData.reduce((sum, store) => sum + store.revenue, 0),
    avgPerDelivery:
      filteredData.reduce((sum, store) => sum + store.revenue, 0) /
      filteredData.reduce((sum, store) => sum + store.deliveries, 0),
    avgGrowth: filteredData.reduce((sum, store) => sum + store.growth, 0) / filteredData.length,
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Store Analytics
            </h1>
            <p className="mt-2 text-gray-600">
              Performance analytics for assigned Topps Tiles stores (Read-Only)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2">
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

          {/* Store Filter */}
          <div className="relative">
            <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              {stores.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{totalStats.deliveries}</p>
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
                  £{totalStats.revenue.toLocaleString()}
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
                <p className="text-sm text-gray-600">Avg per Delivery</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  £{totalStats.avgPerDelivery.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Growth</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  +{totalStats.avgGrowth.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 p-3">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Store Performance Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Store Performance Breakdown</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">Store Name</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Deliveries</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Revenue</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">
                    Avg per Delivery
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-900">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((store, index) => (
                  <tr key={index} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-teal-50 p-2">
                          <Building2 className="h-5 w-5 text-teal-600" />
                        </div>
                        <span className="font-medium text-gray-900">{store.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">{store.deliveries}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      £{store.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">
                      £{store.avgPerDelivery.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-600">
                        <TrendingUp className="h-3 w-3" />+{store.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                <tr>
                  <td className="px-6 py-4 font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    {totalStats.deliveries}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    £{totalStats.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    £{totalStats.avgPerDelivery.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">
                    +{totalStats.avgGrowth.toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Revenue Trend</h3>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* Read-Only Notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Read-Only Analytics</h3>
              <p className="mt-1 text-sm text-blue-700">
                You have view-only access to analytics data. Export and advanced reporting features
                are restricted to administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
