import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getContractorDashboard,
  getContractorProfile,
  generateContractorInvoice,
} from '../../../../services/driverService';
import Loading from '../../../../components/Loading';
import GenerateInvoiceHeader from './components/GenerateInvoiceHeader';
import InvoiceContractorDetails from './components/InvoiceContractorDetails';
import InvoiceBankDetails from './components/InvoiceBankDetails';
import InvoiceJobsList from './components/InvoiceJobsList';
import InvoiceSummary from './components/InvoiceSummary';

const toDateInputValue = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

const formatPayType = (payType) => {
  if (!payType) return '—';
  return payType
    .toString()
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const mapProfile = (data) => {
  const driver = data?.driverProfile || {};
  return {
    tradingName: driver.tradingName || data?.fullName || '',
    contactName: driver.contactName || data?.fullName || '',
    fullName: data?.fullName || '',
    address: driver.address || '',
    tradingAddress: driver.tradingAddress || '',
    vatRegistered: !!driver.isVatRegistered,
    vatNumber: driver.vatNumber || '',
    payType: driver.payType || '',
    rate: Number(driver.rate) || 0,
    bank: {
      bankName: driver.bankName || '',
      accountName: driver.accountName || '',
      sortCode: driver.sortCode || '',
      accountNumber: driver.accountNumber || '',
      reference: driver.bankReference || '',
    },
  };
};

const normalizeJobs = (jobs = []) =>
  jobs.map((job, index) => ({
    id: job.id ?? job.deliveryId ?? `job-${index}`,
    spoNumber: job.spoNumber || job.spo || '—',
    customerName: job.customerName || job.customer?.fullName || '—',
    date: job.date || job.completedAt || job.completedDate || null,
    amount: Number(job.amount ?? job.earnings ?? job.rate ?? 0),
  }));

const ContractorGenerateInvoice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [periodLabel, setPeriodLabel] = useState('');
  const [completedJobs, setCompletedJobs] = useState(0);
  const [currentEarnings, setCurrentEarnings] = useState(0);

  useEffect(function fetchGenerateInvoicePreviewOnMount() {
    let isMounted = true;

    const fetchPreviewData = async () => {
      setLoading(true);
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          getContractorProfile(),
          getContractorDashboard(),
        ]);

        console.log('Generate invoice profile response:', profileRes);
        console.log('Generate invoice dashboard response:', dashboardRes);

        if (!isMounted) return;

        if (profileRes?.success && profileRes?.data) {
          setProfile(mapProfile(profileRes.data));
        }

        if (dashboardRes?.success && dashboardRes?.data) {
          const period = dashboardRes.data.currentPeriod || {};
          const contractor = dashboardRes.data.contractor || {};
          setPeriodStart(toDateInputValue(period.periodStart));
          setPeriodEnd(toDateInputValue(period.periodEnd));
          setPeriodLabel(period.label || formatPayType(period.payType || contractor.payType));
          setCompletedJobs(period.completedJobs ?? 0);
          setCurrentEarnings(Number(period.currentEarnings) || 0);
          setJobs(normalizeJobs(dashboardRes.data.recentCompletedJobs));

          if (!profileRes?.data) {
            setProfile({
              tradingName: contractor.tradingName || contractor.fullName || '',
              contactName: contractor.fullName || '',
              fullName: contractor.fullName || '',
              address: '',
              tradingAddress: '',
              vatRegistered: false,
              vatNumber: '',
              payType: contractor.payType || '',
              rate: Number(contractor.rate) || 0,
              bank: {},
            });
          }
        }
      } catch (error) {
        console.error('Error loading generate invoice preview:', error);
        if (isMounted) {
          toast.error(error.response?.data?.message || 'Failed to load invoice preview');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPreviewData();

    return function cleanupGenerateInvoicePreviewFetch() {
      isMounted = false;
    };
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Body is optional — send {} or period dates when provided
    const payload = {};
    if (periodStart) payload.periodStart = periodStart;
    if (periodEnd) payload.periodEnd = periodEnd;

    console.log('Generate invoice payload:', payload);
    setSubmitting(true);

    try {
      const response = await generateContractorInvoice(payload);
      console.log('Generate invoice response:', response);

      if (response?.success) {
        toast.success(response.message || 'Invoice generated successfully');
        navigate('/contractor/invoices');
      } else {
        throw new Error(response?.message || 'Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to generate invoice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loading />
      </div>
    );
  }

  const jobsCount = jobs.length || completedJobs;
  const total = jobs.length
    ? jobs.reduce((sum, job) => sum + (job.amount || 0), 0)
    : currentEarnings;

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <GenerateInvoiceHeader />

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Invoice Period (optional)</h2>
          <p className="mb-4 text-sm text-gray-500">
            Leave blank to use the current pay period. Or set custom dates.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Period Start</label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Period End</label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <InvoiceContractorDetails profile={profile || {}} />
            <InvoiceBankDetails bank={profile?.bank || {}} />
            {/* <InvoiceJobsList
              jobs={jobs}
              period={{
                startDate: periodStart,
                endDate: periodEnd,
                label: periodLabel,
              }}
            /> */}
          </div>

          <InvoiceSummary
            profile={profile || {}}
            jobsCount={jobsCount}
            total={total}
            submitting={submitting}
          />
        </div>
      </form>
    </div>
  );
};

export default ContractorGenerateInvoice;
