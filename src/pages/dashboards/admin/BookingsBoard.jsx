import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  Weight,
  AlertCircle,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';

const BookingsBoard = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const itemsPerPage = 5;

  // Convert bookings to a flat array structure
  const allDeliveries = [
    // Received deliveries
    {
      id: 1,
      spoNumber: 'SPO013349',
      customer: 'Topps Tiles Wrexham (T022)',
      deliveryDate: '2026-01-20',
      timeSlot: 'AM',
      weight: '800 kg',
      address: '4 Bumpers Lane, Chester, CH1 4LY',
      contact: 'John Smith',
      phone: '01244 398888',
      status: 'Received',
      cost: 45.0,
    },
    {
      id: 2,
      spoNumber: 'SPO013348',
      customer: 'Topps Tiles Chester (T045)',
      deliveryDate: '2026-01-18',
      timeSlot: 'PM',
      weight: '1600 kg',
      address: 'Unit 4, Lyme Court, Newcastle, ST5 3TF',
      contact: 'Sarah Jones',
      phone: '01492 234567',
      status: 'Received',
      cost: 100.0,
    },
    // Allocated deliveries
    {
      id: 3,
      spoNumber: 'SPO013347',
      customer: 'Topps Tiles Llandudno (T089)',
      deliveryDate: '2026-01-16',
      timeSlot: 'AM',
      weight: '800 kg',
      address: '152 Vale Road, Rhyl, LL18 2PD',
      driver: 'BK',
      status: 'Allocated',
      cost: 45.0,
    },
    {
      id: 4,
      spoNumber: 'SPO013346',
      customer: 'Topps Tiles Mold (T067)',
      deliveryDate: '2026-01-15',
      timeSlot: 'PM',
      weight: '2400 kg',
      address: '321 Station Road, Mold, CH7 1DD',
      driver: 'BK',
      status: 'Allocated',
      cost: 140.63,
    },
    // Delivered deliveries
    {
      id: 5,
      spoNumber: 'SPO013345',
      customer: 'Topps Tiles Bangor (T112)',
      deliveryDate: '2026-01-12',
      timeSlot: 'AM',
      weight: '1600 kg',
      address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
      driver: 'BK',
      status: 'Delivered',
      cost: 90.0,
      deliveredAt: '2026-01-12 10:15',
      receivedBy: 'Mark Johnson',
    },
    {
      id: 6,
      spoNumber: 'SPO013344',
      customer: 'Topps Tiles Wrexham (T022)',
      deliveryDate: '2026-01-10',
      timeSlot: 'PM',
      weight: '800 kg',
      address: '4 Bumpers Lane, Chester, CH1 4LY',
      driver: 'BK',
      status: 'Delivered',
      cost: 45.0,
      deliveredAt: '2026-01-10 15:30',
      receivedBy: 'Jane Roberts',
    },
    // Cancelled delivery
    {
      id: 7,
      spoNumber: 'SPO013343',
      customer: 'Topps Tiles Northwich (T143)',
      deliveryDate: '2026-01-08',
      timeSlot: 'AM',
      weight: '800 kg',
      address: 'Wadebrook Retail Park, Northwich, CW9 5NN',
      status: 'Cancelled',
      cost: 45.0,
      cancelledAt: '2026-01-07 14:00',
      cancelReason: 'Customer requested postponement',
    },
  ];

  // Calculate statistics
  const stats = {
    total: allDeliveries.length,
    received: allDeliveries.filter((d) => d.status === 'Received').length,
    allocated: allDeliveries.filter((d) => d.status === 'Allocated').length,
    delivered: allDeliveries.filter((d) => d.status === 'Delivered').length,
    cancelled: allDeliveries.filter((d) => d.status === 'Cancelled').length,
  };

  // Filter deliveries
  const filteredDeliveries = allDeliveries.filter((delivery) => {
    const matchesStatus =
      filterStatus === 'all' || delivery.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      delivery.spoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change with page reset
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  // Handle search with page reset
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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

  // Handle actions
  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
    setShowActionDropdown(null);
  };

  const handleEditDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
    setShowActionDropdown(null);
  };

  const handleDeleteDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeleteModal(true);
    setShowActionDropdown(null);
  };

  const confirmDelete = () => {
    console.log('Delete delivery:', selectedDelivery);
    // Add actual delete logic here
    setShowDeleteModal(false);
    setSelectedDelivery(null);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Bookings Board
          </h1>
          <p className="mt-2 text-gray-600">Manage all delivery bookings in one place</p>
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
                <p className="text-xs text-gray-600">Received</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.received}</p>
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
                <p className="text-xs text-gray-600">Delivered</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.delivered}</p>
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none sm:text-base"
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  filterStatus === 'all'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => handleFilterChange('received')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  filterStatus === 'received'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Received
              </button>
              <button
                onClick={() => handleFilterChange('allocated')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  filterStatus === 'allocated'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Allocated
              </button>
              <button
                onClick={() => handleFilterChange('delivered')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  filterStatus === 'delivered'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => handleFilterChange('cancelled')}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                  filterStatus === 'cancelled'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelled
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
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden overflow-x-auto lg:block">
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
                    {paginatedDeliveries.map((delivery) => {
                      const StatusIcon = getStatusIcon(delivery.status);
                      return (
                        <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">
                                {delivery.spoNumber}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {delivery.deliveryDate}
                                </p>
                                <p className="text-xs text-gray-600">{delivery.timeSlot}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-900">{delivery.customer}</p>
                                <p className="text-xs text-gray-600">{delivery.address}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Weight className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{delivery.weight}</span>
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
                              £{delivery.cost.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowActionDropdown(
                                    showActionDropdown === delivery.id ? null : delivery.id
                                  )
                                }
                                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50"
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {showActionDropdown === delivery.id && (
                                <div
                                  className={`absolute right-0 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedDeliveries.indexOf(delivery) >= paginatedDeliveries.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleViewDelivery(delivery)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                      <Eye className="h-4 w-4" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() => handleEditDelivery(delivery)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDelivery(delivery)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Hidden on desktop */}
              <div className="divide-y divide-gray-200 lg:hidden">
                {paginatedDeliveries.map((delivery) => {
                  const StatusIcon = getStatusIcon(delivery.status);
                  return (
                    <div key={delivery.id} className="p-4 transition-colors hover:bg-gray-50">
                      {/* Card Header */}
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{delivery.spoNumber}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(
                            delivery.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {delivery.status}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-600">Date & Time</p>
                            <p className="font-medium text-gray-900">
                              {delivery.deliveryDate} - {delivery.timeSlot}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-600">Delivery Address</p>
                            <p className="font-medium text-gray-900">{delivery.customer}</p>
                            <p className="text-xs text-gray-600">{delivery.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-600">Weight</p>
                              <p className="font-medium text-gray-900">{delivery.weight}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Cost</p>
                            <p className="font-semibold text-gray-900">
                              £{delivery.cost.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionDropdown(
                                showActionDropdown === delivery.id ? null : delivery.id
                              )
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                            Actions
                          </button>

                          {/* Dropdown Menu */}
                          {showActionDropdown === delivery.id && (
                            <div
                              className={`absolute right-0 left-0 z-50 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedDeliveries.indexOf(delivery) >= paginatedDeliveries.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewDelivery(delivery)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleEditDelivery(delivery)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteDelivery(delivery)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {filteredDeliveries.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDeliveries.length}
            />
          )}
        </div>

        {/* View Details Modal */}
        {showViewModal && selectedDelivery && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
                  <p className="mt-1 text-sm text-gray-600">{selectedDelivery.spoNumber}</p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(selectedDelivery.status)}`}
                    >
                      {selectedDelivery.status}
                    </span>
                  </div>

                  {/* Customer Information */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">Customer Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <User className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Customer</p>
                          <p className="font-medium text-gray-900">{selectedDelivery.customer}</p>
                        </div>
                      </div>
                      {selectedDelivery.contact && (
                        <div className="flex items-start gap-2">
                          <User className="mt-0.5 h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Contact Person</p>
                            <p className="font-medium text-gray-900">{selectedDelivery.contact}</p>
                          </div>
                        </div>
                      )}
                      {selectedDelivery.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="mt-0.5 h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">{selectedDelivery.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">Delivery Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium text-gray-900">{selectedDelivery.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Scheduled Date & Time</p>
                          <p className="font-medium text-gray-900">
                            {selectedDelivery.deliveryDate} - {selectedDelivery.timeSlot}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Weight className="mt-0.5 h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Weight</p>
                          <p className="font-medium text-gray-900">{selectedDelivery.weight}</p>
                        </div>
                      </div>
                      {selectedDelivery.driver && (
                        <div className="flex items-start gap-2">
                          <Truck className="mt-0.5 h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Assigned Driver</p>
                            <p className="font-medium text-gray-900">{selectedDelivery.driver}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cost Information */}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h3 className="mb-3 font-semibold text-gray-900">Cost</h3>
                    <p className="text-2xl font-bold text-teal-600">
                      £{selectedDelivery.cost.toFixed(2)}
                    </p>
                  </div>

                  {/* Additional Info */}
                  {selectedDelivery.deliveredAt && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <h3 className="mb-2 font-semibold text-green-900">Delivery Completed</h3>
                      <p className="text-sm text-green-700">
                        Delivered at: {selectedDelivery.deliveredAt}
                      </p>
                      {selectedDelivery.receivedBy && (
                        <p className="text-sm text-green-700">
                          Received by: {selectedDelivery.receivedBy}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedDelivery.cancelReason && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <h3 className="mb-2 font-semibold text-gray-900">Cancellation Reason</h3>
                      <p className="text-sm text-gray-700">{selectedDelivery.cancelReason}</p>
                      {selectedDelivery.cancelledAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          Cancelled at: {selectedDelivery.cancelledAt}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDelivery && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Delivery</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <form className="space-y-6">
                  {/* SPO Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SPO Number</label>
                    <input
                      type="text"
                      defaultValue={selectedDelivery.spoNumber}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      readOnly
                    />
                  </div>

                  {/* Customer */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer</label>
                    <input
                      type="text"
                      defaultValue={selectedDelivery.customer}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Address
                    </label>
                    <textarea
                      defaultValue={selectedDelivery.address}
                      rows={3}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Delivery Date
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedDelivery.deliveryDate}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                      <select
                        defaultValue={selectedDelivery.timeSlot}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Weight and Cost */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Weight</label>
                      <input
                        type="text"
                        defaultValue={selectedDelivery.weight}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cost (£)</label>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={selectedDelivery.cost}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      defaultValue={selectedDelivery.status}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="Received">Received</option>
                      <option value="Allocated">Allocated</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Modal Actions */}
                  <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowEditModal(false);
                      }}
                      className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDelivery && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                  Delete Delivery
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Are you sure you want to delete delivery{' '}
                  <strong>{selectedDelivery.spoNumber}</strong>? This action cannot be undone.
                </p>

                {/* Delivery Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-900">{selectedDelivery.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">
                        {selectedDelivery.deliveryDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${selectedDelivery.status === 'Cancelled' ? 'text-gray-600' : 'text-red-600'}`}
                      >
                        {selectedDelivery.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Delivery</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsBoard;
