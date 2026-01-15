import React, { useState } from 'react';
import {
  Package,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  User,
  Weight,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';

const CustomerDashboardHome = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample delivery data
  const [deliveries, setDeliveries] = useState([
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
  ]);

  // New delivery request form
  const [newDelivery, setNewDelivery] = useState({
    spoNumber: '',
    date: '',
    timeSlot: 'AM',
    weight: '',
    address: '',
    customerName: '',
    phone: '',
    requestedBy: '',
    instructions: '',
  });

  // Calculate stats
  const stats = {
    pending: deliveries.filter((d) => d.status === 'Received').length,
    allocated: deliveries.filter((d) => d.status === 'Allocated').length,
    completed: deliveries.filter((d) => d.status === 'Delivered').length,
    cancelled: deliveries.filter((d) => d.status === 'Cancelled').length,
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (filterStatus === 'all') return true;
    return delivery.status.toLowerCase() === filterStatus.toLowerCase();
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

  // Handle request new delivery
  const handleRequestDelivery = () => {
    if (
      !newDelivery.spoNumber ||
      !newDelivery.date ||
      !newDelivery.weight ||
      !newDelivery.address
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if same day delivery
    const today = new Date().toISOString().split('T')[0];
    const isSameDay = newDelivery.date === today;

    if (isSameDay) {
      toast.warning(
        'Same-day delivery cannot be guaranteed. Please call 07971415430 to confirm availability'
      );
    }

    const delivery = {
      id: Date.now(),
      ...newDelivery,
      status: 'Received',
      createdAt: new Date().toISOString(),
      distance: Math.floor(Math.random() * 45) + 10,
      estimatedCost: newDelivery.weight <= 800 ? 45.0 : Math.ceil(newDelivery.weight / 800) * 45.0,
      driver: null,
    };

    setDeliveries([delivery, ...deliveries]);
    setShowRequestModal(false);
    setNewDelivery({
      spoNumber: '',
      date: '',
      timeSlot: 'AM',
      weight: '',
      address: '',
      customerName: '',
      phone: '',
      requestedBy: '',
      instructions: '',
    });
    toast.success('Delivery request submitted successfully!');
  };

  // Handle view delivery
  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  // Handle edit delivery
  const handleEditDelivery = (delivery) => {
    if (delivery.status === 'Allocated' || delivery.status === 'Delivered') {
      toast.error('Cannot edit delivery that has been allocated or delivered');
      return;
    }
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    setDeliveries(deliveries.map((d) => (d.id === selectedDelivery.id ? selectedDelivery : d)));
    setShowEditModal(false);
    setSelectedDelivery(null);
    toast.success('Delivery updated successfully!');
  };

  // Handle cancel delivery
  const handleCancelDelivery = (delivery) => {
    if (delivery.status === 'Allocated') {
      toast.error(
        'Cannot cancel delivery that has been allocated to a driver. Please contact admin.'
      );
      return;
    }
    if (delivery.status === 'Delivered') {
      toast.error('Cannot cancel completed delivery');
      return;
    }

    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      setDeliveries(
        deliveries.map((d) =>
          d.id === delivery.id
            ? {
                ...d,
                status: 'Cancelled',
                cancelledAt: new Date().toISOString(),
                cancelReason: reason,
              }
            : d
        )
      );
      toast.success('Delivery cancelled successfully');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your delivery requests and track shipments</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Allocated</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.allocated}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <XCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('received')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                filterStatus === 'received'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('allocated')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                filterStatus === 'allocated'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                filterStatus === 'delivered'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Request Delivery
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No deliveries found</h3>
            <p className="mb-6 text-gray-600">Get started by requesting your first delivery</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Request Delivery
            </button>
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">{delivery.spoNumber}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(delivery.status)}`}
                    >
                      {delivery.status}
                    </span>
                    {delivery.driver && (
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-600">
                        Driver: {delivery.driver}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Delivery Address</p>
                        <p className="text-sm font-semibold text-gray-900">{delivery.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Calendar className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {delivery.date} - {delivery.timeSlot}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <User className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {delivery.customerName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Weight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-sm font-semibold text-gray-900">{delivery.weight}kg</p>
                      </div>
                    </div>
                  </div>

                  {delivery.instructions && (
                    <div className="mt-3 rounded-lg bg-teal-50 p-3">
                      <p className="mb-1 text-xs text-gray-600">Instructions:</p>
                      <p className="text-sm text-gray-900">{delivery.instructions}</p>
                    </div>
                  )}

                  {delivery.status === 'Delivered' && (
                    <div className="mt-3 rounded-lg bg-green-50 p-3">
                      <p className="mb-1 text-xs text-gray-600">
                        Delivered by {delivery.receivedBy} on {delivery.deliveredAt}
                      </p>
                      {delivery.driverNotes && (
                        <p className="mt-1 text-sm text-gray-900">{delivery.driverNotes}</p>
                      )}
                    </div>
                  )}

                  {delivery.status === 'Cancelled' && delivery.cancelReason && (
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <p className="mb-1 text-xs text-gray-600">Cancellation Reason:</p>
                      <p className="text-sm text-gray-900">{delivery.cancelReason}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 md:flex-col">
                  <button
                    onClick={() => handleViewDelivery(delivery)}
                    className="rounded-lg p-2 text-teal-600 transition-colors hover:bg-teal-50"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {delivery.status === 'Received' && (
                    <>
                      <button
                        onClick={() => handleEditDelivery(delivery)}
                        className="rounded-lg p-2 text-teal-600 transition-colors hover:bg-teal-50"
                        title="Edit Delivery"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleCancelDelivery(delivery)}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                        title="Cancel Delivery"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Delivery Modal */}
      {showRequestModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Request New Delivery</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex items-start gap-3 rounded-lg bg-teal-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Same-day delivery notice</p>
                  <p className="mt-1 text-xs text-gray-600">
                    Same-day delivery cannot be guaranteed. Please call 07971415430 to confirm
                    availability.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    SPO Number *
                  </label>
                  <input
                    type="text"
                    value={newDelivery.spoNumber}
                    onChange={(e) => setNewDelivery({ ...newDelivery, spoNumber: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., SPO013350"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={newDelivery.weight}
                    onChange={(e) => setNewDelivery({ ...newDelivery, weight: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Date *</label>
                  <input
                    type="date"
                    value={newDelivery.date}
                    onChange={(e) => setNewDelivery({ ...newDelivery, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Time Slot *
                  </label>
                  <select
                    value={newDelivery.timeSlot}
                    onChange={(e) => setNewDelivery({ ...newDelivery, timeSlot: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  value={newDelivery.address}
                  onChange={(e) => setNewDelivery({ ...newDelivery, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  placeholder="Full delivery address"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={newDelivery.customerName}
                    onChange={(e) =>
                      setNewDelivery({ ...newDelivery, customerName: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="Contact person name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newDelivery.phone}
                    onChange={(e) => setNewDelivery({ ...newDelivery, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    placeholder="07123456789"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Requested By
                </label>
                <input
                  type="text"
                  value={newDelivery.requestedBy}
                  onChange={(e) => setNewDelivery({ ...newDelivery, requestedBy: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  value={newDelivery.instructions}
                  onChange={(e) => setNewDelivery({ ...newDelivery, instructions: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="Any specific delivery instructions..."
                />
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestDelivery}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Delivery Modal */}
      {showViewModal && selectedDelivery && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900">
                  {selectedDelivery.spoNumber}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(selectedDelivery.status)}`}
                >
                  {selectedDelivery.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDelivery.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedDelivery.timeSlot}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedDelivery.weight}kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedDelivery.distance} miles
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="text-base font-semibold text-gray-900">{selectedDelivery.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedDelivery.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDelivery.phone}</p>
                </div>
              </div>

              {selectedDelivery.requestedBy && (
                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedDelivery.requestedBy}
                  </p>
                </div>
              )}

              {selectedDelivery.instructions && (
                <div className="rounded-lg bg-teal-50 p-4">
                  <p className="mb-1 text-sm text-gray-600">Special Instructions</p>
                  <p className="text-base text-gray-900">{selectedDelivery.instructions}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Estimated Cost</p>
                <p className="text-2xl font-bold text-teal-600">
                  £{selectedDelivery.estimatedCost.toFixed(2)}
                </p>
              </div>

              {selectedDelivery.driver && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="mb-1 text-sm text-gray-600">Assigned Driver</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDelivery.driver}</p>
                </div>
              )}

              {selectedDelivery.status === 'Delivered' && (
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="mb-2 text-sm text-gray-600">Delivery Confirmation</p>
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">Received By:</span>{' '}
                    {selectedDelivery.receivedBy}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">Delivered At:</span>{' '}
                    {selectedDelivery.deliveredAt}
                  </p>
                  {selectedDelivery.driverNotes && (
                    <p className="mt-2 text-sm text-gray-900">
                      <span className="font-semibold">Driver Notes:</span>{' '}
                      {selectedDelivery.driverNotes}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Delivery Modal */}
      {showEditModal && selectedDelivery && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">Edit Delivery</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDelivery(null);
                }}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Date</label>
                  <input
                    type="date"
                    value={selectedDelivery.date}
                    onChange={(e) =>
                      setSelectedDelivery({ ...selectedDelivery, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Time Slot
                  </label>
                  <select
                    value={selectedDelivery.timeSlot}
                    onChange={(e) =>
                      setSelectedDelivery({ ...selectedDelivery, timeSlot: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Delivery Address
                </label>
                <input
                  type="text"
                  value={selectedDelivery.address}
                  onChange={(e) =>
                    setSelectedDelivery({ ...selectedDelivery, address: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Special Instructions
                </label>
                <textarea
                  value={selectedDelivery.instructions}
                  onChange={(e) =>
                    setSelectedDelivery({ ...selectedDelivery, instructions: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  rows="3"
                />
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                <p className="text-sm text-gray-900">
                  Changes will notify the admin. Please ensure all details are correct before
                  saving.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedDelivery(null);
                }}
                className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
              >
                <Edit2 className="h-5 w-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboardHome;
