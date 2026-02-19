import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Minus,
  Settings,
  Package,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../../services/axiosInstance';
import Pagination from '../../../components/Pagination';

const SlotsManagement = () => {
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'date'
  const [displayMode, setDisplayMode] = useState('table'); // 'cards' or 'table'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showSetAvailabilityModal, setShowSetAvailabilityModal] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newCapacity, setNewCapacity] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);
  const [newSlotData, setNewSlotData] = useState({
    date: '',
    timeSlot: 'AM',
    maxCapacity: 10,
  });

  // Fetch slots - all or by date
  const fetchSlots = async (date = null) => {
    try {
      setLoading(true);
      setError(null);
      const url = date ? `/api/admin/slots?date=${date}` : '/api/admin/slots';
      const response = await axiosInstance.get(url);

      if (response.data.success) {
        setSlots(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError(err.response?.data?.message || 'Failed to fetch slots');
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'all') {
      fetchSlots();
    } else if (viewMode === 'date' && selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [viewMode, selectedDate]);

  // Reset pagination when slots change
  useEffect(() => {
    setCurrentPage(1);
  }, [slots.length, viewMode, selectedDate]);

  // Set slot availability
  const handleSetAvailability = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/admin/slots', {
        date: newSlotData.date,
        timeSlot: newSlotData.timeSlot,
        maxCapacity: parseInt(newSlotData.maxCapacity),
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Slot availability set successfully');
        setShowSetAvailabilityModal(false);
        // Refresh slots
        if (viewMode === 'all') {
          fetchSlots();
        } else if (newSlotData.date === selectedDate) {
          fetchSlots(selectedDate);
        }
        setNewSlotData({
          date: '',
          timeSlot: 'AM',
          maxCapacity: 10,
        });
      }
    } catch (err) {
      console.error('Error setting availability:', err);
      toast.error(err.response?.data?.message || 'Failed to set availability');
    } finally {
      setLoading(false);
    }
  };

  // Update slot capacity
  const handleUpdateCapacity = async () => {
    try {
      setLoading(true);

      // Calculate difference and determine method
      const difference = newCapacity - selectedSlot.maxCapacity;
      if (difference === 0) {
        toast.info('No changes to update');
        setShowCapacityModal(false);
        return;
      }

      const method = difference > 0 ? 'increase' : 'decrease';
      const value = Math.abs(difference);

      const response = await axiosInstance.put(`/api/admin/slots/${selectedSlot.id}/capacity`, {
        method: method,
        value: value,
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Capacity updated successfully');
        setShowCapacityModal(false);
        // Refresh based on view mode
        if (viewMode === 'all') {
          fetchSlots();
        } else {
          fetchSlots(selectedDate);
        }
      }
    } catch (err) {
      console.error('Error updating capacity:', err);
      toast.error(err.response?.data?.message || 'Failed to update capacity');
    } finally {
      setLoading(false);
    }
  };

  const openCapacityModal = (slot) => {
    setSelectedSlot(slot);
    setNewCapacity(slot.maxCapacity);
    setCustomAmount(0);
    setShowCapacityModal(true);
  };

  // Calculate statistics
  const stats = {
    totalSlots: slots.length,
    totalCapacity: slots.reduce((sum, slot) => sum + slot.maxCapacity, 0),
    totalBooked: slots.reduce((sum, slot) => sum + slot.booked, 0),
    totalAvailable: slots.reduce((sum, slot) => sum + (slot.maxCapacity - slot.booked), 0),
  };

  const getSlotStatusColor = (slot) => {
    if (slot.isFull) return 'bg-red-100 text-red-800 border-red-200';
    const availablePercent = ((slot.maxCapacity - slot.booked) / slot.maxCapacity) * 100;
    if (availablePercent > 50) return 'bg-green-100 text-green-800 border-green-200';
    if (availablePercent > 25) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  // Sort and paginate slots
  const sortedSlots = [...slots].sort((a, b) => {
    const dateCompare = new Date(a.date) - new Date(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.timeSlot === 'AM' ? -1 : 1;
  });

  const totalPages = Math.ceil(sortedSlots.length / itemsPerPage) || 1;

  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedSlots = sortedSlots.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  // Handle page change (only change page)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const SlotCard = ({ slot }) => {
    const available = slot.maxCapacity - slot.booked;
    const utilization = ((slot.booked / slot.maxCapacity) * 100).toFixed(0);

    return (
      <div
        className={`rounded-lg border-2 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6 ${getSlotStatusColor(slot)}`}
      >
        {/* Time Slot Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="rounded-full bg-white p-2 shadow-sm">
              <Clock className="h-5 w-5 text-teal-600 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{slot.timeSlot}</h3>
              <p className="text-xs text-gray-600 sm:text-sm">
                {new Date(slot.date).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
          {slot.isFull ? (
            <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white sm:px-3 sm:text-sm">
              FULL
            </span>
          ) : (
            <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white sm:px-3 sm:text-sm">
              AVAILABLE
            </span>
          )}
        </div>

        {/* Capacity Stats */}
        <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-lg bg-white p-2 text-center shadow-sm sm:p-3">
            <p className="text-xs text-gray-600 sm:text-sm">Capacity</p>
            <p className="text-lg font-bold text-teal-600 sm:text-2xl">{slot.maxCapacity}</p>
          </div>
          <div className="rounded-lg bg-white p-2 text-center shadow-sm sm:p-3">
            <p className="text-xs text-gray-600 sm:text-sm">Booked</p>
            <p className="text-lg font-bold text-blue-600 sm:text-2xl">{slot.booked}</p>
          </div>
          <div className="rounded-lg bg-white p-2 text-center shadow-sm sm:p-3">
            <p className="text-xs text-gray-600 sm:text-sm">Available</p>
            <p className="text-lg font-bold text-green-600 sm:text-2xl">{available}</p>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-gray-700">Utilization</span>
            <span className="font-bold text-gray-900">{utilization}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 sm:h-3">
            <div
              className={`h-full transition-all ${
                utilization >= 90
                  ? 'bg-red-600'
                  : utilization >= 70
                    ? 'bg-orange-500'
                    : utilization >= 50
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
              }`}
              style={{ width: `${utilization}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => openCapacityModal(slot)}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg sm:text-base"
        >
          <Settings className="h-4 w-4" />
          <span>Update Capacity</span>
        </button>

        {/* Last Updated */}
        <p className="mt-3 text-center text-xs text-gray-500">
          Updated: {new Date(slot.updatedAt).toLocaleString('en-GB')}
        </p>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Slot Management
              </h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                Manage delivery time slots and capacity
              </p>
            </div>
            <button
              onClick={() => setShowSetAvailabilityModal(true)}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg sm:w-auto sm:px-6"
            >
              <Plus className="h-5 w-5" />
              <span>Set Availability</span>
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
        {!loading && !error && slots.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">Total Slots</p>
                  <p className="text-xl font-bold text-gray-900 sm:text-2xl">{stats.totalSlots}</p>
                </div>
                <Package className="h-8 w-8 text-teal-600 sm:h-10 sm:w-10" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">Total Capacity</p>
                  <p className="text-xl font-bold text-blue-600 sm:text-2xl">
                    {stats.totalCapacity}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600 sm:h-10 sm:w-10" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">Booked</p>
                  <p className="text-xl font-bold text-orange-600 sm:text-2xl">
                    {stats.totalBooked}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600 sm:h-10 sm:w-10" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">Available</p>
                  <p className="text-xl font-bold text-green-600 sm:text-2xl">
                    {stats.totalAvailable}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600 sm:h-10 sm:w-10" />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-sm">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-3 text-gray-600">Loading slots...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6">
            <div className="flex items-start">
              <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <h3 className="text-base font-semibold text-red-900">Error Loading Slots</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => (viewMode === 'all' ? fetchSlots() : fetchSlots(selectedDate))}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slots Display */}
        {!loading && !error && slots.length > 0 && (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {paginatedSlots.map((slot) => {
                  const available = slot.maxCapacity - slot.booked;
                  const utilization = ((slot.booked / slot.maxCapacity) * 100).toFixed(0);
                  return (
                    <div
                      key={slot.id}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between bg-linear-to-r from-teal-600 to-teal-500 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-white" />
                          <span className="text-sm font-semibold text-white">
                            {new Date(slot.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            slot.timeSlot === 'AM'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {slot.timeSlot}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="space-y-3 p-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Capacity</p>
                            <p className="text-lg font-bold text-gray-900">{slot.maxCapacity}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Booked</p>
                            <p className="text-lg font-bold text-orange-600">{slot.booked}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Available</p>
                            <p className="text-lg font-bold text-green-600">{available}</p>
                          </div>
                        </div>

                        {/* Utilization Bar */}
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">Utilization</span>
                            <span className="text-xs font-semibold text-gray-900">
                              {utilization}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full transition-all ${
                                utilization > 75
                                  ? 'bg-red-500'
                                  : utilization > 50
                                    ? 'bg-orange-500'
                                    : utilization > 25
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                              }`}
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                        </div>

                        {/* Status and Action */}
                        <div className="flex items-center justify-between pt-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              slot.isFull
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {slot.isFull ? 'FULL' : 'AVAILABLE'}
                          </span>
                          <button
                            onClick={() => openCapacityModal(slot)}
                            className="inline-flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            <span>Update</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={validCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={sortedSlots.length}
                  />
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              {displayMode === 'cards' ? (
                viewMode === 'all' ? (
                  // Group by date when showing all slots
                  <div className="space-y-6">
                    {Object.entries(
                      slots.reduce((acc, slot) => {
                        const dateKey = new Date(slot.date).toISOString().split('T')[0];
                        if (!acc[dateKey]) acc[dateKey] = [];
                        acc[dateKey].push(slot);
                        return acc;
                      }, {})
                    )
                      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                      .map(([date, dateSlots]) => (
                        <div key={date} className="space-y-4">
                          <div className="flex items-center space-x-3 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-3 shadow-md">
                            <Calendar className="h-5 w-5 text-white" />
                            <h3 className="text-lg font-bold text-white">
                              {new Date(date).toLocaleDateString('en-GB', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </h3>
                            <span className="ml-auto rounded-full bg-white px-3 py-1 text-sm font-semibold text-teal-600">
                              {dateSlots.length} {dateSlots.length === 1 ? 'Slot' : 'Slots'}
                            </span>
                          </div>
                          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
                            {dateSlots
                              .sort((a) => (a.timeSlot === 'AM' ? -1 : 1))
                              .map((slot) => (
                                <SlotCard key={slot.id} slot={slot} />
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  // Single date view
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8">
                    {slots.map((slot) => (
                      <SlotCard key={slot.id} slot={slot} />
                    ))}
                  </div>
                )
              ) : (
                // Table View
                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Time
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Capacity
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Booked
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Available
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Utilization
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Status
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-700 uppercase sm:px-6">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {paginatedSlots.map((slot) => {
                          const available = slot.maxCapacity - slot.booked;
                          const utilization = ((slot.booked / slot.maxCapacity) * 100).toFixed(0);
                          return (
                            <tr key={slot.id} className="transition-colors hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900 sm:px-6">
                                {new Date(slot.date).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    slot.timeSlot === 'AM'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {slot.timeSlot}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap text-gray-900 sm:px-6">
                                {slot.maxCapacity}
                              </td>
                              <td className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap text-orange-600 sm:px-6">
                                {slot.booked}
                              </td>
                              <td className="px-4 py-4 text-center text-sm font-semibold whitespace-nowrap text-green-600 sm:px-6">
                                {available}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                <div className="flex flex-col items-center space-y-1">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {utilization}%
                                  </span>
                                  <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                      className={`h-full transition-all ${
                                        utilization > 75
                                          ? 'bg-red-500'
                                          : utilization > 50
                                            ? 'bg-orange-500'
                                            : utilization > 25
                                              ? 'bg-yellow-500'
                                              : 'bg-green-500'
                                      }`}
                                      style={{ width: `${utilization}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center whitespace-nowrap sm:px-6">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    slot.isFull
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {slot.isFull ? 'FULL' : 'AVAILABLE'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center whitespace-nowrap sm:px-6">
                                <button
                                  onClick={() => openCapacityModal(slot)}
                                  className="inline-flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                                >
                                  <Settings className="h-3.5 w-3.5" />
                                  <span>Update</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination inside table container */}
                  {totalPages > 1 && (
                    <div className="border-t border-gray-200 px-0 py-0">
                      <Pagination
                        currentPage={validCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={sortedSlots.length}
                        compact
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* No Slots Message */}
        {!loading && !error && slots.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <Clock className="mx-auto h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No slots found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {viewMode === 'all'
                ? 'No slots have been created yet. Set availability to create slots.'
                : 'No slots are available for the selected date. Set availability to create slots.'}
            </p>
          </div>
        )}
      </div>

      {/* Set Availability Modal */}
      {showSetAvailabilityModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowSetAvailabilityModal(false);
          }}
        >
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Set Slot Availability
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Create or update slot for a specific date and time
              </p>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 p-4 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={newSlotData.date}
                  onChange={(e) => setNewSlotData({ ...newSlotData, date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Time Slot</label>
                <select
                  value={newSlotData.timeSlot}
                  onChange={(e) => setNewSlotData({ ...newSlotData, timeSlot: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Max Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={newSlotData.maxCapacity}
                  onChange={(e) => setNewSlotData({ ...newSlotData, maxCapacity: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 border-t border-gray-200 p-4 sm:p-6">
              <button
                onClick={() => setShowSetAvailabilityModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSetAvailability}
                disabled={!newSlotData.date || loading}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Setting...' : 'Set Availability'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Capacity Modal */}
      {showCapacityModal && selectedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCapacityModal(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Update Slot Capacity</h2>
                  <div className="mt-2 inline-flex items-center rounded-lg bg-teal-100 px-3 py-1.5">
                    <Clock className="mr-2 h-4 w-4 text-teal-600" />
                    <span className="text-base font-[700] text-teal-900">
                      {selectedSlot.timeSlot} Slot -{' '}
                      {new Date(selectedSlot.date).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCapacityModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-6">
              {/* Current Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="text-base text-gray-600">Current Capacity</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {selectedSlot.maxCapacity}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                  <p className="text-base text-gray-600">Booked</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{selectedSlot.booked}</p>
                </div>
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-center">
                  <p className="text-base text-teal-700">Available</p>
                  <p className="mt-1 text-2xl font-bold text-teal-600">
                    {selectedSlot.maxCapacity - selectedSlot.booked}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-base font-medium text-gray-700">
                  Custom Amount (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  value={customAmount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setCustomAmount(Math.max(0, val));
                  }}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 text-center text-lg font-semibold focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="0"
                />
                <p className="mt-2 text-center text-sm text-gray-600">
                  Leave 0 to adjust by 1, or enter amount for bulk changes
                </p>
              </div>

              <div>
                <label className="mb-3 block text-base font-medium text-gray-700">
                  Adjust Capacity
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      const amount = customAmount || 1;
                      setNewCapacity((prev) => Math.max(selectedSlot.booked, prev - amount));
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-red-50 px-6 py-3 text-base font-medium text-red-700 transition-all hover:border-red-400 hover:bg-red-100"
                  >
                    <Minus className="h-5 w-5" />
                    <span>Decrease {customAmount > 0 ? `by ${customAmount}` : ''}</span>
                  </button>
                  <button
                    onClick={() => {
                      const amount = customAmount || 1;
                      setNewCapacity((prev) => prev + amount);
                    }}
                    className="flex items-center justify-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 px-6 py-3 text-base font-medium text-green-700 transition-all hover:border-green-400 hover:bg-green-100"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Increase {customAmount > 0 ? `by ${customAmount}` : ''}</span>
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg border-2 border-teal-200 bg-teal-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold text-teal-900">New Capacity:</p>
                  <p className="text-3xl font-bold text-teal-600">{newCapacity}</p>
                </div>
                <p className="mt-2 text-base text-teal-800">
                  {newCapacity > selectedSlot.maxCapacity
                    ? `Increasing by ${newCapacity - selectedSlot.maxCapacity}`
                    : newCapacity < selectedSlot.maxCapacity
                      ? `Decreasing by ${selectedSlot.maxCapacity - newCapacity}`
                      : 'No change'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowCapacityModal(false)}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCapacity}
                disabled={loading || newCapacity === selectedSlot.maxCapacity}
                className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2.5 text-base font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Update Capacity
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsManagement;
