import { FileText } from 'lucide-react';
import { formatMoney } from '../../contractorDummyData';

const InvoiceSummary = ({ profile, jobsCount, total, submitting }) => {
  return (
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
          <dd className="font-medium text-gray-900">{jobsCount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Rate</dt>
          <dd className="font-medium text-gray-900">
            {formatMoney(profile.payStructure?.rate)}/day
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
  );
};

export default InvoiceSummary;
