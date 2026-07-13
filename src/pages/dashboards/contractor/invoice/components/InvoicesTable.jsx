import { Calendar, Briefcase, PoundSterling } from 'lucide-react';
import { formatMoney, formatDate } from '../../contractorDummyData';
import InvoiceActionMenu from './InvoiceActionMenu';

const statusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Outstanding: 'bg-amber-100 text-amber-800',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      statusStyles[status] || 'bg-gray-100 text-gray-700'
    }`}
  >
    {status}
  </span>
);

const InvoiceCard = ({ invoice, onView, onDelete }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-gray-900">{invoice.id}</p>
        <p className="mt-1 text-sm text-gray-600">{invoice.period}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <StatusBadge status={invoice.status} />
        <InvoiceActionMenu invoice={invoice} onView={onView} onDelete={onDelete} />
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
      <div className="flex items-start gap-2">
        <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <div>
          <p className="text-xs text-gray-500">Jobs</p>
          <p className="text-sm font-medium text-gray-900">{invoice.jobs}</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <PoundSterling className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <div>
          <p className="text-xs text-gray-500">Amount</p>
          <p className="text-sm font-medium text-gray-900">{formatMoney(invoice.amount)}</p>
        </div>
      </div>
      <div className="col-span-2 flex items-start gap-2">
        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <div>
          <p className="text-xs text-gray-500">Issued</p>
          <p className="text-sm font-medium text-gray-900">{formatDate(invoice.issuedAt)}</p>
        </div>
      </div>
    </div>
  </div>
);

const InvoicesTable = ({ invoices, onView, onDelete }) => {
  return (
    <>
      {/* Mobile + Tablet cards */}
      <div className="space-y-3 p-4 lg:hidden">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Jobs
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Issued
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{invoice.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.period}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.jobs}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatMoney(invoice.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(invoice.issuedAt)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <InvoiceActionMenu invoice={invoice} onView={onView} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoicesTable;
