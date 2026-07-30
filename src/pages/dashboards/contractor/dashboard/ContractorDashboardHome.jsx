import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getContractorDashboard } from '../../../../services/driverService';
import Loading from '../../../../components/Loading';
import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import RecentCompletedJobs from './components/RecentCompletedJobs';
import InvoiceSnapshot from './components/InvoiceSnapshot';
import VehicleDocumentStatus from './components/VehicleDocumentStatus';

const DOC_LABELS = {
  motExpiry: 'MOT Expiry',
  insuranceExpiry: 'Insurance Expiry',
  goodsInTransitExpiry: 'Goods In Transit',
  publicLiabilityExpiry: 'Public Liability',
};

const mapDocStatusToUrgency = (status) => {
  const value = (status || '').toString().toUpperCase();
  if (value === 'EXPIRED') return 'expired';
  if (value === 'WITHIN_7_DAYS') return 'warning_7';
  if (value === 'WITHIN_14_DAYS') return 'warning_14';
  if (value === 'WITHIN_30_DAYS') return 'warning_30';
  return 'ok';
};

const normalizeJobs = (jobs = []) =>
  jobs.map((job, index) => ({
    id: job.id ?? job.deliveryId ?? `job-${index}`,
    spoNumber: job.spoNumber || job.spo || '—',
    customerName: job.customerName || job.customer?.fullName || '—',
    date: job.date || job.completedAt || job.completedDate || null,
    amount: job.amount ?? job.earnings ?? job.rate ?? 0,
    status: job.status || 'Completed',
  }));

const normalizeInvoices = (invoices = []) =>
  invoices.map((invoice, index) => ({
    id: invoice.id ?? invoice.invoiceNumber ?? `inv-${index}`,
    period: invoice.period || invoice.periodLabel || '—',
    amount: invoice.amount ?? 0,
    status: invoice.status || 'Outstanding',
    issuedAt: invoice.issuedAt || invoice.createdAt || null,
  }));

const normalizeDocuments = (documentStatus = {}) =>
  Object.entries(DOC_LABELS).map(([key, label]) => {
    const doc = documentStatus[key] || {};
    const urgency = mapDocStatusToUrgency(doc.status);
    return {
      label,
      date: doc.date || null,
      urgency,
      urgencyLabel: doc.label || 'Valid',
      highlight: !!doc.highlight,
      daysRemaining: doc.daysRemaining,
    };
  });

const ContractorDashboardHome = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mount এ contractor dashboard API call করে stats, jobs, invoices ও document status load করে
  useEffect(function fetchContractorDashboardOnMount() {
    let isMounted = true;

    const fetchContractorDashboard = async () => {
      setLoading(true);
      try {
        const response = await getContractorDashboard();
        console.log('Contractor dashboard response:', response);

        if (!isMounted) return;

        if (response?.success && response?.data) {
          setDashboard(response.data);
        } else {
          throw new Error(response?.message || 'Failed to load dashboard');
        }
      } catch (error) {
        console.error('Error loading contractor dashboard:', error);
        if (isMounted) {
          toast.error(error.response?.data?.message || 'Failed to load contractor dashboard');
          setDashboard(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchContractorDashboard();

    return function cleanupContractorDashboardFetch() {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loading />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6 text-center text-sm text-gray-600">
        Unable to load contractor dashboard data.
      </div>
    );
  }

  const contractor = dashboard.contractor || {};
  const period = dashboard.currentPeriod || {};
  const invoiceStatus = dashboard.invoiceStatus || { paid: 0, outstanding: 0, summary: '—' };
  const recentJobs = normalizeJobs(dashboard.recentCompletedJobs);
  const recentInvoices = normalizeInvoices(dashboard.recentInvoices);
  const documents = normalizeDocuments(dashboard.documentStatus);

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <DashboardHeader contractor={contractor} />
      <StatsCards period={period} invoiceStatus={invoiceStatus} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <RecentCompletedJobs jobs={recentJobs} />
        <InvoiceSnapshot invoices={recentInvoices} />
      </div>

      <VehicleDocumentStatus documents={documents} />
    </div>
  );
};

export default ContractorDashboardHome;
