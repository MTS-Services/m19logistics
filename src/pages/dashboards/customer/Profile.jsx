import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Lock,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Shield,
  Package,
  DollarSign,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Topps Chester',
    email: user?.email || 'topps022@toppstiles.co.uk',
    phone: user?.phone || '01244398888',
    depotAddress: user?.depotAddress || '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
    loginId: user?.username || 'T022',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Account info
  const accountInfo = {
    pricingTier: 'Tier B',
    ratePerDelivery: '£45.00',
    accountStatus: 'Active',
    memberSince: '2019',
  };

  // Handle profile change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Save profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
    console.log('Profile data:', profileData);
  };

  // Change password
  const handleChangePassword = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    toast.success('Password changed successfully!');
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
          <p className="mt-2 text-gray-600">Manage your account information and settings</p>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="mt-1 text-lg font-bold text-green-600">{accountInfo.accountStatus}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pricing Tier</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{accountInfo.pricingTier}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rate Per Delivery</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{accountInfo.ratePerDelivery}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{accountInfo.memberSince}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="mx-auto mb-1 h-5 w-5" />
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
              activeTab === 'security'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="mx-auto mb-1 h-5 w-5" />
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Basic Information Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <User className="h-5 w-5 text-teal-600" />
                  Basic Information
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Store Name */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building className="h-4 w-4 text-gray-400" />
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter store name"
                    />
                  </div>

                  {/* Login ID */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="h-4 w-4 text-gray-400" />
                      Login ID
                    </label>
                    <input
                      type="text"
                      name="loginId"
                      value={profileData.loginId}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500"
                      placeholder="Login ID"
                    />
                    <p className="mt-1 text-xs text-gray-500">Login ID cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Phone className="h-5 w-5 text-teal-600" />
                  Contact Information
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Depot Address Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  Depot Address
                </h3>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Address
                  </label>
                  <textarea
                    name="depotAddress"
                    value={profileData.depotAddress}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="Enter depot address"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This address is used for delivery distance calculations
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Change Password Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Lock className="h-5 w-5 text-teal-600" />
                  Change Password
                </h3>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold">Security Tips</p>
                    <ul className="mt-2 space-y-1 text-blue-800">
                      <li>• Use a strong password with letters, numbers, and symbols</li>
                      <li>• Don't share your password with anyone</li>
                      <li>• Change your password regularly</li>
                      <li>• Use different passwords for different accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Change Password Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  <Lock className="h-5 w-5" />
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Package className="h-5 w-5 text-teal-600" />
          Pricing Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Your Pricing Tier</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{accountInfo.pricingTier}</p>
            <p className="mt-1 text-sm text-gray-600">
              Base rate: {accountInfo.ratePerDelivery} per 800kg (up to 45 miles)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">VAT Rate</p>
            <p className="mt-1 text-lg font-bold text-gray-900">20%</p>
            <p className="mt-1 text-sm text-gray-600">VAT is added to all deliveries</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm text-teal-900">
            <strong>Note:</strong> For deliveries beyond 45 miles or custom pricing inquiries,
            please contact our admin team at{' '}
            <a href="tel:07971415430" className="font-semibold underline">
              07971 415430
            </a>{' '}
            or{' '}
            <a href="mailto:deliveries@m19logistics.com" className="font-semibold underline">
              deliveries@m19logistics.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
