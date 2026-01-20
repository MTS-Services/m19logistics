import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Key,
  Shield,
  Truck,
  UserCheck,
  Building,
  Mail,
  Phone,
  X,
  Save,
  Upload,
  EllipsisVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const itemsPerPage = 5;

  // Pre-loaded users based on requirements
  const [users, setUsers] = useState([
    // Customers (Topps Tiles Stores)
    {
      id: 1,
      name: 'Topps Chester',
      email: 'topps022@toppstiles.co.uk',
      phone: '01244 398888',
      username: 'T022',
      role: 'customer',
      depot: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
      pricingTier: 'Tier B',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    {
      id: 2,
      name: 'Topps Nantwich',
      email: 'topps226@toppstiles.co.uk',
      phone: '01270 625222',
      username: 'T226',
      role: 'customer',
      depot: 'Unit 1, Nantwich Trade Park, CW5 6HL',
      pricingTier: 'Tier B',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    {
      id: 3,
      name: 'Topps Newcastle',
      email: 'topps167@toppstiles.co.uk',
      phone: '01782 717171',
      username: 'T167',
      role: 'customer',
      depot: 'Unit 4, Lyme Court, ST5 3TF',
      pricingTier: 'Tier A',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    {
      id: 4,
      name: 'Topps Northwich',
      email: 'topps143@toppstiles.co.uk',
      phone: '01606 44411',
      username: 'T143',
      role: 'customer',
      depot: 'Wadebrook Retail Park, CW9 5NN',
      pricingTier: 'Tier B',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    {
      id: 5,
      name: 'Topps Rhyl',
      email: 'topps211@toppstiles.co.uk',
      phone: '01745 342152',
      username: 'T211',
      role: 'customer',
      depot: '152 Vale Road, Rhyl, LL18 2PD',
      pricingTier: 'Tier B',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    {
      id: 6,
      name: 'Topps Wrexham',
      email: 'topps217@toppstiles.co.uk',
      phone: '01978 664411',
      username: 'T217',
      role: 'customer',
      depot: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
      pricingTier: 'Tier B',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    // Drivers
    {
      id: 7,
      name: 'BK',
      email: 'wwwbk@yahoo.co.uk',
      phone: '07971415430',
      username: 'BK01',
      role: 'driver',
      status: 'active',
      passwordReset: true,
      profilePhoto: '/media/profile_pics/bk_profile.jpg',
    },
    // Area Managers
    {
      id: 8,
      name: 'Rob Myers',
      email: 'rob.myers@toppstiles.com',
      phone: '07725957625',
      username: 'Rob01',
      role: 'area_manager',
      accessScope: 'All Topps Tiles stores',
      status: 'active',
      passwordReset: true,
      profilePhoto: null,
    },
    // Admin
    {
      id: 9,
      name: 'Ben Admin',
      email: 'ben@m19logistics.com',
      phone: '07971415430',
      username: 'admin',
      role: 'admin',
      status: 'active',
      passwordReset: false,
      profilePhoto: null,
    },
  ]);

  const roleConfig = {
    admin: { icon: Shield, color: 'text-teal-700 bg-teal-100', label: 'Administrator' },
    driver: { icon: Truck, color: 'text-teal-700 bg-teal-100', label: 'Driver' },
    customer: { icon: Building, color: 'text-teal-700 bg-teal-100', label: 'Customer' },
    area_manager: {
      icon: UserCheck,
      color: 'text-teal-700 bg-teal-100',
      label: 'Area Manager',
    },
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change with page reset
  const handleFilterChange = (role) => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  // Handle search with page reset
  const handleSearchChange = (query) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
    setShowActionDropdown(null);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    setShowActionDropdown(null);
  };

  const confirmDelete = () => {
    setUsers(users.filter((u) => u.id !== selectedUser.id));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setShowResetPasswordModal(true);
    setShowActionDropdown(null);
  };

  const confirmResetPassword = () => {
    // API call to reset password
    alert('Password reset email sent to ' + selectedUser.email);
    setShowResetPasswordModal(false);
    setSelectedUser(null);
  };

  const AddEditModal = ({ isEdit = false, user = null, onClose }) => (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit User' : 'Add New User'}
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
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Username *</label>
                <input
                  type="text"
                  defaultValue={user?.username}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  defaultValue={user?.phone}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role *</label>
              <select
                defaultValue={user?.role || 'customer'}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                <option value="customer">Customer</option>
                <option value="driver">Driver</option>
                <option value="area_manager">Area Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {/* Customer-specific fields */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">Customer-Specific Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">Depot Address</label>
                <textarea
                  defaultValue={user?.depot}
                  rows={2}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pricing Tier</label>
                <select
                  defaultValue={user?.pricingTier || 'Tier B'}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Tier A">Tier A (£50.00 per 800kg)</option>
                  <option value="Tier B">Tier B (£45.00 per 800kg)</option>
                </select>
              </div>
            </div>

            {/* Area Manager-specific fields */}
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">Area Manager Settings</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700">Access Scope</label>
                <input
                  type="text"
                  defaultValue={user?.accessScope}
                  placeholder="e.g., All Topps Tiles stores"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  User will be required to reset password on first login
                </p>
              </div>
            )}

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
                <span>{isEdit ? 'Update User' : 'Create User'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-600 sm:mt-2">
                Manage admins, drivers, customers, and area managers
              </p>
            </div>
            <button
              onClick={handleAddUser}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-teal-600">
                  {users.filter((u) => u.role === 'customer').length}
                </p>
              </div>
              <Building className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drivers</p>
                <p className="text-2xl font-bold text-teal-600">
                  {users.filter((u) => u.role === 'driver').length}
                </p>
              </div>
              <Truck className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-teal-600">
                  {users.filter((u) => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-10 w-10 text-teal-600" />
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
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="driver">Drivers</option>
              <option value="area_manager">Area Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">User Records</h2>
          </div>

          {/* Table Content */}
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
              <p className="mt-2 text-sm text-gray-600">
                Try adjusting your search or filter criteria
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
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                        Role
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
                    {paginatedUsers.map((user) => {
                      const RoleIcon = roleConfig[user.role]?.icon || Users;
                      return (
                        <tr key={user.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.profilePhoto ? (
                                <img
                                  src={user.profilePhoto}
                                  alt={user.name}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-bold text-white">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-600">@{user.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-2 text-sm text-gray-900">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{user.phone}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${roleConfig[user.role]?.color}`}
                            >
                              <RoleIcon className="h-3 w-3" />
                              {roleConfig[user.role]?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.passwordReset ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                                Password Reset Required
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowActionDropdown(
                                    showActionDropdown === user.id ? null : user.id
                                  )
                                }
                                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:bg-gray-50"
                              >
                                <EllipsisVertical className="h-4 w-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {showActionDropdown === user.id && (
                                <div
                                  className={`absolute right-0 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedUsers.indexOf(user) >= paginatedUsers.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleEditUser(user)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit User
                                    </button>
                                    <button
                                      onClick={() => handleResetPassword(user)}
                                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                    >
                                      <Key className="h-4 w-4" />
                                      Reset Password
                                    </button>
                                    {user.role !== 'admin' && (
                                      <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete User
                                      </button>
                                    )}
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
                {paginatedUsers.map((user) => {
                  const RoleIcon = roleConfig[user.role]?.icon || Users;
                  return (
                    <div key={user.id} className="p-4 transition-colors hover:bg-gray-50">
                      {/* Card Header */}
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-lg font-bold text-white">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-600">@{user.username}</p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleConfig[user.role]?.color}`}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {roleConfig[user.role]?.label}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{user.phone}</span>
                        </div>
                        {user.passwordReset && (
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
                              setShowActionDropdown(showActionDropdown === user.id ? null : user.id)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                            Actions
                          </button>

                          {/* Dropdown Menu */}
                          {showActionDropdown === user.id && (
                            <div
                              className={`absolute right-0 left-0 z-50 rounded-lg border border-gray-200 bg-white shadow-lg ${paginatedUsers.indexOf(user) >= paginatedUsers.length - 2 ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit User
                                </button>
                                <button
                                  onClick={() => handleResetPassword(user)}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                  <Key className="h-4 w-4" />
                                  Reset Password
                                </button>
                                {user.role !== 'admin' && (
                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete User
                                  </button>
                                )}
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
          {filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredUsers.length}
            />
          )}
        </div>

        {/* Modals */}
        {showAddModal && <AddEditModal onClose={() => setShowAddModal(false)} />}
        {showEditModal && (
          <AddEditModal
            isEdit
            user={selectedUser}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
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
                  Delete User
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action
                  cannot be undone.
                </p>

                {/* User Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium text-gray-900">@{selectedUser.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {selectedUser.role}
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
                    <span>Delete User</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Confirmation Modal */}
        {showResetPasswordModal && selectedUser && (
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
                  Send a password reset link to <strong>{selectedUser.name}</strong>?
                </p>

                {/* User Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedUser.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-800">
                    📧 A password reset link will be sent to the user's email address. The link will
                    expire in 24 hours.
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

export default UsersManagement;
