import React, { useState, useEffect, useRef } from 'react';
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
  Camera,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../services/axiosInstance';
import { ENDPOINT } from '../../../services/httpEndpoint';
import { compressImage } from '../../../utils/imageCompression';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const fileInputRef = useRef(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    depotAddress: user?.depotAddress || '',
    loginId: user?.username || '',
    ccEmail: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Account info from API
  const [accountInfo, setAccountInfo] = useState({
    pricingTier: '',
    ratePerDelivery: '',
    accountStatus: '',
    memberSince: '',
    basePrice: '',
    vatRate: '',
    maxDistance: '',
    weightUnit: '',
  });

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchingProfile(true);
        const response = await axiosInstance.get(ENDPOINT.API.AUTH.GET_PROFILE);

        if (response.data && response.data.success && response.data.data) {
          const userData = response.data.data;
          setProfileData({
            fullName: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            depotAddress: userData.customerProfile?.depotAddress || '',
            loginId: userData.username || '',
            ccEmail: userData.customerProfile?.ccEmail || '',
          });

          // Prefer any locally selected preview saved during this session
          const storedPreview = sessionStorage.getItem('m19_profile_preview');
          if (storedPreview) {
            console.log('Using stored local preview from sessionStorage');
            setImagePreview(storedPreview);
            setImageLoadError(false);
          } else if (userData.profilePicture) {
            console.log('Profile Picture URL:', userData.profilePicture);
            setImagePreview(userData.profilePicture);
            setImageLoadError(false);
          }

          // Set account info from API
          const pricingTier = userData.customerProfile?.pricingTier;
          const createdAt = userData.createdAt ? new Date(userData.createdAt).getFullYear() : '';

          setAccountInfo({
            pricingTier: pricingTier?.name || 'N/A',
            ratePerDelivery: pricingTier?.basePrice ? `£${pricingTier.basePrice}` : 'N/A',
            accountStatus: userData.isActive ? 'Active' : 'Inactive',
            memberSince: createdAt || 'N/A',
            basePrice: pricingTier?.basePrice || '0',
            vatRate: pricingTier?.vatRate || '0',
            maxDistance: pricingTier?.maxDistance || '0',
            weightUnit: pricingTier?.weightUnit || '800',
          });
        }
      } catch (error) {
        // Silently fail and use data from AuthContext if available
        console.error('Failed to fetch profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper to rewrite absolute image URLs to proxied paths in dev
  const getImageSrc = (src) => {
    if (!src) return null;
    // Don't modify data URLs (local previews from FileReader)
    if (src.startsWith('data:')) return src;
    try {
      const url = new URL(src);
      // In dev, use the pathname so Vite dev server proxy ("/uploads") can intercept
      if (import.meta.env && import.meta.env.DEV) {
        return url.pathname;
      }
      return src;
    } catch (e) {
      return src;
    }
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

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    try {
      // Compress image before setting
      const compressedFile = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
      });

      setProfileImage(compressedFile);
      setProfilePicture(compressedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageLoadError(false);
        try {
          sessionStorage.setItem('m19_profile_preview', reader.result);
        } catch (e) {
          console.warn('Could not save preview to sessionStorage', e);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Image compression error:', error);
      toast.error('Failed to process image. Please try another image.');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      // preserve local preview (data URL) if user selected a new image
      const localPreviewBefore =
        imagePreview && String(imagePreview).startsWith('data:') ? imagePreview : null;

      // If image is selected, send as FormData
      if (profileImage) {
        const formData = new FormData();
        formData.append('fullName', profileData.fullName);
        if (profileData.email) formData.append('email', profileData.email);
        if (profileData.phone) formData.append('phone', profileData.phone);
        if (profileData.depotAddress) formData.append('depotAddress', profileData.depotAddress);
        formData.append('profilePicture', profileImage);

        response = await axiosInstance.patch(ENDPOINT.API.AUTH.PROFILE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 seconds for file upload
        });
      } else {
        // Send as JSON if no image
        response = await axiosInstance.patch(ENDPOINT.API.AUTH.PROFILE, {
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          depotAddress: profileData.depotAddress,
        });
      }

      if (response.data && response.data.success) {
        toast.success('Profile updated successfully!');
        // Keep the local preview (so user sees the uploaded image immediately)
        if (localPreviewBefore) {
          setImagePreview(localPreviewBefore);
          setImageLoadError(false);
        } else if (response.data.data?.user?.profilePicture) {
          setImagePreview(response.data.data.user.profilePicture);
          setImageLoadError(false);
        }
        // clear stored preview only if server returned a usable profilePicture
        if (response.data.data?.user?.profilePicture) {
          try {
            sessionStorage.removeItem('m19_profile_preview');
          } catch (e) {}
        }
        setProfileImage(null);
        setProfilePicture(null);
      } else {
        toast.error(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || error.response.data?.error || 'Failed to update profile';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data && response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.data?.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || error.response.data?.error || 'Failed to change password';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setPasswordLoading(false);
    }
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
              {/* Profile Picture Section */}
              <div className="mb-6 flex items-center gap-6">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                    {imagePreview && !imageLoadError ? (
                      <img
                        src={getImageSrc(imagePreview)}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error('❌ Image failed to load (original):', imagePreview);
                          console.error(
                            '❌ Image failed to load (used):',
                            getImageSrc(imagePreview)
                          );
                          setImageLoadError(true);
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', getImageSrc(imagePreview));
                          setImageLoadError(false);
                        }}
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : 'C'}
                      </span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute right-0 bottom-0 z-10 cursor-pointer rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50"
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{profileData.fullName}</h3>
                  <p className="text-sm text-gray-600">Customer</p>
                  {profileImage && (
                    <p className="mt-1 text-xs font-medium text-teal-600">
                      Image selected. Click "Save Changes" to upload.
                    </p>
                  )}
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <User className="h-5 w-5 text-teal-600" />
                  Basic Information
                </h3>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Building className="h-4 w-4 text-gray-400" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Enter full name"
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

                {/* CC Email */}
                {profileData.ccEmail && (
                  <div className="mt-6">
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4 text-gray-400" />
                      CC Email
                    </label>
                    <input
                      type="email"
                      value={profileData.ccEmail}
                      disabled
                      className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">CC Email is managed by admin</p>
                  </div>
                )}
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
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-6 py-3 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
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
                  <Shield className="h-5 w-5 shrink-0 text-blue-600" />
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
                  disabled={passwordLoading}
                  className="flex items-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-6 py-3 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Changing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Additional Information */}
      {/* <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Package className="h-5 w-5 text-teal-600" />
          Pricing Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Your Pricing Tier</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{accountInfo.pricingTier}</p>
            <p className="mt-1 text-sm text-gray-600">
              Base rate: {accountInfo.ratePerDelivery} per {accountInfo.weightUnit}kg (up to{' '}
              {accountInfo.maxDistance} miles)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">VAT Rate</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{accountInfo.vatRate}%</p>
            <p className="mt-1 text-sm text-gray-600">VAT is added to all deliveries</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm text-teal-900">
            <strong>Note:</strong> For deliveries beyond 45 miles or custom pricing inquiries,
            please contact our admin team at{' '}
            <a href="tel:07818077110" className="font-semibold underline">
              07818 077110
            </a>{' '}
            or{' '}
            <a href="mailto:deliveries@m19logistics.com" className="font-semibold underline">
              deliveries@m19logistics.com
            </a>
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Profile;
