import React, { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../services/axiosInstance';

const AddEditModal = ({ isEdit = false, driver = null, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: driver?.name || '',
    username: driver?.username || '',
    email: driver?.email || '',
    phone: driver?.phone || '',
    password: '',
    vehicleRegistration: driver?.vehicleRegistration || '',
    isActive: driver?.status === 'active' || true,
    isActiveDriver: true,
    enableSmsNotifications: driver?.enableSmsNotifications || false,
    enableEmailNotifications: driver?.enableEmailNotifications || true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return toast.error('Full name is required');
    if (!formData.email.trim()) return toast.error('Email is required');
    if (!formData.phone.trim()) return toast.error('Phone is required');
    if (!isEdit && !formData.password.trim()) return toast.error('Password is required');

    try {
      setIsSubmitting(true);
      if (isEdit) {
        const updatePayload = { fullName: formData.fullName, phone: formData.phone };
        await axiosInstance.put(`/api/admin/users/${driver.id}`, updatePayload);
        toast.success('Driver updated successfully');
      } else {
        const createPayload = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          role: 'DRIVER',
          isActive: formData.isActive,
          vehicleRegistration: formData.vehicleRegistration,
          isActiveDriver: formData.isActiveDriver,
        };
        const response = await axiosInstance.post('/api/admin/users', createPayload);
        toast.success(response.data.message || 'Driver created successfully');
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Driver' : 'Add New Driver'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter driver's full name"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g., BK01"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  disabled={isEdit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="driver@example.com"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  disabled={isEdit}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="07971415430"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            {!isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Registration
              </label>
              <input
                name="vehicleRegistration"
                value={formData.vehicleRegistration}
                onChange={handleChange}
                placeholder="e.g., AB12 CDE"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
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
                className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>
                  {isSubmitting ? 'Saving...' : isEdit ? 'Update Driver' : 'Create Driver'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
