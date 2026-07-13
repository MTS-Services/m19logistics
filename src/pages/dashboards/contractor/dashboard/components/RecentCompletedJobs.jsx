import { Link } from 'react-router-dom';
import { Package, Clock } from 'lucide-react';
import { formatMoney, formatDate } from '../../contractorDummyData';

const RecentCompletedJobs = ({ jobs }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Completed Jobs</h2>
        <Link
          to="/contractor/completed"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-teal-50 p-2">
                <Package className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{job.spoNumber}</p>
                <p className="text-sm text-gray-600">{job.customerName}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatDate(job.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatMoney(job.amount)}</p>
              <span className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCompletedJobs;
