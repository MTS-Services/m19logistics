import { useMemo, useState, useEffect } from 'react';
import Pagination from '../../../../components/Pagination';
import axiosInstance from '../../../../services/axiosInstance';
import FailedDeliveriesHeader from './components/FailedDeliveriesHeader';
import FailedDeliveriesStats from './components/FailedDeliveriesStats';
import FailedDeliveriesFilters from './components/FailedDeliveriesFilters';
import FailedDeliveriesTable from './components/FailedDeliveriesTable';
import FailedDeliveryViewModal from './components/FailedDeliveryViewModal';
import EmptyFailedState from './components/EmptyFailedState';

const FailedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get('/api/admin/deliveries');
        console.log('Failed/Cancelled Deliveries backend response:', response.data);

        if (response.data?.success) {
          const allDeliveries = response.data.data || [];
          const cancelledDeliveries = allDeliveries
            .filter((d) => d.status === 'CANCELLED' || d.status === 'Cancelled')
            .map((delivery) => ({
              id: delivery.id,
              spoNumber: delivery.spoNumber || '—',
              customer: delivery.customerName || '—',
              customerPhone: delivery.customerPhone || '—',
              driver: delivery.driver?.fullName || '—',
              driverPhone: delivery.driver?.phone || '—',
              deliveryAddress: delivery.deliveryAddress || '—',
              scheduledDate: delivery.deliveryDate || '—',
              timeSlot: delivery.timeSlot || '—',
              failedAt: delivery.deliveredAt || delivery.updatedAt || new Date().toISOString(),
              reason: delivery.cancellationReason || delivery.rejectionReason || '',
              status: 'Cancelled',
              driverNotes: delivery.specialInstructions || '',
              weight: delivery.weight || '—',
              cost: delivery.totalPrice || 0,
            }));
          setDeliveries(cancelledDeliveries);
        } else {
          setError('Failed to fetch deliveries');
        }
      } catch (err) {
        console.error('Error fetching failed deliveries:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching deliveries');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const stats = useMemo(
    () => ({
      total: deliveries.length,
      pending: deliveries.filter((d) => d.status === 'Pending Review').length,
      reattempt: deliveries.filter((d) => d.status === 'Re-attempt Scheduled').length,
      resolved: deliveries.filter((d) => d.status === 'Resolved').length,
    }),
    [deliveries]
  );

  const filteredDeliveries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.spoNumber.toLowerCase().includes(query) ||
        delivery.customer.toLowerCase().includes(query) ||
        delivery.driver.toLowerCase().includes(query) ||
        delivery.deliveryAddress.toLowerCase().includes(query) ||
        delivery.reason.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      const matchesReason = reasonFilter === 'all' || delivery.reason === reasonFilter;

      return matchesSearch && matchesStatus && matchesReason;
    });
  }, [deliveries, searchQuery, statusFilter, reasonFilter]);

  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleReasonChange = (value) => {
    setReasonFilter(value);
    setCurrentPage(1);
  };

  const handleView = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  const handleDelete = (deliveryId) => {
    if (window.confirm('Are you sure you want to delete this failed delivery record?')) {
      setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
      if (paginatedDeliveries.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const hasFilters = searchQuery || statusFilter !== 'all' || reasonFilter !== 'all';

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        <FailedDeliveriesHeader />
        {/* <FailedDeliveriesStats stats={stats} /> */}
        <FailedDeliveriesFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          reasonFilter={reasonFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onReasonChange={handleReasonChange}
        />

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Delivery Records</h2>
          </div>

          {filteredDeliveries.length === 0 ? (
            <div className="p-4 sm:p-6">
              <EmptyFailedState hasFilters={hasFilters} />
            </div>
          ) : (
            <>
              <FailedDeliveriesTable
                deliveries={paginatedDeliveries}
                onView={handleView}
                onDelete={handleDelete}
              />
              <div className="border-t border-gray-200 bg-white px-6 py-3">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredDeliveries.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredDeliveries.length}
                  compact
                />
              </div>
            </>
          )}
        </div>
      </div>

      {showViewModal && (
        <FailedDeliveryViewModal
          delivery={selectedDelivery}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default FailedDeliveries;
