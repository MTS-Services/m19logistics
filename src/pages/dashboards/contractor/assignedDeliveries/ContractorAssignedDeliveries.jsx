import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import { dummyAssignedDeliveries } from '../contractorDummyData';
import AssignedDeliveriesHeader from './components/AssignedDeliveriesHeader';
import EmptyAssignedState from './components/EmptyAssignedState';
import AssignedDeliveryCard from './components/AssignedDeliveryCard';
import DeclineDeliveryModal from './components/DeclineDeliveryModal';
import CompleteDeliveryModal from './components/CompleteDeliveryModal';

const ContractorAssignedDeliveries = () => {
  const [deliveries, setDeliveries] = useState(dummyAssignedDeliveries);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const itemsPerPage = 4;

  const handleAccept = (id) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Accepted' } : d))
    );
    toast.success('Delivery accepted (dummy — backend later)');
  };

  const handleDecline = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeclineModal(true);
  };

  const handleDeclineConfirm = (id) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    toast.success('Delivery declined (dummy — backend later)');
    setShowDeclineModal(false);
    setSelectedDelivery(null);
  };

  const handleComplete = (delivery) => {
    setSelectedDelivery(delivery);
    setShowCompleteModal(true);
  };

  const handleCompleteConfirm = (id) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== id));
    toast.success('Delivery completed (dummy — backend later)');
    setShowCompleteModal(false);
    setSelectedDelivery(null);
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
              onDecline={handleDecline}
              onComplete={handleComplete}
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

      <DeclineDeliveryModal
        isOpen={showDeclineModal}
        delivery={selectedDelivery}
        onClose={() => {
          setShowDeclineModal(false);
          setSelectedDelivery(null);
        }}
        onConfirm={handleDeclineConfirm}
      />

      <CompleteDeliveryModal
        isOpen={showCompleteModal}
        delivery={selectedDelivery}
        onClose={() => {
          setShowCompleteModal(false);
          setSelectedDelivery(null);
        }}
        onConfirm={handleCompleteConfirm}
      />
    </div>
  );
};

export default ContractorAssignedDeliveries;
