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

const StoreDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [storeFilter, setStoreFilter] = useState('All');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

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
  ]);

  const statusOptions = ['All', 'Received', 'Allocated', 'Delivered', 'Cancelled'];

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.spoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || delivery.status === statusFilter;
    const matchesStore = storeFilter === 'All' || delivery.storeName === storeFilter;

    return matchesSearch && matchesStatus && matchesStore;
  });

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Deliveries</h1>
        <p className="mt-2 text-gray-600">
          View deliveries for all assigned Topps Tiles stores (Read-Only)
        </p>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SPO, store, or address..."
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Store Filter */}
          <div className="relative">
            <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {searchQuery || statusFilter !== 'All' || storeFilter !== 'All'
                ? 'Try adjusting your filters'
                : 'No deliveries available'}
            </p>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
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

      {/* Detail Modal */}
      {showDetailModal && selectedDelivery && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">SPO Number</label>
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
                  <label className="mb-1 block text-sm font-medium text-gray-700">Store Name</label>
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
  );
};

export default StoreDeliveries;
