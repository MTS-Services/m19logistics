import { Building2 } from 'lucide-react';
import { formatMoney } from '../../contractorDummyData';

const DashboardHeader = ({ profile }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {profile.tradingName || profile.fullName || profile.name}
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
        <Building2 className="h-4 w-4" />
        <span>
          Pay: {profile.payStructure?.payType || 'Weekly'} 
        </span>
      </div>
    </div>
  );
};

export default DashboardHeader;
