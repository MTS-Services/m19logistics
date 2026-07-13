import { Calendar, CheckCircle, PoundSterling, FileText } from 'lucide-react';
import { formatMoney, formatDate } from '../../contractorDummyData';

const StatsCards = ({ period, data }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Period</p>
            <p className="mt-1 text-xl font-bold text-gray-900">{period.label}</p>
            <p className="mt-1 text-xs text-gray-500">
              {formatDate(period.startDate)} – {formatDate(period.endDate)}
            </p>
          </div>
          <div className="rounded-lg bg-teal-50 p-3">
            <Calendar className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Completed Jobs</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{data.completedJobs}</p>
            <p className="mt-1 text-xs text-gray-500">This period</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Earnings</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatMoney(data.currentEarnings, data.currency)}
            </p>
            <p className="mt-1 text-xs text-gray-500">Based on completed jobs</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3">
            <PoundSterling className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Invoice Status</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {data.invoiceStatus.latestStatus}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Paid {data.invoiceStatus.paid} · Outstanding {data.invoiceStatus.outstanding}
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <FileText className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
