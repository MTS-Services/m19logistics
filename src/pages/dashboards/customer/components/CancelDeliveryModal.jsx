import React from 'react';
import { XCircle } from 'lucide-react';

const CancelDeliveryModal = ({ isOpen, delivery, cancelReason, onCancelReasonChange, onClose, onConfirm }) => {
  if (!isOpen || !delivery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Cancel Delivery</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100">
            <XCircle className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-600">Are you sure you want to cancel this delivery?</p>

        <textarea
          value={cancelReason}
          onChange={(e) => onCancelReasonChange(e.target.value)}
          placeholder="Optional cancellation reason"
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
          rows={3}
        />

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            Keep Delivery
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelDeliveryModal;
