import { CreditCard } from 'lucide-react';

const InvoiceBankDetails = ({ bank }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">Bank Details</h2>
      </div>
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Bank Name</dt>
          <dd className="mt-1 font-medium text-gray-900">{bank?.bankName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Account Name
          </dt>
          <dd className="mt-1 font-medium text-gray-900">{bank?.accountName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Sort Code</dt>
          <dd className="mt-1 font-medium text-gray-900">{bank?.sortCode}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Account Number
          </dt>
          <dd className="mt-1 font-medium text-gray-900">{bank?.accountNumber}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Reference</dt>
          <dd className="mt-1 font-medium text-gray-900">{bank?.reference}</dd>
        </div>
      </dl>
    </div>
  );
};

export default InvoiceBankDetails;
