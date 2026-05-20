import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllDeliveries,
  getDeliveryStats,
  cancelDelivery,
  getDeliveryById,
  updateDelivery,
} from '../../../services/deliveryService';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  User,
  Weight,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  FileText,
  TrendingUp,
  DollarSign,
  Truck,
  Image as ImageIcon,
  PenTool,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination';
import EditDeliveryModal from './components/EditDeliveryModal';
import ViewDeliveryModal from './components/ViewDeliveryModal';
import CancelDeliveryModal from './components/CancelDeliveryModal';

const CustomerDashboardHome = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [detailedDelivery, setDetailedDelivery] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ pending: 0, allocated: 0, completed: 0, cancelled: 0 });
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const [deliveries, setDeliveries] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await getDeliveryStats();
      if (res?.data?.deliveries) {
        const d = res.data.deliveries;
        setStats({
          pending: Array.isArray(d.pending) ? d.pending.length : 0,
          allocated: Array.isArray(d.allocated) ? d.allocated.length : 0,
          completed: Array.isArray(d.completed) ? d.completed.length : 0,
          cancelled: Array.isArray(d.cancelled) ? d.cancelled.length : 0,
        });
      }
    } catch {
      toast.error('Failed to load stats');
    }
  };

  const fetchDeliveries = async (status) => {
    try {
      setLoading(true);
      const params = {};
      if (status && status !== 'all') {
        params.status = status.toUpperCase();
      }
      const res = await getAllDeliveries(params);
      setDeliveries(Array.isArray(res?.data) ? res.data : []);
    } catch {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDeliveries('all');
  }, []);

  // Deliveries are already filtered by API; use directly
  const filteredDeliveries = deliveries;

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
    fetchDeliveries(status);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'bg-red-100 text-red-600';
      case 'ALLOCATED':
        return 'bg-blue-100 text-blue-600';
      case 'DELIVERED':
        return 'bg-green-100 text-green-600';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Handle view delivery
  const handleViewDelivery = async (delivery) => {
    try {
      setLoadingDetails(true);
      setShowViewModal(true);
      const id = delivery.id || delivery._id;
      const res = await getDeliveryById(id);
      if (res?.data) {
        setDetailedDelivery(res.data);
      } else {
        setDetailedDelivery(delivery);
      }
    } catch {
      toast.error('Failed to load delivery details');
      setDetailedDelivery(delivery);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Handle edit delivery
  const handleEditDelivery = (delivery) => {
    if (delivery.status === 'DELIVERED') {
      toast.error('Cannot edit delivery that has been delivered');
      return;
    }
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      const id = selectedDelivery.id || selectedDelivery._id;

      // Basic client-side validation
      if (!selectedDelivery.spoNumber || selectedDelivery.spoNumber.toString().trim() === '') {
        toast.error('SPO Number is required');
        return;
      }

      // Safely parse weight, avoid sending NaN
      const weightValue =
        selectedDelivery.weight === '' || selectedDelivery.weight == null
          ? null
          : Number(selectedDelivery.weight);

      if (weightValue !== null && Number.isNaN(weightValue)) {
        toast.error('Weight must be a number');
        return;
      }

      // Robust date formatting: accept YYYY-MM-DD, ISO strings, or Date objects
      let formattedDate = null;
      if (selectedDelivery.deliveryDate) {
        try {
          const d = selectedDelivery.deliveryDate;
          if (d instanceof Date) {
            if (!Number.isNaN(d.getTime())) {
              // Use UTC midnight for the date portion
              formattedDate = new Date(
                Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
              ).toISOString();
            }
          } else if (typeof d === 'string') {
            // If it's YYYY-MM-DD, construct UTC start of day
            if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
              const tmp = new Date(`${d}T00:00:00.000Z`);
              if (!Number.isNaN(tmp.getTime())) formattedDate = tmp.toISOString();
            } else {
              const tmp = new Date(d);
              if (!Number.isNaN(tmp.getTime())) formattedDate = tmp.toISOString();
            }
          }
        } catch {
          formattedDate = null;
        }
      }

      const updateData = {
        deliveryDate: formattedDate,
        timeSlot: selectedDelivery.timeSlot,
        // include weight only when present
        ...(weightValue !== null ? { weight: Math.round(weightValue) } : {}),
        deliveryAddress: selectedDelivery.deliveryAddress,
        customerName: selectedDelivery.customerName,
        customerPhone: selectedDelivery.customerPhone,
        spoNumber: selectedDelivery.spoNumber,
        specialInstructions: selectedDelivery.specialInstructions || '',
      };

      await updateDelivery(id, updateData);
      toast.success('Delivery updated successfully!');
      setShowEditModal(false);
      setSelectedDelivery(null);
      fetchStats();
      fetchDeliveries(filterStatus);
    } catch (err) {
      // Prefer backend message when available
      const serverMsg = err?.response?.data?.message || err?.response?.data || null;
      if (serverMsg) {
        toast.error(serverMsg);
        console.error('Update delivery error response:', err.response?.data);
      } else {
        console.error('Update delivery error:', err);
        toast.error('Failed to update delivery');
      }
    }
  };

  // Handle cancel delivery
  const handleCancelDelivery = (delivery) => {
    if (delivery.status === 'DELIVERED') {
      toast.error('Cannot cancel completed delivery');
      return;
    }

    setSelectedDelivery(delivery);
    setCancelReason('');
    setShowDeleteModal(true);
  };

  // Confirm delete delivery
  const confirmDeleteDelivery = async () => {
    try {
      const id = selectedDelivery.id || selectedDelivery._id;
      await cancelDelivery(id, cancelReason || 'Cancelled by customer');
      toast.success('Delivery cancelled successfully');
      setShowDeleteModal(false);
      setSelectedDelivery(null);
      setCancelReason('');
      fetchStats();
      fetchDeliveries(filterStatus);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to cancel delivery');
    }
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage your delivery requests and track shipments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Received</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{stats.pending}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-2 sm:p-3">
                <Clock className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Allocated</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.allocated}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
                <Package className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Delivered</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.completed}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 sm:p-3">
                <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Cancelled</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.cancelled}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
                <XCircle className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  filterStatus === 'all'
                    ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('received')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  filterStatus === 'received'
                    ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => handleFilterChange('allocated')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  filterStatus === 'allocated'
                    ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Allocated
              </button>
              <button
                onClick={() => handleFilterChange('delivered')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  filterStatus === 'delivered'
                    ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => handleFilterChange('cancelled')}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:text-base ${
                  filterStatus === 'cancelled'
                    ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancelled
              </button>
            </div>

            <button
              onClick={() => navigate('/customer/new-delivery')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:text-base lg:w-auto lg:px-6"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Request Delivery
            </button>
          </div>
        </div>
        {/* Deliveries List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              <span className="text-gray-600">Loading deliveries...</span>
            </div>
          ) : filteredDeliveries.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No deliveries found</h3>
              <p className="mb-6 text-gray-600">Get started by requesting your first delivery</p>
              <button
                onClick={() => navigate('/customer/new-delivery')}
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Request Delivery
              </button>
            </div>
          ) : (
            paginatedDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-base font-bold text-gray-900 sm:text-lg">
                          {delivery.spoNumber}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${getStatusColor(delivery.status)}`}
                        >
                          {delivery.status}
                        </span>
                        {delivery.driver?.fullName && (
                          <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-600 sm:px-3 sm:py-1">
                            Driver: {delivery.driver.fullName}
                          </span>
                        )}
                      </div>

                      {/* Action buttons - top right on mobile, side column on desktop */}
                      <div className="flex gap-1.5 lg:hidden">
                        <button
                          onClick={() => handleViewDelivery(delivery)}
                          className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2 text-teal-600 transition-colors hover:bg-teal-100"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {(delivery.status === 'RECEIVED' || delivery.status === 'ALLOCATED') && (
                          <>
                            <button
                              onClick={() => handleEditDelivery(delivery)}
                              className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2 text-teal-600 transition-colors hover:bg-teal-100"
                              title="Edit Delivery"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelDelivery(delivery)}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                              title="Cancel Delivery"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Delivery Address</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {delivery.deliveryAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Date & Time</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {delivery.deliveryDate
                              ? new Date(delivery.deliveryDate).toLocaleDateString('en-GB')
                              : 'â€”'}{' '}
                            - {delivery.timeSlot}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {delivery.customerName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Weight className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Weight</p>
                          <p className="text-sm font-semibold text-gray-900">{delivery.weight}kg</p>
                        </div>
                      </div>
                    </div>

                    {delivery.instructions && (
                      <div className="mt-3 rounded-lg bg-teal-50 p-3">
                        <p className="mb-1 text-xs text-gray-600">Instructions:</p>
                        <p className="text-sm text-gray-900">{delivery.instructions}</p>
                      </div>
                    )}

                    {delivery.status === 'DELIVERED' && delivery.deliveredAt && (
                      <div className="mt-3 rounded-lg bg-green-50 p-3">
                        <p className="mb-1 text-xs text-gray-600">
                          Delivered on {new Date(delivery.deliveredAt).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    )}

                    {delivery.status === 'CANCELLED' && delivery.cancelReason && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-3">
                        <p className="mb-1 text-xs text-gray-600">Cancellation Reason:</p>
                        <p className="text-sm text-gray-900">{delivery.cancelReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Action buttons - desktop only (side column) */}
                  <div className="hidden lg:flex lg:flex-col lg:gap-2 lg:border-l lg:border-gray-100 lg:pl-4">
                    <button
                      onClick={() => handleViewDelivery(delivery)}
                      className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2.5 text-teal-600 transition-colors hover:bg-teal-100"
                      title="View Details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {(delivery.status === 'RECEIVED' || delivery.status === 'ALLOCATED') && (
                      <>
                        <button
                          onClick={() => handleEditDelivery(delivery)}
                          className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2.5 text-teal-600 transition-colors hover:bg-teal-100"
                          title="Edit Delivery"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleCancelDelivery(delivery)}
                          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100"
                          title="Cancel Delivery"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

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

        {/* Edit Delivery Modal */}
        {showEditModal && (
          <EditDeliveryModal
            isOpen={showEditModal}
            delivery={selectedDelivery}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDelivery(null);
            }}
            onSave={handleSaveEdit}
            onChange={(d) => setSelectedDelivery(d)}
          />
        )}

        {/* View Delivery Modal */}
        {showViewModal && (
          <ViewDeliveryModal
            isOpen={showViewModal}
            delivery={detailedDelivery}
            isLoading={loadingDetails}
            onClose={() => {
              setShowViewModal(false);
              setDetailedDelivery(null);
            }}
            getStatusColor={getStatusColor}
          />
        )}

        <CancelDeliveryModal
          isOpen={showDeleteModal}
          delivery={selectedDelivery}
          cancelReason={cancelReason}
          onCancelReasonChange={setCancelReason}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteDelivery}
        />
      </div>
    </div>
  );
};

export default CustomerDashboardHome;
