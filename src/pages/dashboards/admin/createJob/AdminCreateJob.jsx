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
  AlertTriangle,
  CheckCircle,
  Send,
  X,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { saveAdminCreatedJob } from './adminJobsStorage';

const AdminCreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [showSameDayModal, setShowSameDayModal] = useState(false);
  const [formData, setFormData] = useState({
    spoNumber: '',
    date: '',
    timeSlot: 'AM',
    weight: '',
    address: '',
    customerName: '',
    phone: '',
    requestedBy: user?.name || user?.fullName || '',
    instructions: '',
  });

  const [errors, setErrors] = useState({});

  const isSameDayDelivery = () => {
    if (!formData.date) return false;
    const today = new Date().toISOString().split('T')[0];
    return formData.date === today;
  };

  const getEmptyForm = () => ({
    spoNumber: '',
    date: '',
    timeSlot: 'AM',
    weight: '',
    address: '',
    customerName: '',
    phone: '',
    requestedBy: user?.name || user?.fullName || '',
    instructions: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    if (name === 'date' && value) {
      const today = new Date().toISOString().split('T')[0];
      if (value === today) {
        setShowSameDayModal(true);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setShowPreview(true);
  };

  // Design-only confirm — no API call; save locally and go to My Bookings
  const confirmSubmission = () => {
    const job = saveAdminCreatedJob(formData);
    console.log('Admin Create Job saved locally:', job);
    toast.success('Job created — saved to My Bookings');
    setShowPreview(false);
    setFormData(getEmptyForm());
    setErrors({});
    navigate('/admin/my-bookings');
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Create Job
          </h1>
          <p className="mt-2 text-gray-600">
            Create a new delivery job. All fields marked with * are required.
          </p>
        </div>
      </div>

      {isSameDayDelivery() && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-orange-600" />
          <div>
            <h3 className="font-semibold text-orange-900">Same-Day Delivery Notice</h3>
            <p className="mt-1 text-base text-orange-800">
              Same-day delivery cannot be guaranteed. Please call{' '}
              <a href="tel:07818077110" className="font-semibold underline">
                07818077110
              </a>{' '}
              to confirm availability.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-base text-amber-900">
            <p className="font-semibold">Delivery Slot Availability</p>
            <p className="mt-1">
              Time slots are subject to availability and admin configuration. If you encounter any
              issues with slot availability, please contact support at{' '}
              <a href="tel:07818077110" className="font-semibold underline">
                07818077110
              </a>{' '}
              for assistance.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <Package className="h-5 w-5 text-teal-600" />
            Delivery Details
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
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
              {errors.spoNumber && (
                <p className="mt-1 text-base text-red-600">{errors.spoNumber}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
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
              {errors.weight && <p className="mt-1 text-base text-red-600">{errors.weight}</p>}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
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
              {errors.date && <p className="mt-1 text-base text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
                <Clock className="h-4 w-4 text-gray-400" />
                Time Slot *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="AM">Morning (AM)</option>
                <option value="PM">Afternoon (PM)</option>
                <option value="SAME_DAY">Same Day</option>
              </select>
              <p className="mt-1 text-base text-gray-500">
                ⚠️ Time slots are subject to availability. If unavailable, try a different slot or
                contact support.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <MapPin className="h-5 w-5 text-teal-600" />
            Delivery Address
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-base font-medium text-gray-700">
                Full Address *
              </label>
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
              {errors.address && <p className="mt-1 text-base text-red-600">{errors.address}</p>}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <User className="h-5 w-5 text-teal-600" />
            Contact Information
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
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
                <p className="mt-1 text-base text-red-600">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
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
              {errors.phone && <p className="mt-1 text-base text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
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
                <p className="mt-1 text-base text-red-600">{errors.requestedBy}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
            <AlertCircle className="h-5 w-5 text-teal-600" />
            Special Instructions
          </h2>

          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">
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

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              setFormData(getEmptyForm());
              setErrors({});
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 sm:w-auto"
          >
            <Send className="h-5 w-5" />
            Submit Request
          </button>
        </div>
      </form>

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
                    <p className="text-base text-gray-600">SPO Number</p>
                    <p className="font-semibold text-gray-900">{formData.spoNumber}</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-600">Weight</p>
                    <p className="font-semibold text-gray-900">{formData.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-600">Delivery Date</p>
                    <p className="font-semibold text-gray-900">{formData.date}</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-600">Time Slot</p>
                    <p className="font-semibold text-gray-900">
                      {formData.timeSlot === 'AM'
                        ? 'Morning (AM)'
                        : formData.timeSlot === 'PM'
                          ? 'Afternoon (PM)'
                          : 'Same Day'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-base text-gray-600">Delivery Address</p>
                  <p className="font-semibold text-gray-900">{formData.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base text-gray-600">Customer Name</p>
                    <p className="font-semibold text-gray-900">{formData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-base text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-900">{formData.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-base text-gray-600">Requested By</p>
                  <p className="font-semibold text-gray-900">{formData.requestedBy}</p>
                </div>

                {formData.instructions && (
                  <div>
                    <p className="text-base text-gray-600">Special Instructions</p>
                    <p className="font-semibold text-gray-900">{formData.instructions}</p>
                  </div>
                )}
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
                className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 sm:w-auto"
              >
                <CheckCircle className="h-5 w-5" />
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showSameDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Same-Day Delivery</h3>
                </div>
                <button
                  onClick={() => setShowSameDayModal(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-900">Important Information</p>
                      <p className="mt-1 text-base text-orange-800">
                        Same-day delivery cannot be guaranteed and requires confirmation from our
                        team.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Info className="h-5 w-5 text-teal-600" />
                    <p className="font-semibold text-teal-900">Next Steps:</p>
                  </div>
                  <ol className="space-y-1.5 text-base text-teal-800">
                    <li className="flex items-start gap-2">
                      <Package className="h-4 w-4 shrink-0 text-teal-600" />
                      <span>Complete your booking request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-teal-600" />
                      <span>
                        Call{' '}
                        <a
                          href="tel:07971415430"
                          className="font-semibold text-teal-700 underline hover:text-teal-900"
                        >
                          07971 415430
                        </a>{' '}
                        to confirm availability
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-teal-600" />
                      <span>We'll confirm if same-day delivery is possible</span>
                    </li>
                  </ol>
                </div>

                <p className="text-base text-gray-600">
                  <span className="italic">Note:</span> You can continue with your booking, but
                  please contact us to confirm same-day availability.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowSameDayModal(false)}
                className="w-full rounded-md border border-gray-300 bg-white px-6 py-2.5 text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
              >
                Continue Booking
              </button>
              <a
                href="tel:07971415430"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2.5 font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 sm:w-auto"
              >
                <Phone className="h-4 w-4" />
                Call 07971 415430
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateJob;
