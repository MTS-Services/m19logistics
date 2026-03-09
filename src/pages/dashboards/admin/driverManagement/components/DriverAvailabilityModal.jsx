import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sunrise,
  Sunset,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  Phone,
  Car,
} from 'lucide-react';
import {
  getAdminDriverAvailability,
  getAdminDriverAvailabilityById,
} from '../../../../../services/driverService';

const DriverAvailabilityModal = ({ onClose, drivers = [], initialDriverId = null }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allData, setAllData] = useState(null);
  const [singleData, setSingleData] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(initialDriverId);
  const [dateFilter, setDateFilter] = useState('');

  const fetchData = async () => {
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
      setError(err?.response?.data?.message || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDriverId]);

  // Group the "grouped" array from all-drivers API by date → { date, AM: [], PM: [] }
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

  // Group single-driver data by date → { date, AM: entry|null, PM: entry|null }
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const sourceData = selectedDriverId ? singleData?.data : allData?.data;
  const totalSlots = selectedDriverId ? (singleData?.count ?? 0) : (allData?.count ?? 0);
  const available = sourceData ? sourceData.filter((e) => e.isAvailable).length : 0;
  const unavailable = totalSlots - available;

  const displayDriverName =
    singleData?.driver?.fullName || drivers.find((d) => d.id === Number(selectedDriverId))?.name;

  const groupedAll = getGroupedAll();
  const groupedSingle = getGroupedSingle();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Driver Availability</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {selectedDriverId
                ? `${displayDriverName ?? 'Driver'}'s schedule`
                : 'Overview of all drivers availability'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-3 sm:flex-row sm:items-center sm:px-6">
          <div className="relative flex-1">
            <select
              value={selectedDriverId ?? ''}
              onChange={(e) => {
                setSelectedDriverId(e.target.value ? Number(e.target.value) : null);
                setDateFilter('');
              }}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pr-8 pl-3 text-sm text-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
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

          <div className="relative flex-1">
            <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
          </div>

          <div className="flex shrink-0 gap-2">
            {(dateFilter || selectedDriverId) && (
              <button
                onClick={() => {
                  setDateFilter('');
                  setSelectedDriverId(null);
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700 transition-colors hover:bg-teal-100"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats bar */}
        {!loading && !error && (
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            <div className="py-3 text-center">
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
                Total Slots
              </p>
              <p className="mt-0.5 text-xl font-bold text-gray-900">{totalSlots}</p>
            </div>
            <div className="py-3 text-center">
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
                Available
              </p>
              <p className="mt-0.5 text-xl font-bold text-green-600">{available}</p>
            </div>
            <div className="py-3 text-center">
              <p className="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
                Unavailable
              </p>
              <p className="mt-0.5 text-xl font-bold text-red-500">{unavailable}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-7 w-7 animate-spin text-teal-500" />
              <p className="text-sm text-gray-400">Loading availability...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 p-5 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchData}
                className="mt-3 rounded-lg bg-red-500 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          ) : selectedDriverId ? (
            /* ── Single Driver View ── */
            groupedSingle.length === 0 ? (
              <div className="py-14 text-center">
                <Calendar className="mx-auto h-10 w-10 text-gray-200" />
                <p className="mt-3 text-sm text-gray-400">
                  No availability records for this driver
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {groupedSingle.map(({ date, AM, PM }) => (
                  <div
                    key={date}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600">
                        <span className="text-sm font-bold text-white">
                          {new Date(date + 'T00:00:00').getDate()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {formatDate(date)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                      {[
                        { slot: 'AM', entry: AM },
                        { slot: 'PM', entry: PM },
                      ].map(({ slot, entry }) => (
                        <div
                          key={slot}
                          className={`rounded-lg border p-3 ${
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
                                {slot === 'AM' ? 'Morning' : 'Afternoon'}
                              </span>
                            </div>
                            {entry ? (
                              entry.isAvailable ? (
                                <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                  <CheckCircle className="h-3 w-3" /> Available
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                                  <XCircle className="h-3 w-3" /> Unavailable
                                </span>
                              )
                            ) : (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">
                                Not set
                              </span>
                            )}
                          </div>
                          {entry?.notes && (
                            <p className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500 italic">
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
            <div className="py-14 text-center">
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
                  <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600">
                      <span className="text-sm font-bold text-white">
                        {new Date(date + 'T00:00:00').getDate()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{formatDate(date)}</span>
                  </div>

                  <div className="divide-y divide-gray-50 px-4 pb-3">
                    {/* AM row */}
                    {AM.length > 0 && (
                      <div className="py-3">
                        <div className="mb-2 flex items-center gap-1.5">
                          <Sunrise className="h-3.5 w-3.5 text-orange-400" />
                          <span className="text-xs font-semibold text-gray-500">Morning (AM)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {AM.map((driver) => (
                            <span
                              key={driver.availabilityId}
                              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                driver.isAvailable
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : 'border-red-200 bg-red-50 text-red-600'
                              }`}
                            >
                              {driver.isAvailable ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {driver.fullName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PM row */}
                    {PM.length > 0 && (
                      <div className="py-3">
                        <div className="mb-2 flex items-center gap-1.5">
                          <Sunset className="h-3.5 w-3.5 text-blue-400" />
                          <span className="text-xs font-semibold text-gray-500">
                            Afternoon (PM)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {PM.map((driver) => (
                            <span
                              key={driver.availabilityId}
                              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                driver.isAvailable
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : 'border-red-200 bg-red-50 text-red-600'
                              }`}
                            >
                              {driver.isAvailable ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {driver.fullName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {AM.length === 0 && PM.length === 0 && (
                      <p className="py-3 text-xs text-gray-400">No availability entries</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverAvailabilityModal;
