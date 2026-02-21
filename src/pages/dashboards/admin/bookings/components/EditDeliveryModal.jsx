import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../services/axiosInstance';

const EditDeliveryModal = ({ delivery, onClose, onSave }) => {
  const [form, setForm] = useState({
    spoNumber: delivery?.spoNumber || '',
    customerName: delivery?.customerName || delivery?.customer || '',
    customerPhone: delivery?.customerPhone || delivery?.phone || '',
    deliveryAddress: delivery?.deliveryAddress || delivery?.address || '',
    weight: delivery?.weight || '',
    specialInstructions: delivery?.specialInstructions || '',
  });
  const [saving, setSaving] = useState(false);

  if (!delivery) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        spoNumber: form.spoNumber,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        deliveryAddress: form.deliveryAddress,
        weight: Number(form.weight),
        specialInstructions: form.specialInstructions,
      };

      const response = await axiosInstance.put(`/api/admin/deliveries/${delivery.id}`, payload);

      if (response.data.success) {
        toast.success('Delivery updated successfully!');
        onSave(response.data.data);
      } else {
        toast.error(response.data.message || 'Update failed.');
      }
    } catch (err) {
      console.error('Edit error:', err?.response?.data);
      const msg = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || 'Failed to update delivery.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Delivery</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-delivery-form" className="space-y-5" onSubmit={handleSubmit}>
            {/* READ-ONLY INFO ROW */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Delivery Date</label>
                <p className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {delivery.deliveryDate ? delivery.deliveryDate.split('T')[0] : '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Time Slot</label>
                <p className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {delivery.timeSlot || '—'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <p className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {delivery.status || '—'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">Cost (£)</label>
                <p className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  {delivery.cost ? `£${parseFloat(delivery.cost).toFixed(2)}` : '—'}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* EDITABLE FIELDS */}
            {/* SPO Number */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                SPO Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="spoNumber"
                value={form.spoNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-base font-medium text-gray-700">Customer Phone</label>
              <input
                type="text"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                rows={3}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Weight <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-base font-medium text-gray-700">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={form.specialInstructions}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-gray-200 bg-white p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-delivery-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-base font-medium text-white shadow-md transition-all hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryModal;
