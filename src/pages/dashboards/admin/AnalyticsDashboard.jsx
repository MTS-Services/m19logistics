import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Package, Users } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import axiosInstance from '../../../services/axiosInstance';

const AnalyticsDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({});
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/admin/analytics');
      const data = response.data?.data || {};
      setSummary(data.summary || {});
      setRecentDeliveries(
        (data.recentDeliveries || []).map((d) => ({
          id: d.id,
          spoNumber: d.spoNumber,
          customerName: d.customerName,
          driverName: d.driver?.fullName || 'N/A',
          deliveryDate: d.deliveryDate,
          timeSlot: d.timeSlot,
          amount: parseFloat(d.totalPrice || 0),
          status: d.status,
        }))
      );
    } catch {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const overviewStats = {
    totalRevenue: parseFloat(summary.totalRevenue || 0),
    totalDeliveries: summary.totalDeliveries || 0,
    activeCustomers: summary.activeCustomers || 0,
  };

  const allDeliveries = recentDeliveries;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = allDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allDeliveries.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Comprehensive performance metrics and reports</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.totalRevenue.toLocaleString()}
              </p>
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
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">{overviewStats.activeCustomers}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Total Deliveries Table */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Package className="h-6 w-6 text-teal-600" />
            Total Deliveries Details
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allDeliveries.length)} of{' '}
            {allDeliveries.length} deliveries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Delivery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Date &amp; Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-teal-600">{delivery.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{delivery.customerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{delivery.driverName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{delivery.deliveryDate}</p>
                    <p className="text-sm text-gray-600">{delivery.timeSlot}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-teal-600">£{delivery.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        delivery.status === 'Delivered'
                          ? 'bg-green-100 text-green-600'
                          : delivery.status === 'Allocated'
                            ? 'bg-blue-100 text-blue-600'
                            : delivery.status === 'Received'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allDeliveries.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={allDeliveries.length}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
