import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  Weight,
  AlertCircle,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import axiosInstance from '../../../../services/axiosInstance';
import Loading from '../../../../components/Loading';
import StatisticsCards from './components/StatisticsCards';
import FilterSection from './components/FilterSection';
import ViewDetailsModal from './components/ViewDetailsModal';
import EditDeliveryModal from './components/EditDeliveryModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

console.log('Imported components:', {
  ViewDetailsModal: typeof ViewDetailsModal,
  EditDeliveryModal: typeof EditDeliveryModal,
  DeleteConfirmationModal: typeof DeleteConfirmationModal,
});

// Allocate Driver Modal Component
const AllocateDriverModal = ({
  delivery,
  drivers,
  onClose,
  onAssign,
  searchQuery,
  setSearchQuery,
  loading,
  error,
  assigningDriverId,
}) => {
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      searchQuery === '' ||
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && driver.status === 'active';
  });

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Allocate Driver</h2>
              <p className="mt-1 text-base text-gray-600">
                Assign a driver to delivery{' '}
                <span className="font-medium">{delivery?.spoNumber}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search drivers by name, username, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Body - Drivers List */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-4 sm:p-6">
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
            <div className="space-y-3">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Driver Info */}
                  <div className="flex items-start gap-3 sm:items-center">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-teal-600 text-lg font-bold text-white sm:h-14 sm:w-14">
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-base font-medium text-teal-700">
                          <CheckCircle className="h-3 w-3" />
                          {driver.username}
                        </span>
                      </div>

                      {/* Contact Info - Responsive Layout */}
                      <div className="mt-1 flex flex-col gap-1 text-base text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{driver.phone}</span>
                        </div>
                        <div className="hidden text-gray-300 sm:block">•</div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5 shrink-0" />
                          <span>{driver.currentDeliveries} active</span>
                        </div>
                        <div className="hidden text-gray-300 sm:block">•</div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{driver.totalDeliveries} completed</span>
                        </div>
                      </div>

                      {/* Rating - Mobile */}
                      <div className="mt-2 flex items-center gap-1 sm:hidden">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-3.5 w-3.5 ${i < Math.floor(driver.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-base font-medium text-gray-700">{driver.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating & Action - Desktop/Tablet */}
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                    {/* Rating - Desktop */}
                    <div className="hidden items-center gap-1 sm:flex">
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
                      <span className="text-base font-medium text-gray-700">{driver.rating}</span>
                    </div>

                    {/* Assign Button */}
                    <button
                      onClick={() => onAssign(driver)}
                      disabled={assigningDriverId === driver.id}
                      className="w-full rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-base font-medium text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {assigningDriverId === driver.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            Assign
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingsBoard = () => {
  console.log('BookingsBoard component rendering...');

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [driverSearchQuery, setDriverSearchQuery] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Driver-related states
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [driversError, setDriversError] = useState(null);
  const [assigningDriverId, setAssigningDriverId] = useState(null);

  const itemsPerPage = 5;

  // Fetch deliveries from API (inline to avoid dependency issues)
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/admin/deliveries');

        if (response.data.success) {
          const mappedDeliveries = response.data.data.map((delivery) => ({
            id: delivery.id,
            spoNumber: delivery.spoNumber,
            customer: delivery.customerName,
            deliveryDate: delivery.deliveryDate,
            timeSlot: delivery.timeSlot,
            weight: delivery.weight,
            address: delivery.deliveryAddress,
            contact: delivery.customerName,
            phone: delivery.customerPhone,
            status: formatStatus(delivery.status),
            cost: delivery.totalPrice,
            driver: delivery.driverId ? `Driver ${delivery.driverId}` : null,
            requestedBy: delivery.requestedBy,
            specialInstructions: delivery.specialInstructions,
            deliveredAt: delivery.deliveredAt,
            cancelReason: delivery.cancelReason,
            // Additional API fields
            customerId: delivery.customerId,
            driverId: delivery.driverId,
            isAdditionalDelivery: delivery.isAdditionalDelivery,
            distanceFromDepot: delivery.distanceFromDepot,
            calculatedBasePrice: delivery.calculatedBasePrice,
            distanceSurcharge: delivery.distanceSurcharge,
            subtotal: delivery.subtotal,
            vatAmount: delivery.vatAmount,
          }));
          setDeliveries(mappedDeliveries);
        } else {
          setError('Failed to fetch deliveries');
        }
      } catch (err) {
        console.error('Error fetching deliveries:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching deliveries');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/admin/deliveries');

      if (response.data.success) {
        const mappedDeliveries = response.data.data.map((delivery) => ({
          id: delivery.id,
          spoNumber: delivery.spoNumber,
          customer: delivery.customerName,
          deliveryDate: delivery.deliveryDate,
          timeSlot: delivery.timeSlot,
          weight: delivery.weight,
          address: delivery.deliveryAddress,
          contact: delivery.customerName,
          phone: delivery.customerPhone,
          status: formatStatus(delivery.status),
          cost: delivery.totalPrice,
          driver: delivery.driverId ? `Driver ${delivery.driverId}` : null,
          requestedBy: delivery.requestedBy,
          specialInstructions: delivery.specialInstructions,
          deliveredAt: delivery.deliveredAt,
          cancelReason: delivery.cancelReason,
          // Additional API fields
          customerId: delivery.customerId,
          driverId: delivery.driverId,
          isAdditionalDelivery: delivery.isAdditionalDelivery,
          distanceFromDepot: delivery.distanceFromDepot,
          calculatedBasePrice: delivery.calculatedBasePrice,
          distanceSurcharge: delivery.distanceSurcharge,
          subtotal: delivery.subtotal,
          vatAmount: delivery.vatAmount,
        }));
        setDeliveries(mappedDeliveries);
      } else {
        setError('Failed to fetch deliveries');
      }
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching deliveries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch drivers from API
  const fetchDrivers = async () => {
    try {
      setDriversLoading(true);
      setDriversError(null);
      const response = await axiosInstance.get('/api/admin/users?role=DRIVER');

      if (response.data.success) {
        // Transform API response to expected format
        const mappedDrivers = response.data.data.map((driver) => ({
          id: driver.id,
          name: driver.fullName,
          username: driver.username,
          email: driver.email,
          phone: driver.phone,
          profilePhoto: driver.profilePicture,
          status: driver.driverProfile?.isActiveDriver ? 'active' : 'inactive',
          rating: 4.5, // Default rating - you can calculate this based on actual data later
          currentDeliveries: driver._count?.deliveriesAssigned || 0,
          totalDeliveries: driver._count?.deliveriesAssigned || 0,
          vehicleRegistration: driver.driverProfile?.vehicleRegistration,
        }));
        setDrivers(mappedDrivers);
      } else {
        setDriversError('Failed to fetch drivers');
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setDriversError(err.response?.data?.message || 'An error occurred while fetching drivers');
    } finally {
      setDriversLoading(false);
    }
  };

  const formatStatus = (status) => {
    // Convert API status (RECEIVED, ALLOCATED) to display format (Received, Allocated)
    if (!status) return 'Unknown';
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
  };

  // Close dropdown when clicking outside any dropdown element
  useEffect(() => {
    const handleClickOutside = (event) => {
      // only act when a dropdown is open
      if (showActionDropdown !== null) {
        // if the click target is not inside any element marked with data-dropdown, close
        if (!event.target.closest('[data-dropdown]')) {
          setShowActionDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionDropdown]);

  // Calculate statistics
  const stats = {
    total: deliveries.length,
    received: deliveries.filter((d) => d.status === 'Received').length,
    allocated: deliveries.filter((d) => d.status === 'Allocated').length,
    delivered: deliveries.filter((d) => d.status === 'Delivered').length,
    cancelled: deliveries.filter((d) => d.status === 'Cancelled').length,
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesStatus =
      filterStatus === 'all' || delivery.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      delivery.spoNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change with page reset
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  // Handle search with page reset
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Received':
        return 'bg-red-100 text-red-600';
      case 'Allocated':
        return 'bg-blue-100 text-blue-600';
      case 'Delivered':
        return 'bg-green-100 text-green-600';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Received':
        return Clock;
      case 'Allocated':
        return Package;
      case 'Delivered':
        return CheckCircle;
      case 'Cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  // Handle actions
  const handleViewDelivery = (delivery) => {
    console.log('handleViewDelivery called with:', delivery);
    setSelectedDelivery(delivery);
    console.log('setSelectedDelivery called');
    setShowViewModal(true);
    console.log('setShowViewModal(true) called');
    setShowActionDropdown(null);
  };

  const handleEditDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
    setShowActionDropdown(null);
  };

  const handleDeleteDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeleteModal(true);
    setShowActionDropdown(null);
  };

  const handleAllocateDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowAllocateModal(true);
    setShowActionDropdown(null);
    setDriverSearchQuery('');
    // Fetch drivers when modal opens
    fetchDrivers();
  };

  const confirmDelete = () => {
    console.log('Delete delivery:', selectedDelivery);
    // Add actual delete logic here
    setShowDeleteModal(false);
    setSelectedDelivery(null);
  };

  const handleAssignDriver = async (driver) => {
    try {
      setAssigningDriverId(driver.id);
      console.log('Assigning driver:', driver, 'to delivery:', selectedDelivery);

      // Make API call to assign driver
      const response = await axiosInstance.post(
        `/api/admin/deliveries/${selectedDelivery.id}/allocate`,
        { driverId: driver.id }
      );

      if (response.data.success) {
        // Show success message
        toast.success(
          `Driver ${driver.name} successfully assigned to delivery ${selectedDelivery.spoNumber}`,
          {
            position: 'top-right',
            autoClose: 3000,
          }
        );

        // Reset assigning state immediately
        setAssigningDriverId(null);

        // Close modal
        setShowAllocateModal(false);
        setSelectedDelivery(null);
        setDriverSearchQuery('');

        // Refresh deliveries list in background (fire and forget)
        fetchDeliveries().catch((err) => {
          console.error('Error refreshing deliveries:', err);
        });
      }
    } catch (err) {
      console.error('Error assigning driver:', err);
      setAssigningDriverId(null);
      toast.error(err.response?.data?.message || 'Failed to assign driver. Please try again.', {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading message="Loading Bookings" submessage="Fetching delivery bookings data..." />
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
              <h3 className="text-base font-semibold text-red-900">Error Loading Bookings</h3>
              <p className="mt-1 text-base text-red-700">{error}</p>
              <button
                onClick={fetchDeliveries}
                className="mt-3 rounded bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Render - showViewModal:', showViewModal, 'selectedDelivery:', selectedDelivery);

  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Bookings Board
          </h1>
          <p className="mt-2 text-gray-600">Manage all delivery bookings in one place</p>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards stats={stats} />

        {/* Filters and Search */}
        <FilterSection
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterStatus={filterStatus}
          onFilterChange={handleFilterChange}
        />

        {/* Deliveries Table/List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Delivery Records</h2>
          </div>

          {/* Table Content */}
          {filteredDeliveries.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries found</h3>
              <p className="mt-2 text-base text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'No deliveries match the selected filter'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden overflow-x-auto lg:block">
                {console.log(
                  'Rendering desktop table with deliveries:',
                  paginatedDeliveries.length
                )}
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        SPO Number
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Delivery Address
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Cost
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedDeliveries.map((delivery) => {
                      const StatusIcon = getStatusIcon(delivery.status);
                      return (
                        <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">
                                {delivery.spoNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-base font-medium text-gray-900">
                                  {formatDate(delivery.deliveryDate)}
                                </p>
                                <p className="text-base text-gray-600">{delivery.timeSlot}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                              <div>
                                <p className="text-base text-gray-900">{delivery.customer}</p>
                                <p className="text-base text-gray-600">{delivery.address}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Weight className="h-4 w-4 text-gray-400" />
                              <span className="text-base text-gray-900">{delivery.weight}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-base font-semibold ${getStatusColor(
                                delivery.status
                              )}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {delivery.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-base font-semibold text-gray-900">
                              £{formatCurrency(delivery.cost)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative" data-dropdown="true">
                              <button
                                onClick={() => {
                                  console.log('Dropdown button clicked for delivery:', delivery.id);
                                  setShowActionDropdown(
                                    showActionDropdown === delivery.id ? null : delivery.id
                                  );
                                }}
                                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50"
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {showActionDropdown === delivery.id && (
                                <div
                                  className={`absolute right-0 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedDeliveries.indexOf(delivery) >= paginatedDeliveries.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        console.log('View Details clicked:', delivery);
                                        handleViewDelivery(delivery);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-base text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => handleAllocateDelivery(delivery)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-base text-gray-700 transition-colors hover:bg-teal-50"
                                    >
                                      <UserCheck className="h-4 w-4" />
                                      Allocate
                                    </button>
                                    <button
                                      onClick={() => handleEditDelivery(delivery)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-base text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDelivery(delivery)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-base text-red-600 transition-colors hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Hidden on desktop */}
              <div className="divide-y divide-gray-200 lg:hidden">
                {console.log('Rendering mobile cards with deliveries:', paginatedDeliveries.length)}
                {paginatedDeliveries.map((delivery) => {
                  const StatusIcon = getStatusIcon(delivery.status);
                  return (
                    <div key={delivery.id} className="p-4 transition-colors hover:bg-gray-50">
                      {/* Card Header */}
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{delivery.spoNumber}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-base font-semibold ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {delivery.status}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2.5 text-base">
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-base text-gray-600">Date & Time</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(delivery.deliveryDate)} - {delivery.timeSlot}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-base text-gray-600">Delivery Address</p>
                            <p className="font-medium text-gray-900">{delivery.customer}</p>
                            <p className="text-base text-gray-600">{delivery.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-base text-gray-600">Weight</p>
                              <p className="font-medium text-gray-900">{delivery.weight}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-base text-gray-600">Cost</p>
                            <p className="font-semibold text-gray-900">
                              £{formatCurrency(delivery.cost)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <div className="relative" data-dropdown="true">
                          <button
                            onClick={() => {
                              console.log(
                                'Mobile dropdown button clicked for delivery:',
                                delivery.id
                              );
                              setShowActionDropdown(
                                showActionDropdown === delivery.id ? null : delivery.id
                              );
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-all hover:bg-gray-50"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                            Actions
                          </button>

                          {/* Dropdown Menu */}
                          {showActionDropdown === delivery.id && (
                            <div
                              className={`absolute right-0 left-0 z-50 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedDeliveries.indexOf(delivery) >= paginatedDeliveries.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    console.log('Mobile View Details clicked:', delivery);
                                    handleViewDelivery(delivery);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-base text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleAllocateDelivery(delivery)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-base text-gray-700 transition-colors hover:bg-teal-50"
                                >
                                  <UserCheck className="h-4 w-4" />
                                  Allocate
                                </button>
                                <button
                                  onClick={() => handleEditDelivery(delivery)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-base text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteDelivery(delivery)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-base text-red-600 transition-colors hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {filteredDeliveries.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDeliveries.length}
            />
          )}
        </div>

        {/* View Details Modal */}
        {console.log(
          'Modal check - showViewModal:',
          showViewModal,
          'selectedDelivery:',
          selectedDelivery
        )}
        {showViewModal && selectedDelivery && (
          <ViewDetailsModal
            delivery={selectedDelivery}
            onClose={() => setShowViewModal(false)}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusColor={getStatusColor}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDelivery && (
          <EditDeliveryModal
            delivery={selectedDelivery}
            onClose={() => setShowEditModal(false)}
            onSave={(updatedDelivery) => {
              console.log('Saving delivery:', updatedDelivery);
              setShowEditModal(false);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDelivery && (
          <DeleteConfirmationModal
            delivery={selectedDelivery}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            formatDate={formatDate}
          />
        )}

        {/* Allocate Driver Modal */}
        {showAllocateModal && selectedDelivery && (
          <AllocateDriverModal
            delivery={selectedDelivery}
            drivers={drivers}
            loading={driversLoading}
            error={driversError}
            assigningDriverId={assigningDriverId}
            onClose={() => {
              setShowAllocateModal(false);
              setSelectedDelivery(null);
              setDriverSearchQuery('');
            }}
            onAssign={handleAssignDriver}
            searchQuery={driverSearchQuery}
            setSearchQuery={setDriverSearchQuery}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsBoard;
