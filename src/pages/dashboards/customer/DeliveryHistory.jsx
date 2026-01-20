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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DeliveryHistory = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    {
      id: 6,
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
    {
      id: 7,
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

  // Handle view delivery
  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  // Export to Excel
  const handleExportCSV = () => {
    // Prepare data for export based on current filter
    const dataToExport = filteredDeliveries.map((delivery, index) => ({
      'No.': index + 1,
      'SPO Number': delivery.spoNumber,
      Date: delivery.date,
      'Time Slot': delivery.timeSlot,
      'Customer Name': delivery.customerName,
      Phone: delivery.phone,
      'Delivery Address': delivery.address,
      'Weight (kg)': delivery.weight,
      'Distance (miles)': delivery.distance,
      Status: delivery.status,
      'Cost (£)': delivery.estimatedCost.toFixed(2),
      Driver: delivery.driver || 'Not Assigned',
      'Requested By': delivery.requestedBy || '',
      Instructions: delivery.instructions || '',
      'Created At': delivery.createdAt,
      ...(delivery.deliveredAt && { 'Delivered At': delivery.deliveredAt }),
      ...(delivery.receivedBy && { 'Received By': delivery.receivedBy }),
      ...(delivery.driverNotes && { 'Driver Notes': delivery.driverNotes }),
      ...(delivery.cancelledAt && { 'Cancelled At': delivery.cancelledAt }),
      ...(delivery.cancelReason && { 'Cancel Reason': delivery.cancelReason }),
    }));

    // Convert to CSV
    if (dataToExport.length === 0) {
      return;
    }

    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(','),
      ...dataToExport.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || '';
            // Escape commas and quotes in values
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Generate filename based on filter status
    const statusLabel =
      filterStatus === 'all'
        ? 'All'
        : filterStatus === 'received'
          ? 'Pending'
          : filterStatus === 'allocated'
            ? 'In-Progress'
            : filterStatus === 'delivered'
              ? 'Completed'
              : filterStatus;
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `M19Logistics_Delivery_History_${statusLabel}_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Delivery History
        </h1>
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
                  ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('received')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                filterStatus === 'received'
                  ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('allocated')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                filterStatus === 'allocated'
                  ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleFilterChange('delivered')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${
                filterStatus === 'delivered'
                  ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Completed
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 sm:gap-2 sm:px-4 sm:text-sm"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Export</span>
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
                              <p className="text-sm font-medium text-gray-900">{delivery.date}</p>
                              <p className="text-xs text-gray-600">{delivery.timeSlot}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
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
                            className="flex items-center gap-1 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
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
                            {delivery.date} - {delivery.timeSlot}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600">Delivery Address</p>
                          <p className="font-medium text-gray-900">{delivery.customerName}</p>
                          <p className="text-xs text-gray-600">{delivery.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-600">Weight</p>
                            <p className="font-medium text-gray-900">{delivery.weight} kg</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Cost</p>
                          <p className="font-semibold text-gray-900">
                            £{delivery.estimatedCost.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Action */}
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleViewDelivery(delivery)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Pagination - Inside table container */}
        {filteredDeliveries.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Items count */}
              <div className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-gray-900">
                  {Math.min(currentPage * itemsPerPage, filteredDeliveries.length)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{filteredDeliveries.length}</span>{' '}
                results
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    currentPage === 1
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                          : 'border border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    currentPage === totalPages
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-teal-500 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                >
                  <span className="mr-1 hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedDelivery && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
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
