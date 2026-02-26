import React from 'react';
import { Building, Calendar, Package, Eye, Download } from 'lucide-react';

const InvoiceCard = ({ invoice, statusConfig, onView, onDownload }) => {
  // Normalize status to lowercase for statusConfig lookup (API returns "Draft", config keys are "draft")
  const status = (invoice.status || 'draft').toLowerCase();
  const StatusIcon = statusConfig[status]?.icon || (() => null);

  const invoiceNumber = invoice.invoiceNumber || invoice.id || 'N/A';

  // customer is an object: { fullName, email, customerProfile }
  const customer =
    typeof invoice.customer === 'object' && invoice.customer !== null
      ? invoice.customer.fullName || invoice.customer.email || 'N/A'
      : invoice.customer || 'N/A';

  const customerEmail = typeof invoice.customer === 'object' ? invoice.customer.email || '' : '';

  const invoiceDate = invoice.invoiceDate || invoice.createdAt || new Date();
  const dueDate = invoice.dueDate || null;
  // items array (API: invoice.items)
  const items = invoice.items || [];
  // API uses grandTotal and vatTotal
  const total = invoice.grandTotal || invoice.total || 0;
  const vat = invoice.vatTotal || invoice.vat || 0;
  const paidDate = invoice.paidAt || invoice.paidDate || null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{invoiceNumber}</h3>
            <span
              className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-700'} w-fit`}
            >
              <StatusIcon className="h-3 w-3" />
              <span>{statusConfig[status]?.label || status}</span>
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Building className="h-4 w-4 shrink-0" />
              <span className="wrap-break-word">
                {customer} {customerEmail && `(${customerEmail})`}
              </span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-gray-500 sm:text-sm">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Issued: {new Date(invoiceDate).toLocaleDateString('en-GB')} | Due:{' '}
                {dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : '—'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package className="h-4 w-4 shrink-0" />
              <span>
                {items.length} {items.length === 1 ? 'delivery' : 'deliveries'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xl font-bold text-gray-900 sm:text-2xl">£{Number(total).toFixed(2)}</p>
          <p className="text-xs text-gray-500">inc. VAT £{Number(vat).toFixed(2)}</p>
          {paidDate && (
            <p className="mt-1 text-xs text-green-600">
              Paid: {new Date(paidDate).toLocaleDateString('en-GB')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={() => onView(invoice)}
          className="flex min-w-20 flex-1 items-center justify-center space-x-1 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 sm:flex-initial"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => onDownload(invoice)}
          className="flex min-w-20 flex-1 items-center justify-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:flex-initial"
        >
          <Download className="h-4 w-4" />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceCard;
