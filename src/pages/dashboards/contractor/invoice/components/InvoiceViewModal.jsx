import { X } from 'lucide-react';
import { formatMoney, formatDate } from '../../contractorDummyData';

const statusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Outstanding: 'bg-amber-100 text-amber-800',
  Pending: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-red-100 text-red-700',
};

const InvoiceViewModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</p>
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                statusStyles[invoice.status] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Period</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{invoice.period}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Jobs</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{invoice.jobs}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Rate</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{formatMoney(invoice.rate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Amount</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatMoney(invoice.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Issued</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {formatDate(invoice.issuedAt)}
              </dd>
            </div>
            {invoice.paidAt && (
              <div>
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Paid</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(invoice.paidAt)}
                </dd>
              </div>
            )}
          </dl>

          {invoice.items?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Line Items</h3>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                {invoice.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{item.spoNumber || '—'}</p>
                      <p className="truncate text-xs text-gray-500">{item.description || ''}</p>
                    </div>
                    <p className="shrink-0 font-medium text-gray-900">
                      {formatMoney(Number(item.amount) || 0)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewModal;
