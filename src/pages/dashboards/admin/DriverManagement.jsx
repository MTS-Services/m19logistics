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
} from 'lucide-react';

const DriverManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedView, setSelectedView] = useState('grid'); // 'grid' or 'list'

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

  const handleAddDriver = () => {
    setShowAddModal(true);
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setShowEditModal(true);
  };

  const handleViewAnalytics = (driver) => {
    setSelectedDriver(driver);
    setShowAnalyticsModal(true);
  };

  const handleDeleteDriver = (driverId) => {
    if (
      window.confirm('Are you sure you want to delete this driver? This action cannot be undone.')
    ) {
      setDrivers(drivers.filter((d) => d.id !== driverId));
    }
  };

  const handleResetPassword = (driverId) => {
    if (window.confirm('Send password reset email to this driver?')) {
      alert('Password reset email sent!');
    }
  };

  const DriverCard = ({ driver }) => {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg">
        {/* Driver Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Photo */}
            <div className="relative">
              {driver.profilePhoto ? (
                <img
                  src={driver.profilePhoto}
                  alt={driver.name}
                  className="h-16 w-16 rounded-full border-4 border-teal-100 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-teal-100 bg-gradient-to-br from-teal-500 to-teal-600 text-xl font-bold text-white">
                  {driver.name.charAt(0)}
                </div>
              )}
              {/* Status Indicator */}
              <div
                className={`absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-white ${
                  driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}
              ></div>
            </div>

            {/* Driver Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{driver.name}</h3>
                {driver.rating && (
                  <div className="flex items-center space-x-1 rounded-full bg-yellow-100 px-2 py-0.5">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium text-yellow-700">{driver.rating}</span>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">@{driver.username}</p>

              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{driver.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{driver.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewAnalytics(driver)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
              title="View analytics"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleEditDriver(driver)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Edit driver"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleResetPassword(driver.id)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-yellow-50 hover:text-yellow-600"
              title="Reset password"
            >
              <Key className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteDriver(driver.id)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Delete driver"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Package className="h-4 w-4 text-teal-600" />
              <p className="text-2xl font-bold text-gray-900">{driver.totalDeliveries}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">Total Deliveries</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircle className="h-4 w-4 text-teal-600" />
              <p className="text-2xl font-bold text-gray-900">{driver.completedThisWeek}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">This Week</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-4 w-4 text-teal-600" />
              <p className="text-2xl font-bold text-gray-900">{driver.avgCompletionTime}</p>
            </div>
            <p className="mt-1 text-xs text-gray-500">Avg. Time</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-teal-50 p-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-900">
              {driver.currentDeliveries} active{' '}
              {driver.currentDeliveries === 1 ? 'delivery' : 'deliveries'}
            </span>
          </div>
          <span className="text-xs text-teal-700">Last active: {driver.lastActive}</span>
        </div>

        {/* Warnings */}
        {driver.passwordReset && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3">
            <p className="text-xs text-yellow-800">⚠️ Password reset required on first login</p>
          </div>
        )}

        {driver.lateDeliveries > 0 && (
          <div className="mt-2 rounded-md bg-red-50 p-3">
            <p className="text-xs text-red-800">
              ⚠️ {driver.lateDeliveries} late{' '}
              {driver.lateDeliveries === 1 ? 'delivery' : 'deliveries'} this month
            </p>
          </div>
        )}
      </div>
    );
  };

  const AddEditModal = ({ isEdit = false, driver = null, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
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
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-2xl font-bold text-white">
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
                <label className="block text-sm font-medium text-gray-700">
                  Initial Password *
                </label>
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
                className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
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

  const AnalyticsModal = ({ driver, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage drivers, view performance, and track deliveries
          </p>
        </div>
        <button
          onClick={handleAddDriver}
          className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Driver</span>
        </button>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Driver List */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((driver) => <DriverCard key={driver.id} driver={driver} />)
        ) : (
          <div className="col-span-full rounded-lg bg-white p-12 text-center shadow-sm">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No drivers found</h3>
            <p className="mt-2 text-sm text-gray-600">
              Try adjusting your search or filter criteria, or add a new driver
            </p>
            <button
              onClick={handleAddDriver}
              className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add First Driver</span>
            </button>
          </div>
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
    </div>
  );
};

export default DriverManagement;
