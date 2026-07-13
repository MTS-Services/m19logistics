import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  CreditCard,
  Truck,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import {
  DEMO_CONTRACTOR_USER,
  formatDate,
  getExpiryUrgency,
  getExpiryLabel,
} from './contractorDummyData';

const expiryStyles = {
  ok: 'border-gray-200 bg-white',
  warning_30: 'border-red-200 bg-red-50',
  warning_14: 'border-red-300 bg-red-50',
  warning_7: 'border-red-400 bg-red-100',
  expired: 'border-red-600 bg-red-200',
};

const ContractorProfile = () => {
  const { user } = useAuth();
  const base = { ...DEMO_CONTRACTOR_USER, ...user };
  const [activeTab, setActiveTab] = useState('personal');

  const [form, setForm] = useState({
    tradingName: base.tradingName || '',
    contactName: base.contactName || base.fullName || '',
    address: base.address || '',
    tradingAddress: base.tradingAddress || '',
    phone: base.phone || '',
    email: base.email || '',
    driversLicenceNumber: base.driversLicenceNumber || '',
    vatRegistered: base.vatRegistered ?? false,
    vatNumber: base.vatNumber || '',
    vanRegistration: base.vehicle?.vanRegistration || '',
    make: base.vehicle?.make || '',
    model: base.vehicle?.model || '',
    motExpiry: base.vehicle?.motExpiry || '',
    insuranceExpiry: base.vehicle?.insuranceExpiry || '',
    goodsInTransitExpiry: base.vehicle?.goodsInTransitExpiry || '',
    publicLiabilityExpiry: base.vehicle?.publicLiabilityExpiry || '',
    bankName: base.bank?.bankName || '',
    accountName: base.bank?.accountName || '',
    sortCode: base.bank?.sortCode || '',
    accountNumber: base.bank?.accountNumber || '',
    reference: base.bank?.reference || '',
    payType: base.payStructure?.payType || 'Weekly',
    rate: base.payStructure?.rate || 0,
  });

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile saved (dummy — backend later)');
  };

  const expiryFields = [
    { key: 'motExpiry', label: 'MOT Expiry *' },
    { key: 'insuranceExpiry', label: 'Insurance Expiry' },
    { key: 'goodsInTransitExpiry', label: 'Goods In Transit Insurance' },
    { key: 'publicLiabilityExpiry', label: 'Public Liability Insurance' },
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'vehicle', label: 'Vehicle Details', icon: Truck },
    { id: 'bank', label: 'Bank & Pay', icon: CreditCard },
  ];

  const inputClass =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500';

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your contractor details — dummy data</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-2xl font-bold text-white">
                {(form.tradingName || 'C').charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{form.tradingName}</p>
                <p className="text-sm text-gray-500">Contractor</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Trading Name *</label>
                <div className="relative">
                  <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={form.tradingName}
                    onChange={(e) => updateField('tradingName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={form.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    className={`${inputClass} pl-9`}
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address *</label>
                <div className="relative">
                  <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <textarea
                    rows={2}
                    className={`${inputClass} pl-9`}
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Trading Address *</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={form.tradingAddress}
                  onChange={(e) => updateField('tradingAddress', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Driver’s Licence Number *
                </label>
                <input
                  className={inputClass}
                  value={form.driversLicenceNumber}
                  onChange={(e) => updateField('driversLicenceNumber', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">VAT Registered?</label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={form.vatRegistered === true}
                      onChange={() => updateField('vatRegistered', true)}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={form.vatRegistered === false}
                      onChange={() => updateField('vatRegistered', false)}
                    />
                    No
                  </label>
                </div>
              </div>
              {form.vatRegistered && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">VAT Number</label>
                  <input
                    className={inputClass}
                    value={form.vatNumber}
                    onChange={(e) => updateField('vatNumber', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vehicle' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Van Registration *</label>
                <input
                  className={inputClass}
                  value={form.vanRegistration}
                  onChange={(e) => updateField('vanRegistration', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Make</label>
                <input
                  className={inputClass}
                  value={form.make}
                  onChange={(e) => updateField('make', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                <input
                  className={inputClass}
                  value={form.model}
                  onChange={(e) => updateField('model', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {expiryFields.map((field) => {
                const urgency = getExpiryUrgency(form[field.key]);
                return (
                  <div
                    key={field.key}
                    className={`rounded-lg border p-4 ${expiryStyles[urgency] || expiryStyles.ok}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">{field.label}</label>
                      {urgency !== 'ok' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800">
                          <AlertTriangle className="h-3 w-3" />
                          {getExpiryLabel(urgency)}
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      className={inputClass}
                      value={form[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-600">{formatDate(form[field.key])}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  className={inputClass}
                  value={form.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Name</label>
                <input
                  className={inputClass}
                  value={form.accountName}
                  onChange={(e) => updateField('accountName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sort Code</label>
                <input
                  className={inputClass}
                  value={form.sortCode}
                  onChange={(e) => updateField('sortCode', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  className={inputClass}
                  value={form.accountNumber}
                  onChange={(e) => updateField('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reference</label>
                <input
                  className={inputClass}
                  value={form.reference}
                  onChange={(e) => updateField('reference', e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Pay Structure</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pay Type</label>
                  <select
                    className={inputClass}
                    value={form.payType}
                    onChange={(e) => updateField('payType', e.target.value)}
                    disabled
                    title="Set by Admin"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Fortnightly</option>
                    <option>Four Weekly</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Set by Admin (read-only for now)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rate (£)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.rate}
                    onChange={(e) => updateField('rate', Number(e.target.value))}
                    disabled
                    title="Set by Admin"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractorProfile;
