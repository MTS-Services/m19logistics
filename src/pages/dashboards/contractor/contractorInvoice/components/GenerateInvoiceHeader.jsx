import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GenerateInvoiceHeader = () => {
  return (
    <div>
      <Link
        to="/contractor/invoices"
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to invoices
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Generate Invoice</h1>
      <p className="mt-2 text-gray-600">
        Create and submit an invoice to M19 Logistics for your pay period
      </p>
    </div>
  );
};

export default GenerateInvoiceHeader;
