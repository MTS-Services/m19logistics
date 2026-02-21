import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
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

const BookingsBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, openUp: false });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  // Toggle dropdown and calculate its fixed position from the button
  const toggleDropdown = useCallback(
    (deliveryId, e) => {
      if (showActionDropdown === deliveryId) {
        setShowActionDropdown(null);
        return;
      }
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const dropdownHeight = 190; // approximate height of dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < dropdownHeight;

      setDropdownPos({
        top: openUp ? rect.top : rect.bottom + 4,
        left: rect.right - 192, // 192px = w-48
        openUp,
      });
      setShowActionDropdown(deliveryId);
    },
    [showActionDropdown]
  );

  // Check for refresh request from allocation page
  useEffect(() => {
    if (location.state?.refreshDeliveries) {
      if (location.state.message) {
        toast.success(location.state.message);
      }
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
    // Navigate to dedicated allocation page
    navigate('/admin/bookings/allocate', { state: { delivery } });
    setShowActionDropdown(null);
  };

  const confirmDelete = () => {
    console.log('Delete delivery:', selectedDelivery);
    // Add actual delete logic here
    setShowDeleteModal(false);
    setSelectedDelivery(null);
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
                {/* Table Wrapper */}
                <div>
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
                                  onClick={(e) => toggleDropdown(delivery.id, e)}
                                  className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:border-teal-400 hover:bg-gray-50"
                                >
                                  <EllipsisVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View - Hidden on desktop */}
              <div className="divide-y divide-gray-200 lg:hidden">
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
                            onClick={(e) => toggleDropdown(delivery.id, e)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-all hover:border-teal-400 hover:bg-gray-50"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                            Actions
                          </button>
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
      </div>

      {/* Portal-rendered Action Dropdown - renders outside overflow containers */}
      {showActionDropdown &&
        ReactDOM.createPortal(
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-9998" onClick={() => setShowActionDropdown(null)} />
            {/* Dropdown Menu */}
            <div
              className="fixed z-9999 w-48 rounded-lg border border-gray-200 bg-white shadow-xl"
              style={{
                top: dropdownPos.openUp ? 'auto' : `${dropdownPos.top}px`,
                bottom: dropdownPos.openUp
                  ? `${window.innerHeight - dropdownPos.top + 4}px`
                  : 'auto',
                left: `${dropdownPos.left}px`,
              }}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    const delivery = paginatedDeliveries.find((d) => d.id === showActionDropdown);
                    if (delivery) handleViewDelivery(delivery);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    const delivery = paginatedDeliveries.find((d) => d.id === showActionDropdown);
                    if (delivery) handleAllocateDelivery(delivery);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-teal-50"
                >
                  <UserCheck className="h-4 w-4" />
                  Allocate
                </button>
                <button
                  onClick={() => {
                    const delivery = paginatedDeliveries.find((d) => d.id === showActionDropdown);
                    if (delivery) handleEditDelivery(delivery);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    const delivery = paginatedDeliveries.find((d) => d.id === showActionDropdown);
                    if (delivery) handleDeleteDelivery(delivery);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

export default BookingsBoard;
