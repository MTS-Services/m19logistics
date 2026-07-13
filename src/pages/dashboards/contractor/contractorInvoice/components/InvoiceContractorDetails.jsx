import { Building2 } from 'lucide-react';

const InvoiceContractorDetails = ({ profile }) => {
  return (
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
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Contact</dt>
          <dd className="mt-1 font-medium text-gray-900">
            {profile.contactName || profile.fullName}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Address</dt>
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
  );
};

export default InvoiceContractorDetails;
