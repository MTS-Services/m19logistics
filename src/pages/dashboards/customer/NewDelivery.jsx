import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Phone,
  User,
  Weight,
  Package,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Send,
  X,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const NewDelivery = () => {
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    spoNumber: '',
    date: '',
    timeSlot: 'AM',
    weight: '',
    address: '',
    customerName: '',
    phone: '',
    requestedBy: user?.name || '',
    instructions: '',
  });

  const [errors, setErrors] = useState({});

  // Check if same day delivery
  const isSameDayDelivery = () => {
    if (!formData.date) return false;
    const today = new Date().toISOString().split('T')[0];
    return formData.date === today;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.spoNumber.trim()) {
      newErrors.spoNumber = 'SPO Number is required';
    }
    if (!formData.date) {
      newErrors.date = 'Delivery date is required';
    }
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Valid weight is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.requestedBy.trim()) {
      newErrors.requestedBy = 'Requested by name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    // Show preview modal
    setShowPreview(true);
  };

  // Confirm submission
  const confirmSubmission = () => {
    // Calculate estimated cost (simple calculation)
    const weightBlocks = Math.ceil(formData.weight / 800);
    const estimatedCost = weightBlocks * 45; // Tier B pricing

    // Here you would normally make an API call
    console.log('Submitting delivery request:', formData);

    toast.success('Delivery request submitted successfully!');

    // Show same-day warning if applicable
    if (isSameDayDelivery()) {
      setTimeout(() => {
        toast.warning(
          'Same-day delivery cannot be guaranteed. Please call 07971415430 to confirm availability'
        );
      }, 1000);
    }

    // Reset form
    setFormData({
      spoNumber: '',
      date: '',
      timeSlot: 'AM',
      weight: '',
      address: '',
      customerName: '',
      phone: '',
      requestedBy: user?.name || '',
      instructions: '',
    });
    setShowPreview(false);
  };

  // Calculate estimated cost
  const getEstimatedCost = () => {
    if (!formData.weight) return 0;
    const weightBlocks = Math.ceil(formData.weight / 800);
    return weightBlocks * 45; // Tier B pricing
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Request New Delivery
          </h1>
          <p className="mt-2 text-gray-600">
            Submit a new delivery request. All fields marked with * are required.
          </p>
        </div>
      </div>

      {/* Same-day delivery warning */}
      {isSameDayDelivery() && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-900">Same-Day Delivery Notice</h3>
            <p className="mt-1 text-sm text-orange-800">
              Same-day delivery cannot be guaranteed. Please call{' '}
              <a href="tel:07971415430" className="font-semibold underline">
                07971 415430
              </a>{' '}
              to confirm availability.
            </p>
          </div>
        </div>
      )}

      {/* Information Card */}
      <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 text-teal-600" />
          <div className="text-sm text-teal-900">
            <p className="font-semibold">Pricing Information</p>
            <ul className="mt-2 space-y-1">
              <li>• Base rate: £45 per 800kg (up to 45 miles)</li>
              <li>• Additional charges apply for deliveries beyond 45 miles</li>
              <li>• Estimated cost is calculated based on weight</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Details Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Package className="h-5 w-5 text-teal-600" />
            Delivery Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* SPO Number */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="h-4 w-4 text-gray-400" />
                SPO Number *
              </label>
              <input
                type="text"
                name="spoNumber"
                value={formData.spoNumber}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.spoNumber ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="Enter SPO number"
              />
              {errors.spoNumber && <p className="mt-1 text-sm text-red-600">{errors.spoNumber}</p>}
            </div>

            {/* Weight */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Weight className="h-4 w-4 text-gray-400" />
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="1"
                className={`w-full rounded-md border ${
                  errors.weight ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="Enter weight in kg"
              />
              {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              {formData.weight > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  Estimated Cost: <span className="font-semibold">£{getEstimatedCost()}</span>
                </p>
              )}
            </div>

            {/* Delivery Date */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 text-gray-400" />
                Delivery Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full rounded-md border ${
                  errors.date ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/* Time Slot */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4 text-gray-400" />
                Time Slot *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                disabled={isSameDayDelivery()}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="AM">Morning (AM)</option>
                <option value="PM">Afternoon (PM)</option>
              </select>
              {isSameDayDelivery() && (
                <p className="mt-1 text-sm text-orange-600">
                  Time slot not available for same-day delivery
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <MapPin className="h-5 w-5 text-teal-600" />
            Delivery Address
          </h2>

          <div className="space-y-4">
            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-md border ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="Enter complete delivery address with postcode"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <User className="h-5 w-5 text-teal-600" />
            Contact Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Customer Name */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4 text-gray-400" />
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.customerName ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="Enter contact number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* Requested By */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4 text-gray-400" />
                Requested By *
              </label>
              <input
                type="text"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.requestedBy ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="Your name"
              />
              {errors.requestedBy && (
                <p className="mt-1 text-sm text-red-600">{errors.requestedBy}</p>
              )}
            </div>
          </div>
        </div>

        {/* Special Instructions Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <AlertCircle className="h-5 w-5 text-teal-600" />
            Special Instructions
          </h2>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Delivery Instructions (Optional)
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Any special instructions for the driver (e.g., call before arrival, deliver to rear entrance, etc.)"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setFormData({
                spoNumber: '',
                date: '',
                timeSlot: 'AM',
                weight: '',
                address: '',
                customerName: '',
                phone: '',
                requestedBy: user?.name || '',
                instructions: '',
              });
              setErrors({});
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 sm:w-auto"
          >
            <Send className="h-5 w-5" />
            Submit Request
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Confirm Delivery Request</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">SPO Number</p>
                    <p className="font-semibold text-gray-900">{formData.spoNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold text-gray-900">{formData.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Delivery Date</p>
                    <p className="font-semibold text-gray-900">{formData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="font-semibold text-gray-900">
                      {isSameDayDelivery() ? 'Not Specified' : formData.timeSlot}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="font-semibold text-gray-900">{formData.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-semibold text-gray-900">{formData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-900">{formData.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="font-semibold text-gray-900">{formData.requestedBy}</p>
                </div>

                {formData.instructions && (
                  <div>
                    <p className="text-sm text-gray-600">Special Instructions</p>
                    <p className="font-semibold text-gray-900">{formData.instructions}</p>
                  </div>
                )}

                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <p className="text-sm text-teal-900">
                    <span className="font-semibold">Estimated Cost:</span> £{getEstimatedCost()}
                  </p>
                  <p className="mt-1 text-xs text-teal-700">
                    Final cost may vary based on distance and additional requirements
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="w-full rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 sm:w-auto"
              >
                <CheckCircle className="h-5 w-5" />
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDelivery;
