import React, { useState, useEffect } from 'react';
import {
  Package,
  Users,
  Truck,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../services/axiosInstance';
import Loading from '../../../components/Loading';
import Pagination from '../../../components/Pagination';

const ManagerDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/admin/dashboard');

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatStatus = (status) => {
    // Convert API status (RECEIVED, ALLOCATED) to display format (Received, Allocated)
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const getChangeType = (change) => {
    if (change > 0) return 'increase';
    if (change < 0) return 'decrease';
    return 'neutral';
  };

  const formatChangeText = (change, text) => {
    if (change > 0) return `+${text}`;
    if (change < 0) return `-${Math.abs(change)}% from last month`;
    return text;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading message="Loading Dashboard" submessage="Fetching your dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h3 className="text-sm font-semibold text-red-900">Error Loading Dashboard</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-3 rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { metrics, statusCards, recentBookings } = dashboardData;

  // Pagination calculations
  const totalPages = Math.ceil(recentBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = recentBookings.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to table top for better UX
    document.getElementById('recent-bookings-table')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const stats = [
    {
      name: 'Total Bookings',
      value: metrics.totalBookings.count,
      change: formatChangeText(metrics.totalBookings.change, metrics.totalBookings.changeText),
      changeType: getChangeType(metrics.totalBookings.change),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Customers',
      value: metrics.activeCustomers.count,
      change: formatChangeText(metrics.activeCustomers.change, metrics.activeCustomers.changeText),
      changeType: getChangeType(metrics.activeCustomers.change),
      icon: Users,
      color: 'bg-teal-500',
    },
    {
      name: 'Active Drivers',
      value: metrics.activeDrivers.count,
      change: formatChangeText(metrics.activeDrivers.change, metrics.activeDrivers.changeText),
      changeType: getChangeType(metrics.activeDrivers.change),
      icon: Truck,
      color: 'bg-indigo-500',
    },
    {
      name: 'Revenue (MTD)',
      value: metrics.revenue.formatted,
      change: formatChangeText(metrics.revenue.change, metrics.revenue.changeText),
      changeType: getChangeType(metrics.revenue.change),
      icon: DollarSign,
      color: 'bg-green-500',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Received: 'bg-red-100 text-red-800',
      Allocated: 'bg-yellow-100 text-yellow-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[formatStatus(status)] || 'bg-gray-100 text-gray-800';
  };


  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Manager Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
              Manage your delivery requests and track shipments
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">{stat.name}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
                      {stat.value}
                    </p>
                    <p
                      className={`mt-1 inline-flex items-center text-xs font-medium sm:mt-2 sm:text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-600'
                        }`}
                    >
                      <TrendingUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{stat.change} from last month</span>
                      <span className="sm:hidden">{stat.change}</span>
                    </p>
                  </div>
                  <div className={`rounded-lg ${stat.color} p-2 sm:p-3`}>
                    <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-linear-to-br from-teal-500 to-teal-600 p-4 text-white shadow-lg sm:rounded-xl sm:p-6">
            <Package className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
            <h3 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
              {statusCards.pending.label}
            </h3>
            <p className="mb-2 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
              {statusCards.pending.count}
            </p>
            <p className="text-xs text-teal-100 sm:text-sm">{statusCards.pending.description}</p>
          </div>

          <div className="rounded-lg bg-linear-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg sm:rounded-xl sm:p-6">
            <Clock className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
            <h3 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
              {statusCards.inProgress.label}
            </h3>
            <p className="mb-2 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
              {statusCards.inProgress.count}
            </p>
            <p className="text-xs text-blue-100 sm:text-sm">{statusCards.inProgress.description}</p>
          </div>

          <div className="rounded-lg bg-linear-to-br from-green-500 to-green-600 p-4 text-white shadow-lg sm:rounded-xl sm:p-6">
            <CheckCircle className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
            <h3 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
              {statusCards.completedToday.label}
            </h3>
            <p className="mb-2 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
              {statusCards.completedToday.count}
            </p>
            <p className="text-xs text-green-100 sm:text-sm">
              {statusCards.completedToday.description}
            </p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div id="recent-bookings-table" className="rounded-lg border border-gray-200 bg-white shadow-sm sm:rounded-xl">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Recent Bookings</h2>
              <Link
                to="/manager/bookings"
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  <th className="px-4 py-3 sm:px-6">Invoice #</th>
                  <th className="px-4 py-3 sm:px-6">Customer</th>
                  <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Date</th>
                  <th className="hidden px-4 py-3 md:table-cell md:px-6">Time</th>
                  <th className="hidden px-4 py-3 lg:table-cell lg:px-6">Weight</th>
                  <th className="px-4 py-3 sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr key={booking.deliveryId} className="text-sm transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 sm:px-6 sm:py-4">
                      {booking.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600 sm:px-6 sm:py-4">
                      <div className="max-w-xs truncate sm:max-w-sm">{booking.customer}</div>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell sm:px-6 sm:py-4">
                      {formatDate(booking.date)}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 md:table-cell md:px-6 md:py-4">
                      {booking.timeSlot}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 lg:table-cell lg:px-6 lg:py-4">
                      {booking.weight}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold sm:px-3 ${getStatusColor(booking.status)}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {recentBookings.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={recentBookings.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardHome;
