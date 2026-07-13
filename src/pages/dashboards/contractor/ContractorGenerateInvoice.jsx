import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Building2, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import {
  DEMO_CONTRACTOR_USER,
  contractorDashboardData,
  dummyCompletedDeliveries,
  formatMoney,
  formatDate,
} from './contractorDummyData';

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
      <div>
        <Link
          to="/contractor/invoices"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to invoices
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Generate Invoice</h1>
        <p className="mt-2 text-gray-600">
          Invoice to M19 Logistics for the current pay period — dummy preview
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Contractor Details</h2>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Trading Name
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{profile.tradingName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Contact
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {profile.contactName || profile.fullName}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Address
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {profile.tradingAddress || profile.address}
                  </dd>
                </div>
                {profile.vatRegistered && (
                  <div>
                    <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      VAT Number
                    </dt>
                    <dd className="mt-1 font-medium text-gray-900">{profile.vatNumber}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Bank Details</h2>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Bank Name
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{profile.bank?.bankName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Account Name
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{profile.bank?.accountName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Sort Code
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{profile.bank?.sortCode}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Account Number
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{profile.bank?.accountNumber}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Reference
                  </dt>
                  <dd className="mt-1 font-medium text-gray-900">{profile.bank?.reference}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Completed Jobs This Period</h2>
                <p className="text-sm text-gray-500">
                  {formatDate(period.startDate)} – {formatDate(period.endDate)}
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{job.spoNumber}</p>
                      <p className="text-sm text-gray-500">
                        {job.customerName} · {formatDate(job.date)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">{formatMoney(job.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-4 lg:self-start">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-900">Summary</h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Pay Type</dt>
                <dd className="font-medium text-gray-900">{profile.payStructure?.payType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Jobs</dt>
                <dd className="font-medium text-gray-900">{jobs.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Rate</dt>
                <dd className="font-medium text-gray-900">
                  {formatMoney(profile.payStructure?.rate)} / day
                </dd>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <dt className="text-base font-semibold text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-teal-700">{formatMoney(total)}</dd>
                </div>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60"
            >
              <FileText className="h-4 w-4" />
              {submitting ? 'Generating...' : 'Generate & Submit'}
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Status will be Outstanding until Admin marks Paid
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContractorGenerateInvoice;
