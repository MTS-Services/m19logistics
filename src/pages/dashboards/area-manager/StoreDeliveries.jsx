import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  Building2,
  MapPin,
  Calendar,
  User,
  X,
  Loader2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';
import axiosInstance from '../../../services/axiosInstance';

const StoreDeliveries = () => {
  // Client-side filters
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');

  // Server-side filters (query params)
  const [statusFilter, setStatusFilter] = useState('All');
  const [driverFilter, setDriverFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (statusFilter !== 'All') params.append('status', statusFilter);
    if (driverFilter !== 'All') params.append('driverId', driverFilter);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return params.toString();
  }, [statusFilter, driverFilter, startDate, endDate]);

  const fetchDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const query = buildQueryParams();
      const url = query ? `/api/admin/deliveries?${query}` : '/api/admin/deliveries';
      const response = await axiosInstance.get(url);
      if (response.data.success) {
        const mapped = response.data.data.map((d) => ({
          id: d.id,
          spoNumber: d.spoNumber,
          storeName: d.customer?.customerProfile?.storeName || d.customer?.fullName || 'N/A',
          deliveryAddress: d.deliveryAddress,
          date: d.deliveryDate ? d.deliveryDate.split('T')[0] : 'N/A',
          timeSlot: d.timeSlot,
          weight: d.weight,
          status: d.status,
          driverId: d.driverId,
          driverName: d.driver?.fullName || 'Unassigned',
          driverPhone: d.driver?.phone || 'N/A',
          driverEmail: d.driver?.email || 'N/A',
          customerName: d.customerName,
          phone: d.customerPhone,
          requestedBy: d.requestedBy || 'N/A',
          specialInstructions: d.specialInstructions || 'N/A',
          distanceFromDepot: d.distanceFromDepot || 'N/A',
          calculatedBasePrice: parseFloat(d.calculatedBasePrice) || 0,
          distanceSurcharge: parseFloat(d.distanceSurcharge) || 0,
          subtotal: parseFloat(d.subtotal) || 0,
          vatAmount: parseFloat(d.vatAmount) || 0,
          cost: parseFloat(d.totalPrice) || 0,
          isAdditionalDelivery: d.isAdditionalDelivery || false,
          deliveredAt: d.deliveredAt ? d.deliveredAt.split('T')[0] : null,
          receivedBy: d.receivedBy || null,
          signatureUrl: d.signatureUrl || null,
          photoUrl: d.photoUrl || null,
          acceptedAt: d.acceptedAt || null,
          cancelledAt: d.cancelledAt || null,
          cancellationReason: d.cancellationReason || null,
        }));
        setDeliveries(mapped);
      } else {
        setError('Failed to fetch deliveries');
      }
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching deliveries');
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Re-fetch whenever server-side filters change
  useEffect(() => {
    fetchDeliveries();
    setCurrentPage(1);
  }, [fetchDeliveries]);

  // Build dynamic store list from fetched data
  const stores = [
    'All',
    ...Array.from(
      new Set(deliveries.map((d) => d.storeName).filter((s) => s && s !== 'N/A'))
    ).sort(),
  ];

  // Build dynamic driver list from fetched data
  const drivers = [
    { id: 'All', name: 'All Drivers' },
    ...Array.from(
      new Map(
        deliveries
          .filter((d) => d.driverId && d.driverName !== 'Unassigned')
          .map((d) => [d.driverId, { id: d.driverId, name: d.driverName }])
      ).values()
    ).sort((a, b) => a.name.localeCompare(b.name)),
  ];

  const statusOptions = ['All', 'RECEIVED', 'ALLOCATED', 'DELIVERED', 'CANCELLED'];

  const filteredDeliveries = deliveries.filter((delivery) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const spoMatch = normalizedQuery.match(/spo[:\s]*([a-z0-9]+)/);
    const extractedSpo = spoMatch ? spoMatch[1] : normalizedQuery;

    const matchesSearch =
      delivery.spoNumber.toLowerCase().includes(extractedSpo) ||
      delivery.storeName.toLowerCase().includes(normalizedQuery) ||
      delivery.deliveryAddress.toLowerCase().includes(normalizedQuery);

    const matchesStore = storeFilter === 'All' || delivery.storeName === storeFilter;

    return matchesSearch && matchesStore;
  });

  // Pagination calculations
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  const handleClientFilterChange = (type, value) => {
    if (type === 'search') setSearchQuery(value);
    if (type === 'store') setStoreFilter(value);
    setCurrentPage(1);
  };

  const handleServerFilterChange = (type, value) => {
    if (type === 'status') setStatusFilter(value);
    if (type === 'driver') setDriverFilter(value);
    if (type === 'startDate') setStartDate(value);
    if (type === 'endDate') setEndDate(value);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStoreFilter('All');
    setStatusFilter('All');
    setDriverFilter('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'RECEIVED':
        return 'bg-blue-100 text-blue-600';
      case 'ALLOCATED':
        return 'bg-yellow-100 text-yellow-600';
      case 'DELIVERED':
        return 'bg-green-100 text-green-600';
      case 'CANCELLED':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatStatus = (status) => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const hasActiveFilters =
    statusFilter !== 'All' ||
    driverFilter !== 'All' ||
    storeFilter !== 'All' ||
    startDate ||
    endDate ||
    searchQuery;

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-sm">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-100 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchDeliveries}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Store Deliveries
            </h1>
            <p className="mt-2 text-gray-600">
              View deliveries for all assigned Topps Tiles stores (Read-Only)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Filters</p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset All
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleClientFilterChange('search', e.target.value)}
                placeholder="Search by SPO, store, or address..."
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Status Filter → server-side */}
            <div className="relative">
              <Filter className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => handleServerFilterChange('status', e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            {/* Driver Filter → server-side */}
            <div className="relative">
              <Truck className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={driverFilter}
                onChange={(e) => handleServerFilterChange('driver', e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Filter → client-side */}
            <div className="relative">
              <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={storeFilter}
                onChange={(e) => handleClientFilterChange('store', e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {stores.map((store) => (
                  <option key={store} value={store}>
                    {store === 'All' ? 'All Stores' : store}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date → server-side */}
            <div className="flex items-center rounded-md border border-gray-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <div className="flex shrink-0 items-center gap-2 rounded-l-md border-r border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="whitespace-nowrap">Start Date</span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleServerFilterChange('startDate', e.target.value)}
                className="w-full rounded-r-md bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none"
              />
            </div>

            {/* End Date → server-side */}
            <div className="flex items-center rounded-md border border-gray-300 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
              <div className="flex shrink-0 items-center gap-2 rounded-l-md border-r border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="whitespace-nowrap">End Date</span>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleServerFilterChange('endDate', e.target.value)}
                className="w-full rounded-r-md bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Deliveries</h2>
            <p className="mt-1 text-sm text-gray-600">
              Showing {paginatedDeliveries.length} of {totalItems} deliveries
            </p>
          </div>

          <div className="space-y-4 p-6">
            {paginatedDeliveries.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries found</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {searchQuery || statusFilter !== 'All' || storeFilter !== 'All'
                    ? 'Try adjusting your filters'
                    : 'No deliveries available'}
                </p>
              </div>
            ) : (
              paginatedDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Delivery Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-teal-50 p-3">
                          <Package className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              SPO: {delivery.spoNumber}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                delivery.status
                              )}`}
                            >
                              {formatStatus(delivery.status)}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">{delivery.storeName}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                              <span>{delivery.deliveryAddress}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {delivery.date} - {delivery.timeSlot}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{delivery.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Truck className="h-4 w-4" />
                              <span>{delivery.driverName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-6 lg:min-w-45">
                      <button
                        onClick={() => handleViewDetails(delivery)}
                        className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <div className="rounded-md bg-green-50 px-4 py-2 text-center text-sm font-medium text-green-700">
                        £{delivery.cost.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 pb-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
            <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="rounded-t-xl bg-linear-to-r from-teal-600 to-teal-500 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-xs font-medium tracking-widest text-teal-100 uppercase">
                      SPO Number
                    </p>
                    <h2 className="mt-0.5 truncate text-lg font-bold text-white sm:text-xl">
                      {selectedDelivery.spoNumber}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="shrink-0 rounded-lg p-1.5 text-teal-200 transition-colors hover:bg-teal-700 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(selectedDelivery.status)}`}
                    >
                      {formatStatus(selectedDelivery.status)}
                    </span>
                    {selectedDelivery.isAdditionalDelivery && (
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        Additional
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-teal-100">Total Cost</p>
                    <p className="text-xl font-bold text-white sm:text-2xl">
                      £{selectedDelivery.cost.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-3 sm:space-y-5 sm:p-6">
                {/* Delivery Summary Row */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex flex-col items-center px-2 py-3 text-center sm:px-4">
                    <Calendar className="mb-1 h-4 w-4 text-teal-500" />
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-800 sm:text-sm">
                      {selectedDelivery.date}
                    </p>
                  </div>
                  <div className="flex flex-col items-center px-2 py-3 text-center sm:px-4">
                    <Package className="mb-1 h-4 w-4 text-teal-500" />
                    <p className="text-xs text-gray-500">Slot · Weight</p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-800 sm:text-sm">
                      {selectedDelivery.timeSlot} · {selectedDelivery.weight} kg
                    </p>
                  </div>
                  <div className="flex flex-col items-center px-2 py-3 text-center sm:px-4">
                    <MapPin className="mb-1 h-4 w-4 text-teal-500" />
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-800 sm:text-sm">
                      {selectedDelivery.distanceFromDepot} miles
                    </p>
                  </div>
                </div>

                {/* Address + Store */}
                <div className="rounded-lg border border-gray-200 p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">Delivery Address</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {selectedDelivery.deliveryAddress}
                      </p>
                    </div>
                  </div>
                  {selectedDelivery.storeName !== 'N/A' && (
                    <div className="mt-3 flex items-start gap-3 border-t border-gray-100 pt-3">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Store</p>
                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                          {selectedDelivery.storeName}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedDelivery.specialInstructions !== 'N/A' && (
                    <div className="mt-3 flex items-start gap-3 border-t border-gray-100 pt-3">
                      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Special Instructions</p>
                        <p className="mt-0.5 text-sm text-gray-700">
                          {selectedDelivery.specialInstructions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer & Driver Cards */}
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {/* Customer */}
                  <div className="rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-md bg-blue-50 p-1.5">
                        <User className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Customer
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedDelivery.customerName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{selectedDelivery.phone}</p>
                    {selectedDelivery.requestedBy !== 'N/A' && (
                      <p className="mt-2 text-xs text-gray-400">
                        Requested by:{' '}
                        <span className="text-gray-600">{selectedDelivery.requestedBy}</span>
                      </p>
                    )}
                  </div>

                  {/* Driver */}
                  <div className="rounded-lg border border-gray-200 p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-md bg-orange-50 p-1.5">
                        <Truck className="h-4 w-4 text-orange-500" />
                      </div>
                      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Driver
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedDelivery.driverName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{selectedDelivery.driverPhone}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{selectedDelivery.driverEmail}</p>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="rounded-lg border border-gray-200 p-3 sm:p-4">
                  <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Pricing
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Base Price</span>
                      <span>£{selectedDelivery.calculatedBasePrice.toFixed(2)}</span>
                    </div>
                    {selectedDelivery.distanceSurcharge > 0 && (
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Distance Surcharge</span>
                        <span>£{selectedDelivery.distanceSurcharge.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>VAT (20%)</span>
                      <span>£{selectedDelivery.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-teal-600">£{selectedDelivery.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Proof of Delivery — DELIVERED only */}
                {selectedDelivery.status?.toUpperCase() === 'DELIVERED' && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
                    <p className="mb-3 text-xs font-semibold tracking-wide text-green-700 uppercase">
                      Proof of Delivery
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedDelivery.deliveredAt && (
                        <div>
                          <p className="text-xs text-green-600">Delivered At</p>
                          <p className="text-sm font-medium text-green-900">
                            {selectedDelivery.deliveredAt}
                          </p>
                        </div>
                      )}
                      {selectedDelivery.receivedBy && (
                        <div>
                          <p className="text-xs text-green-600">Received By</p>
                          <p className="text-sm font-medium text-green-900">
                            {selectedDelivery.receivedBy}
                          </p>
                        </div>
                      )}
                    </div>
                    {(selectedDelivery.signatureUrl || selectedDelivery.photoUrl) && (
                      <div className="mt-3 flex gap-3 border-t border-green-200 pt-3">
                        {selectedDelivery.signatureUrl && (
                          <a
                            href={selectedDelivery.signatureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-md border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm transition-colors hover:bg-green-100"
                          >
                            <Eye className="h-3.5 w-3.5" /> Signature
                          </a>
                        )}
                        {selectedDelivery.photoUrl && (
                          <a
                            href={selectedDelivery.photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-md border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700 shadow-sm transition-colors hover:bg-green-100"
                          >
                            <Eye className="h-3.5 w-3.5" /> Photo
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Cancellation — CANCELLED only */}
                {selectedDelivery.status?.toUpperCase() === 'CANCELLED' &&
                  selectedDelivery.cancellationReason && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
                      <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase">
                        Cancellation Reason
                      </p>
                      <p className="text-sm text-red-800">{selectedDelivery.cancellationReason}</p>
                    </div>
                  )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-3 py-3 sm:px-6 sm:py-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDeliveries;
