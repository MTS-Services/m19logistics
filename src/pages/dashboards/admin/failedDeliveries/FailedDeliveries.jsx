import { useMemo, useState } from 'react';
import Pagination from '../../../../components/Pagination';
import { dummyFailedDeliveries } from './failedDeliveriesDummyData';
import FailedDeliveriesHeader from './components/FailedDeliveriesHeader';
import FailedDeliveriesStats from './components/FailedDeliveriesStats';
import FailedDeliveriesFilters from './components/FailedDeliveriesFilters';
import FailedDeliveriesTable from './components/FailedDeliveriesTable';
import FailedDeliveryViewModal from './components/FailedDeliveryViewModal';
import EmptyFailedState from './components/EmptyFailedState';

const FailedDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 5;

  const stats = useMemo(
    () => ({
      total: dummyFailedDeliveries.length,
      pending: dummyFailedDeliveries.filter((d) => d.status === 'Pending Review').length,
      reattempt: dummyFailedDeliveries.filter((d) => d.status === 'Re-attempt Scheduled').length,
      resolved: dummyFailedDeliveries.filter((d) => d.status === 'Resolved').length,
    }),
    []
  );

  const filteredDeliveries = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return dummyFailedDeliveries.filter((delivery) => {
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
  }, [searchQuery, statusFilter, reasonFilter]);

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

  const hasFilters = searchQuery || statusFilter !== 'all' || reasonFilter !== 'all';

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
              <FailedDeliveriesTable deliveries={paginatedDeliveries} onView={handleView} />
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
