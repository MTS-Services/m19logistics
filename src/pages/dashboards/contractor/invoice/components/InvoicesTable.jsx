import { formatMoney, formatDate } from '../../contractorDummyData';
import InvoiceActionMenu from './InvoiceActionMenu';

const statusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Outstanding: 'bg-amber-100 text-amber-800',
};

const InvoicesTable = ({ invoices, onView, onDelete }) => {
  return (
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
            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.issuedAt)}</td>
            <td className="px-6 py-4">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  statusStyles[invoice.status] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {invoice.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <InvoiceActionMenu invoice={invoice} onView={onView} onDelete={onDelete} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InvoicesTable;
