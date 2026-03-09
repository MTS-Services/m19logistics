import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getDriverAvailability,
  createDriverAvailability,
  updateDriverAvailability,
  deleteDriverAvailability,
} from '../../../services/driverService';

const DriverAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    timeSlot: 'AM',
    isAvailable: true,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await getDriverAvailability();
      if (res?.success && Array.isArray(res.data)) {
        setAvailabilities(res.data);
      } else {
        setAvailabilities([]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load availability');
      setAvailabilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Group entries by date (YYYY-MM-DD), then by timeSlot
  const getGrouped = () => {
    const dateMap = {};
    availabilities.forEach((entry) => {
      const dateKey = entry.date.split('T')[0];
      if (!dateMap[dateKey]) dateMap[dateKey] = {};
      dateMap[dateKey][entry.timeSlot] = entry;
    });
    const keys = Object.keys(dateMap).sort();
    const filtered = selectedDate ? keys.filter((d) => d === selectedDate) : keys;
    return filtered.map((date) => ({ date, slots: dateMap[date] }));
  };

  const grouped = getGrouped();

  const stats = {
    totalDates: grouped.length,
    amAvailable: availabilities.filter((a) => a.timeSlot === 'AM' && a.isAvailable).length,
    pmAvailable: availabilities.filter((a) => a.timeSlot === 'PM' && a.isAvailable).length,
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openAddForm = (prefillDate = '') => {
    setEditingEntry(null);
    setFormData({ date: prefillDate, timeSlot: 'AM', isAvailable: true, notes: '' });
    setShowForm(true);
  };

  const openEditForm = (entry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date.split('T')[0],
      timeSlot: entry.timeSlot,
      isAvailable: entry.isAvailable,
      notes: entry.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      toast.error('Please select a date');
      return;
    }
    setSubmitting(true);
    try {
      if (editingEntry) {
        await updateDriverAvailability(editingEntry.id, {
          isAvailable: formData.isAvailable,
          notes: formData.notes,
        });
        toast.success('Availability updated');
      } else {
        await createDriverAvailability({
          date: formData.date,
          timeSlot: formData.timeSlot,
          isAvailable: formData.isAvailable,
          notes: formData.notes,
        });
        toast.success('Availability saved');
      }
      setShowForm(false);
      fetchAvailability();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save availability');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDriverAvailability(id);
      toast.success('Availability entry removed');
      fetchAvailability();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete availability');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-2 sm:p-6 md:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Driver Availability
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              Set and manage your availability for delivery slots
            </p>
          </div>
          <button
            onClick={() => openAddForm()}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Set Availability
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">Total Dates</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.totalDates}
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 p-2 sm:p-3">
                <Calendar className="h-5 w-5 text-teal-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 sm:text-sm">AM Available</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.amAvailable}
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
                <p className="text-xs text-gray-600 sm:text-sm">PM Available</p>
                <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {stats.pmAvailable}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
                <Clock className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 md:max-w-md">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none sm:text-base"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={fetchAvailability}
              className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingEntry ? 'Edit Availability' : 'Set Availability'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                    disabled={!!editingEntry}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Time Slot */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Time Slot
                  </label>
                  <div className="flex gap-3">
                    {['AM', 'PM'].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        disabled={!!editingEntry}
                        onClick={() => setFormData((p) => ({ ...p, timeSlot: slot }))}
                        className={`flex-1 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${
                          formData.timeSlot === slot
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {slot === 'AM' ? '🌅 Morning (AM)' : '🌆 Afternoon (PM)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Toggle */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, isAvailable: true }))}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${
                        formData.isAvailable
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, isAvailable: false }))}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${
                        !formData.isAvailable
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <XCircle className="h-4 w-4" />
                      Not Available
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Notes <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="e.g. Personal appointment, available for all deliveries..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 py-2.5 text-sm font-medium text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {submitting ? 'Saving...' : editingEntry ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-gray-600">Loading availability...</span>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No availability set</h3>
            <p className="text-gray-600">
              {selectedDate
                ? 'No availability set for this date'
                : 'Add your first availability entry to get started'}
            </p>
            <button
              onClick={() => openAddForm(selectedDate)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Set Availability
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(({ date, slots }) => (
              <div
                key={date}
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
                        <h3 className="text-lg font-bold text-gray-900">{formatDate(date)}</h3>
                        <p className="text-sm text-gray-600">{date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slots.AM?.isAvailable && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          AM Available
                        </span>
                      )}
                      {slots.PM?.isAvailable && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          PM Available
                        </span>
                      )}
                      <button
                        onClick={() => openAddForm(date)}
                        className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-200"
                      >
                        <Plus className="h-3 w-3" />
                        Add Slot
                      </button>
                    </div>
                  </div>
                </div>

                {/* AM / PM Cards */}
                <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-2">
                  {['AM', 'PM'].map((slot) => {
                    const entry = slots[slot];
                    return (
                      <div
                        key={slot}
                        className={`rounded-lg border-2 p-4 transition-all ${
                          entry
                            ? entry.isAvailable
                              ? 'border-green-300 bg-green-50'
                              : 'border-red-200 bg-red-50'
                            : 'border-dashed border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-lg p-2 ${
                                entry
                                  ? entry.isAvailable
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                                  : 'bg-gray-100'
                              }`}
                            >
                              <Clock
                                className={`h-5 w-5 ${
                                  entry
                                    ? entry.isAvailable
                                      ? 'text-green-600'
                                      : 'text-red-400'
                                    : 'text-gray-400'
                                }`}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {slot === 'AM' ? 'Morning Slot' : 'Afternoon Slot'}
                              </p>
                              <p className="text-xs text-gray-600">
                                {slot === 'AM' ? 'Before 12:00 PM' : 'After 12:00 PM'}
                              </p>
                            </div>
                          </div>
                          {entry ? (
                            entry.isAvailable ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-400" />
                            )
                          ) : (
                            <span className="text-xs text-gray-400">Not set</span>
                          )}
                        </div>

                        {entry ? (
                          <>
                            {entry.notes && (
                              <div className="mb-3 rounded-lg bg-white/70 px-3 py-2 text-xs text-gray-600">
                                <span className="font-semibold text-gray-700">Notes: </span>
                                {entry.notes}
                              </div>
                            )}
                            <div className="mt-3 flex gap-2 border-t border-gray-200 pt-3">
                              <span
                                className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                                  entry.isAvailable
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-400 text-white'
                                }`}
                              >
                                {entry.isAvailable ? 'Available' : 'Not Available'}
                              </span>
                              <button
                                onClick={() => openEditForm(entry)}
                                className="rounded-lg bg-teal-50 p-2 text-teal-700 transition-colors hover:bg-teal-100"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                disabled={deletingId === entry.id}
                                className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === entry.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingEntry(null);
                              setFormData({ date, timeSlot: slot, isAvailable: true, notes: '' });
                              setShowForm(true);
                            }}
                            className="mt-3 w-full rounded-lg border-2 border-dashed border-teal-300 py-2 text-sm font-medium text-teal-600 transition-colors hover:border-teal-400 hover:bg-teal-50"
                          >
                            + Set {slot === 'AM' ? 'Morning' : 'Afternoon'} Availability
                          </button>
                        )}
                      </div>
                    );
                  })}
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
                  <span>
                    Set your availability in advance so the admin can allocate deliveries to you
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>You can edit or remove your availability entries at any time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAvailability;
