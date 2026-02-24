import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Phone,
  Search,
  AlertCircle,
  UserCheck,
  Loader2,
  ArrowLeft,
  Truck,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../services/axiosInstance';

const AllocateDriverPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const delivery = location.state?.delivery;

  console.log('AllocateDriverPage - location.state:', location.state);
  console.log('AllocateDriverPage - delivery:', delivery);

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningDriverId, setAssigningDriverId] = useState(null);

  // Redirect if no delivery data
  useEffect(() => {
    if (!delivery) {
      console.log('No delivery data found, redirecting...');
      toast.error('No delivery data found. Redirecting to bookings...');
      setTimeout(() => {
        navigate('/admin/bookings', { replace: true });
      }, 500);
    }
  }, [delivery, navigate]);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/admin/users?role=DRIVER');

        if (response.data.success) {
          const mappedDrivers = response.data.data.map((driver) => ({
            id: driver.id,
            name: driver.fullName,
            username: driver.username,
            email: driver.email,
            phone: driver.phone,
            profilePhoto: driver.profilePicture,
            status: driver.driverProfile?.isActiveDriver ? 'active' : 'inactive',
            rating: 4.5,
            currentDeliveries: driver._count?.deliveriesAssigned || 0,
            totalDeliveries: driver._count?.deliveriesAssigned || 0,
            vehicleRegistration: driver.driverProfile?.vehicleRegistration,
          }));
          setDrivers(mappedDrivers);
        } else {
          setError('Failed to fetch drivers');
        }
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching drivers');
      } finally {
        setLoading(false);
      }
    };

    if (delivery) {
      fetchDrivers();
    }
  }, [delivery]);

  const handleAssignDriver = async (driver) => {
    let toastId = null;

    try {
      setAssigningDriverId(driver.id);

      // Show loading toast
      toastId = toast.loading(`Assigning ${driver.name}...`);

      // Make API call
      const response = await axiosInstance.post(`/api/admin/deliveries/${delivery.id}/allocate`, {
        driverId: driver.id,
      });

      // Update toast to success
      if (response.data.success || response.status === 200) {
        toast.update(toastId, {
          render: `Driver ${driver.name} assigned successfully!`,
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });

        // Navigate back after short delay
        setTimeout(() => {
          navigate('/admin/bookings', {
            state: {
              refreshDeliveries: true,
              message: `Driver ${driver.name} assigned to ${delivery.spoNumber}`,
            },
          });
        }, 1500);
      } else {
        toast.update(toastId, {
          render: 'Assignment completed with warnings',
          type: 'warning',
          isLoading: false,
          autoClose: 3000,
        });
        setAssigningDriverId(null);
      }
    } catch (err) {
      console.error('Error assigning driver:', err);

      // Dismiss loading toast if it exists
      if (toastId) {
        toast.dismiss(toastId);
      }

      toast.error(err.response?.data?.message || 'Failed to assign driver', {
        position: 'top-right',
        autoClose: 4000,
      });

      setAssigningDriverId(null);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      searchQuery === '' ||
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && driver.status === 'active';
  });

  if (!delivery) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
          <p className="mt-4 text-base text-gray-600">Redirecting to bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Bookings
          </button>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Allocate Driver</h1>
          <p className="mt-2 text-base text-gray-600">
            Assign a driver to delivery{' '}
            <span className="font-semibold text-teal-600">{delivery?.spoNumber}</span>
          </p>
        </div>

        {/* Delivery Info Card */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Delivery Information</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium text-gray-900">{delivery.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-900">{delivery.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time Slot</p>
              <p className="font-medium text-gray-900">{delivery.timeSlot}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <p className="font-medium text-gray-900">{delivery.weight}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium text-gray-900">{delivery.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost</p>
              <p className="font-medium text-gray-900">£{delivery.cost}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver Name</p>
              <p className="font-medium text-gray-900">{delivery.driver || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver ID</p>
              <p className="font-medium text-gray-900">{delivery.driverId || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver Phone</p>
              <p className="font-medium text-gray-900">{delivery.driverPhone || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Driver Email</p>
              <p className="font-medium text-gray-900">{delivery.driverEmail || '—'}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers by name, username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pr-4 pl-10 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Drivers List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">Available Drivers</h2>
          </div>

          <div className="p-4 sm:p-6">
            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
                <p className="mt-4 text-base text-gray-600">Loading drivers...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <p className="mt-4 text-base text-red-600">{error}</p>
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="py-12 text-center">
                <Truck className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-base text-gray-500">
                  {searchQuery
                    ? 'No drivers found matching your search'
                    : 'No active drivers available'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Driver Info */}
                    <div className="flex items-start gap-3 sm:items-center">
                      {/* Avatar */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-teal-600 text-lg font-bold text-white">
                        {driver.profilePhoto ? (
                          <img
                            src={driver.profilePhoto}
                            alt={driver.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          driver.name.charAt(0)
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-sm font-medium text-teal-700">
                            <CheckCircle className="h-3 w-3" />
                            {driver.username}
                          </span>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-1 flex flex-col gap-1 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{driver.phone}</span>
                          </div>
                          <div className="hidden text-gray-300 sm:block">•</div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3.5 w-3.5 shrink-0" />
                            <span>{driver.currentDeliveries} active deliveries</span>
                          </div>
                          <div className="hidden text-gray-300 sm:block">•</div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{driver.totalDeliveries} completed</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="mt-2 flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(driver.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{driver.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assign Button */}
                    <button
                      onClick={() => handleAssignDriver(driver)}
                      disabled={assigningDriverId !== null}
                      className="w-full rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {assigningDriverId === driver.id ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-5 w-5" />
                            Assign Driver
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocateDriverPage;
