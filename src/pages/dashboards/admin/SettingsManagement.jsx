import React, { useState } from 'react';
import {
  Settings,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  Bell,
  Shield,
  Database,
  Save,
  RefreshCw,
  User,
  Building,
  Phone,
  Globe,
} from 'lucide-react';
import { toast } from 'react-toastify';

const SettingsManagement = () => {
  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    companyName: 'M19 Logistics Limited',
    vatNumber: '447 5918 54',
    phone: '07971415430',
    altPhone: '01978439739',
    email: 'ben@m19logistics.com',
    website: 'www.m19logistics.com',
    address: 'Wrexham, United Kingdom',
    founded: '2019',
  });

  // Email Configuration
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.m19logistics.com',
    smtpPort: '587',
    smtpUser: 'deliveries@m19logistics.com',
    smtpPassword: '••••••••',
    fromEmail: 'deliveries@m19logistics.com',
    fromName: 'M19 Logistics',
    adminEmail: 'admin@m19logistics.com',
    enquiriesEmail: 'enquiries@m19logistics.com',
    enableNotifications: true,
  });

  // Banking Details
  const [bankingSettings, setBankingSettings] = useState({
    bankName: 'NatWest Bank',
    accountHolder: 'M19 Logistics Limited',
    sortCode: '01-10-01',
    accountNumber: '72696370',
    paymentTerms: '30 Days (End of Month)',
  });

  // Google Maps Configuration
  const [mapsSettings, setMapsSettings] = useState({
    apiKey: '••••••••••••••••••••••••••••••••',
    enableDistanceCalculation: true,
    maxDistance: '45',
    distanceUnit: 'miles',
  });

  // Delivery Settings
  const [deliverySettings, setDeliverySettings] = useState({
    baseDistance: '45',
    sameDayBooking: true,
    cutOffTime: '12:00',
    timeSlots: ['AM', 'PM'],
    enableAdditionalDeliveries: true,
    requireProofOfDelivery: true,
    requireSignature: true,
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoInvoiceGeneration: true,
    invoiceGenerationDay: 'Sunday',
    invoiceGenerationTime: '00:00',
    enableAuditLog: true,
    sessionTimeout: '30',
    passwordResetRequired: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewDelivery: true,
    emailOnStatusChange: true,
    emailOnCancellation: true,
    emailOnEdit: true,
    smsNotifications: false,
    pushNotifications: false,
  });

  const [activeTab, setActiveTab] = useState('company');

  // Save handlers with toast notifications
  const handleSaveCompanySettings = () => {
    // Simulate API call
    setTimeout(() => {
      toast.success('Company settings saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }, 500);
  };

  const handleSaveEmailSettings = () => {
    setTimeout(() => {
      toast.success('Email configuration saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 500);
  };

  const handleSaveBankingSettings = () => {
    setTimeout(() => {
      toast.success('Banking details saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 500);
  };

  const handleSaveMapsSettings = () => {
    setTimeout(() => {
      toast.success('Google Maps settings saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 500);
  };

  const handleSaveDeliverySettings = () => {
    setTimeout(() => {
      toast.success('Delivery settings saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 500);
  };

  const handleSaveSystemSettings = () => {
    setTimeout(() => {
      toast.success('System settings saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 500);
  };

  const handleSaveNotificationSettings = () => {
    setTimeout(() => {
      toast.success('Notification settings saved successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 500);
  };

  const handleTestEmail = () => {
    toast.info('Sending test email...', { autoClose: 2000 });
    setTimeout(() => {
      toast.success('Test email sent successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 2000);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      toast.warning('Settings reset to defaults', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleClearCache = () => {
    toast.info('Clearing cache...', { autoClose: 2000 });
    setTimeout(() => {
      toast.success('Cache cleared successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }, 2000);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            System Settings
          </h1>
          <p className="mt-2 text-gray-600">Manage system configuration and preferences</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="mt-1 text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Settings className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Email Config</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {emailSettings.enableNotifications ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Mail className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maps API</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {mapsSettings.enableDistanceCalculation ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <MapPin className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Auto Invoicing</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {systemSettings.autoInvoiceGeneration ? 'On' : 'Off'}
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'company'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Building className="h-4 w-4" />
            Company
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'email'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'banking'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Banking
          </button>
          <button
            onClick={() => setActiveTab('maps')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'maps'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Maps
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'delivery'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            Delivery
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'system'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Database className="h-4 w-4" />
            System
          </button>
        </div>
      </div>

      {/* Company Settings Tab */}
      {activeTab === 'company' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Building className="h-6 w-6 text-teal-600" />
              Company Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, companyName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">VAT Number</label>
                <input
                  type="text"
                  value={companySettings.vatNumber}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, vatNumber: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Primary Phone
                </label>
                <input
                  type="text"
                  value={companySettings.phone}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Alternative Phone
                </label>
                <input
                  type="text"
                  value={companySettings.altPhone}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, altPhone: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={companySettings.email}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Website</label>
                <input
                  type="text"
                  value={companySettings.website}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, website: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Address</label>
                <input
                  type="text"
                  value={companySettings.address}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, address: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Founded Year
                </label>
                <input
                  type="text"
                  value={companySettings.founded}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, founded: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleResetToDefaults}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <RefreshCw className="h-5 w-5" />
              Reset
            </button>
            <button
              onClick={handleSaveCompanySettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Email Settings Tab */}
      {activeTab === 'email' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Mail className="h-6 w-6 text-teal-600" />
              Email Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">SMTP Host</label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">SMTP Port</label>
                <input
                  type="text"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpUser}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">From Email</label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">From Name</label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={emailSettings.adminEmail}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, adminEmail: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Enquiries Email
                </label>
                <input
                  type="email"
                  value={emailSettings.enquiriesEmail}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, enquiriesEmail: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
              <input
                type="checkbox"
                checked={emailSettings.enableNotifications}
                onChange={(e) => {
                  setEmailSettings({ ...emailSettings, enableNotifications: e.target.checked });
                  toast.info(
                    e.target.checked
                      ? 'Email notifications enabled'
                      : 'Email notifications disabled'
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="text-sm font-semibold text-gray-700">
                Enable Email Notifications
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleTestEmail}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Mail className="h-5 w-5" />
              Send Test Email
            </button>
            <button
              onClick={handleSaveEmailSettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Banking Settings Tab */}
      {activeTab === 'banking' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <DollarSign className="h-6 w-6 text-teal-600" />
              Banking Details
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Bank Name</label>
                <input
                  type="text"
                  value={bankingSettings.bankName}
                  onChange={(e) =>
                    setBankingSettings({ ...bankingSettings, bankName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Account Holder
                </label>
                <input
                  type="text"
                  value={bankingSettings.accountHolder}
                  onChange={(e) =>
                    setBankingSettings({ ...bankingSettings, accountHolder: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Sort Code</label>
                <input
                  type="text"
                  value={bankingSettings.sortCode}
                  onChange={(e) =>
                    setBankingSettings({ ...bankingSettings, sortCode: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankingSettings.accountNumber}
                  onChange={(e) =>
                    setBankingSettings({ ...bankingSettings, accountNumber: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Payment Terms
              </label>
              <input
                type="text"
                value={bankingSettings.paymentTerms}
                onChange={(e) =>
                  setBankingSettings({ ...bankingSettings, paymentTerms: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveBankingSettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Maps Settings Tab */}
      {activeTab === 'maps' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <MapPin className="h-6 w-6 text-teal-600" />
              Google Maps Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Google Maps API Key
              </label>
              <input
                type="password"
                value={mapsSettings.apiKey}
                onChange={(e) => setMapsSettings({ ...mapsSettings, apiKey: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used for distance calculation via Distance Matrix API
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Max Base Distance
                </label>
                <input
                  type="number"
                  value={mapsSettings.maxDistance}
                  onChange={(e) =>
                    setMapsSettings({ ...mapsSettings, maxDistance: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum distance before surcharge applies
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Distance Unit
                </label>
                <select
                  value={mapsSettings.distanceUnit}
                  onChange={(e) =>
                    setMapsSettings({ ...mapsSettings, distanceUnit: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                >
                  <option value="miles">Miles</option>
                  <option value="kilometers">Kilometers</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
              <input
                type="checkbox"
                checked={mapsSettings.enableDistanceCalculation}
                onChange={(e) => {
                  setMapsSettings({ ...mapsSettings, enableDistanceCalculation: e.target.checked });
                  toast.info(
                    e.target.checked
                      ? 'Distance calculation enabled'
                      : 'Distance calculation disabled'
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label className="text-sm font-semibold text-gray-700">
                Enable Automatic Distance Calculation
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveMapsSettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Delivery Settings Tab */}
      {activeTab === 'delivery' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Clock className="h-6 w-6 text-teal-600" />
              Delivery Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Base Distance (miles)
                </label>
                <input
                  type="number"
                  value={deliverySettings.baseDistance}
                  onChange={(e) =>
                    setDeliverySettings({ ...deliverySettings, baseDistance: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Same-Day Cut-off Time
                </label>
                <input
                  type="time"
                  value={deliverySettings.cutOffTime}
                  onChange={(e) =>
                    setDeliverySettings({ ...deliverySettings, cutOffTime: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Available Time Slots
              </label>
              <div className="flex flex-wrap gap-2">
                {deliverySettings.timeSlots.map((slot, index) => (
                  <span
                    key={index}
                    className="rounded-lg bg-teal-100 px-3 py-2 text-sm font-semibold text-teal-600"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={deliverySettings.sameDayBooking}
                  onChange={(e) => {
                    setDeliverySettings({ ...deliverySettings, sameDayBooking: e.target.checked });
                    toast.info(
                      e.target.checked ? 'Same-day booking enabled' : 'Same-day booking disabled'
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Allow Same-Day Bookings
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={deliverySettings.enableAdditionalDeliveries}
                  onChange={(e) => {
                    setDeliverySettings({
                      ...deliverySettings,
                      enableAdditionalDeliveries: e.target.checked,
                    });
                    toast.info(
                      e.target.checked
                        ? 'Additional deliveries enabled'
                        : 'Additional deliveries disabled'
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Enable Additional Deliveries
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={deliverySettings.requireProofOfDelivery}
                  onChange={(e) => {
                    setDeliverySettings({
                      ...deliverySettings,
                      requireProofOfDelivery: e.target.checked,
                    });
                    toast.info(
                      e.target.checked ? 'Proof of delivery required' : 'Proof of delivery optional'
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Require Proof of Delivery (Photo)
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={deliverySettings.requireSignature}
                  onChange={(e) => {
                    setDeliverySettings({
                      ...deliverySettings,
                      requireSignature: e.target.checked,
                    });
                    toast.info(e.target.checked ? 'Signature required' : 'Signature optional');
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">Require Signature</label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveDeliverySettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Notification Settings Tab */}
      {activeTab === 'notifications' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Bell className="h-6 w-6 text-teal-600" />
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-teal-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Email on New Delivery</p>
                <p className="text-xs text-gray-500">Notify admin when new delivery is submitted</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailOnNewDelivery}
                onChange={(e) => {
                  setNotificationSettings({
                    ...notificationSettings,
                    emailOnNewDelivery: e.target.checked,
                  });
                  toast.info(
                    e.target.checked ? 'Email notification enabled' : 'Email notification disabled'
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-teal-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Email on Status Change</p>
                <p className="text-xs text-gray-500">Notify when delivery status is updated</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailOnStatusChange}
                onChange={(e) => {
                  setNotificationSettings({
                    ...notificationSettings,
                    emailOnStatusChange: e.target.checked,
                  });
                  toast.info(
                    e.target.checked
                      ? 'Status change notifications enabled'
                      : 'Status change notifications disabled'
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-teal-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Email on Cancellation</p>
                <p className="text-xs text-gray-500">Notify when delivery is cancelled</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailOnCancellation}
                onChange={(e) => {
                  setNotificationSettings({
                    ...notificationSettings,
                    emailOnCancellation: e.target.checked,
                  });
                  toast.info(
                    e.target.checked
                      ? 'Cancellation notifications enabled'
                      : 'Cancellation notifications disabled'
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-teal-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Email on Edit</p>
                <p className="text-xs text-gray-500">Notify when delivery details are modified</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailOnEdit}
                onChange={(e) => {
                  setNotificationSettings({
                    ...notificationSettings,
                    emailOnEdit: e.target.checked,
                  });
                  toast.info(
                    e.target.checked ? 'Edit notifications enabled' : 'Edit notifications disabled'
                  );
                }}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">SMS Notifications</p>
                <p className="text-xs text-gray-500">Send SMS alerts (Coming Soon)</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.smsNotifications}
                disabled
                className="h-4 w-4 rounded border-gray-300 text-gray-400"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Push Notifications</p>
                <p className="text-xs text-gray-500">Browser push notifications (Coming Soon)</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                disabled
                className="h-4 w-4 rounded border-gray-300 text-gray-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveNotificationSettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <Database className="h-6 w-6 text-teal-600" />
              System Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Invoice Generation Day
                </label>
                <select
                  value={systemSettings.invoiceGenerationDay}
                  onChange={(e) =>
                    setSystemSettings({ ...systemSettings, invoiceGenerationDay: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Generation Time
                </label>
                <input
                  type="time"
                  value={systemSettings.invoiceGenerationTime}
                  onChange={(e) =>
                    setSystemSettings({ ...systemSettings, invoiceGenerationTime: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={systemSettings.sessionTimeout}
                onChange={(e) =>
                  setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={systemSettings.autoInvoiceGeneration}
                  onChange={(e) => {
                    setSystemSettings({
                      ...systemSettings,
                      autoInvoiceGeneration: e.target.checked,
                    });
                    toast.info(
                      e.target.checked
                        ? 'Automatic invoice generation enabled'
                        : 'Automatic invoice generation disabled'
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Enable Automatic Invoice Generation
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={systemSettings.enableAuditLog}
                  onChange={(e) => {
                    setSystemSettings({ ...systemSettings, enableAuditLog: e.target.checked });
                    toast.info(
                      e.target.checked ? 'Audit logging enabled' : 'Audit logging disabled'
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Enable Audit Trail Logging
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-teal-50 p-4">
                <input
                  type="checkbox"
                  checked={systemSettings.passwordResetRequired}
                  onChange={(e) => {
                    setSystemSettings({
                      ...systemSettings,
                      passwordResetRequired: e.target.checked,
                    });
                    toast.info(
                      e.target.checked
                        ? 'Password reset required on first login'
                        : 'Password reset not required'
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Require Password Reset on First Login
                </label>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4">
                <input
                  type="checkbox"
                  checked={systemSettings.maintenanceMode}
                  onChange={(e) => {
                    setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked });
                    if (e.target.checked) {
                      toast.warning('Maintenance mode enabled - System is now offline');
                    } else {
                      toast.success('Maintenance mode disabled - System is now online');
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <label className="text-sm font-semibold text-red-700">Maintenance Mode</label>
                  <p className="text-xs text-red-600">
                    Enable to take system offline for maintenance
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">System Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleClearCache}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear Cache
                </button>
                <button
                  onClick={() => {
                    toast.info('Optimizing database...', { autoClose: 2000 });
                    setTimeout(() => toast.success('Database optimized successfully!'), 2500);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <Database className="h-4 w-4" />
                  Optimize Database
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveSystemSettings}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
