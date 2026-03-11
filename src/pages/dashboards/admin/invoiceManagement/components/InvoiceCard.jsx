import React from 'react';
import { Building, Calendar, Package, Eye, Download, CheckCircle, Edit } from 'lucide-react';

const InvoiceCard = ({ invoice, statusConfig, onView, onEdit, onDownload, onMarkPaid, markingPaid }) => {
  // If invoice has a paidAt date, treat it as paid regardless of status field
  const isPaid = !!(invoice.paidAt || invoice.paidDate || invoice.isPaid);
  // Normalize status: paid takes priority
  const status = isPaid ? 'paid' : (invoice.status || 'draft').toLowerCase();
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
    <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 lg:p-6 shadow-sm transition-all hover:shadow-md">
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
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <Building className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="wrap-break-word truncate">
                {customer} {customerEmail && `(${customerEmail})`}
              </span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-gray-500">
              <Calendar className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="text-xs sm:text-sm">
                Issued: {new Date(invoiceDate).toLocaleDateString('en-GB')} | Due:{' '}
                {dueDate ? new Date(dueDate).toLocaleDateString('en-GB') : '—'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
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

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 sm:flex sm:flex-wrap sm:gap-2">
        <button
          type="button"
          onClick={() => onView(invoice)}
          className="flex items-center justify-center space-x-1 rounded-lg bg-teal-50 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
        </button>
        <button
          type="button"
          onClick={() => onEdit(invoice)}
          disabled={isPaid}
          className={`flex items-center justify-center space-x-1 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${isPaid
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          type="button"
          onClick={() => onDownload(invoice)}
          className="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">PDF</span>
        </button>
        {!isPaid && onMarkPaid && (
          <button
            type="button"
            onClick={() => onMarkPaid(invoice)}
            disabled={markingPaid}
            className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-1 rounded-lg bg-teal-600 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markingPaid ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{markingPaid ? 'Marking...' : 'Mark as Paid'}</span>
            <span className="sm:hidden">{markingPaid ? '...' : 'Paid'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InvoiceCard;
