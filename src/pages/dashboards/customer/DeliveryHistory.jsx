import React, { useState } from 'react';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Phone,
  User,
  Weight,
  FileText,
  Filter,
  Search,
  Download,
  Truck,
} from 'lucide-react';
import { toast } from 'react-toastify';

const DeliveryHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Sample delivery history data
  const deliveries = [
    {
      id: 1,
      spoNumber: 'SPO013349',
      date: '2026-01-20',
      timeSlot: 'AM',
      weight: 800,
      address: '4 Bumpers Lane, Chester, CH1 4LY',
      customerName: 'John Smith',
      phone: '07123456789',
      requestedBy: 'Sarah Williams',
      instructions: 'Please call before arrival',
      status: 'Received',
      distance: 25,
      estimatedCost: 45.0,
      createdAt: '2026-01-15 10:30',
      driver: null,
    },
    {
      id: 2,
      spoNumber: 'SPO013348',
      date: '2026-01-18',
      timeSlot: 'PM',
      weight: 1600,
      address: 'Unit 4, Lyme Court, Newcastle, ST5 3TF',
      customerName: 'Emma Johnson',
      phone: '07987654321',
      requestedBy: 'Michael Brown',
      instructions: 'Deliver to rear entrance',
      status: 'Allocated',
      distance: 38,
      estimatedCost: 100.0,
      createdAt: '2026-01-14 14:20',
      driver: 'BK',
    },
    {
      id: 3,
      spoNumber: 'SPO013347',
      date: '2026-01-16',
      timeSlot: 'AM',
      weight: 800,
      address: '152 Vale Road, Rhyl, LL18 2PD',
      customerName: 'David Wilson',
      phone: '07456789123',
      requestedBy: 'Lisa Anderson',
      instructions: 'Leave with reception',
      status: 'Delivered',
      distance: 42,
      estimatedCost: 45.0,
      createdAt: '2026-01-10 09:15',
      driver: 'BK',
      deliveredAt: '2026-01-16 11:30',
      receivedBy: 'Jane Roberts',
      driverNotes: 'Delivered successfully to reception desk',
    },
    {
      id: 4,
      spoNumber: 'SPO013346',
      date: '2026-01-15',
      timeSlot: 'PM',
      weight: 800,
      address: 'Wadebrook Retail Park, Northwich, CW9 5NN',
      customerName: 'Robert Taylor',
      phone: '07321654987',
      requestedBy: 'Jennifer Clark',
      instructions: 'Fragile items',
      status: 'Cancelled',
      distance: 35,
      estimatedCost: 45.0,
      createdAt: '2026-01-13 16:45',
      cancelledAt: '2026-01-14 10:00',
      cancelReason: 'Customer requested postponement',
    },
    {
      id: 5,
      spoNumber: 'SPO013345',
      date: '2026-01-12',
      timeSlot: 'AM',
      weight: 1600,
      address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
      customerName: 'Sophie Martinez',
      phone: '07789456123',
      requestedBy: 'Tom Harris',
      instructions: 'Contact before arrival',
      status: 'Delivered',
      distance: 30,
      estimatedCost: 90.0,
      createdAt: '2026-01-08 11:20',
      driver: 'BK',
      deliveredAt: '2026-01-12 10:15',
      receivedBy: 'Mark Johnson',
      driverNotes: 'Delivered on time',
    },
  ];

  // Calculate statistics
  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === 'Received').length,
    allocated: deliveries.filter((d) => d.status === 'Allocated').length,
    completed: deliveries.filter((d) => d.status === 'Delivered').length,
    cancelled: deliveries.filter((d) => d.status === 'Cancelled').length,
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesStatus =
      filterStatus === 'all' || delivery.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      delivery.spoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Received':
        return 'bg-red-100 text-red-600';
      case 'Allocated':
        return 'bg-blue-100 text-blue-600';
      case 'Delivered':
        return 'bg-green-100 text-green-600';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Received':
        return Clock;
      case 'Allocated':
        return Package;
      case 'Delivered':
        return CheckCircle;
      case 'Cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  // Handle view delivery
  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    toast.success('Exporting delivery history to CSV...');
    // CSV export logic would go here
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
        <p className="mt-2 text-gray-600">View and track all your delivery requests</p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Allocated</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.allocated}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Completed</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Cancelled</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <XCircle className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="flex-1 md:max-w-md">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by SPO, customer, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('received')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'received'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('allocated')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'allocated'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'delivered'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Deliveries Table/List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Table Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Delivery Records</h2>
        </div>

        {/* Table Content */}
        {filteredDeliveries.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No deliveries found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'No deliveries match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    SPO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredDeliveries.map((delivery) => {
                  const StatusIcon = getStatusIcon(delivery.status);
                  return (
                    <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{delivery.spoNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{delivery.date}</p>
                            <p className="text-xs text-gray-600">{delivery.timeSlot}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">{delivery.customerName}</p>
                            <p className="text-xs text-gray-600">{delivery.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{delivery.weight} kg</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          £{delivery.estimatedCost.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewDelivery(delivery)}
                          className="flex items-center gap-1 rounded-md border border-teal-300 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedDelivery && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Delivery Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                      selectedDelivery.status
                    )}`}
                  >
                    {React.createElement(getStatusIcon(selectedDelivery.status), {
                      className: 'h-4 w-4',
                    })}
                    {selectedDelivery.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    Created: {selectedDelivery.createdAt}
                  </span>
                </div>

                {/* Delivery Information */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <Package className="h-5 w-5 text-teal-600" />
                    Delivery Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">SPO Number</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.spoNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Date</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Slot</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-semibold text-gray-900">
                        {selectedDelivery.distance} miles
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Estimated Cost</p>
                      <p className="font-semibold text-gray-900">
                        £{selectedDelivery.estimatedCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <User className="h-5 w-5 text-teal-600" />
                    Contact Information
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Requested By</p>
                      <p className="font-semibold text-gray-900">{selectedDelivery.requestedBy}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <MapPin className="h-5 w-5 text-teal-600" />
                    Delivery Address
                  </h4>
                  <p className="font-semibold text-gray-900">{selectedDelivery.address}</p>
                </div>

                {/* Special Instructions */}
                {selectedDelivery.instructions && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-900">
                      <FileText className="h-5 w-5 text-teal-600" />
                      Special Instructions
                    </h4>
                    <p className="text-gray-700">{selectedDelivery.instructions}</p>
                  </div>
                )}

                {/* Driver Information */}
                {selectedDelivery.driver && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                      <Truck className="h-5 w-5 text-teal-600" />
                      Driver Information
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-gray-600">Driver Name</p>
                        <p className="font-semibold text-gray-900">{selectedDelivery.driver}</p>
                      </div>
                      {selectedDelivery.deliveredAt && (
                        <div>
                          <p className="text-sm text-gray-600">Delivered At</p>
                          <p className="font-semibold text-gray-900">
                            {selectedDelivery.deliveredAt}
                          </p>
                        </div>
                      )}
                      {selectedDelivery.receivedBy && (
                        <div>
                          <p className="text-sm text-gray-600">Received By</p>
                          <p className="font-semibold text-gray-900">
                            {selectedDelivery.receivedBy}
                          </p>
                        </div>
                      )}
                      {selectedDelivery.driverNotes && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-600">Driver Notes</p>
                          <p className="font-semibold text-gray-900">
                            {selectedDelivery.driverNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cancellation Info */}
                {selectedDelivery.status === 'Cancelled' && selectedDelivery.cancelReason && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-900">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Cancellation Details
                    </h4>
                    <p className="text-sm text-gray-600">
                      Cancelled at: {selectedDelivery.cancelledAt}
                    </p>
                    <p className="mt-2 text-gray-900">
                      <span className="font-semibold">Reason:</span> {selectedDelivery.cancelReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50"
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

export default DeliveryHistory;
