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

const CustomerDashboardHome = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
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

  // New delivery request form
  const [newDelivery, setNewDelivery] = useState({
    spoNumber: '',
    date: '',
    timeSlot: 'AM',
    weight: '',
    address: '',
    customerName: '',
    phone: '',
    requestedBy: '',
    instructions: '',
  });

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

  // Handle request new delivery
  const handleRequestDelivery = () => {
    if (
      !newDelivery.spoNumber ||
      !newDelivery.date ||
      !newDelivery.weight ||
      !newDelivery.address
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if same day delivery
    const today = new Date().toISOString().split('T')[0];
    const isSameDay = newDelivery.date === today;

    if (isSameDay) {
      toast.warning(
        'Same-day delivery cannot be guaranteed. Please call 07971415430 to confirm availability'
      );
    }

    const delivery = {
      id: Date.now(),
      ...newDelivery,
      status: 'Received',
      createdAt: new Date().toISOString(),
      distance: Math.floor(Math.random() * 45) + 10,
      estimatedCost: newDelivery.weight <= 800 ? 45.0 : Math.ceil(newDelivery.weight / 800) * 45.0,
      driver: null,
    };

    setDeliveries([delivery, ...deliveries]);
    setShowRequestModal(false);
    setNewDelivery({
      spoNumber: '',
      date: '',
      timeSlot: 'AM',
      weight: '',
      address: '',
      customerName: '',
      phone: '',
      requestedBy: '',
      instructions: '',
    });
    toast.success('Delivery request submitted successfully!');
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
      const updateData = {
        deliveryDate: selectedDelivery.deliveryDate || null,
        timeSlot: selectedDelivery.timeSlot,
        weight: parseInt(selectedDelivery.weight),
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
      toast.error(err?.response?.data?.message || 'Failed to update delivery');
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
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Request Delivery Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                  Request New Deliveryy
                </h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2"
                >
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                <div className="flex items-start gap-3 rounded-lg bg-teal-50 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Same-day delivery notice</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Same-day delivery cannot be guaranteed. Please call 07971415430 to confirm
                      availability.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      SPO Number *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.spoNumber}
                      onChange={(e) =>
                        setNewDelivery({ ...newDelivery, spoNumber: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., SPO013350"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      value={newDelivery.weight}
                      onChange={(e) => setNewDelivery({ ...newDelivery, weight: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      placeholder="800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Date *</label>
                    <input
                      type="date"
                      value={newDelivery.date}
                      onChange={(e) => setNewDelivery({ ...newDelivery, date: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Time Slot *
                    </label>
                    <select
                      value={newDelivery.timeSlot}
                      onChange={(e) => setNewDelivery({ ...newDelivery, timeSlot: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    value={newDelivery.address}
                    onChange={(e) => setNewDelivery({ ...newDelivery, address: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="Full delivery address"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={newDelivery.customerName}
                      onChange={(e) =>
                        setNewDelivery({ ...newDelivery, customerName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newDelivery.phone}
                      onChange={(e) => setNewDelivery({ ...newDelivery, phone: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                      placeholder="07123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Requested By
                  </label>
                  <input
                    type="text"
                    value={newDelivery.requestedBy}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, requestedBy: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Special Instructions
                  </label>
                  <textarea
                    value={newDelivery.instructions}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, instructions: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    rows="3"
                    placeholder="Any specific delivery instructions..."
                  />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto sm:px-6 sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestDelivery}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 sm:text-base"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Delivery Modal */}
        {showViewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                  Delivery Details
                </h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setDetailedDelivery(null);
                  }}
                  className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2"
                >
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {loadingDetails ? (
                <div className="flex items-center justify-center gap-3 p-12">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                  <span className="text-gray-600">Loading delivery details...</span>
                </div>
              ) : detailedDelivery ? (
                <div className="space-y-4 p-4 sm:p-6">
                  {/* Header with SPO Number and Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
                    <div>
                      <p className="text-sm text-gray-600">SPO Number</p>
                      <p className="text-xl font-bold text-gray-900">
                        {detailedDelivery.spoNumber}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getStatusColor(detailedDelivery.status)}`}
                    >
                      {detailedDelivery.status}
                    </span>
                  </div>

                  {/* Delivery Information */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <h3 className="mb-3 text-base font-bold text-gray-900">Delivery Information</h3>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-600">Delivery Date</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.deliveryDate
                            ? new Date(detailedDelivery.deliveryDate).toLocaleDateString('en-GB')
                            : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Time Slot</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.timeSlot}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Weight</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.weight}kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Distance from Depot</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.distanceFromDepot} miles
                        </p>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-xs text-gray-600">Delivery Address</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.deliveryAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Customer Name</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Customer Phone</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.customerPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Requested By</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailedDelivery.requestedBy || '—'}
                        </p>
                      </div>
                    </div>

                    {detailedDelivery.specialInstructions && (
                      <div className="mt-3 rounded-lg bg-teal-50 p-3">
                        <p className="text-xs font-semibold text-gray-700">Special Instructions</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {detailedDelivery.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Customer Information */}
                  {detailedDelivery.customer && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="mb-3 text-base font-bold text-gray-900">Customer Account</h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-gray-600">Full Name</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {detailedDelivery.customer.fullName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {detailedDelivery.customer.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Phone</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {detailedDelivery.customer.phone}
                          </p>
                        </div>
                        {detailedDelivery.customer.customerProfile?.depotAddress && (
                          <div>
                            <p className="text-xs text-gray-600">Depot Address</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {detailedDelivery.customer.customerProfile.depotAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                    <h3 className="mb-3 text-base font-bold text-gray-900">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Base Price</span>
                        <span className="font-semibold text-gray-900">
                          £{parseFloat(detailedDelivery.calculatedBasePrice || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance Surcharge</span>
                        <span className="font-semibold text-gray-900">
                          £{parseFloat(detailedDelivery.distanceSurcharge || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-gray-900">
                          £{parseFloat(detailedDelivery.subtotal || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">VAT</span>
                        <span className="font-semibold text-gray-900">
                          £{parseFloat(detailedDelivery.vatAmount || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-teal-300 pt-2">
                        <span className="font-bold text-gray-900">Total Price</span>
                        <span className="text-lg font-bold text-teal-600">
                          £{parseFloat(detailedDelivery.totalPrice || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver (if allocated) */}
                  {detailedDelivery.driver && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <h3 className="mb-3 text-base font-bold text-gray-900">Driver</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Name:</span>{' '}
                          {detailedDelivery.driver.fullName || detailedDelivery.driver.name || '—'}
                        </p>
                        {detailedDelivery.acceptedAt && (
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Accepted At:</span>{' '}
                            {new Date(detailedDelivery.acceptedAt).toLocaleString('en-GB')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Status Details */}
                  {detailedDelivery.deliveredAt && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <h3 className="mb-3 text-base font-bold text-gray-900">Delivery Complete</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Delivered At:</span>{' '}
                          {new Date(detailedDelivery.deliveredAt).toLocaleString('en-GB')}
                        </p>
                        {detailedDelivery.receivedBy && (
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Received By:</span>{' '}
                            {detailedDelivery.receivedBy}
                          </p>
                        )}
                        {detailedDelivery.signatureUrl && (
                          <p className="text-sm">
                            <a
                              href={detailedDelivery.signatureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 underline hover:text-green-800"
                            >
                              View Signature
                            </a>
                          </p>
                        )}
                        {detailedDelivery.photoUrl && (
                          <p className="text-sm">
                            <a
                              href={detailedDelivery.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-700 underline hover:text-green-800"
                            >
                              View Photo
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {detailedDelivery.cancelledAt && (
                    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                      <h3 className="mb-3 text-base font-bold text-gray-900">Cancelled</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Cancelled At:</span>{' '}
                          {new Date(detailedDelivery.cancelledAt).toLocaleString('en-GB')}
                        </p>
                        {detailedDelivery.cancelledBy && (
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Cancelled By:</span>{' '}
                            {detailedDelivery.cancelledBy}
                          </p>
                        )}
                        {detailedDelivery.cancellationReason && (
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Reason:</span>{' '}
                            {detailedDelivery.cancellationReason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {detailedDelivery.rejectedAt && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <h3 className="mb-3 text-base font-bold text-gray-900">Rejected</h3>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">Rejected At:</span>{' '}
                          {new Date(detailedDelivery.rejectedAt).toLocaleString('en-GB')}
                        </p>
                        {detailedDelivery.rejectionReason && (
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">Reason:</span>{' '}
                            {detailedDelivery.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">No delivery details available</p>
                </div>
              )}

              <div className="sticky bottom-0 z-10 flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setDetailedDelivery(null);
                  }}
                  className="w-full rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <EditDeliveryModal
          isOpen={showEditModal && !!selectedDelivery}
          delivery={selectedDelivery}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDelivery(null);
          }}
          onSave={handleSaveEdit}
          onChange={setSelectedDelivery}
        />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl">
                  Confirm Cancellation
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDelivery(null);
                  }}
                  className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-start gap-3 sm:mb-6 sm:gap-4">
                  <div className="rounded-full bg-red-100 p-2 sm:p-3">
                    <AlertCircle className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">
                      Are you sure you want to cancel this delivery?
                    </h3>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      This action will cancel the delivery request for{' '}
                      <span className="font-semibold">{selectedDelivery.spoNumber}</span>. This
                      cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-600">Delivery Details:</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {selectedDelivery.deliveryAddress}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedDelivery.deliveryDate
                      ? new Date(selectedDelivery.deliveryDate).toLocaleDateString('en-GB')
                      : '—'}{' '}
                    - {selectedDelivery.timeSlot}
                  </p>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Reason for cancellation
                  </label>
                  <textarea
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Enter reason (optional)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedDelivery(null);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto sm:px-6 sm:text-base"
                >
                  No, Keep It
                </button>
                <button
                  onClick={confirmDeleteDelivery}
                  className="w-full rounded-lg bg-linear-to-r from-red-600 to-red-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 sm:text-base"
                >
                  Yes, Cancel Delivery
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboardHome;
