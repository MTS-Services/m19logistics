import React, { useState, useEffect, useRef } from 'react';
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
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import axiosInstance from '../../../../services/axiosInstance';
import UserCard from './components/UserCard';
import UsersTable from './components/UsersTable';
import AddEditModal from './components/AddEditModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
// import ResetPasswordModal from './components/ResetPasswordModal';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionDropdown, setShowActionDropdown] = useState(null);
  const itemsPerPage = 6;
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError(null);
        const res = await axiosInstance.get('/api/admin/users');
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const mapped = res.data.data.map((u) => ({
            id: u.id,
            name: u.fullName || u.username || u.email,
            email: u.email,
            phone: u.phone,
            username: u.username,
            role:
              u.role === 'ADMIN'
                ? 'admin'
                : u.role === 'DRIVER'
                  ? 'driver'
                  : u.role === 'MANAGER'
                    ? 'area_manager'
                    : 'customer',
            depot: u.customerProfile?.depotAddress || u.driverProfile?.address || '',
            pricingTier: u.customerProfile?.pricingTier?.name || null,
            status: u.isActive ? 'active' : 'inactive',
            passwordReset: !!u.requirePasswordReset,
            profilePhoto: u.profilePicture || null,
          }));
          setUsers(mapped);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error('Error loading users', err);
        setUsersError(err.response?.data?.message || err.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  const roleConfig = {
    admin: { icon: Shield, color: 'text-teal-700 bg-teal-100', label: 'Administrator' },
    driver: { icon: Truck, color: 'text-blue-700 bg-blue-100', label: 'Driver' },
    customer: { icon: Building, color: 'text-purple-700 bg-purple-100', label: 'Customer' },
    area_manager: {
      icon: UserCheck,
      color: 'text-orange-700 bg-orange-100',
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

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Status counts for the top cards
  const totalUsersCount = users.length;
  const customersCount = users.filter((u) => u.role === 'customer').length;
  const driversCount = users.filter((u) => u.role === 'driver').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchTerm(query);
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
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

  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/api/admin/users/${selectedUser.id}`);

      if (response.data?.success) {
        // Show success toast with backend message
        toast.success(response.data.message || 'User deleted successfully');
        // Remove user from list
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  // const handleResetPassword = (user) => {
  //   setSelectedUser(user);
  //   setShowResetPasswordModal(true);
  //   setShowActionDropdown(null);
  // };

  // const confirmResetPassword = () => {
  //   alert('Password reset email sent to ' + selectedUser.email);
  //   setShowResetPasswordModal(false);
  //   setSelectedUser(null);
  // };

  return (
    <div className="p-2 text-base sm:p-6">
      <div className="space-y-6">
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700"
            >
              <UserPlus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsersCount}</p>
              </div>
              <Users className="h-10 w-10 text-gray-400" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customersCount}</p>
              </div>
              <Building className="h-10 w-10 text-teal-600" />
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{driversCount}</p>
              </div>
              <Truck className="h-10 w-10 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative flex-1 md:max-w-md">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 outline-none focus:border-teal-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="driver">Drivers</option>
              <option value="area_manager">Area Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">User Records</h2>
          </div>

          {/* Mobile: show card list */}
          <div className="space-y-3 p-4 md:hidden">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                roleConfig={roleConfig}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>

          {/* Desktop/table */}
          <div className="hidden md:block">
            <UsersTable
              users={paginatedUsers}
              roleConfig={roleConfig}
              showActionDropdown={showActionDropdown}
              setShowActionDropdown={setShowActionDropdown}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
          />
        </div>

        {/* MODAL RENDERING AREA */}
        {showAddModal && (
          <AddEditModal
            onClose={() => setShowAddModal(false)}
            onSuccess={(newUser) => {
              // Map the new user to our format and add to list
              const mapped = {
                id: newUser.id,
                name: newUser.fullName || newUser.username || newUser.email,
                email: newUser.email,
                phone: newUser.phone,
                username: newUser.username,
                role:
                  newUser.role === 'ADMIN'
                    ? 'admin'
                    : newUser.role === 'DRIVER'
                      ? 'driver'
                      : newUser.role === 'MANAGER'
                        ? 'area_manager'
                        : 'customer',
                depot: newUser.customerProfile?.depotAddress || '',
                pricingTier: newUser.customerProfile?.pricingTier?.name || null,
                status: newUser.isActive ? 'active' : 'inactive',
                passwordReset: !!newUser.requirePasswordReset,
                profilePhoto: newUser.profilePicture || null,
              };
              setUsers((prev) => [mapped, ...prev]);
            }}
          />
        )}

        {showEditModal && selectedUser && (
          <AddEditModal
            isEdit
            user={selectedUser}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            onSuccess={(updatedUser) => {
              // Update the user in the list
              const mapped = {
                id: updatedUser.id,
                name: updatedUser.fullName || updatedUser.username || updatedUser.email,
                email: updatedUser.email,
                phone: updatedUser.phone,
                username: updatedUser.username,
                role:
                  updatedUser.role === 'ADMIN'
                    ? 'admin'
                    : updatedUser.role === 'DRIVER'
                      ? 'driver'
                      : updatedUser.role === 'MANAGER'
                        ? 'area_manager'
                        : 'customer',
                depot: updatedUser.customerProfile?.depotAddress || '',
                pricingTier: updatedUser.customerProfile?.pricingTier?.name || null,
                status: updatedUser.isActive ? 'active' : 'inactive',
                passwordReset: !!updatedUser.requirePasswordReset,
                profilePhoto: updatedUser.profilePicture || null,
              };
              setUsers((prev) => prev.map((u) => (u.id === mapped.id ? mapped : u)));
            }}
          />
        )}

        {showDeleteModal && selectedUser && (
          <ConfirmDeleteModal
            user={selectedUser}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            isDeleting={isDeleting}
          />
        )}

        {/* {showResetPasswordModal && selectedUser && (
          <ResetPasswordModal
            user={selectedUser}
            onCancel={() => setShowResetPasswordModal(false)}
            onConfirm={confirmResetPassword}
          />
        )} */}
      </div>
    </div>
  );
};

export default UsersManagement;
