import React, { useState } from 'react';
import { XCircle, AlertCircle, Edit2, Loader2 } from 'lucide-react';

const EditDeliveryModal = ({ isOpen, delivery, onClose, onSave, onChange }) => {
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !delivery) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">Edit Delivery</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2"
          >
            <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">SPO Number *</label>
            <input
              type="text"
              value={delivery.spoNumber}
              onChange={(e) => onChange({ ...delivery, spoNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Delivery Date *</label>
              <input
                type="date"
                value={(() => {
                  if (!delivery.deliveryDate) return '';
                  try {
                    const dt = new Date(delivery.deliveryDate);
                    if (Number.isNaN(dt.getTime())) return '';
                    return dt.toISOString().split('T')[0];
                  } catch {
                    return '';
                  }
                })()}
                onChange={(e) => onChange({ ...delivery, deliveryDate: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Time Slot *</label>
              <select
                value={delivery.timeSlot}
                onChange={(e) => onChange({ ...delivery, timeSlot: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Weight (kg) *</label>
              <input
                type="number"
                value={delivery.weight}
                onChange={(e) => onChange({ ...delivery, weight: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Delivery Address *</label>
            <input
              type="text"
              value={delivery.deliveryAddress}
              onChange={(e) => onChange({ ...delivery, deliveryAddress: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Customer Name *</label>
              <input
                type="text"
                value={delivery.customerName}
                onChange={(e) => onChange({ ...delivery, customerName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Customer Phone *</label>
              <input
                type="tel"
                value={delivery.customerPhone}
                onChange={(e) => onChange({ ...delivery, customerPhone: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Special Instructions</label>
            <textarea
              value={delivery.specialInstructions || ''}
              onChange={(e) => onChange({ ...delivery, specialInstructions: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              rows="3"
            />
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
            <p className="text-sm text-gray-900">
              Changes will notify the admin. Please ensure all details are correct before saving.
            </p>
          </div>
        </div>

          <div className="sticky bottom-0 z-10 flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 sm:flex-row sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="w-full disabled:opacity-60 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto sm:px-6 sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              try {
                setIsSaving(true);
                await onSave();
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className="flex w-full disabled:opacity-60 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 sm:text-base"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryModal;
