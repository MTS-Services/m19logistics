import React, { useState } from 'react';
import { X, Trash2, Loader2, AlertTriangle, User, Calendar, Hash, MapPin } from 'lucide-react';

const DeleteConfirmationModal = ({ delivery, onClose, onConfirm, formatDate }) => {
  const [deleting, setDeleting] = useState(false);
  if (!delivery) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Delivery</h2>
              <p className="text-sm text-gray-500">{delivery.spoNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-700">
              This action <strong>cannot be undone</strong>. The delivery record will be permanently
              removed from the system.
            </p>
          </div>

          {/* Delivery Summary Card */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 border-b border-gray-200 pb-2 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Delivery Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 shrink-0 text-teal-500" />
                <span className="w-24 text-sm text-gray-500">Customer</span>
                <span className="text-sm font-medium text-gray-900">{delivery.customer}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 shrink-0 text-teal-500" />
                <span className="w-24 text-sm text-gray-500">Date</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate
                    ? formatDate(delivery.deliveryDate)
                    : delivery.deliveryDate?.split('T')[0] || '—'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-teal-500" />
                <span className="w-24 text-sm text-gray-500">Address</span>
                <span className="line-clamp-1 text-sm font-medium text-gray-900">
                  {delivery.address || '—'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 shrink-0 text-teal-500" />
                <span className="w-24 text-sm text-gray-500">Status</span>
                <span className="text-sm font-semibold text-gray-900">{delivery.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-white p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-base font-medium text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete Delivery</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
