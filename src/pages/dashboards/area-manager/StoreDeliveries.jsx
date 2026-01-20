import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Eye,
  Building2,
  MapPin,
  Calendar,
  User,
  FileText,
  X,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';

const StoreDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [storeFilter, setStoreFilter] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const stores = [
    'All',
    'Topps Chester',
    'Topps Nantwich',
    'Topps Newcastle',
    'Topps Northwich',
    'Topps Rhyl',
    'Topps Wrexham',
  ];

  const [deliveries] = useState([
    {
      id: 1,
      spoNumber: 'SPO013349',
      storeName: 'Topps Chester',
      depot: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
      deliveryAddress: '123 Main Street, Liverpool, L1 1AA',
      date: '2026-01-16',
      timeSlot: 'AM',
      weight: 1200,
      status: 'Allocated',
      driver: 'BK',
      customerName: 'John Smith',
      phone: '01234567890',
      cost: 90.0,
    },
    {
      id: 2,
      spoNumber: 'SPO013350',
      storeName: 'Topps Newcastle',
      depot: 'Unit 4, Lyme Court, ST5 3TF',
      deliveryAddress: '456 High Street, Manchester, M1 1AA',
      date: '2026-01-16',
      timeSlot: 'PM',
      weight: 800,
      status: 'Delivered',
      driver: 'BK',
      customerName: 'Sarah Johnson',
      phone: '01234567891',
      cost: 50.0,
    },
    {
      id: 3,
      spoNumber: 'SPO013351',
      storeName: 'Topps Wrexham',
      depot: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
      deliveryAddress: '789 Park Lane, Birmingham, B1 1AA',
      date: '2026-01-15',
      timeSlot: 'AM',
      weight: 1600,
      status: 'Delivered',
      driver: 'BK',
      customerName: 'Mike Wilson',
      phone: '01234567892',
      cost: 135.0,
    },
    {
      id: 4,
      spoNumber: 'SPO013352',
      storeName: 'Topps Rhyl',
      depot: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
      deliveryAddress: '321 Oak Street, Leeds, LS1 1AA',
      date: '2026-01-17',
      timeSlot: 'PM',
      weight: 700,
      status: 'Received',
      driver: 'BK',
      customerName: 'Emily Davis',
      phone: '01234567893',
      cost: 45.0,
    },
    {
      id: 5,
      spoNumber: 'SPO013353',
      storeName: 'Topps Nantwich',
      depot: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
      deliveryAddress: '654 Cedar Road, Bristol, BS1 1AA',
      date: '2026-01-18',
      timeSlot: 'AM',
      weight: 1100,
      status: 'Cancelled',
      driver: 'BK',
      customerName: 'Anna Brown',
      phone: '01234567894',
      cost: 75.0,
    },
    {
      id: 6,
      spoNumber: 'SPO013354',
      storeName: 'Topps Northwich',
      depot: 'Unit 4, Lyme Court, ST5 3TF',
      deliveryAddress: '987 Birch Avenue, Cardiff, CF1 1AA',
      date: '2026-01-19',
      timeSlot: 'PM',
      weight: 900,
      status: 'Allocated',
      driver: 'BK',
      customerName: 'David Green',
      phone: '01234567895',
      cost: 60.0,
    },
  ]);

  const statusOptions = ['All', 'Received', 'Allocated', 'Delivered', 'Cancelled'];

  const filteredDeliveries = deliveries.filter((delivery) => {
    // Normalize search query to extract SPO number
    const normalizedQuery = searchQuery.trim().toLowerCase();
    // Extract just the SPO number from formats like "SPO: SPO013349", "SPO:SPO013349", "SPO013349"
    const spoMatch = normalizedQuery.match(/spo[:\s]*([a-z0-9]+)/);
    const extractedSpo = spoMatch ? spoMatch[1] : normalizedQuery;

    const matchesSearch =
      delivery.spoNumber.toLowerCase().includes(extractedSpo) ||
      delivery.storeName.toLowerCase().includes(normalizedQuery) ||
      delivery.deliveryAddress.toLowerCase().includes(normalizedQuery);

    const matchesStatus = statusFilter === 'All' || delivery.status === statusFilter;
    const matchesStore = storeFilter === 'All' || delivery.storeName === storeFilter;

    return matchesSearch && matchesStatus && matchesStore;
  });

  // Pagination calculations
  const totalItems = filteredDeliveries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (type, value) => {
    if (type === 'search') setSearchQuery(value);
    if (type === 'status') setStatusFilter(value);
    if (type === 'store') setStoreFilter(value);
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
    switch (status) {
      case 'Received':
        return 'bg-blue-100 text-blue-600';
      case 'Allocated':
        return 'bg-yellow-100 text-yellow-600';
      case 'Delivered':
        return 'bg-green-100 text-green-600';
      case 'Cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

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
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by SPO, store, or address..."
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Store Filter */}
            <div className="relative">
              <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={storeFilter}
                onChange={(e) => handleFilterChange('store', e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {stores.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
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
                              {delivery.status}
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">{delivery.storeName}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
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
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:ml-6 lg:min-w-[180px]">
                      <button
                        onClick={() => handleViewDetails(delivery)}
                        className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
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
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      SPO Number
                    </label>
                    <p className="text-sm text-gray-900">{selectedDelivery.spoNumber}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        selectedDelivery.status
                      )}`}
                    >
                      {selectedDelivery.status}
                    </span>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Store Name
                    </label>
                    <p className="text-sm text-gray-900">{selectedDelivery.storeName}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Driver</label>
                    <p className="text-sm text-gray-900">{selectedDelivery.driver}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Depot Address
                    </label>
                    <p className="text-sm text-gray-900">{selectedDelivery.depot}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Delivery Address
                    </label>
                    <p className="text-sm text-gray-900">{selectedDelivery.deliveryAddress}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Delivery Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedDelivery.date} - {selectedDelivery.timeSlot}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Weight</label>
                    <p className="text-sm text-gray-900">{selectedDelivery.weight} kg</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Customer Name
                    </label>
                    <p className="text-sm text-gray-900">{selectedDelivery.customerName}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <p className="text-sm text-gray-900">{selectedDelivery.phone}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Cost</label>
                    <p className="text-sm font-bold text-green-600">
                      £{selectedDelivery.cost.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Read-Only Notice */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900">Read-Only Access</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        You cannot edit or modify this delivery. Contact an administrator to make
                        changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
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
