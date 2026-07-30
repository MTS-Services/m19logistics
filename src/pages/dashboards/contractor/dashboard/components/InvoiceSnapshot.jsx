import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { formatMoney } from '../../contractorDummyData';

const invoiceStatusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Outstanding: 'bg-amber-100 text-amber-800',
  Pending: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
};

const InvoiceSnapshot = ({ invoices = [] }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Invoices</h2>
        <Link
          to="/contractor/invoices"
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          View all
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-gray-500">No recent invoices.</div>
      ) : (
        <div className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{invoice.id}</p>
                  <p className="text-sm text-gray-600">{invoice.period}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    invoiceStatusStyles[invoice.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {formatMoney(invoice.amount)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 p-4">
        <Link
          to="/contractor/invoices/generate"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          <FileText className="h-4 w-4" />
          Generate Invoice
        </Link>
      </div>
    </div>
  );
};

export default InvoiceSnapshot;
