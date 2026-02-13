import React from 'react';
import { X, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ delivery, onClose, onConfirm, formatDate }) => {
  if (!delivery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
            Delete Delivery
          </h3>
          <p className="mb-4 text-center text-base text-gray-600">
            Are you sure you want to delete delivery{' '}
            <strong>{delivery.spoNumber}</strong>? This action cannot be undone.
          </p>

          {/* Delivery Details Summary */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-2 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium text-gray-900">{delivery.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(delivery.deliveryDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${delivery.status === 'Cancelled' ? 'text-gray-600' : 'text-red-600'}`}
                >
                  {delivery.status}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-base font-medium text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Delivery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
