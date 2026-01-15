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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p
                    className={`mt-2 inline-flex items-center text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    <TrendingUp className="mr-1 h-4 w-4" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`rounded-lg ${stat.color} p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 p-6 text-white shadow-lg">
          <Package className="mb-3 h-8 w-8" />
          <h3 className="mb-2 text-lg font-semibold">Pending Bookings</h3>
          <p className="mb-4 text-3xl font-bold">8</p>
          <p className="text-sm text-teal-100">Requires allocation to drivers</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <Clock className="mb-3 h-8 w-8" />
          <h3 className="mb-2 text-lg font-semibold">In Progress</h3>
          <p className="mb-4 text-3xl font-bold">15</p>
          <p className="text-sm text-blue-100">Currently out for delivery</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg">
          <CheckCircle className="mb-3 h-8 w-8" />
          <h3 className="mb-2 text-lg font-semibold">Completed Today</h3>
          <p className="mb-4 text-3xl font-bold">23</p>
          <p className="text-sm text-green-100">Successfully delivered</p>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
          <a
            href="/admin/bookings"
            className="text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View all →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-600">
                <th className="pb-3">Invoice #</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Weight</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="text-sm hover:bg-gray-50">
                  <td className="py-4 font-medium text-gray-900">{booking.id}</td>
                  <td className="py-4 text-gray-600">{booking.customer}</td>
                  <td className="py-4 text-gray-600">{booking.date}</td>
                  <td className="py-4 text-gray-600">{booking.time}</td>
                  <td className="py-4 text-gray-600">{booking.weight}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(booking.status)}`}
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
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-3 h-5 w-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-900">Action Required</h4>
              <p className="mt-1 text-sm text-red-700">8 new bookings awaiting driver allocation</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4">
          <div className="flex items-start">
            <CheckCircle className="mr-3 h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">System Status</h4>
              <p className="mt-1 text-sm text-blue-700">All systems operational - 99.8% uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
