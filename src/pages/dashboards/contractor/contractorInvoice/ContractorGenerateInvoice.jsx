import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';
import {
  DEMO_CONTRACTOR_USER,
  contractorDashboardData,
  dummyCompletedDeliveries,
} from '../contractorDummyData';
import GenerateInvoiceHeader from './components/GenerateInvoiceHeader';
import InvoiceContractorDetails from './components/InvoiceContractorDetails';
import InvoiceBankDetails from './components/InvoiceBankDetails';
import InvoiceJobsList from './components/InvoiceJobsList';
import InvoiceSummary from './components/InvoiceSummary';

const ContractorGenerateInvoice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = { ...DEMO_CONTRACTOR_USER, ...user };
  const period = contractorDashboardData.currentPeriod;
  const jobs = dummyCompletedDeliveries;
  const total = jobs.reduce((sum, job) => sum + (job.amount || 0), 0);
  const [submitting, setSubmitting] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Invoice generated as Outstanding (dummy — backend later)');
      setSubmitting(false);
      navigate('/contractor/invoices');
    }, 600);
  };

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <GenerateInvoiceHeader />

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <InvoiceContractorDetails profile={profile} />
            <InvoiceBankDetails bank={profile.bank} />
            <InvoiceJobsList jobs={jobs} period={period} />
          </div>

          <InvoiceSummary
            profile={profile}
            jobsCount={jobs.length}
            total={total}
            submitting={submitting}
          />
        </div>
      </form>
    </div>
  );
};

export default ContractorGenerateInvoice;
