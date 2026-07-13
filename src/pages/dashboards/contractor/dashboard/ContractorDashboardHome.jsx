import React from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  DEMO_CONTRACTOR_USER,
  contractorDashboardData,
  dummyCompletedDeliveries,
  dummyInvoices,
  getExpiryUrgency,
  getExpiryLabel,
} from '../contractorDummyData';
import DashboardHeader from './components/DashboardHeader';
import DocumentAlertBanner from './components/DocumentAlertBanner';
import StatsCards from './components/StatsCards';
import RecentCompletedJobs from './components/RecentCompletedJobs';
import InvoiceSnapshot from './components/InvoiceSnapshot';
import VehicleDocumentStatus from './components/VehicleDocumentStatus';

const ContractorDashboardHome = () => {
  const { user } = useAuth();
  const profile = {
    ...DEMO_CONTRACTOR_USER,
    ...user,
    vehicle: { ...DEMO_CONTRACTOR_USER.vehicle, ...(user?.vehicle || {}) },
  };
  const data = contractorDashboardData;
  const recentJobs = dummyCompletedDeliveries.slice(0, 4);

  const documentChecks = [
    { label: 'MOT Expiry', date: profile.vehicle?.motExpiry },
    { label: 'Insurance Expiry', date: profile.vehicle?.insuranceExpiry },
    { label: 'Goods In Transit', date: profile.vehicle?.goodsInTransitExpiry },
    { label: 'Public Liability', date: profile.vehicle?.publicLiabilityExpiry },
  ].map((doc) => {
    const urgency = getExpiryUrgency(doc.date);
    return { ...doc, urgency, urgencyLabel: getExpiryLabel(urgency) };
  });

  const hasCriticalDocs = documentChecks.some(
    (doc) => doc.urgency === 'expired' || doc.urgency === 'warning_7'
  );

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <DashboardHeader profile={profile} />
      {/* <DocumentAlertBanner show={hasCriticalDocs} /> */}
      <StatsCards period={data.currentPeriod} data={data} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <RecentCompletedJobs jobs={recentJobs} />
        <InvoiceSnapshot invoices={dummyInvoices} />
      </div>

      <VehicleDocumentStatus documents={documentChecks} />
    </div>
  );
};

export default ContractorDashboardHome;
