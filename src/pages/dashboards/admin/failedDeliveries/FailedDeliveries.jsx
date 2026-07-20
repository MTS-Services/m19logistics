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
        <FailedDeliveriesStats stats={stats} />
        <FailedDeliveriesFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          reasonFilter={reasonFilter}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onReasonChange={handleReasonChange}
        />

        {filteredDeliveries.length === 0 ? (
          <EmptyFailedState hasFilters={hasFilters} />
        ) : (
          <>
            <FailedDeliveriesTable deliveries={paginatedDeliveries} onView={handleView} />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredDeliveries.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDeliveries.length}
              compact
            />
          </>
        )}
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
