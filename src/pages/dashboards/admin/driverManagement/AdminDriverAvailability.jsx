import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Sunrise,
  Sunset,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  X,
  User,
} from 'lucide-react';
import {
  getAdminDriverAvailability,
  getAdminDriverAvailabilityById,
} from '../../../../services/driverService';
import axiosInstance from '../../../../services/axiosInstance';

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

const formatFullDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const AdminDriverAvailability = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState(null);
  const [singleData, setSingleData] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(true);

  const selectedDriverId = searchParams.get('driver') ? Number(searchParams.get('driver')) : null;
  const dateFilter = searchParams.get('date') ?? '';

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axiosInstance.get('/api/admin/users?role=DRIVER');
        if (res.data.success) {
          setDrivers(res.data.data.map((d) => ({ id: d.id, name: d.fullName || d.username })));
        }
      } catch {
        /* non-critical */
      } finally {
        setDriversLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (selectedDriverId) {
        const res = await getAdminDriverAvailabilityById(selectedDriverId);
        if (res.success) {
          setSingleData(res);
          setAllData(null);
        }
      } else {
        const res = await getAdminDriverAvailability();
        if (res.success) {
          setAllData(res);
          setSingleData(null);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load availability data');
    } finally {
      setLoading(false);
    }
  }, [selectedDriverId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setDriverFilter = (id) => {
    const p = new URLSearchParams(searchParams);
    if (id) p.set('driver', id);
    else p.delete('driver');
    p.delete('date');
    setSearchParams(p, { replace: true });
  };

  const setDateFilter = (val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set('date', val);
    else p.delete('date');
    setSearchParams(p, { replace: true });
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  const hasFilters = Boolean(selectedDriverId || dateFilter);

  const getRawData = () => {
    const src = selectedDriverId ? singleData?.data : allData?.data;
    if (!src) return [];
    return dateFilter ? src.filter((e) => e.date.split('T')[0] === dateFilter) : src;
  };

  const getGroupedByDate = (data) => {
    const map = {};
    data.forEach((entry) => {
      const d = entry.date.split('T')[0];
      if (!map[d]) map[d] = [];
      map[d].push(entry);
    });
    return Object.keys(map)
      .sort()
      .map((d) => ({ date: d, entries: map[d] }));
  };

  const rawData = getRawData();
  const totalSlots = rawData.length;
  const available = rawData.filter((e) => e.isAvailable).length;
  const unavailable = totalSlots - available;
  const uniqueDriverCount = new Set(rawData.map((e) => e.driverId)).size;
  const groupedData = getGroupedByDate(rawData);

  const singleGroupedData = selectedDriverId
    ? Object.values(
        rawData.reduce((acc, entry) => {
          const d = entry.date.split('T')[0];
          if (!acc[d]) acc[d] = { date: d, AM: null, PM: null };
          acc[d][entry.timeSlot] = entry;
          return acc;
        }, {})
      ).sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const driverInfo = singleData?.driver;
  const displayName = driverInfo?.fullName || drivers.find((d) => d.id === selectedDriverId)?.name;

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-5">
        {/* ── Header ── */}
        <div>
          <button
            onClick={() => navigate('/admin/drivers')}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Drivers
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {selectedDriverId && displayName
                  ? `${displayName}'s Schedule`
                  : 'Driver Availability'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {selectedDriverId
                  ? 'Individual availability schedule for this driver'
                  : 'Overview of all driver availability, grouped by date'}
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-teal-300 hover:text-teal-600 disabled:opacity-50 sm:self-start"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Driver Profile Banner (single driver view) ── */}
        {selectedDriverId && driverInfo && !loading && (
          <div className="flex items-center gap-4 rounded-xl border border-teal-100 bg-linear-to-r from-teal-50 to-white p-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm">
              {getInitials(driverInfo.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900">{driverInfo.fullName}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-gray-500">
                {driverInfo.email && <span>{driverInfo.email}</span>}
                {driverInfo.phone && <span>{driverInfo.phone}</span>}
                {driverInfo.driverProfile?.vehicleRegistration && (
                  <span className="rounded-md bg-teal-100 px-2 py-0.5 font-semibold text-teal-700">
                    {driverInfo.driverProfile.vehicleRegistration}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={clearFilters}
              title="View all drivers"
              className="shrink-0 rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Stats ── */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-500">Total Slots</p>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalSlots}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-500">
                  {selectedDriverId ? 'Dates' : 'Drivers'}
                </p>
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {selectedDriverId ? groupedData.length : uniqueDriverCount}
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <CheckCircle className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{available}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-500">Unavailable</p>
                <XCircle className="h-4 w-4 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{unavailable}</p>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <label className="block text-sm font-medium text-gray-500">Filter by Driver</label>
              <div className="relative">
                <select
                  value={selectedDriverId ?? ''}
                  disabled={driversLoading}
                  onChange={(e) => setDriverFilter(e.target.value ? Number(e.target.value) : null)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pr-9 pl-3 text-sm text-gray-700 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none disabled:opacity-50"
                >
                  <option value="">All Drivers</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="block text-sm font-medium text-gray-500">Filter by Date</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm text-gray-700 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 sm:shrink-0"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Main Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-24 shadow-sm">
            <div className="rounded-full bg-teal-50 p-4">
              <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-gray-600">Loading availability</p>
              <p className="mt-0.5 text-sm text-gray-400">Please wait a moment…</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-6 w-6 text-red-400" />
            </div>
            <p className="mt-3 text-base font-semibold text-gray-800">Something went wrong</p>
            <p className="mt-1 text-sm text-gray-400">{error}</p>
            <button
              onClick={fetchData}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </button>
          </div>
        ) : selectedDriverId ? (
          /* ── Individual Driver Schedule ── */
          singleGroupedData.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-7 w-7 text-gray-300" />
              </div>
              <p className="mt-4 text-base font-semibold text-gray-600">No availability set</p>
              <p className="mt-1 text-sm text-gray-400">
                {dateFilter
                  ? 'No entries for the selected date'
                  : "This driver hasn't set any availability yet"}
              </p>
              {dateFilter && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-teal-600 hover:underline"
                >
                  Clear date filter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {singleGroupedData.map(({ date, AM, PM }) => (
                <div
                  key={date}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Date header */}
                  <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-3.5">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                      <span className="text-base leading-none font-bold">
                        {new Date(date + 'T00:00:00').getDate()}
                      </span>
                      <span className="mt-0.5 text-[8px] font-semibold tracking-wider uppercase opacity-80">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-gray-800">
                        {formatFullDate(date)}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-400">
                        {[AM, PM].filter(Boolean).length} of 2 slots set
                        {' · '}
                        <span className="text-green-600">
                          {[AM, PM].filter((e) => e?.isAvailable).length} available
                        </span>
                        {[AM, PM].some((e) => e && !e.isAvailable) && (
                          <span className="text-red-500">
                            {' · '}
                            {[AM, PM].filter((e) => e && !e.isAvailable).length} unavailable
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* AM / PM side by side */}
                  <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    {[
                      { slot: 'AM', entry: AM },
                      { slot: 'PM', entry: PM },
                    ].map(({ slot, entry }) => (
                      <div key={slot} className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                              slot === 'AM' ? 'bg-amber-50' : 'bg-indigo-50'
                            }`}
                          >
                            {slot === 'AM' ? (
                              <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                            ) : (
                              <Sunset className="h-3.5 w-3.5 text-indigo-500" />
                            )}
                          </div>
                          <span className="text-base font-medium text-gray-700">
                            {slot === 'AM' ? 'Morning (AM)' : 'Afternoon (PM)'}
                          </span>
                        </div>
                        {entry ? (
                          <div
                            className={`rounded-lg border px-4 py-3 ${
                              entry.isAvailable
                                ? 'border-green-200 bg-green-50'
                                : 'border-red-200 bg-red-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {entry.isAvailable ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span
                                className={`text-base font-semibold ${
                                  entry.isAvailable ? 'text-green-700' : 'text-red-600'
                                }`}
                              >
                                {entry.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            {entry.notes && (
                              <p className="mt-2 border-t border-gray-200 pt-2 text-sm text-gray-500 italic">
                                &ldquo;{entry.notes}&rdquo;
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-sm text-gray-400">Not set</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : /* ── All Drivers View ── */
        groupedData.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-7 w-7 text-gray-300" />
            </div>
            <p className="mt-4 text-base font-semibold text-gray-600">No records found</p>
            <p className="mt-1 text-sm text-gray-400">
              {dateFilter ? 'Try adjusting your filters' : 'No availability has been set yet'}
            </p>
            {dateFilter && (
              <button
                onClick={clearFilters}
                className="mt-4 text-xs font-medium text-teal-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedData.map(({ date, entries }) => (
              <div
                key={date}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Date header */}
                <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/70 px-5 py-3.5">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                    <span className="text-base leading-none font-bold">
                      {new Date(date + 'T00:00:00').getDate()}
                    </span>
                    <span className="mt-0.5 text-[8px] font-semibold tracking-wider uppercase opacity-80">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-gray-800">{formatFullDate(date)}</p>
                    <p className="mt-0.5 text-sm text-gray-400">
                      {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                      {' · '}
                      <span className="text-green-600">
                        {entries.filter((e) => e.isAvailable).length} available
                      </span>
                      {entries.some((e) => !e.isAvailable) && (
                        <span className="text-red-500">
                          {' · '}
                          {entries.filter((e) => !e.isAvailable).length} unavailable
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Entry rows */}
                <div className="divide-y divide-gray-100">
                  {entries.map((entry) => {
                    const driverName = entry.driver?.fullName ?? '—';
                    const vehicleReg = entry.driver?.driverProfile?.vehicleRegistration;
                    const initials = getInitials(driverName);
                    const isAM = entry.timeSlot === 'AM';

                    return (
                      <button
                        key={entry.id}
                        onClick={() => entry.driver && setDriverFilter(entry.driver.id)}
                        className="flex w-full flex-col gap-3 px-5 py-4 text-left transition-colors hover:bg-teal-50/40 sm:flex-row sm:items-center"
                      >
                        {/* Driver avatar + name */}
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-gray-800">
                              {driverName}
                            </p>
                            {vehicleReg && (
                              <span className="text-sm text-gray-400">{vehicleReg}</span>
                            )}
                          </div>
                        </div>

                        {/* Slot + Status + Notes + Arrow */}
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
                              isAM
                                ? 'border-amber-200 bg-amber-50 text-amber-700'
                                : 'border-indigo-200 bg-indigo-50 text-indigo-700'
                            }`}
                          >
                            {isAM ? (
                              <Sunrise className="h-3 w-3" />
                            ) : (
                              <Sunset className="h-3 w-3" />
                            )}
                            {isAM ? 'Morning (AM)' : 'Afternoon (PM)'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
                              entry.isAvailable
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-red-200 bg-red-50 text-red-600'
                            }`}
                          >
                            {entry.isAvailable ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {entry.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                          {entry.notes && (
                            <p className="hidden max-w-48 truncate text-sm text-gray-400 italic lg:block">
                              &ldquo;{entry.notes}&rdquo;
                            </p>
                          )}
                          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDriverAvailability;
