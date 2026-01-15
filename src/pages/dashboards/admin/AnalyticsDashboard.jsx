import React, { useState } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('this-week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Sample analytics data
  const overviewStats = {
    totalRevenue: 12450.0,
    revenueChange: 12.5,
    totalDeliveries: 278,
    deliveriesChange: 8.3,
    avgRevenuePerDelivery: 44.78,
    avgChange: 3.8,
    totalVAT: 2490.0,
    vatChange: 12.5,
    outstandingInvoices: 1250.0,
    outstandingCount: 3,
    completionRate: 94.6,
    completionChange: 2.1,
  };

  const storePerformance = [
    { id: 1, name: 'Topps Chester', deliveries: 52, revenue: 2340.0, change: 15.2, share: 18.7 },
    { id: 2, name: 'Topps Newcastle', deliveries: 48, revenue: 2400.0, change: -5.3, share: 17.3 },
    { id: 3, name: 'Topps Wrexham', deliveries: 45, revenue: 2025.0, change: 8.7, share: 16.2 },
    { id: 4, name: 'Topps Rhyl', deliveries: 42, revenue: 1890.0, change: 12.4, share: 15.1 },
    { id: 5, name: 'Topps Nantwich', deliveries: 38, revenue: 1710.0, change: 6.8, share: 13.7 },
    { id: 6, name: 'Topps Northwich', deliveries: 53, revenue: 2085.0, change: 18.9, share: 19.0 },
  ];

  const driverPerformance = [
    {
      id: 1,
      name: 'BK',
      deliveries: 278,
      avgTime: '45 mins',
      completionRate: 94.6,
      lateDeliveries: 15,
      proofsAttached: 263,
      feedbackCount: 245,
      rating: 4.8,
    },
  ];

  const weeklyData = [
    { day: 'Mon', deliveries: 42, revenue: 1890.0 },
    { day: 'Tue', deliveries: 38, revenue: 1710.0 },
    { day: 'Wed', deliveries: 45, revenue: 2025.0 },
    { day: 'Thu', deliveries: 52, revenue: 2340.0 },
    { day: 'Fri', deliveries: 48, revenue: 2160.0 },
    { day: 'Sat', deliveries: 35, revenue: 1575.0 },
    { day: 'Sun', deliveries: 18, revenue: 810.0 },
  ];

  const monthlyTrends = [
    { month: 'Aug', revenue: 48500, deliveries: 1078 },
    { month: 'Sep', revenue: 51200, deliveries: 1138 },
    { month: 'Oct', revenue: 49800, deliveries: 1106 },
    { month: 'Nov', revenue: 52600, deliveries: 1169 },
    { month: 'Dec', revenue: 54300, deliveries: 1207 },
    { month: 'Jan', revenue: 12450, deliveries: 278 },
  ];

  const handleExport = (format) => {
    alert(`Exporting analytics as ${format.toUpperCase()}...`);
    // In real implementation: generate and download file
  };

  const getMaxValue = (data, key) => Math.max(...data.map((item) => item[key]));

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Comprehensive performance metrics and reports</p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-semibold text-gray-700">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
            >
              <option value="this-week">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === 'custom' && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.totalRevenue.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.revenueChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.revenueChange > 0 ? '+' : ''}
                  {overviewStats.revenueChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total Deliveries</p>
              <p className="text-3xl font-bold text-gray-900">{overviewStats.totalDeliveries}</p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.deliveriesChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.deliveriesChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.deliveriesChange > 0 ? '+' : ''}
                  {overviewStats.deliveriesChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Avg Revenue/Delivery</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.avgRevenuePerDelivery}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.avgChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.avgChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.avgChange > 0 ? '+' : ''}
                  {overviewStats.avgChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total VAT Collected</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.totalVAT.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.vatChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.vatChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.vatChange > 0 ? '+' : ''}
                  {overviewStats.vatChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <FileText className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Outstanding Invoices</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.outstandingInvoices.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-sm text-gray-500">
                  {overviewStats.outstandingCount} unpaid invoices
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <XCircle className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{overviewStats.completionRate}%</p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.completionChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.completionChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.completionChange > 0 ? '+' : ''}
                  {overviewStats.completionChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <CheckCircle className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMetric('overview')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'overview'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedMetric('stores')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'stores'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Store Performance
          </button>
          <button
            onClick={() => setSelectedMetric('drivers')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'drivers'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Driver Analytics
          </button>
          <button
            onClick={() => setSelectedMetric('trends')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'trends'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Trends & Charts
          </button>
        </div>
      </div>

      {/* Store Performance View */}
      {selectedMetric === 'stores' && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <BarChart3 className="h-6 w-6 text-teal-600" />
              Store Performance Analysis
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Deliveries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Market Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {storePerformance.map((store) => (
                  <tr key={store.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{store.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{store.deliveries}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-teal-600">
                        £{store.revenue.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {store.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-semibold ${store.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {store.change > 0 ? '+' : ''}
                          {store.change}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 max-w-[100px] flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500"
                            style={{ width: `${store.share * 5}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{store.share}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          store.change > 15
                            ? 'bg-green-100 text-green-600'
                            : store.change > 5
                              ? 'bg-teal-100 text-teal-600'
                              : store.change > 0
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {store.change > 15
                          ? 'Excellent'
                          : store.change > 5
                            ? 'Good'
                            : store.change > 0
                              ? 'Average'
                              : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Driver Analytics View */}
      {selectedMetric === 'drivers' && (
        <div className="space-y-6">
          {driverPerformance.map((driver) => (
            <div
              key={driver.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-2xl font-bold text-white shadow-md">
                    {driver.name}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{driver.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {driver.rating}/5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-teal-50 px-4 py-2">
                  <p className="text-xs text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-teal-600">{driver.completionRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Deliveries</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.deliveries}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Avg Time</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.avgTime}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Late</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.lateDeliveries}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Proofs</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.proofsAttached}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Feedback</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.feedbackCount}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Efficiency</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trends & Charts View */}
      {selectedMetric === 'trends' && (
        <div className="space-y-6">
          {/* Weekly Bar Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <BarChart3 className="h-6 w-6 text-teal-600" />
                Weekly Deliveries & Revenue
              </h2>
            </div>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-semibold text-gray-600">{day.day}</div>
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="flex h-8 items-center justify-end rounded-full bg-gradient-to-r from-teal-600 to-teal-500 pr-3 transition-all"
                        style={{
                          width: `${(day.deliveries / getMaxValue(weeklyData, 'deliveries')) * 100}%`,
                        }}
                      >
                        <span className="text-sm font-semibold text-white">{day.deliveries}</span>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm font-bold text-teal-600">
                        £{day.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <LineChart className="h-6 w-6 text-teal-600" />
                Monthly Revenue Trends
              </h2>
            </div>
            <div className="space-y-3">
              {monthlyTrends.map((month, index) => {
                const prevRevenue = index > 0 ? monthlyTrends[index - 1].revenue : month.revenue;
                const change = (((month.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1);
                return (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-semibold text-gray-600">{month.month}</div>
                    <div className="flex flex-1 items-center gap-4">
                      <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="flex h-8 items-center justify-end rounded-full bg-gradient-to-r from-teal-600 to-teal-500 pr-3 transition-all"
                          style={{
                            width: `${(month.revenue / getMaxValue(monthlyTrends, 'revenue')) * 100}%`,
                          }}
                        >
                          <span className="text-sm font-semibold text-white">
                            {month.deliveries}
                          </span>
                        </div>
                      </div>
                      <div className="w-32 text-right">
                        <p className="text-sm font-bold text-teal-600">
                          £{month.revenue.toLocaleString()}
                        </p>
                        {index > 0 && (
                          <p
                            className={`text-xs font-semibold ${parseFloat(change) > 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {parseFloat(change) > 0 ? '+' : ''}
                            {change}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Store Share Pie Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <PieChart className="h-6 w-6 text-teal-600" />
                Store Market Share
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-64">
                  <svg viewBox="0 0 100 100" className="-rotate-90 transform">
                    {
                      storePerformance.reduce(
                        (acc, store, index) => {
                          const colors = [
                            '#0d9488',
                            '#14b8a6',
                            '#2dd4bf',
                            '#5eead4',
                            '#99f6e4',
                            '#ccfbf1',
                          ];
                          const startAngle = acc.angle;
                          const angle = (store.share / 100) * 360;
                          const endAngle = startAngle + angle;
                          const largeArc = angle > 180 ? 1 : 0;

                          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                          acc.paths.push(
                            <path
                              key={store.id}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={colors[index]}
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          );
                          acc.angle = endAngle;
                          return acc;
                        },
                        { angle: 0, paths: [] }
                      ).paths
                    }
                    <circle cx="50" cy="50" r="20" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{storePerformance.length}</p>
                      <p className="text-xs text-gray-600">Stores</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {storePerformance.map((store, index) => {
                  const colors = [
                    'bg-teal-600',
                    'bg-teal-500',
                    'bg-teal-400',
                    'bg-teal-300',
                    'bg-teal-200',
                    'bg-teal-100',
                  ];
                  return (
                    <div
                      key={store.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded ${colors[index]}`} />
                        <span className="text-sm font-semibold text-gray-900">{store.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal-600">{store.share}%</p>
                        <p className="text-xs text-gray-500">{store.deliveries} deliveries</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
