import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import axiosInstance from '../../../../services/axiosInstance';

import AddEditModal from './components/AddEditModal';
import AnalyticsModal from './components/AnalyticsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ActionDropdown from './components/ActionDropdown';

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
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;

  // Fetch drivers from API
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/admin/users?role=DRIVER');

      if (response.data.success) {
        const mappedDrivers = response.data.data.map((driver) => ({
          id: driver.id,
          name: driver.fullName,
          email: driver.email,
          phone: driver.phone,
          username: driver.username,
          status: driver.isActive ? 'active' : 'inactive',
          profilePhoto: driver.profilePicture,
          passwordReset: driver.requirePasswordReset,
          // Driver profile data
          vehicleRegistration: driver.driverProfile?.vehicleRegistration || '',
          driverLicenseNumber: driver.driverProfile?.driverLicenseNumber || '',
          address: driver.driverProfile?.address || '',
          enableSmsNotifications: driver.driverProfile?.enableSmsNotifications || false,
          enableEmailNotifications: driver.driverProfile?.enableEmailNotifications || true,
          // Performance metrics from API
          totalDeliveries: driver._count?.deliveriesAssigned || 0,
          completedThisWeek: 0, // Not available from API
          completedThisMonth: 0, // Not available from API
          avgCompletionTime: 'N/A',
          lateDeliveries: 0,
          proofAttachments: 0,
          feedbackCount: 0,
          rating: null,
          // Current status
          currentDeliveries: driver._count?.deliveriesAssigned || 0,
          lastActive: driver.lastLogin ? new Date(driver.lastLogin).toLocaleDateString() : 'Never',
          joinedDate: new Date(driver.createdAt).toLocaleDateString(),
        }));
        setDrivers(mappedDrivers);
      } else {
        setError('Failed to fetch drivers');
      }
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching drivers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDropdown = event.target.closest('.action-dropdown-container');
      if (!isInsideDropdown) {
        setShowActionDropdown(null);
      }
    };

    if (showActionDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionDropdown]);



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

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await axiosInstance.delete(`/api/admin/users/${selectedDriver.id}`);
      toast.success(response.data.message );
      fetchDrivers();
      setShowDeleteModal(false);
      setSelectedDriver(null);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsDeleting(false);
    }
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
    <div className="p-2 sm:p-6 ">
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add Driver</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-2 text-gray-600">Loading drivers...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start">
              <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <h3 className="text-base font-semibold text-red-900">Error Loading Drivers</h3>
                <p className="mt-1 text-base text-red-700">{error}</p>
                <button
                  onClick={fetchDrivers}
                  className="mt-3 rounded bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && (
          <>
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-teal-100 bg-linear-to-br from-teal-500 to-teal-600 text-sm font-bold text-white">
                                      {driver.name.charAt(0)}
                                    </div>
                                  )}
                                  <div
                                    className={`absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white ${driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
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
                             
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="relative action-dropdown-container">
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
                                  <ActionDropdown
                                    driver={driver}
                                    onViewAnalytics={handleViewAnalytics}
                                    onEdit={handleEditDriver}
                                    onResetPassword={handleResetPassword}
                                    onDelete={handleDeleteDriver}
                                  />
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
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-teal-100 bg-linear-to-br from-teal-500 to-teal-600 text-lg font-bold text-white">
                                  {driver.name.charAt(0)}
                                </div>
                              )}
                              <div
                                className={`absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white ${driver.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
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

                       
                        </div>

                        {/* Card Actions */}
                        <div className="mt-3 border-t border-gray-100 pt-3">
                          <div className="relative action-dropdown-container">
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
                              <ActionDropdown
                                driver={driver}
                                onViewAnalytics={handleViewAnalytics}
                                onEdit={handleEditDriver}
                                onResetPassword={handleResetPassword}
                                onDelete={handleDeleteDriver}
                              />
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
          </>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddEditModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchDrivers}
          />
        )}
        {showEditModal && (
          <AddEditModal
            isEdit
            driver={selectedDriver}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDriver(null);
            }}
            onSuccess={fetchDrivers}
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
          <DeleteConfirmModal
            driver={selectedDriver}
            isDeleting={isDeleting}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        )}

        {/* Reset Password Confirmation Modal */}
        {showResetPasswordModal && selectedDriver && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setShowResetPasswordModal(false);
            }}
          >
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
                    A password reset link will be sent to the driver's email address. The link
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












