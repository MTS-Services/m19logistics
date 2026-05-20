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
import StatsCards from './components/StatsCards';
import ActionBar from './components/ActionBar';
import DeliveriesList from './components/DeliveriesList';

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

        <StatsCards stats={stats} />

        <ActionBar filterStatus={filterStatus} handleFilterChange={handleFilterChange} navigate={navigate} />
        <div className="space-y-4">
          <DeliveriesList
            loading={loading}
            deliveries={paginatedDeliveries}
            handleViewDelivery={handleViewDelivery}
            handleEditDelivery={handleEditDelivery}
            handleCancelDelivery={handleCancelDelivery}
            getStatusColor={getStatusColor}
          />
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
