import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Camera,
  Shield,
  Truck,
  UserCheck,
  Building,
  Mail,
  Phone,
  X,
  Save,
  Upload,
} from 'lucide-react';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const handleResetPassword = (userId) => {
    if (window.confirm('Send password reset email to this user?')) {
      // API call to reset password
      alert('Password reset email sent!');
    }
  };

  const UserCard = ({ user }) => {
    const RoleIcon = roleConfig[user.role]?.icon || Users;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {/* Profile Photo */}
            <div className="relative">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-xl font-bold text-white">
                  {user.name.charAt(0)}
                </div>
              )}
              {user.passwordReset && (
                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs text-white">
                  !
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <span
                  className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleConfig[user.role]?.color}`}
                >
                  <RoleIcon className="h-3 w-3" />
                  <span>{roleConfig[user.role]?.label}</span>
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">@{user.username}</p>

              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              </div>

              {/* Customer-specific info */}
              {user.role === 'customer' && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Depot:</span> {user.depot}
                  </p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Pricing:</span> {user.pricingTier}
                  </p>
                </div>
              )}

              {/* Area Manager-specific info */}
              {user.role === 'area_manager' && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Access Scope:</span> {user.accessScope}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditUser(user)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Edit user"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleResetPassword(user.id)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-yellow-600"
              title="Reset password"
            >
              <Key className="h-5 w-5" />
            </button>
            {user.role !== 'admin' && (
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
                title="Delete user"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {user.passwordReset && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3">
            <p className="text-xs text-yellow-800">⚠️ Password reset required on first login</p>
          </div>
        )}
      </div>
    );
  };

  const AddEditModal = ({ isEdit = false, user = null, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage admins, drivers, customers, and area managers
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add User</span>
        </button>
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
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

      {/* User List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-sm text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
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
    </div>
  );
};

export default UsersManagement;
