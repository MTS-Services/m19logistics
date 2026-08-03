import { formatMoney, formatDate } from '../../contractorDummyData';

const InvoiceJobsList = ({ jobs = [], period = {} }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Completed Jobs This Period</h2>
        <p className="text-sm text-gray-500">
          {period.label ? `${period.label} · ` : ''}
          {formatDate(period.startDate)} – {formatDate(period.endDate)}
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-gray-500">
          No completed jobs found for this period preview.
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default InvoiceJobsList;
