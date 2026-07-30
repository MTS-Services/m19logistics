import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { getContractorProfile } from '../../../../services/driverService';
import Loading from '../../../../components/Loading';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import PersonalDetailsForm from './components/PersonalDetailsForm';
import VehicleDetailsForm from './components/VehicleDetailsForm';
import BankPayForm from './components/BankPayForm';

const emptyForm = {
  tradingName: '',
  contactName: '',
  address: '',
  tradingAddress: '',
  phone: '',
  email: '',
  driversLicenceNumber: '',
  vatRegistered: false,
  vatNumber: '',
  vanRegistration: '',
  make: '',
  model: '',
  motExpiry: '',
  insuranceExpiry: '',
  goodsInTransitExpiry: '',
  publicLiabilityExpiry: '',
  bankName: '',
  accountName: '',
  sortCode: '',
  accountNumber: '',
  reference: '',
  payType: 'WEEKLY',
  rate: '',
  displayRole: 'Contractor',
  fullName: '',
};

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const mapProfileToForm = (data) => {
  const profile = data?.driverProfile || {};
  return {
    tradingName: profile.tradingName || data?.fullName || '',
    contactName: profile.contactName || '',
    address: profile.address || '',
    tradingAddress: profile.tradingAddress || '',
    phone: data?.phone || '',
    email: data?.email || '',
    driversLicenceNumber: profile.driverLicenseNumber || '',
    vatRegistered: !!profile.isVatRegistered,
    vatNumber: profile.vatNumber || '',
    vanRegistration: profile.vehicleRegistration || '',
    make: profile.vehicleMake || '',
    model: profile.vehicleModel || '',
    motExpiry: toDateInputValue(profile.motExpiry),
    insuranceExpiry: toDateInputValue(profile.insuranceExpiry),
    goodsInTransitExpiry: toDateInputValue(profile.goodsInTransitExpiry),
    publicLiabilityExpiry: toDateInputValue(profile.publicLiabilityExpiry),
    bankName: profile.bankName || '',
    accountName: profile.accountName || '',
    sortCode: profile.sortCode || '',
    accountNumber: profile.accountNumber || '',
    reference: profile.bankReference || '',
    payType: profile.payType || 'WEEKLY',
    rate: profile.rate ?? '',
    displayRole: data?.displayRole || 'Contractor',
    fullName: data?.fullName || '',
  };
};

const ContractorProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [form, setForm] = useState(emptyForm);
  const [documentStatus, setDocumentStatus] = useState({});
  const [payFieldsReadOnly, setPayFieldsReadOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(function fetchContractorProfileOnMount() {
    let isMounted = true;

    const fetchContractorProfile = async () => {
      setLoading(true);
      try {
        const response = await getContractorProfile();
        console.log('Contractor profile response:', response);

        if (!isMounted) return;

        if (response?.success && response?.data) {
          setForm(mapProfileToForm(response.data));
          setDocumentStatus(response.data.documentStatus || {});
          setPayFieldsReadOnly(response.data.payFieldsReadOnly !== false);
        } else {
          throw new Error(response?.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Error loading contractor profile:', error);
        if (isMounted) {
          toast.error(error.response?.data?.message || 'Failed to load contractor profile');
          setForm(emptyForm);
          setDocumentStatus({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContractorProfile();

    return function cleanupContractorProfileFetch() {
      isMounted = false;
    };
  }, []);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Contractor profile save payload (update API pending):', form);
    toast.info('Profile loaded from API. Update endpoint not connected yet.');
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <ProfileHeader displayRole={form.displayRole} tradingName={form.tradingName} />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <form onSubmit={handleSave} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === 'personal' && (
          <PersonalDetailsForm form={form} updateField={updateField} />
        )}
        {activeTab === 'vehicle' && (
          <VehicleDetailsForm
            form={form}
            updateField={updateField}
            documentStatus={documentStatus}
          />
        )}
        {activeTab === 'bank' && (
          <BankPayForm
            form={form}
            updateField={updateField}
            payFieldsReadOnly={payFieldsReadOnly}
          />
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
