import { AlertCircle, CalendarClock, CheckCircle, XCircle } from 'lucide-react';

const FailedDeliveriesStats = ({ stats }) => (
  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base text-gray-600">Total Failed</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-red-50 p-2">
          <XCircle className="h-5 w-5 text-red-600" />
        </div>
      </div>
    </div>

    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base text-gray-600">Pending Review</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.pending}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </div>
      </div>
    </div>

    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base text-gray-600">Re-attempt</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.reattempt}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-2">
          <CalendarClock className="h-5 w-5 text-blue-600" />
        </div>
      </div>
    </div>

    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base text-gray-600">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.resolved}</p>
        </div>
        <div className="rounded-lg bg-green-50 p-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
      </div>
    </div>
  </div>
);

export default FailedDeliveriesStats;
