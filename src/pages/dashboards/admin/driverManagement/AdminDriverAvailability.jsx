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
  X,
} from 'lucide-react';
import {
  getAdminDriverAvailability,
  getAdminDriverAvailabilityById,
} from '../../../../services/driverService';
import axiosInstance from '../../../../services/axiosInstance';

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

  // Fetch the drivers list for the dropdown
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

  const setDriver = (id) => {
    const p = new URLSearchParams(searchParams);
    if (id) p.set('driver', id);
    else p.delete('driver');
    p.delete('date');
    setSearchParams(p, { replace: true });
  };

  const setDate = (val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set('date', val);
    else p.delete('date');
    setSearchParams(p, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Group all-drivers data: date → { AM: [], PM: [] }
  const getGroupedAll = () => {
    if (!allData?.grouped) return [];
    const dateMap = {};
    allData.grouped.forEach(({ date, timeSlot, drivers: drvs }) => {
      const d = date.split('T')[0];
      if (!dateMap[d]) dateMap[d] = { date: d, AM: [], PM: [] };
      dateMap[d][timeSlot] = drvs;
    });
    let keys = Object.keys(dateMap).sort();
    if (dateFilter) keys = keys.filter((k) => k === dateFilter);
    return keys.map((k) => dateMap[k]);
  };

  // Group single-driver data: date → { AM: entry|null, PM: entry|null }
  const getGroupedSingle = () => {
    if (!singleData?.data) return [];
    const dateMap = {};
    singleData.data.forEach((entry) => {
      const d = entry.date.split('T')[0];
      if (!dateMap[d]) dateMap[d] = { date: d, AM: null, PM: null };
      dateMap[d][entry.timeSlot] = entry;
    });
    let keys = Object.keys(dateMap).sort();
    if (dateFilter) keys = keys.filter((k) => k === dateFilter);
    return keys.map((k) => dateMap[k]);
  };

  const sourceData = selectedDriverId ? singleData?.data : allData?.data;
  const totalSlots = selectedDriverId ? (singleData?.count ?? 0) : (allData?.count ?? 0);
  const available = sourceData ? sourceData.filter((e) => e.isAvailable).length : 0;
  const unavailable = totalSlots - available;

  const displayDriverName =
    singleData?.driver?.fullName || drivers.find((d) => d.id === selectedDriverId)?.name;

  const groupedAll = getGroupedAll();
  const groupedSingle = getGroupedSingle();
  const hasFilters = selectedDriverId || dateFilter;

  return (
    <div className="p-3 sm:p-6">
      <div className="space-y-5">
        {/* ── Header ── */}
        <div>
          <button
            onClick={() => navigate('/admin/drivers')}
            className="mb-2 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Drivers
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                {selectedDriverId && displayDriverName
                  ? `${displayDriverName}'s Availability`
                  : 'Driver Availability'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {selectedDriverId
                  ? 'Viewing individual schedule for this driver'
                  : 'Availability overview for all drivers, grouped by date'}
              </p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-teal-300 hover:text-teal-700 sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Driver</label>
              <div className="relative">
                <select
                  value={selectedDriverId ?? ''}
                  disabled={driversLoading}
                  onChange={(e) => setDriver(e.target.value ? Number(e.target.value) : null)}
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Date</label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-9 text-sm text-gray-700 transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                />
              </div>
            </div>

            {hasFilters && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Cards ── */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                    Total Slots
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{totalSlots}</p>
                  <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">recorded entries</p>
                </div>
                <div className="shrink-0 rounded-lg bg-gray-100 p-2 sm:p-2.5">
                  <Calendar className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">Available</p>
                  <p className="mt-1 text-2xl font-bold text-green-600 sm:text-3xl">{available}</p>
                  <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">open slots</p>
                </div>
                <div className="shrink-0 rounded-lg bg-green-100 p-2 sm:p-2.5">
                  <CheckCircle className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 sm:text-sm">
                    Unavailable
                  </p>
                  <p className="mt-1 text-2xl font-bold text-red-500 sm:text-3xl">{unavailable}</p>
                  <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">blocked slots</p>
                </div>
                <div className="shrink-0 rounded-lg bg-red-100 p-2 sm:p-2.5">
                  <XCircle className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white py-24 shadow-sm">
            <div className="rounded-full bg-teal-50 p-4">
              <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Loading availability</p>
              <p className="mt-0.5 text-xs text-gray-400">Please wait a moment…</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-800">Failed to load data</p>
            <p className="mt-1 text-xs text-gray-500">{error}</p>
            <button
              onClick={fetchData}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : selectedDriverId ? (
          /* ── Single Driver View ── */
          groupedSingle.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-7 w-7 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-700">No availability records</p>
              <p className="mt-1 text-xs text-gray-400">
                This driver hasn't set any availability yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedSingle.map(({ date, AM, PM }) => (
                <div
                  key={date}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* Date header */}
                  <div className="flex items-center gap-4 border-b border-gray-100 px-5 py-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-600 text-white">
                      <span className="text-lg leading-none font-bold">
                        {new Date(date + 'T00:00:00').getDate()}
                      </span>
                      <span className="mt-0.5 text-[9px] font-semibold tracking-wide uppercase opacity-80">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">{date}</p>
                    </div>
                  </div>

                  {/* AM / PM slots */}
                  <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    {[
                      { slot: 'AM', entry: AM },
                      { slot: 'PM', entry: PM },
                    ].map(({ slot, entry }) => (
                      <div key={slot} className="p-5">
                        <div className="mb-3 flex items-center gap-2">
                          {slot === 'AM' ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
                              <Sunrise className="h-3.5 w-3.5 text-orange-500" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
                              <Sunset className="h-3.5 w-3.5 text-indigo-500" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700">
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
                                className={`text-sm font-semibold ${
                                  entry.isAvailable ? 'text-green-700' : 'text-red-600'
                                }`}
                              >
                                {entry.isAvailable ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            {entry.notes && (
                              <p className="mt-2 border-t border-current/10 pt-2 text-xs text-gray-500 italic">
                                "{entry.notes}"
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
        groupedAll.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-7 w-7 text-gray-400" />
            </div>
            <p className="mt-4 text-sm font-semibold text-gray-700">No availability records</p>
            <p className="mt-1 text-xs text-gray-400">No drivers have set their availability yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groupedAll.map(({ date, AM, PM }) => (
              <div
                key={date}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Date header */}
                <div className="flex items-center gap-4 border-b border-gray-100 px-5 py-4">
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-teal-600 text-white">
                    <span className="text-lg leading-none font-bold">
                      {new Date(date + 'T00:00:00').getDate()}
                    </span>
                    <span className="mt-0.5 text-[9px] font-semibold tracking-wide uppercase opacity-80">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {AM.length + PM.length} slot{AM.length + PM.length !== 1 ? 's' : ''} recorded
                    </p>
                  </div>
                </div>

                {/* Slot sections — always show AM + PM side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* ── AM Column ── */}
                  <div className="border-b border-gray-100 sm:border-r sm:border-b-0 sm:border-gray-100">
                    <div className="flex items-center gap-2.5 border-b border-amber-100 bg-amber-50/60 px-5 py-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-100 bg-white shadow-sm">
                        <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                      </div>
                      <span className="flex-1 text-sm font-semibold text-gray-700">
                        Morning (AM)
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          AM.length > 0 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {AM.length}
                      </span>
                    </div>
                    <div className="min-h-18 p-4">
                      {AM.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {AM.map((driver) => (
                            <button
                              key={driver.availabilityId}
                              onClick={() => setDriver(driver.id)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${
                                driver.isAvailable
                                  ? 'border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100'
                                  : 'border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100'
                              }`}
                            >
                              {driver.isAvailable ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {driver.fullName}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/70 py-5">
                          <p className="text-xs text-gray-400">No drivers for this slot</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── PM Column ── */}
                  <div>
                    <div className="flex items-center gap-2.5 border-b border-indigo-100 bg-indigo-50/60 px-5 py-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-white shadow-sm">
                        <Sunset className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <span className="flex-1 text-sm font-semibold text-gray-700">
                        Afternoon (PM)
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          PM.length > 0 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {PM.length}
                      </span>
                    </div>
                    <div className="min-h-18 p-4">
                      {PM.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {PM.map((driver) => (
                            <button
                              key={driver.availabilityId}
                              onClick={() => setDriver(driver.id)}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm ${
                                driver.isAvailable
                                  ? 'border-green-200 bg-green-50 text-green-700 hover:border-green-300 hover:bg-green-100'
                                  : 'border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100'
                              }`}
                            >
                              {driver.isAvailable ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {driver.fullName}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/70 py-5">
                          <p className="text-xs text-gray-400">No drivers for this slot</p>
                        </div>
                      )}
                    </div>
                  </div>
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
