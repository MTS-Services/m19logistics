import React, { useState } from 'react';
import {
  Settings,
  Mail,
  MapPin,
  DollarSign,
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
    altPhone: 'WhatsApp 07577574676',
    email: 'ben@m19logistics.com',
    website: 'www.m19logistics.com',
    address: 'Wrexham, United Kingdom',
    founded: '2019',
  });

  // Banking Details
  const [bankingSettings, setBankingSettings] = useState({
    bankName: 'NatWest Bank',
    accountHolder: 'M19 Logistics Limited',
    sortCode: '01-10-01',
    accountNumber: '72696370',
    paymentTerms: '30 Days (End of Month)',
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

  const handleSaveBankingSettings = () => {
    setTimeout(() => {
      toast.success('Banking details saved successfully!', {
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

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      toast.warning('Settings reset to defaults', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-2 sm:p-6">
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
              <p className="mt-1 text-2xl font-bold text-gray-900">Enabled</p>
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
              <p className="mt-1 text-2xl font-bold text-gray-900">Active</p>
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
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Building className="h-4 w-4" />
            Company
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'banking'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Banking
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
              activeTab === 'system'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
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
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
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
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
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
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveSystemSettings}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg"
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
