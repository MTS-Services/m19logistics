import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  Package,
  Users,
  Truck,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';
import axiosInstance from '../../../services/axiosInstance';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
  delivered: { hex: '#059669', tw: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Delivered' },
  allocated: { hex: '#2563eb', tw: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'Allocated' },
  received: { hex: '#f59e0b', tw: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Received' },
  cancelled: { hex: '#ef4444', tw: 'bg-red-500', badge: 'bg-red-100 text-red-700', label: 'Cancelled' },
};

const getStatusCfg = (s = '') => STATUS_CFG[s.toLowerCase()] ?? {
  hex: '#6b7280', tw: 'bg-gray-400', badge: 'bg-gray-100 text-gray-600', label: s,
};

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
const DonutChart = ({ data, total }) => {
  const r = 64, sw = 22, cx = 90, cy = 90;
  const C = 2 * Math.PI * r;

  if (!total) {
    return (
      <div className="flex h-45 w-45 items-center justify-center">
        <div
          className="flex h-45 w-45 items-center justify-center rounded-full"
          style={{ border: `${sw}px solid #f3f4f6` }}
        >
          <span className="text-base text-gray-400">No data</span>
        </div>
      </div>
    );
  }

  let cumulative = 0;
  const segments = Object.entries(data)
    .filter(([, v]) => Number(v) > 0)
    .map(([key, value]) => {
      const arc = (Number(value) / total) * C;
      const seg = { key, value: Number(value), arc, offset: cumulative };
      cumulative += arc;
      return seg;
    });

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={sw} />
      {/* Segments — rotated so first segment starts at 12 o'clock */}
      {segments.map((seg) => (
        <circle
          key={seg.key}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={getStatusCfg(seg.key).hex}
          strokeWidth={sw}
          strokeDasharray={`${seg.arc} ${C - seg.arc}`}
          strokeDashoffset={-seg.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          strokeLinecap="butt"
        />
      ))}
      {/* Centre label */}
      <text x={cx} y={cy - 7} textAnchor="middle" fill="#111827" fontSize="22" fontWeight="700">
        {total}
      </text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill="#6b7280" fontSize="11">
        Deliveries
      </text>
    </svg>
  );
};

// ─── Period options ───────────────────────────────────────────────────────────
const PERIODS = [
  { label: 'All', value: 'all' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },

];

// ─── Main Component ───────────────────────────────────────────────────────────
const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalytics] = useState(null);

  const fetchAnalytics = useCallback(async (p, sd, ed) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/admin/analytics';
      if (p === 'custom') {
        const params = new URLSearchParams();
        if (sd) params.set('startDate', sd);
        if (ed) params.set('endDate', ed);
        if (params.toString()) url += '?' + params.toString();
      } else if (p !== 'all') {
        url += `?period=${p}`;
      }
      const res = await axiosInstance.get(url);
      setAnalytics(res.data?.data || {});
    } catch {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (period !== 'custom') fetchAnalytics(period);
  }, [period, fetchAnalytics]);

  const handleCustomApply = () => {
    if (startDate && endDate) fetchAnalytics('custom', startDate, endDate);
  };

  const handlePeriodChange = (val) => {
    setPeriod(val);
    setCurrentPage(1);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const summary = analyticsData?.summary ?? {};
  const byStatus = analyticsData?.deliveriesByStatus ?? {};
  const dateRange = analyticsData?.dateRange;
  const statusTotal = Object.values(byStatus).reduce((a, v) => a + Number(v), 0);

  const recentDeliveries = (analyticsData?.recentDeliveries ?? []).map((d) => ({
    id: d.id,
    spoNumber: d.spoNumber,
    customerName: d.customerName,
    driverName: d.driver?.fullName || 'N/A',
    deliveryDate: d.deliveryDate,
    timeSlot: d.timeSlot,
    amount: parseFloat(d.totalPrice || 0),
    status: d.status,
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = recentDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recentDeliveries.length / itemsPerPage);

  const dateLabel = dateRange?.startDate && dateRange?.endDate
    ? `${dateRange.startDate}  →  ${dateRange.endDate}`
    : null;

  // ── Stat cards ───────────────────────────────────────────────────────────────
  const statCards = [
    { label: 'Total Revenue', value: `£${parseFloat(summary.totalRevenue || 0).toLocaleString()}`, CardIcon: DollarSign, bg: 'bg-teal-50', ic: 'text-teal-600' },
    { label: 'Total Deliveries', value: summary.totalDeliveries ?? 0, CardIcon: Package, bg: 'bg-blue-50', ic: 'text-blue-600' },
    { label: 'Total Invoices', value: summary.totalInvoices ?? 0, CardIcon: FileText, bg: 'bg-purple-50', ic: 'text-purple-600' },
    { label: 'Active Customers', value: summary.activeCustomers ?? 0, CardIcon: Users, bg: 'bg-amber-50', ic: 'text-amber-600' },
    { label: 'Active Drivers', value: summary.activeDrivers ?? 0, CardIcon: Truck, bg: 'bg-indigo-50', ic: 'text-indigo-600' },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-2 sm:p-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Analytics Dashboard</h1>
          <p className="mt-1 text-base text-gray-600 sm:mt-2">
            {dateLabel ? `Period: ${dateLabel}` : 'Comprehensive performance metrics and reports'}
          </p>
        </div>
        {/* <button
          onClick={() => period !== 'custom' ? fetchAnalytics(period) : handleCustomApply()}
          disabled={loading}
          className="flex items-center gap-2 self-start rounded-lg border border-teal-200 bg-white px-4 py-2 text-base font-medium text-teal-700 shadow-sm transition hover:bg-teal-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button> */}
      </div>

      {/* ── Period Filter ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePeriodChange(p.value)}
            className={`rounded-lg px-4 py-2 text-base font-medium transition ${period === p.value
              ? 'bg-teal-600 text-white shadow-sm'
              : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300 hover:text-teal-700'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Custom Date Range ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl ">
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-700 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
          />
        </div>
        {startDate && endDate && (
          <button
            onClick={handleCustomApply}
            disabled={loading}
            className="rounded-lg bg-teal-600 px-5 py-2 text-base font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-50"
          >
            Apply
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-700">
          {error}
        </div>
      )}

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => {
          const SI = card.CardIcon;
          return (
            <div key={card.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className={`mb-3 inline-flex rounded-lg p-2 ${card.bg}`}>
                <SI className={`h-5 w-5 ${card.ic}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '—' : card.value}</p>
              <p className="mt-1 text-base text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Donut — Deliveries by Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">Deliveries by Status</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <DonutChart data={byStatus} total={statusTotal} />
              <div className="flex w-full flex-col gap-5">
                {Object.entries(byStatus).map(([key, value]) => {
                  const cfg = getStatusCfg(key);
                  const pct = statusTotal > 0 ? Math.round((Number(value) / statusTotal) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between text-base">
                        <span className="flex items-center gap-1.5 font-medium capitalize text-gray-700">
                          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${cfg.tw}`} />
                          {cfg.label}
                        </span>
                        <span className="text-gray-500">
                          {value} <span className="text-gray-400">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${cfg.tw}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Invoice & People Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">Invoice Summary</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Revenue highlight */}
              <div className="rounded-xl bg-linear-to-r from-teal-600 to-teal-500 p-4 text-white">
                <p className="text-base font-medium text-white">Total Revenue</p>
                <p className="mt-0.5 text-3xl font-bold text-white">
                  £{parseFloat(summary.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              {/* Invoice bars */}
              {[
                { label: 'Total Invoices', value: summary.totalInvoices ?? 0, color: 'bg-purple-400', ref: summary.totalInvoices ?? 1 },
                { label: 'Paid Invoices', value: summary.paidInvoices ?? 0, color: 'bg-emerald-400', ref: summary.totalInvoices ?? 1 },
                { label: 'Unpaid Invoices', value: summary.unpaidInvoices ?? 0, color: 'bg-red-400', ref: summary.totalInvoices ?? 1 },
              ].map(({ label, value, color, ref }) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-base">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: ref > 0 ? `${Math.min((value / ref) * 100, 100)}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
              {/* Customers / Drivers */}
              <div className="mt-1 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">{summary.activeCustomers ?? 0}</p>
                  <p className="text-base text-amber-600">Active Customers</p>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-center">
                  <p className="text-2xl font-bold text-indigo-700">{summary.activeDrivers ?? 0}</p>
                  <p className="text-base text-indigo-600">Active Drivers</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Deliveries Table ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-gray-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Package className="h-5 w-5 text-teal-600" />
            Recent Deliveries
          </h2>
          {recentDeliveries.length > 0 && !loading && (
            <p className="text-base text-gray-500">
              Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, recentDeliveries.length)} of{' '}
              {recentDeliveries.length} deliveries
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-14">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
              <span className="ml-3 text-base text-gray-500">Loading deliveries…</span>
            </div>
          ) : recentDeliveries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400">
              <Package className="mb-2 h-10 w-10 opacity-30" />
              <p className="text-base">No deliveries found for this period</p>
            </div>
          ) : (
            <table className="w-full text-base">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  {['Delivery ID', 'SPO No.', 'Customer', 'Driver', 'Date & Slot', 'Amount', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentDeliveries.map((d) => {
                  const cfg = getStatusCfg(d.status);
                  return (
                    <tr key={d.id} className="transition-colors hover:bg-gray-50/70">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-teal-600">#{d.id}</span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{d.spoNumber || '—'}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{d.customerName}</td>
                      <td className="px-5 py-3.5 text-gray-600">{d.driverName}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800">{d.deliveryDate}</p>
                        <p className="text-base text-gray-400">{d.timeSlot}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-teal-600">
                        £{d.amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-base font-semibold capitalize ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {!loading && recentDeliveries.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
            itemsPerPage={itemsPerPage}
            totalItems={recentDeliveries.length}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
