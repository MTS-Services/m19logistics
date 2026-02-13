import React from 'react';
import { X, Save } from 'lucide-react';

const EditDeliveryModal = ({ delivery, onClose, onSave }) => {
  if (!delivery) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save functionality logic here
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    onSave(updatedData);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">

        {/* Modal Header - Sticky/Fixed */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Edit Delivery</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-delivery-form" className="space-y-6" onSubmit={handleSubmit}>
            {/* SPO Number */}
            <div>
              <label className="block text-base font-medium text-gray-700">SPO Number</label>
              <input
                type="text"
                name="spoNumber"
                defaultValue={delivery.spoNumber}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm outline-none"
                readOnly
              />
            </div>

            {/* Customer */}
            <div>
              <label className="block text-base font-medium text-gray-700">Customer</label>
              <input
                type="text"
                name="customer"
                defaultValue={delivery.customer}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Delivery Address
              </label>
              <textarea
                name="address"
                defaultValue={delivery.address}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-base font-medium text-gray-700">
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  defaultValue={delivery.deliveryDate}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">Time Slot</label>
                <select
                  name="timeSlot"
                  defaultValue={delivery.timeSlot}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Weight and Cost */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-base font-medium text-gray-700">Weight</label>
                <input
                  type="text"
                  name="weight"
                  defaultValue={delivery.weight}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">Cost (£)</label>
                <input
                  type="number"
                  name="cost"
                  step="0.01"
                  defaultValue={delivery.cost}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-base font-medium text-gray-700">Status</label>
              <select
                name="status"
                defaultValue={delivery.status}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="Received">Received</option>
                <option value="Allocated">Allocated</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </form>
        </div>

        {/* Modal Footer - Sticky/Fixed */}
        <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-gray-200 p-6 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-delivery-form"
            className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-base font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryModal;