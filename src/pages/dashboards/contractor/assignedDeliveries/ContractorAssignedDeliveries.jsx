import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import { dummyAssignedDeliveries } from '../contractorDummyData';
import AssignedDeliveriesHeader from './components/AssignedDeliveriesHeader';
import EmptyAssignedState from './components/EmptyAssignedState';
import AssignedDeliveryCard from './components/AssignedDeliveryCard';

const ContractorAssignedDeliveries = () => {
  const [deliveries, setDeliveries] = useState(dummyAssignedDeliveries);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleAccept = (id) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Accepted' } : d))
    );
    toast.success('Delivery accepted (dummy — backend later)');
  };

  const pageItems = deliveries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <AssignedDeliveriesHeader count={deliveries.length} />

      <div className="space-y-4">
        {pageItems.length === 0 ? (
          <EmptyAssignedState />
        ) : (
          pageItems.map((delivery) => (
            <AssignedDeliveryCard
              key={delivery.id}
              delivery={delivery}
              onAccept={handleAccept}
            />
          ))
        )}

        {deliveries.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(deliveries.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={deliveries.length}
          />
        )}
      </div>
    </div>
  );
};

export default ContractorAssignedDeliveries;
