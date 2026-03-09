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

  const formatDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

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
    <div className="p-2 sm:p-6">
      <div className="space-y-4">
        {/* ── Header ── */}
        <div>
          <button
            onClick={() => navigate('/admin/drivers')}
            className="mb-1.5 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Drivers
          </button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                {selectedDriverId && displayDriverName
                  ? `${displayDriverName}'s Availability`
                  : 'Driver Availability'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {selectedDriverId
                  ? 'View scheduled availability for this driver'
                  : 'Overview of all drivers availability by date'}
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Driver selector */}
            <div className="relative min-w-0 flex-1">
              <select
                value={selectedDriverId ?? ''}
                disabled={driversLoading}
                onChange={(e) => setDriver(e.target.value ? Number(e.target.value) : null)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-8 pl-3 text-sm text-gray-700 transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-none disabled:opacity-50"
              >
                <option value="">All Drivers</option>
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Date filter */}
            <div className="relative min-w-0 flex-1">
              <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-9 text-sm text-gray-700 transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Stats Cards ── */}
        {!loading && !error && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase sm:text-xs">
                Total Slots
              </p>
              <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">{totalSlots}</p>
              <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">recorded entries</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase sm:text-xs">
                Available
              </p>
              <p className="mt-1.5 text-2xl font-bold text-green-600 sm:text-3xl">{available}</p>
              <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">open slots</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase sm:text-xs">
                Unavailable
              </p>
              <p className="mt-1.5 text-2xl font-bold text-red-500 sm:text-3xl">{unavailable}</p>
              <p className="mt-0.5 hidden text-xs text-gray-400 sm:block">blocked slots</p>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
            <p className="text-sm text-gray-400">Loading availability...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center shadow-sm">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchData}
              className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : selectedDriverId ? (
          /* ── Single Driver View ── */
          groupedSingle.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
              <Calendar className="mx-auto h-10 w-10 text-gray-200" />
              <p className="mt-3 text-sm text-gray-400">No availability records for this driver</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedSingle.map(({ date, AM, PM }) => (
                <div
                  key={date}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600">
                      <span className="text-sm font-bold text-white">
                        {new Date(date + 'T00:00:00').getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(date)}</p>
                      <p className="text-xs text-gray-400">{date}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                    {[
                      { slot: 'AM', entry: AM },
                      { slot: 'PM', entry: PM },
                    ].map(({ slot, entry }) => (
                      <div
                        key={slot}
                        className={`rounded-xl border p-4 ${
                          entry
                            ? entry.isAvailable
                              ? 'border-green-200 bg-green-50/50'
                              : 'border-red-200 bg-red-50/50'
                            : 'border-dashed border-gray-200 bg-gray-50/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {slot === 'AM' ? (
                              <Sunrise className="h-4 w-4 text-orange-400" />
                            ) : (
                              <Sunset className="h-4 w-4 text-blue-400" />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {slot === 'AM' ? 'Morning (AM)' : 'Afternoon (PM)'}
                            </span>
                          </div>
                          {entry ? (
                            entry.isAvailable ? (
                              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                                <CheckCircle className="h-3 w-3" /> Available
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
                                <XCircle className="h-3 w-3" /> Unavailable
                              </span>
                            )
                          ) : (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-400">
                              Not set
                            </span>
                          )}
                        </div>
                        {entry?.notes && (
                          <p className="mt-2.5 border-t border-gray-100 pt-2.5 text-xs text-gray-500 italic">
                            "{entry.notes}"
                          </p>
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
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <Calendar className="mx-auto h-10 w-10 text-gray-200" />
            <p className="mt-3 text-sm text-gray-400">No availability records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {groupedAll.map(({ date, AM, PM }) => (
              <div
                key={date}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                {/* Date header */}
                <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/60 px-5 py-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-600">
                    <span className="text-sm font-bold text-white">
                      {new Date(date + 'T00:00:00').getDate()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{formatDate(date)}</p>
                    <p className="text-xs text-gray-400">{date}</p>
                  </div>
                </div>

                <div className="divide-y divide-gray-50 px-5 pb-4">
                  {AM.length > 0 && (
                    <div className="py-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Sunrise className="h-4 w-4 text-orange-400" />
                        <span className="text-xs font-semibold text-gray-500">Morning (AM)</span>
                        <span className="ml-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {AM.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {AM.map((driver) => (
                          <button
                            key={driver.availabilityId}
                            onClick={() => setDriver(driver.id)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              driver.isAvailable
                                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
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
                    </div>
                  )}

                  {PM.length > 0 && (
                    <div className="py-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Sunset className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-semibold text-gray-500">Afternoon (PM)</span>
                        <span className="ml-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {PM.length}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {PM.map((driver) => (
                          <button
                            key={driver.availabilityId}
                            onClick={() => setDriver(driver.id)}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              driver.isAvailable
                                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                                : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
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
                    </div>
                  )}
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
