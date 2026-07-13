import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import { DEMO_CONTRACTOR_USER } from '../contractorDummyData';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import VehicleDetailsForm from './components/VehicleDetailsForm';
import BankPayForm from './components/BankPayForm';

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

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <ProfileHeader />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <form onSubmit={handleSave} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === 'personal' && (
          <PersonalDetailsForm form={form} updateField={updateField} />
        )}
        {activeTab === 'vehicle' && (
          <VehicleDetailsForm form={form} updateField={updateField} />
        )}
        {activeTab === 'bank' && <BankPayForm form={form} updateField={updateField} />}

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
