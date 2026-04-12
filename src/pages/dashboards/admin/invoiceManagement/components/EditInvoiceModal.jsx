import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../services/axiosInstance';

const EditInvoiceModal = ({ invoice, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerRef: '',
    notes: '',
    paymentTerms: '30 Days (End of Month)',
    items: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber || '',
        customerRef: invoice.customerRef || '',
        notes: invoice.notes || '',
        paymentTerms: invoice.paymentTerms || '30 Days (End of Month)',
        items: (invoice.items || []).map((item) => ({
          ...(item.deliveryId && { deliveryId: item.deliveryId }),
          description: item.description || '',
          quantity: item.quantity || 1,
          unitCost: item.unitCost || 0,
          vatAmount: item.vatAmount || 0,
          total: item.total || 0,
          ...(item.isAdditional !== undefined && { isAdditional: item.isAdditional }),
        })),
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const calculateItemTotal = (quantity, unitCost, vatAmount) => {
    const q = parseFloat(quantity) || 0;
    const uc = parseFloat(unitCost) || 0;
    const va = parseFloat(vatAmount) || 0;
    const total = q * uc + va;
    return Math.round(total * 100) / 100; // Round to 2 decimal places
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    const numericFields = ['quantity', 'unitCost', 'vatAmount'];

    if (numericFields.includes(field)) {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: parseFloat(value) || 0,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }

    // Always recalculate total based on quantity, unitCost, and vatAmount
    updatedItems[index].total = calculateItemTotal(
      updatedItems[index].quantity,
      updatedItems[index].unitCost,
      updatedItems[index].vatAmount
    );

    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          quantity: 1,
          unitCost: 0,
          vatAmount: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    } else {
      // Validate each item
      const itemErrors = [];
      formData.items.forEach((item, index) => {
        const errors = [];
        if (!item.description || !item.description.trim()) {
          errors.push('Description is required');
        }
        if (!item.quantity || item.quantity < 1) {
          errors.push('Quantity must be at least 1');
        }
        if (!item.unitCost || item.unitCost <= 0) {
          errors.push('Unit cost must be positive');
        }
        if (item.vatAmount < 0) {
          errors.push('VAT amount cannot be negative');
        }
        if (!item.total || item.total <= 0) {
          errors.push('Total must be positive');
        }
        if (errors.length > 0) {
          itemErrors.push(`Item ${index + 1}: ${errors.join(', ')}`);
        }
      });

      if (itemErrors.length > 0) {
        newErrors.items = itemErrors.join('; ');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const invoiceId = invoice.id || invoice._id || invoice.invoiceId;

      console.log('Original invoice:', invoice);
      console.log('FormData items:', formData.items);
      console.log('FormData items detailed:', JSON.stringify(formData.items, null, 2));

      // Format items: ensure numeric values are numbers, preserve deliveryId and isAdditional if present
      const formattedItems = formData.items.map((item) => ({
        ...(item.deliveryId && { deliveryId: item.deliveryId }),
        description: item.description.trim(),
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
        vatAmount: Number(item.vatAmount),
        total: Number(item.total),
        ...(item.isAdditional !== undefined && { isAdditional: item.isAdditional }),
      }));

      const payload = {
        // invoiceNumber is read-only, don't send it for update
        customerRef: formData.customerRef.trim(),
        notes: formData.notes.trim(),
        paymentTerms: formData.paymentTerms.trim(),
        items: formattedItems,
      };

      console.log('Updating invoice with ID:', invoiceId);
      console.log('Payload:', JSON.stringify(payload, null, 2));

      const response = await axiosInstance.put(`/api/admin/invoices/${invoiceId}`, payload);

      console.log('Response:', response.data);

      if (response.data?.success) {
        toast.success('Invoice updated successfully!');
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.data?.message || 'Failed to update invoice');
      }
    } catch (err) {
      console.error('Error updating invoice:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      // Log detailed error info
      if (err.response?.data?.errors) {
        console.error('Validation errors details:');
        console.error(JSON.stringify(err.response.data.errors, null, 2));
      }

      // Better error message with backend validation errors
      let errorMessage = 'Failed to update invoice';

      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors
          .map((e) => {
            if (typeof e === 'string') return e;
            if (e.message) return e.message;
            if (e.msg) return e.msg;
            return JSON.stringify(e);
          })
          .join('; ');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(`Update failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose?.();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Invoice {invoice?.invoiceNumber}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Number *
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    readOnly
                    className="mt-1 block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 shadow-sm"
                    placeholder="e.g., T0337"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Ref</label>
                  <input
                    type="text"
                    name="customerRef"
                    value={formData.customerRef}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="e.g., TOPPS-CH-001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
                <input
                  type="text"
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g., 30 Days (End of Month)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  placeholder="e.g., Please reference invoice number on payment"
                />
              </div>

              {/* Items Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Invoice Items
                    {errors.items && (
                      <span className="ml-2 text-xs text-red-500">{errors.items}</span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">
                            Description *
                          </label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            placeholder="e.g., Delivery to Wadebrook Retail Park"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              step="1"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700">
                              Unit Cost (£) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unitCost}
                              onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700">
                              VAT Amount (£) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.vatAmount}
                              onChange={(e) => handleItemChange(index, 'vatAmount', e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700">
                              Total (£)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={Number(item.total).toFixed(2)}
                              className="mt-1 block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-2 py-1.5 text-sm text-gray-600 shadow-sm"
                              readOnly
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Remove Item</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {formData.items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
                      <p className="text-sm text-gray-500">No items added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="shrink-0 border-t border-gray-200 bg-white p-6">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center space-x-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
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
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
