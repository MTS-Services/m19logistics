import React, { useState } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../services/axiosInstance';

const EditJobModal = ({ job, onClose, onSave }) => {
  const [form, setForm] = useState({
    deliveryAddress: job?.address || '',
    weight: job?.weight || '',
    specialInstructions: job?.instructions || '',
    contractorRate: job?.jobRate != null ? String(job.jobRate) : '',
    collectionPoints:
      Array.isArray(job?.collectionPoints) && job.collectionPoints.length > 0
        ? [...job.collectionPoints]
        : [''],
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCollectionChange = (index, value) => {
    const next = [...form.collectionPoints];
    next[index] = value;
    setForm((prev) => ({ ...prev, collectionPoints: next }));
    if (errors.collectionPoints) setErrors((prev) => ({ ...prev, collectionPoints: '' }));
  };

  const addCollectionPoint = () => {
    setForm((prev) => ({ ...prev, collectionPoints: [...prev.collectionPoints, ''] }));
  };

  const removeCollectionPoint = (index) => {
    if (form.collectionPoints.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      collectionPoints: prev.collectionPoints.filter((_, i) => i !== index),
    }));
  };

  const getFilledCollectionPoints = () =>
    form.collectionPoints.map((p) => p.trim()).filter(Boolean);

  const validate = () => {
    const next = {};
    if (!form.deliveryAddress.trim()) next.deliveryAddress = 'Delivery address is required';
    if (!form.weight || Number(form.weight) <= 0) next.weight = 'Valid weight is required';
    if (getFilledCollectionPoints().length === 0) {
      next.collectionPoints = 'At least one collection point is required';
    }
    if (form.contractorRate !== '' && Number(form.contractorRate) < 0) {
      next.contractorRate = 'Rate cannot be negative';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        deliveryAddress: form.deliveryAddress.trim(),
        weight: Number(form.weight),
        specialInstructions: form.specialInstructions.trim(),
        collectionPoints: getFilledCollectionPoints(),
      };

      if (form.contractorRate !== '') {
        payload.contractorRate = Number(form.contractorRate);
      }

      const response = await axiosInstance.put(`/api/admin/deliveries/${job.id}`, payload);

      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'Update failed');
      }

      toast.success(response.data?.message || 'Job updated successfully');
      onSave(response.data?.data || response.data);
    } catch (err) {
      console.error('Edit job error:', err?.response?.data || err);
      const msg = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Failed to update job';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Job</h2>
            <p className="text-sm text-gray-500">{job.spoNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-admin-job-form" className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium text-gray-900">{job.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{job.phone}</p>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Delivery Address *
              </label>
              <textarea
                name="deliveryAddress"
                value={form.deliveryAddress}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none ${
                  errors.deliveryAddress ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.deliveryAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Collection From *
                </label>
                <button
                  type="button"
                  onClick={addCollectionPoint}
                  className="inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Point
                </button>
              </div>
              <div className="space-y-3">
                {form.collectionPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <textarea
                      value={point}
                      onChange={(e) => handleCollectionChange(index, e.target.value)}
                      rows={2}
                      placeholder={`Collection point ${index + 1}`}
                      className={`w-full rounded-md border px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none ${
                        errors.collectionPoints && index === 0 ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {form.collectionPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCollectionPoint(index)}
                        className="mt-1 rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.collectionPoints && (
                <p className="mt-1 text-sm text-red-600">{errors.collectionPoints}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Weight (kg) *</label>
                <input
                  type="number"
                  name="weight"
                  min="1"
                  value={form.weight}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none ${
                    errors.weight ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Contractor Rate (£)
                </label>
                <input
                  type="number"
                  name="contractorRate"
                  min="0"
                  step="0.01"
                  value={form.contractorRate}
                  onChange={handleChange}
                  placeholder="Optional"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none ${
                    errors.contractorRate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.contractorRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.contractorRate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={form.specialInstructions}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </form>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-admin-job-form"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditJobModal;
