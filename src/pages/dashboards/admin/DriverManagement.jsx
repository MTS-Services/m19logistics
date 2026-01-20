import React, { useState } from 'react';
import {
  Truck,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Key,
  Upload,
  Mail,
  Phone,
  X,
  Save,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Star,
  MapPin,
  Camera,
  FileText,
  BarChart3,
  Calendar,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';

// Mock driver analytics data
const driverAnalytics = {
  weeklyDeliveries: [8, 12, 10, 14, 11, 12, 9],
  monthlyRevenue: [2400, 2800, 2600, 3200],
  topRoutes: [
    { route: 'Chester - Rhyl', count: 23 },
    { route: 'Wrexham - Nantwich', count: 18 },
    { route: 'Northwich - Newcastle', count: 15 },
  ],
};

// Add/Edit Driver Modal Component
const AddEditModal = ({ isEdit = false, driver = null, onClose }) => (
  <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEdit ? 'Edit Driver' : 'Add New Driver'}
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        <form className="space-y-6">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-teal-600 text-2xl font-bold text-white">
                {driver?.name?.charAt(0) || 'D'}
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  type="button"
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </button>
                <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                defaultValue={driver?.name}
                placeholder="Enter driver's full name"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username *</label>
              <input
                type="text"
                defaultValue={driver?.username}
                placeholder="e.g., BK01"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                defaultValue={driver?.email}
                placeholder="driver@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="tel"
                defaultValue={driver?.phone}
                placeholder="07971415430"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Password *</label>
              <input
                type="password"
                placeholder="Enter initial password"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Driver will be required to reset password on first login
              </p>
            </div>
          )}

          {/* Driver Settings */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700">Driver Settings</h3>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activeStatus"
                defaultChecked={driver?.status === 'active'}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="activeStatus" className="text-sm text-gray-700">
                Active Driver (can receive delivery assignments)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smsNotifications"
                defaultChecked={true}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="smsNotifications" className="text-sm text-gray-700">
                Enable SMS notifications for new deliveries
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailNotifications"
                defaultChecked={true}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                Enable email notifications
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-4 w-4" />
              <span>{isEdit ? 'Update Driver' : 'Create Driver'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Analytics Modal Component
const AnalyticsModal = ({ driver, onClose }) => (
  <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Driver Analytics</h2>
          <p className="mt-1 text-sm text-gray-600">
            {driver.name} (@{driver.username})
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-teal-50 p-4">
            <Package className="h-8 w-8 text-teal-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{driver.totalDeliveries}</p>
            <p className="text-sm text-gray-600">Total Deliveries</p>
          </div>

          <div className="rounded-lg bg-teal-50 p-4">
            <CheckCircle className="h-8 w-8 text-teal-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{driver.completedThisMonth}</p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>

          <div className="rounded-lg bg-teal-50 p-4">
            <Clock className="h-8 w-8 text-teal-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{driver.avgCompletionTime}</p>
            <p className="text-sm text-gray-600">Avg. Time</p>
          </div>

          <div className="rounded-lg bg-teal-50 p-4">
            <Star className="h-8 w-8 text-teal-600" />
            <p className="mt-2 text-2xl font-bold text-gray-900">{driver.rating}/5.0</p>
            <p className="text-sm text-gray-600">Rating</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Performance Metrics */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed this week</span>
                <span className="font-medium text-gray-900">{driver.completedThisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Late deliveries</span>
                <span className="font-medium text-red-600">{driver.lateDeliveries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Proof attachments</span>
                <span className="font-medium text-gray-900">{driver.proofAttachments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Feedback submitted</span>
                <span className="font-medium text-gray-900">{driver.feedbackCount}</span>
              </div>
            </div>
          </div>

          {/* Top Routes */}
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Top Routes</h3>
            <div className="mt-4 space-y-3">
              {driverAnalytics.topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{route.route}</span>
                  </div>
                  <span className="font-medium text-gray-900">{route.count} trips</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Performance Chart Placeholder */}
        <div className="mt-6 rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Weekly Deliveries</h3>
          <div className="mt-4 flex h-32 items-end justify-between space-x-2">
            {driverAnalytics.weeklyDeliveries.map((count, index) => (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t bg-blue-600 transition-all hover:bg-blue-700"
                  style={{ height: `${(count / 14) * 100}%` }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
                <span className="text-xs font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

const DriverManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const itemsPerPage = 5;

  // Pre-loaded drivers based on requirements
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'BK',
      email: 'wwwbk@yahoo.co.uk',
      phone: '07971415430',
      username: 'BK01',
      status: 'active',
      profilePhoto: '/media/profile_pics/bk_profile.jpg',
      passwordReset: true,
      // Performance metrics
      totalDeliveries: 143,
      completedThisWeek: 12,
      completedThisMonth: 47,
      avgCompletionTime: '45 min',
      lateDeliveries: 2,
      proofAttachments: 141,
      feedbackCount: 38,
      rating: 4.8,
      // Current status
      currentDeliveries: 3,
      lastActive: '2 hours ago',
      joinedDate: '2024-03-15',
    },
  ]);

  // Mock delivery data for analytics
  const driverAnalytics = {
    weeklyDeliveries: [8, 12, 10, 14, 11, 12, 9],
    monthlyRevenue: [2400, 2800, 2600, 3200],
    topRoutes: [
      { route: 'Chester - Rhyl', count: 23 },
      { route: 'Wrexham - Nantwich', count: 18 },
      { route: 'Northwich - Newcastle', count: 15 },
    ],
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || driver.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

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
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleAddDriver = () => {
    setShowAddModal(true);
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
    setShowActionDropdown(null);
  };

  const handleViewAnalytics = (driver) => {
    setSelectedDriver(driver);
    setShowAnalyticsModal(true);
    setShowActionDropdown(null);
  };

  const handleDeleteDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
    setShowActionDropdown(null);
  };

  const confirmDelete = () => {
    setDrivers(drivers.filter((d) => d.id !== selectedDriver.id));
    setShowDeleteModal(false);
    setSelectedDriver(null);
  };

  const handleResetPassword = (driver) => {
    setSelectedDriver(driver);
    setShowResetPasswordModal(true);
    setShowActionDropdown(null);
  };

  const confirmResetPassword = () => {
    alert('Password reset email sent to ' + selectedDriver.email);
    setShowResetPasswordModal(false);
    setSelectedDriver(null);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Driver Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage drivers, view performance, and track deliveries
              </p>
            </div>
            <button
              onClick={handleAddDriver}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add Driver</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
              <Truck className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Drivers</p>
                <p className="text-2xl font-bold text-teal-600">
                  {drivers.filter((d) => d.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-teal-600">
                  {drivers.reduce((sum, d) => sum + d.completedThisWeek, 0)}
                </p>
              </div>
              <Calendar className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-teal-600">
                  {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-10 w-10 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search drivers by name, email, or username..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Driver Table */}
        <div className="overflow-visible rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Driver Records</h2>
          </div>

          {/* Table Content */}
          {filteredDrivers.length === 0 ? (
            <div className="p-12 text-center">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No drivers found</h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting your search or filter criteria, or add a new driver
              </p>
              <button
                onClick={handleAddDriver}
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add First Driver</span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden overflow-visible lg:block">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedDrivers.map((driver) => (
                      <tr key={driver.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              {driver.profilePhoto ? (
                                <img
                                  src={driver.profilePhoto}
                                  alt={driver.name}
                                  className="h-10 w-10 rounded-full border-2 border-teal-100 object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-100 bg-gradient-to-br from-teal-500 to-teal-600 text-sm font-bold text-white">
                                  {driver.name.charAt(0)}
                                </div>
                              )}
                              <div
                                className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${
                                  driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                              ></div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{driver.name}</p>
                                {driver.rating && (
                                  <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5">
                                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                    <span className="text-xs font-medium text-yellow-700">
                                      {driver.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-gray-600">@{driver.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{driver.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{driver.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Package className="h-3 w-3 text-teal-600" />
                                <p className="text-sm font-bold text-gray-900">
                                  {driver.totalDeliveries}
                                </p>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500">Total</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3 text-teal-600" />
                                <p className="text-sm font-bold text-gray-900">
                                  {driver.completedThisWeek}
                                </p>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500">This Week</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Clock className="h-3 w-3 text-teal-600" />
                                <p className="text-sm font-bold text-gray-900">
                                  {driver.avgCompletionTime}
                                </p>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-500">Avg. Time</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {driver.status === 'active' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800">
                                Inactive
                              </span>
                            )}
                            {driver.passwordReset && (
                              <div className="text-xs text-yellow-600">⚠️ Password Reset</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowActionDropdown(
                                  showActionDropdown === driver.id ? null : driver.id
                                )
                              }
                              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50"
                            >
                              <EllipsisVertical className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {showActionDropdown === driver.id && (
                              <div
                                className="absolute top-full right-0 z-[999] mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-xl"
                                style={{ position: 'absolute' }}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => handleViewAnalytics(driver)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                  >
                                    <BarChart3 className="h-4 w-4" />
                                    View Analytics
                                  </button>
                                  <button
                                    onClick={() => handleEditDriver(driver)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit Driver
                                  </button>
                                  <button
                                    onClick={() => handleResetPassword(driver)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                  >
                                    <Key className="h-4 w-4" />
                                    Reset Password
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDriver(driver)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Driver
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View - Hidden on desktop */}
              <div className="divide-y divide-gray-200 lg:hidden">
                {paginatedDrivers.map((driver) => (
                  <div key={driver.id} className="p-4 transition-colors hover:bg-gray-50">
                    {/* Card Header */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {driver.profilePhoto ? (
                            <img
                              src={driver.profilePhoto}
                              alt={driver.name}
                              className="h-12 w-12 rounded-full border-2 border-teal-100 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-100 bg-gradient-to-br from-teal-500 to-teal-600 text-lg font-bold text-white">
                              {driver.name.charAt(0)}
                            </div>
                          )}
                          <div
                            className={`absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white ${
                              driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}
                          ></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{driver.name}</p>
                            {driver.rating && (
                              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5">
                                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-xs font-medium text-yellow-700">
                                  {driver.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">@{driver.username}</p>
                        </div>
                      </div>
                      {driver.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{driver.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{driver.phone}</span>
                      </div>

                      {/* Performance Metrics */}
                      <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-teal-50 p-3">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Package className="h-3 w-3 text-teal-600" />
                            <p className="text-lg font-bold text-gray-900">
                              {driver.totalDeliveries}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600">Total</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle className="h-3 w-3 text-teal-600" />
                            <p className="text-lg font-bold text-gray-900">
                              {driver.completedThisWeek}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600">This Week</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="h-3 w-3 text-teal-600" />
                            <p className="text-lg font-bold text-gray-900">
                              {driver.avgCompletionTime}
                            </p>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600">Avg. Time</p>
                        </div>
                      </div>

                      {driver.passwordReset && (
                        <div className="rounded-md bg-yellow-50 p-2">
                          <p className="text-xs text-yellow-800">⚠️ Password reset required</p>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionDropdown(
                              showActionDropdown === driver.id ? null : driver.id
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                          Actions
                        </button>

                        {/* Dropdown Menu */}
                        {showActionDropdown === driver.id && (
                          <div
                            className={`absolute right-0 left-0 z-50 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedDrivers.length > 1 && paginatedDrivers.indexOf(driver) >= paginatedDrivers.length - 1 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleViewAnalytics(driver)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                <BarChart3 className="h-4 w-4" />
                                View Analytics
                              </button>
                              <button
                                onClick={() => handleEditDriver(driver)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                <Edit className="h-4 w-4" />
                                Edit Driver
                              </button>
                              <button
                                onClick={() => handleResetPassword(driver)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                <Key className="h-4 w-4" />
                                Reset Password
                              </button>
                              <button
                                onClick={() => handleDeleteDriver(driver)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Driver
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {filteredDrivers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDrivers.length}
            />
          )}
        </div>

        {/* Modals */}
        {showAddModal && <AddEditModal onClose={() => setShowAddModal(false)} />}
        {showEditModal && (
          <AddEditModal
            isEdit
            driver={selectedDriver}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDriver(null);
            }}
          />
        )}
        {showAnalyticsModal && (
          <AnalyticsModal
            driver={selectedDriver}
            onClose={() => {
              setShowAnalyticsModal(false);
              setSelectedDriver(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDriver && (
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
                  Delete Driver
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Are you sure you want to delete <strong>{selectedDriver.name}</strong>? This
                  action cannot be undone and will remove all driver data.
                </p>

                {/* Driver Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium text-gray-900">@{selectedDriver.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{selectedDriver.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Deliveries:</span>
                      <span className="font-medium text-gray-900">
                        {selectedDriver.totalDeliveries}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="flex items-center gap-1 font-medium text-gray-900">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {selectedDriver.rating}
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
                    <span>Delete Driver</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Confirmation Modal */}
        {showResetPasswordModal && selectedDriver && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Reset Password</h2>
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                  Reset Password
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Send a password reset link to <strong>{selectedDriver.name}</strong>?
                </p>

                {/* Driver Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedDriver.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedDriver.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-800">
                    📧 A password reset link will be sent to the driver's email address. The link
                    will expire in 24 hours.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowResetPasswordModal(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmResetPassword}
                    className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Key className="h-4 w-4" />
                    <span>Send Reset Link</span>
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

export default DriverManagement;
