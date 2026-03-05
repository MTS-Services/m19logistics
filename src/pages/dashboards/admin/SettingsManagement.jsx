import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  MapPin,
  DollarSign,
  Database,
  Save,
  RefreshCw,
  Building,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../services/axiosInstance';
import { ENDPOINT } from '../../../services/httpEndpoint';
import Loading from '../../../components/Loading';

const SettingsManagement = () => {
  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    companyName: '',
    vatNumber: '',
    phone: '',
    altPhone: '',
    email: '',
    website: '',
    address: '',
    founded: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Banking Details
  const [bankingSettings, setBankingSettings] = useState({
    bankName: '',
    accountHolder: '',
    sortCode: '',
    accountNumber: '',
    paymentTerms: '',
  });
  const [bankingSaving, setBankingSaving] = useState(false);

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    invoiceGenerationDay: '',
    invoiceGenerationTime: '',
    autoInvoicing: 'false',
  });
  const [systemSaving, setSystemSaving] = useState(false);

  const [activeTab, setActiveTab] = useState('company');
  const [companySaving, setCompanySaving] = useState(false);

  // Status summary state for the 4 stat cards
  const [statusSummary, setStatusSummary] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetchStatusSummary();
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await axiosInstance.get(ENDPOINT.API.ADMIN_SETTINGS.GET_ALL);
      if (response.data.success) {
        const d = response.data.data;
        // Populate company settings from API
        if (d.company) {
          setCompanySettings({
            companyName: d.company.name ?? '',
            vatNumber: d.company.vat_number ?? '',
            phone: d.company.primary_phone ?? '',
            altPhone: d.company.alternative_phone ?? '',
            email: d.company.email ?? '',
            website: d.company.website ?? '',
            address: d.company.address ?? '',
            founded: d.company.founded_year ?? '',
          });
        }
        // Populate banking settings from API
        if (d.banking) {
          setBankingSettings({
            bankName: d.banking.bank_name ?? '',
            accountHolder: d.banking.account_holder ?? '',
            sortCode: d.banking.sort_code ?? '',
            accountNumber: d.banking.account_number ?? '',
            paymentTerms: d.banking.payment_terms ?? '',
          });
        }
        // Populate system settings from API
        if (d.system) {
          setSystemSettings({
            invoiceGenerationDay: d.system.invoice_generation_day ?? '',
            invoiceGenerationTime: d.system.invoice_generation_time ?? '',
            autoInvoicing: d.system.auto_invoicing ?? 'false',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      toast.error('Failed to load settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchStatusSummary = async () => {
    try {
      setStatusLoading(true);
      const response = await axiosInstance.get(ENDPOINT.API.ADMIN_SETTINGS.STATUS_SUMMARY);
      if (response.data.success) {
        setStatusSummary(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch settings status summary:', err);
      toast.error('Failed to load settings status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Save handlers with toast notifications
  const handleSaveCompanySettings = async () => {
    try {
      setCompanySaving(true);
      const payload = {
        name: companySettings.companyName,
        vat_number: companySettings.vatNumber,
        primary_phone: companySettings.phone,
        alternative_phone: companySettings.altPhone,
        email: companySettings.email,
        website: companySettings.website,
        address: companySettings.address,
        founded_year: companySettings.founded,
      };
      const response = await axiosInstance.put(ENDPOINT.API.ADMIN_SETTINGS.UPDATE_COMPANY, payload);
      if (response.data.success) {
        // Sync state with what the server returned
        const d = response.data.data;
        setCompanySettings({
          companyName: d.name,
          vatNumber: d.vat_number,
          phone: d.primary_phone,
          altPhone: d.alternative_phone,
          email: d.email,
          website: d.website,
          address: d.address,
          founded: d.founded_year,
        });
        toast.success(response.data.message || 'Company information updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Failed to update company settings:', err);
      toast.error(err.response?.data?.message || 'Failed to update company information');
    } finally {
      setCompanySaving(false);
    }
  };

  const handleSaveBankingSettings = async () => {
    try {
      setBankingSaving(true);
      const payload = {
        bank_name: bankingSettings.bankName,
        account_holder: bankingSettings.accountHolder,
        sort_code: bankingSettings.sortCode,
        account_number: bankingSettings.accountNumber,
        payment_terms: bankingSettings.paymentTerms,
      };
      const response = await axiosInstance.put(ENDPOINT.API.ADMIN_SETTINGS.UPDATE_BANKING, payload);
      if (response.data.success) {
        const d = response.data.data;
        setBankingSettings({
          bankName: d.bank_name,
          accountHolder: d.account_holder,
          sortCode: d.sort_code,
          accountNumber: d.account_number,
          paymentTerms: d.payment_terms,
        });
        toast.success(response.data.message || 'Banking details updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Failed to update banking settings:', err);
      toast.error(err.response?.data?.message || 'Failed to update banking details');
    } finally {
      setBankingSaving(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      setSystemSaving(true);
      const payload = {
        invoice_generation_day: systemSettings.invoiceGenerationDay,
        invoice_generation_time: systemSettings.invoiceGenerationTime,
        auto_invoicing: systemSettings.autoInvoicing,
      };
      const response = await axiosInstance.put(ENDPOINT.API.ADMIN_SETTINGS.UPDATE_SYSTEM, payload);
      if (response.data.success) {
        const d = response.data.data;
        setSystemSettings({
          invoiceGenerationDay: d.invoice_generation_day,
          invoiceGenerationTime: d.invoice_generation_time,
          autoInvoicing: d.auto_invoicing,
        });
        toast.success(response.data.message || 'System configuration updated successfully', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Failed to update system settings:', err);
      toast.error(err.response?.data?.message || 'Failed to update system configuration');
    } finally {
      setSystemSaving(false);
    }
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
              {statusLoading ? (
                <Loader2 className="mt-2 h-5 w-5 animate-spin text-teal-600" />
              ) : (
                <p
                  className={`mt-1 text-2xl font-bold ${statusSummary?.systemStatus === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {statusSummary?.systemStatus ?? '—'}
                </p>
              )}
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
              {statusLoading ? (
                <Loader2 className="mt-2 h-5 w-5 animate-spin text-teal-600" />
              ) : (
                <p
                  className={`mt-1 text-2xl font-bold ${statusSummary?.emailConfig === 'Enabled' ? 'text-gray-900' : 'text-red-600'
                    }`}
                >
                  {statusSummary?.emailConfig ?? '—'}
                </p>
              )}
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
              {statusLoading ? (
                <Loader2 className="mt-2 h-5 w-5 animate-spin text-teal-600" />
              ) : (
                <p
                  className={`mt-1 text-2xl font-bold ${statusSummary?.mapsApi === 'Active' ? 'text-gray-900' : 'text-red-600'
                    }`}
                >
                  {statusSummary?.mapsApi ?? '—'}
                </p>
              )}
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
              {statusLoading ? (
                <Loader2 className="mt-2 h-5 w-5 animate-spin text-teal-600" />
              ) : (
                <p
                  className={`mt-1 text-2xl font-bold ${statusSummary?.autoInvoicing === 'On' ? 'text-gray-900' : 'text-red-600'
                    }`}
                >
                  {statusSummary?.autoInvoicing ?? '—'}
                </p>
              )}
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
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${activeTab === 'company'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Building className="h-4 w-4" />
            Company
          </button>
          <button
            onClick={() => setActiveTab('banking')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${activeTab === 'banking'
                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <DollarSign className="h-4 w-4" />
            Banking
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${activeTab === 'system'
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
            {settingsLoading && <Loading message="Loading Settings" size="small" />}
          </div>

          <div
            className={`space-y-4 transition-opacity ${settingsLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
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
              disabled={companySaving || settingsLoading}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {companySaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {companySaving ? 'Saving...' : 'Save Changes'}
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
              disabled={bankingSaving || settingsLoading}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {bankingSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {bankingSaving ? 'Saving...' : 'Save Changes'}
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
            {settingsLoading && <Loading message="Loading Settings" size="small" />}
          </div>

          <div
            className={`space-y-4 transition-opacity ${settingsLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
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
                  <option value="">Select day</option>
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
                  type="text"
                  placeholder="e.g. 12:00 AM"
                  value={systemSettings.invoiceGenerationTime}
                  onChange={(e) =>
                    setSystemSettings({ ...systemSettings, invoiceGenerationTime: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Auto Invoicing
                </label>
                <select
                  value={systemSettings.autoInvoicing}
                  onChange={(e) =>
                    setSystemSettings({ ...systemSettings, autoInvoicing: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={handleSaveSystemSettings}
              disabled={systemSaving || settingsLoading}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              {systemSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {systemSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
