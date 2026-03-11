import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../services/axiosInstance';

const AddEditModal = ({ isEdit = false, user = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role:
      user?.role === 'admin'
        ? 'ADMIN'
        : user?.role === 'driver'
          ? 'DRIVER'
          : user?.role === 'area_manager'
            ? 'MANAGER'
            : 'CUSTOMER',
    password: '',
    storeName: '',
    depotAddress: user?.depot || '',
    pricingTierId: user?.pricingTierId || '',
    customBasePrice: user?.customBasePrice || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [loadingTiers, setLoadingTiers] = useState(false);

  // Fetch pricing tiers on component mount
  useEffect(() => {
    const fetchPricingTiers = async () => {
      try {
        setLoadingTiers(true);
        const response = await axiosInstance.get('/api/admin/pricing-tiers');
        if (response.data?.success && Array.isArray(response.data.data)) {
          setPricingTiers(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching pricing tiers:', err);
        // Don't show error toast if we already have user pricing tier data
        if (!user?.pricingTierData) {
          toast.error('Failed to load pricing tiers');
        }
      } finally {
        setLoadingTiers(false);
      }
    };
    fetchPricingTiers();
  }, [user?.pricingTierData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    // Password validation
    if (!isEdit && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let response;

      if (isEdit && user?.id) {
        // For update, send all editable fields
        const updatePayload = {
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
        };

        // Add password only if it's provided
        if (formData.password.trim()) {
          updatePayload.password = formData.password;
        }

        // Add customer-specific fields if role is CUSTOMER
        if (formData.role === 'CUSTOMER') {
          if (formData.depotAddress.trim()) {
            updatePayload.depotAddress = formData.depotAddress.trim();
          }
          if (formData.pricingTierId) {
            updatePayload.pricingTierId = parseInt(formData.pricingTierId);
          }
          if (formData.customBasePrice) {
            updatePayload.customBasePrice = parseFloat(formData.customBasePrice);
          }
        }

        response = await axiosInstance.put(`/api/admin/users/${user.id}`, updatePayload);
      } else {
        // For create, send all required fields
        const createPayload = {
          email: formData.email.trim(),
          username: formData.username.trim(),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          role: formData.role,
          password: formData.password,
        };

        // Add customer-specific fields if role is CUSTOMER
        if (formData.role === 'CUSTOMER') {
          if (formData.storeName.trim()) createPayload.storeName = formData.storeName.trim();
          if (formData.depotAddress.trim())
            createPayload.depotAddress = formData.depotAddress.trim();
          if (formData.pricingTierId) {
            createPayload.pricingTierId = parseInt(formData.pricingTierId);
          }
          if (formData.customBasePrice) {
            createPayload.customBasePrice = parseFloat(formData.customBasePrice);
          }
        }

        response = await axiosInstance.post('/api/admin/users', createPayload);
      }

      if (response.data?.success) {
        toast.success(isEdit ? 'User updated successfully!' : 'User created successfully!');
        onSuccess?.(response.data.data);
        onClose();
      } else {
        throw new Error(response.data?.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving user:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save user';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && !isSubmitting && onClose()}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter email"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="DRIVER">Driver</option>
                  <option value="MANAGER">Area Manager</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              {formData.role === 'CUSTOMER' && (
                <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="text-sm font-medium text-gray-700">Customer-Specific Settings</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Store Name</label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="Enter store name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Depot Address</label>
                    <textarea
                      name="depotAddress"
                      value={formData.depotAddress}
                      onChange={handleChange}
                      rows={2}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="Enter depot address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pricing Tier</label>
                    <select
                      name="pricingTierId"
                      value={formData.pricingTierId}
                      onChange={handleChange}
                      disabled={loadingTiers && !user?.pricingTierData}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {!isEdit && <option value="">Select pricing tier (optional)</option>}
                      {/* Show current pricing tier immediately if available */}
                      {isEdit && user?.pricingTierData && pricingTiers.length === 0 && (
                        <option value={user.pricingTierData.id}>
                          {user.pricingTierData.name}
                        </option>
                      )}
                      {pricingTiers.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.name}
                        </option>
                      ))}
                    </select>
                    {loadingTiers && !user?.pricingTierData && (
                      <p className="mt-1 text-xs text-gray-500">Loading pricing tiers...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Base Price</label>
                    <input
                      type="number"
                      name="customBasePrice"
                      value={formData.customBasePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      placeholder="Enter custom base price (optional)"
                    />

                  </div>
                </div>
              )}

              {!isEdit ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Initial Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Update Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current password"
                      className={`mt-1 block w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                  )}

                </div>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-gray-200 bg-white p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEdit ? 'Update User' : 'Create User'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
