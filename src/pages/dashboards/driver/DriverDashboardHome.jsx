import React, { useState } from 'react';
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  Navigation,
} from 'lucide-react';
import { toast } from 'react-toastify';

const DriverDashboardHome = () => {
  // Sample deliveries data
  const [deliveries] = useState([
    {
      id: 1,
      spoNumber: 'SPO013349',
      customerName: 'Topps Chester',
      customerPhone: '01244398888',
      date: '2026-01-16',
      timeSlot: 'AM',
      address: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
      instructions: 'Please call before arrival',
      status: 'Assigned',
      distance: 25,
    },
    {
      id: 2,
      spoNumber: 'SPO013350',
      customerName: 'Topps Newcastle',
      customerPhone: '01782717000',
      date: '2026-01-16',
      timeSlot: 'PM',
      address: 'Unit 4, Lyme Court, Newcastle, ST5 3TF',
      instructions: 'Deliver to rear entrance',
      status: 'Assigned',
      distance: 38,
    },
  ]);

  const stats = {
    assigned: deliveries.filter((d) => d.status === 'Assigned').length,
    completedToday: 8,
    totalWeek: 43,
  };

  // Handle navigate
  const handleNavigate = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.success('Opening navigation...');
  };

  // Handle call
  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your driver portal</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assigned Today</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.assigned}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.completedToday}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total This Week</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalWeek}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Truck className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Deliveries */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Today's Assigned Deliveries</h2>
        </div>

        {deliveries.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries assigned</h3>
            <p className="mt-2 text-sm text-gray-600">
              You currently have no deliveries assigned for today
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="p-6 transition-colors hover:bg-gray-50">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Delivery Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-teal-50 p-3">
                        <Package className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            SPO: {delivery.spoNumber}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
                            <Clock className="h-3 w-3" />
                            {delivery.status}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{delivery.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <a
                              href={`tel:${delivery.customerPhone}`}
                              className="font-medium text-teal-600 hover:text-teal-700"
                            >
                              {delivery.customerPhone}
                            </a>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{delivery.address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {delivery.date} - {delivery.timeSlot}
                            </span>
                          </div>
                          {delivery.instructions && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span className="italic">{delivery.instructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:ml-6">
                    <button
                      onClick={() => handleNavigate(delivery.address)}
                      className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                    >
                      <Navigation className="h-4 w-4" />
                      Navigate
                    </button>
                    <button
                      onClick={() => handleCall(delivery.customerPhone)}
                      className="flex items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                    >
                      <Phone className="h-4 w-4" />
                      Call Customer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>

  );
};

export default DriverDashboardHome;
