import React, { useState, useEffect, useMemo } from 'react';
import { User, Mail, Phone, MapPin, Camera, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../services/axiosInstance';
import { ENDPOINT } from '../../../services/httpEndpoint';

const DriverProfile = () => {
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
  const fileInputRef = React.useRef(null);

  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.driverProfile?.address || '',
    licenseNumber: user?.driverProfile?.driverLicenseNumber || '',
    vehicleReg: user?.driverProfile?.vehicleRegistration || '',
  });

  // Keep a copy of the original fetched profile to detect edits
  const [originalProfile, setOriginalProfile] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.driverProfile?.address || '',
    licenseNumber: user?.driverProfile?.driverLicenseNumber || '',
    vehicleReg: user?.driverProfile?.vehicleRegistration || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchingProfile(true);
        const response = await axiosInstance.get('/api/auth/me');

        if (response.data && response.data.success && response.data.data) {
          const userData = response.data.data;

          const fetched = {
            name: userData.fullName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.driverProfile?.address || '',
            licenseNumber: userData.driverProfile?.driverLicenseNumber || '',
            vehicleReg: userData.driverProfile?.vehicleRegistration || '',
          };

          setProfileData(fetched);
          setOriginalProfile(fetched);

          // Set existing profile picture if available
          if (userData.profilePicture) {
            setImagePreview(userData.profilePicture);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      // If image is selected, send as FormData
      if (profileImage) {
        const formData = new FormData();
        formData.append('fullName', profileData.name);
        formData.append('username', profileData.name);
        formData.append('email', profileData.email);
        formData.append('phone', profileData.phone);
        formData.append('address', profileData.address);
        formData.append('driverLicenseNumber', profileData.licenseNumber);
        formData.append('vehicleRegistration', profileData.vehicleReg);
        formData.append('profilePicture', profileImage);

        response = await axiosInstance.patch(ENDPOINT.API.AUTH.PROFILE, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Send as JSON if no image
        response = await axiosInstance.patch(ENDPOINT.API.AUTH.PROFILE, {
          fullName: profileData.name,
          username: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          driverLicenseNumber: profileData.licenseNumber,
          vehicleRegistration: profileData.vehicleReg,
        });
      }

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Profile updated successfully!');
        
        // Update original profile snapshot so Save button disables until further edits
        setOriginalProfile({ ...profileData });
        setProfileImage(null);
        
        // Update image preview with the new profile picture URL from server
        if (response.data.data?.user?.profilePicture) {
          setImagePreview(response.data.data.user.profilePicture);
        }
      } else {
        toast.error(response.data?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          'Failed to update profile';
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await axiosInstance.post('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Password changed successfully!');
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
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          'Failed to change password';
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

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setProfileImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Compute dirty flag (always call hook to keep hooks order stable)
  const isDirty = useMemo(
    () => JSON.stringify(profileData) !== JSON.stringify(originalProfile) || profileImage !== null,
    [profileData, originalProfile, profileImage]
  );

  // Show loading state while fetching profile
  if (fetchingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

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
              <p className="text-sm font-semibold text-gray-900">{profileData.email }</p>
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
              <p className="text-sm font-semibold text-gray-900">{profileData.phone }</p>
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
              <p className="text-sm font-semibold text-gray-900">{profileData.vehicleReg }</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'profile'
            ? 'border-b-2 border-teal-600 text-teal-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'security'
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
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-2xl font-bold text-white overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    profileData.name ? profileData.name.charAt(0).toUpperCase() : 'D'
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
                  className="absolute right-0 bottom-0 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-50"
                  title="Change profile picture"
                >
                  <Camera className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{profileData.name}</h3>
                <p className="text-sm text-gray-600">Driver</p>
                {profileImage && (
                  <p className="mt-2 text-xs text-teal-600 font-medium">
                    Image selected. Click "Save Changes" to upload.
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
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
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading || !isDirty}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
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
                disabled={passwordLoading}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DriverProfile;
