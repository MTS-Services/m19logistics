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
  Sunrise,
  Sunset,
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
    // Auto-detect which slot is missing for the given date
    let defaultSlot = 'AM';
    if (prefillDate) {
      const existingSlots = availabilities
        .filter((a) => a.date.split('T')[0] === prefillDate)
        .map((a) => a.timeSlot);
      if (existingSlots.includes('AM') && !existingSlots.includes('PM')) {
        defaultSlot = 'PM';
      }
    }
    setFormData({ date: prefillDate, timeSlot: defaultSlot, isAvailable: true, notes: '' });
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
          notes: formData.notes.trim(),
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
    <div className="p-3 sm:p-6 lg:p-8">
      <div className="space-y-5">
        {/* ── Page Header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-linear-to-r from-teal-600 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            Set Availability
          </button>
        </div>

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Dates */}
          <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-linear-to-r from-teal-500 to-teal-400" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  Total Dates
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalDates}</p>
                <p className="mt-0.5 text-xs text-gray-400">scheduled entries</p>
              </div>
              <div className="rounded-xl bg-teal-50 p-3">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          {/* AM Available */}
          <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-linear-to-r from-green-500 to-emerald-400" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  AM Available
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.amAvailable}</p>
                <p className="mt-0.5 text-xs text-gray-400">morning slots</p>
              </div>
              <div className="rounded-xl bg-green-50 p-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* PM Available */}
          <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-linear-to-r from-blue-500 to-blue-400" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                  PM Available
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.pmAvailable}</p>
                <p className="mt-0.5 text-xs text-gray-400">afternoon slots</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
              <div className="relative flex-1">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-9 text-sm text-gray-700 transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={fetchAvailability}
              className="flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Add / Edit Modal ── */}
        {showForm && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
            }}
          >
            <div className="w-full overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
              {/* Accent bar */}
              <div className="h-1 bg-linear-to-r from-teal-600 to-teal-400" />

              <div className="p-5 sm:p-6">
                {/* Modal Header */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingEntry ? 'Edit Availability' : 'Set Availability'}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {editingEntry
                        ? 'Update your availability status or notes'
                        : 'Add a new availability slot'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                      disabled={!!editingEntry}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Time Slot
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {['AM', 'PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          disabled={!!editingEntry}
                          onClick={() => setFormData((p) => ({ ...p, timeSlot: slot }))}
                          className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                            formData.timeSlot === slot
                              ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {slot === 'AM' ? (
                            <Sunrise className="h-5 w-5" />
                          ) : (
                            <Sunset className="h-5 w-5" />
                          )}
                          <span>{slot === 'AM' ? 'Morning' : 'Afternoon'}</span>
                          <span className="text-xs font-normal opacity-60">
                            {slot === 'AM' ? 'Before 12 PM' : 'After 12 PM'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, isAvailable: true }))}
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                          formData.isAvailable
                            ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Available
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, isAvailable: false }))}
                        className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                          !formData.isAvailable
                            ? 'border-red-400 bg-red-50 text-red-600 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <XCircle className="h-4 w-4" />
                        Not Available
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      Notes
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal tracking-normal text-gray-400 normal-case">
                        optional
                      </span>
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                      placeholder="e.g. Personal appointment, available for all deliveries..."
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-teal-600 to-teal-500 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {submitting ? 'Saving...' : editingEntry ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            <p className="text-sm text-gray-400">Loading availability...</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
              <Calendar className="h-9 w-9 text-teal-400" />
            </div>
            <h3 className="mb-1.5 text-lg font-bold text-gray-900">No availability set</h3>
            <p className="text-sm text-gray-400">
              {selectedDate
                ? 'No availability set for this date'
                : 'Add your first availability entry to get started'}
            </p>
            <button
              onClick={() => openAddForm(selectedDate)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
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
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Date Header */}
                <div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 shadow-sm">
                        <span className="text-sm font-bold text-white">
                          {new Date(date + 'T00:00:00').getDate()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                          {formatDate(date)}
                        </h3>
                        <p className="text-xs text-gray-400">{date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {slots.AM?.isAvailable && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          AM
                        </span>
                      )}
                      {slots.PM?.isAvailable && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          PM
                        </span>
                      )}
                      {!(slots.AM && slots.PM) && (
                        <button
                          onClick={() => openAddForm(date)}
                          className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
                        >
                          <Plus className="h-3 w-3" />
                          Add Slot
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* AM / PM Cards */}
                <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                  {['AM', 'PM'].map((slot) => {
                    const entry = slots[slot];
                    return (
                      <div
                        key={slot}
                        className={`rounded-xl border p-4 transition-all ${
                          entry
                            ? entry.isAvailable
                              ? 'border-green-200 bg-green-50/60'
                              : 'border-red-200 bg-red-50/60'
                            : 'border-dashed border-gray-200 bg-gray-50/60'
                        }`}
                      >
                        {/* Slot Header */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                entry
                                  ? entry.isAvailable
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                                  : 'bg-gray-100'
                              }`}
                            >
                              {slot === 'AM' ? (
                                <Sunrise
                                  className={`h-5 w-5 ${
                                    entry
                                      ? entry.isAvailable
                                        ? 'text-green-600'
                                        : 'text-red-400'
                                      : 'text-gray-400'
                                  }`}
                                />
                              ) : (
                                <Sunset
                                  className={`h-5 w-5 ${
                                    entry
                                      ? entry.isAvailable
                                        ? 'text-green-600'
                                        : 'text-red-400'
                                      : 'text-gray-400'
                                  }`}
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {slot === 'AM' ? 'Morning Slot' : 'Afternoon Slot'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {slot === 'AM' ? 'Before 12:00 PM' : 'After 12:00 PM'}
                              </p>
                            </div>
                          </div>
                          {entry ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                entry.isAvailable
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {entry.isAvailable ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Available
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3" />
                                  Unavailable
                                </>
                              )}
                            </span>
                          ) : (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-400">
                              Not set
                            </span>
                          )}
                        </div>

                        {entry ? (
                          <>
                            {entry.notes && (
                              <div className="mb-3 rounded-lg border border-gray-100 bg-white/80 px-3 py-2 text-xs text-gray-500">
                                <span className="font-semibold text-gray-600">Notes: </span>
                                {entry.notes}
                              </div>
                            )}
                            <div className="mt-3 flex gap-2 border-t border-gray-200/70 pt-3">
                              <button
                                onClick={() => openEditForm(entry)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 py-2 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                disabled={deletingId === entry.id}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                              >
                                {deletingId === entry.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                {deletingId === entry.id ? 'Removing...' : 'Remove'}
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
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-teal-200 py-3 text-sm font-medium text-teal-500 transition-all hover:border-teal-400 hover:bg-teal-50 hover:text-teal-600"
                          >
                            <Plus className="h-4 w-4" />
                            Set {slot === 'AM' ? 'Morning' : 'Afternoon'} Slot
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

        {/* ── Info Box ── */}
        <div className="rounded-xl border border-teal-100 bg-linear-to-br from-teal-50 to-white p-5">
          <div className="flex items-start gap-3">
            <div>
              <p className="mb-2.5 text-base font-bold text-teal-900">Availability Guidelines</p>
              <ul className="space-y-2">
                {[
                  { label: 'Morning Slots (AM)', desc: 'Deliveries scheduled before 12:00 PM' },
                  { label: 'Afternoon Slots (PM)', desc: 'Deliveries scheduled after 12:00 PM' },
                  {
                    label: 'Plan ahead',
                    desc: 'Set your availability in advance so admin can allocate deliveries',
                  },
                  {
                    label: 'Flexible',
                    desc: 'You can edit or remove your availability entries at any time',
                  },
                ].map(({ label, desc }) => (
                  <li key={label} className="flex items-start gap-2 text-base text-teal-700">
                    <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-teal-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                    </span>
                    <span>
                      <strong>{label}:</strong> {desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAvailability;
