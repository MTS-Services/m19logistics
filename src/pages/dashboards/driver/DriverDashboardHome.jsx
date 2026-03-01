import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getDriverDashboard, getDriverDeliveries } from '../../../services/driverService';

const DriverDashboardHome = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({
    pendingDeliveries: 0,
    completedDeliveries: 0,
    todayDeliveries: 0,
    thisWeekDeliveries: 0,
  });
  const [loading, setLoading] = useState(false);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);

  // Fetch driver dashboard stats
  useEffect(() => {
    let isMounted = true;

    const loadDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await getDriverDashboard();
        if (!isMounted) return;

        if (response && response.success && response.data && response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        if (isMounted) {
          toast.error('Failed to load dashboard stats');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch today's deliveries
  useEffect(() => {
    let isMounted = true;

    const loadTodaysDeliveries = async () => {
      setLoadingDeliveries(true);
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const response = await getDriverDeliveries('ALLOCATED', formattedDate);
        if (!isMounted) return;

        if (response && response.success && response.data) {
          // Normalize API fields to the UI shape used in this component
          const normalized = response.data.map((d) => ({
            id: d.id,
            spoNumber: d.spoNumber,
            customerName: d.customerName || (d.customer && d.customer.fullName) || '',
            customerPhone: d.customerPhone || (d.customer && d.customer.phone) || '',
            // deliveryDate from API -> date expected by UI (YYYY-MM-DD)
            date: d.deliveryDate ? new Date(d.deliveryDate).toISOString().split('T')[0] : '',
            timeSlot: d.timeSlot || '',
            address: d.deliveryAddress || '',
            instructions: d.specialInstructions || '',
            status: d.status || '',
            distance: d.distanceFromDepot || d.distance || null,
          }));

          setDeliveries(normalized);
        }
      } catch (error) {
        console.error('Error loading deliveries:', error);
        if (isMounted) {
          toast.error('Failed to load deliveries');
        }
      } finally {
        if (isMounted) {
          setLoadingDeliveries(false);
        }
      }
    };

    loadTodaysDeliveries();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle call
  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to your driver portal</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loading ? '—' : stats.pendingDeliveries}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loading ? '—' : stats.completedDeliveries}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today Delivery</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loading ? '—' : stats.todayDeliveries}
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 p-3">
                <Truck className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week Deliveries</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {loading ? '—' : stats.thisWeekDeliveries}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Today's Deliveries */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Today's Assigned Deliveries</h2>
          </div>

          {loadingDeliveries ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-teal-600"></div>
              <p className="mt-4 text-sm text-gray-600">Loading deliveries...</p>
            </div>
          ) : deliveries.length === 0 ? (
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
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
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
                                <FileText className="mt-0.5 h-4 w-4 shrink-0" />
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
