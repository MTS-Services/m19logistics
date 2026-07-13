import React, { useState } from 'react';
import Pagination from '../../../../components/Pagination';
import { dummyCompletedDeliveries } from '../contractorDummyData';
import CompletedDeliveriesHeader from './components/CompletedDeliveriesHeader';
import CompletedDeliveriesSearch from './components/CompletedDeliveriesSearch';
import EmptyCompletedState from './components/EmptyCompletedState';
import CompletedDeliveryCard from './components/CompletedDeliveryCard';
import CompletedDeliveryDetailModal from './components/CompletedDeliveryDetailModal';

const ContractorCompletedDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredDeliveries = dummyCompletedDeliveries.filter(
    (delivery) =>
      delivery.spoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailModal(true);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <CompletedDeliveriesHeader count={dummyCompletedDeliveries.length} />
      <CompletedDeliveriesSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <EmptyCompletedState hasSearch={!!searchQuery} />
        ) : (
          <>
            {filteredDeliveries
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((delivery) => (
                <CompletedDeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onViewDetails={handleViewDetails}
                />
              ))}

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredDeliveries.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDeliveries.length}
            />
          </>
        )}
      </div>

      {showDetailModal && (
        <CompletedDeliveryDetailModal
          delivery={selectedDelivery}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default ContractorCompletedDeliveries;
