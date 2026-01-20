import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const DriverProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: 'John Driver',
    email: 'wwwbk@yahoo.co.uk',
    phone: '07123456789',
    address: '123 Driver Street, Wrexham, LL12 7YJ',
    licenseNumber: 'DL123456',
    vehicleReg: 'AB12 CDE',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    toast.success('Password changed successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-2">
              <User className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Driver Name</p>
              <p className="text-sm font-semibold text-gray-900">{profileData.name}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="text-sm font-semibold text-gray-900">{profileData.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <Phone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Phone</p>
              <p className="text-sm font-semibold text-gray-900">{profileData.phone}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-2">
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Vehicle</p>
              <p className="text-sm font-semibold text-gray-900">{profileData.vehicleReg}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'security'
              ? 'border-b-2 border-teal-600 text-teal-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Security
        </button>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-6 flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-2xl font-bold text-white">
                  {profileData.name.charAt(0)}
                </div>
                <button
                  type="button"
                  className="absolute right-0 bottom-0 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50"
                >
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{profileData.name}</h3>
                <p className="text-sm text-gray-600">Driver</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Vehicle Registration
                </label>
                <input
                  type="text"
                  value={profileData.vehicleReg}
                  onChange={(e) => setProfileData({ ...profileData, vehicleReg: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Driver License Number
                </label>
                <input
                  type="text"
                  value={profileData.licenseNumber}
                  onChange={(e) =>
                    setProfileData({ ...profileData, licenseNumber: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <form onSubmit={handlePasswordChange}>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update your password to keep your account secure
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 py-2 pr-12 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 py-2 pr-12 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 py-2 pr-12 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  })
                }
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
              >
                <Lock className="h-4 w-4" />
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
