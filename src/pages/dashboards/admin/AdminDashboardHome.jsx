import React from 'react';
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

const AdminDashboardHome = () => {
  const stats = [
    {
      name: 'Total Bookings',
      value: '248',
      change: '+12%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Customers',
      value: '42',
      change: '+8%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-teal-500',
    },
    {
      name: 'Active Drivers',
      value: '12',
      change: '0%',
      changeType: 'neutral',
      icon: Truck,
      color: 'bg-indigo-500',
    },
    {
      name: 'Revenue (MTD)',
      value: '£8,450',
      change: '+18%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-green-500',
    },
  ];

  const recentBookings = [
    {
      id: 'T0328',
      customer: 'Topps Tiles Wrexham (T022)',
      status: 'Received',
      date: '2026-01-14',
      time: 'AM',
      weight: '800kg',
    },
    {
      id: 'T0327',
      customer: 'Topps Tiles Chester (T045)',
      status: 'Allocated',
      date: '2026-01-14',
      time: 'PM',
      weight: '1600kg',
    },
    {
      id: 'T0326',
      customer: 'Topps Tiles Llandudno (T089)',
      status: 'Delivered',
      date: '2026-01-13',
      time: 'AM',
      weight: '800kg',
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Received: 'bg-red-100 text-red-800',
      Allocated: 'bg-yellow-100 text-yellow-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Admin Dashboard</h1>
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
                      className={`mt-1 inline-flex items-center text-xs font-medium sm:mt-2 sm:text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-600'
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
              Pending Bookings
            </h3>
            <p className="mb-2 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">8</p>
            <p className="text-xs text-teal-100 sm:text-sm">Requires allocation to drivers</p>
          </div>

          <div className="rounded-lg bg-linear-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg sm:rounded-xl sm:p-6">
            <Clock className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
            <h3 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
              In Progress
            </h3>
            <p className="mb-2 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">15</p>
            <p className="text-xs text-blue-100 sm:text-sm">Currently out for delivery</p>
          </div>

          <div className="rounded-lg bg-linear-to-br from-green-500 to-green-600 p-4 text-white shadow-lg sm:rounded-xl sm:p-6">
            <CheckCircle className="mb-2 h-6 w-6 sm:mb-3 sm:h-8 sm:w-8" />
            <h3 className="mb-1 text-base font-semibold text-white sm:mb-2 sm:text-lg">
              Completed Today
            </h3>
            <p className="mb-2 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">23</p>
            <p className="text-xs text-green-100 sm:text-sm">Successfully delivered</p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm sm:rounded-xl">
          <div className="border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Recent Bookings</h2>
              <a
                href="/admin/bookings"
                className="text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                View all →
              </a>
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
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="text-sm transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 sm:px-6 sm:py-4">
                      {booking.id}
                    </td>
                    <td className="px-4 py-3 text-gray-600 sm:px-6 sm:py-4">
                      <div className="max-w-xs truncate sm:max-w-sm">{booking.customer}</div>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 sm:table-cell sm:px-6 sm:py-4">
                      {booking.date}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 md:table-cell md:px-6 md:py-4">
                      {booking.time}
                    </td>
                    <td className="hidden px-4 py-3 text-gray-600 lg:table-cell lg:px-6 lg:py-4">
                      {booking.weight}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold sm:px-3 ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-3 sm:rounded-xl sm:p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 text-red-600 sm:mr-3" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-red-900 sm:text-base">Action Required</h4>
                <p className="mt-1 text-xs text-red-700 sm:text-sm">
                  8 new bookings awaiting driver allocation
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 sm:rounded-xl sm:p-4">
            <div className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-blue-600 sm:mr-3" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-blue-900 sm:text-base">System Status</h4>
                <p className="mt-1 text-xs text-blue-700 sm:text-sm">
                  All systems operational - 99.8% uptime
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
