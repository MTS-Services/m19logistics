import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const InvoicesHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Invoices</h1>
        <p className="mt-2 text-gray-600">Invoices submitted to M19 Logistics</p>
      </div>
      <Link
        to="/contractor/invoices/generate"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
      >
        <Plus className="h-4 w-4" />
        Generate Invoice
      </Link>
    </div>
  );
};

export default InvoicesHeader;
