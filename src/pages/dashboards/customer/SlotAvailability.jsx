import React, { useState, useEffect } from 'react';
import { getSlotAvailability } from '../../../services/slotService';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';

const SlotAvailability = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async (date = '') => {
    try {
      setLoading(true);
      const params = {};
      if (date) {
        // Ensure date is in YYYY-MM-DD format
        params.date = date;
      }
      const res = await getSlotAvailability(params);

      if (res && res.success) {
        if (Array.isArray(res.data)) {
          setSlots(res.data);
        } else if (res.data && typeof res.data === 'object') {
          // API returned single object instead of array
          setSlots([res.data]);
        } else {
          setSlots([]);
        }
      } else {
        setSlots([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load slot availability');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchSlots(date);
  };

  const clearFilter = () => {
    setSelectedDate('');
    fetchSlots();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTotalSlots = () => {
    let total = { available: 0, booked: 0, remaining: 0 };
    slots.forEach((slotData) => {
      total.available +=
        (slotData.slots.AM.available ? 1 : 0) + (slotData.slots.PM.available ? 1 : 0);
      total.booked += slotData.slots.AM.booked + slotData.slots.PM.booked;
      total.remaining += slotData.slots.AM.remaining + slotData.slots.PM.remaining;
    });
    return total;
  };

  const stats = getTotalSlots();

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Slot Availability
          </h1>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Check available delivery slots for your preferred dates
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Total Dates</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{slots.length}</p>
              </div>
              <div className="rounded-lg bg-teal-50 p-2 sm:p-3">
                <Calendar className="h-5 w-5 text-teal-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Available Slots</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.available}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 sm:p-3">
                <CheckCircle className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Total Capacity</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.remaining}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
                <Clock className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 md:max-w-md">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateFilter}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none sm:text-base"
                placeholder="Select date..."
              />
              {selectedDate && (
                <button
                  onClick={clearFilter}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={() => fetchSlots(selectedDate)}
              className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:text-base"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Slots Grid */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-gray-600">Loading slot availability...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No slots found</h3>
            <p className="text-gray-600">
              {selectedDate
                ? 'No slots available for the selected date'
                : 'No slot information available at the moment'}
            </p>
            <button
              onClick={clearFilter}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
              View All Slots
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {slots.map((slotData, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Date Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-teal-100 p-2">
                        <Calendar className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {formatDate(slotData.date)}
                        </h3>
                        <p className="text-sm text-gray-600">{slotData.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {slotData.slots.AM.available && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          AM Available
                        </span>
                      )}
                      {slotData.slots.PM.available && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          PM Available
                        </span>
                      )}
                      {!slotData.slots.AM.available && !slotData.slots.PM.available && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          <XCircle className="h-3 w-3" />
                          Fully Booked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Slot Details */}
                <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2">
                  {/* AM Slot */}
                  <div
                    className={`rounded-lg border-2 p-4 transition-all ${
                      slotData.slots.AM.available
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-lg p-2 ${
                            slotData.slots.AM.available ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          <Clock
                            className={`h-5 w-5 ${
                              slotData.slots.AM.available ? 'text-green-600' : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Morning Slot</p>
                          <p className="text-xs text-gray-600">Before 12:00 PM</p>
                        </div>
                      </div>
                      {slotData.slots.AM.available ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-600">Max Capacity:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {slotData.slots.AM.maxCapacity}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-600">Booked:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {slotData.slots.AM.booked}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-sm font-semibold text-gray-700">Remaining:</span>
                        <span
                          className={`text-lg font-bold ${
                            slotData.slots.AM.remaining > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {slotData.slots.AM.remaining}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <span
                        className={`inline-block w-full rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                          slotData.slots.AM.available
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {slotData.slots.AM.available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* PM Slot */}
                  <div
                    className={`rounded-lg border-2 p-4 transition-all ${
                      slotData.slots.PM.available
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-lg p-2 ${
                            slotData.slots.PM.available ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          <Clock
                            className={`h-5 w-5 ${
                              slotData.slots.PM.available ? 'text-green-600' : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Afternoon Slot</p>
                          <p className="text-xs text-gray-600">After 12:00 PM</p>
                        </div>
                      </div>
                      {slotData.slots.PM.available ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-600">Max Capacity:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {slotData.slots.PM.maxCapacity}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-600">Booked:</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {slotData.slots.PM.booked}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-sm font-semibold text-gray-700">Remaining:</span>
                        <span
                          className={`text-lg font-bold ${
                            slotData.slots.PM.remaining > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          {slotData.slots.PM.remaining}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 border-t border-gray-200 pt-3">
                      <span
                        className={`inline-block w-full rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                          slotData.slots.PM.available
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {slotData.slots.PM.available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-teal-100 p-2">
              <AlertCircle className="h-5 w-5 text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="mb-2 text-base font-bold text-teal-900">Important Information</p>
              <ul className="space-y-2 text-sm text-teal-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>
                    <strong>Morning Slots (AM):</strong> Deliveries scheduled before 12:00 PM
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>
                    <strong>Afternoon Slots (PM):</strong> Deliveries scheduled after 12:00 PM
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>Slots are allocated on a first-come, first-served basis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>Book your delivery early to secure your preferred time slot</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotAvailability;
