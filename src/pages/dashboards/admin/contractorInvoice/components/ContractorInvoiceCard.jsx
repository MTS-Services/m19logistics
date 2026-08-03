import { Building, Calendar, CheckCircle, Download, Eye, Package, Trash2 } from 'lucide-react';

const ContractorInvoiceCard = ({
  invoice,
  onView,
  onDownload,
  onMarkPaid,
  onDelete,
  markingPaid,
  deleting,
}) => {
  const isPaid = invoice.status === 'Paid';
  const isRejected = invoice.status === 'Rejected';
  const canAct = !isPaid && !isRejected;

  const statusClass =
    invoice.status === 'Paid'
      ? 'bg-green-100 text-green-700'
      : invoice.status === 'Approved'
        ? 'bg-blue-100 text-blue-700'
        : invoice.status === 'Rejected'
          ? 'bg-red-100 text-red-700'
          : 'bg-amber-100 text-amber-700';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md sm:p-4 lg:p-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="flex-1">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{invoice.invoiceNumber}</h3>
            <span className={`inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
              {invoice.status}
            </span>
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-gray-600 sm:text-sm">
              <Building className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="truncate">{invoice.contractor}</span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-gray-500">
              <Calendar className="mt-0.5 h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                Period: {invoice.period} | Submitted: {invoice.submittedAt}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 sm:text-sm">
              <Package className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              <span>{invoice.jobsCount} completed jobs</span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xl font-bold text-gray-900 sm:text-2xl">£{invoice.amount.toFixed(2)}</p>
          <p className="text-xs text-gray-500">inc. VAT £{invoice.vat.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 sm:flex sm:flex-wrap sm:gap-2">
        <button
          type="button"
          onClick={() => onView(invoice)}
          className="flex items-center justify-center space-x-1 rounded-lg bg-teal-50 px-2 py-2 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 sm:px-3 sm:text-sm"
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
        </button>

        <button
          type="button"
          onClick={() => onDownload(invoice)}
          className="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 px-2 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:px-3 sm:text-sm"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">PDF</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(invoice)}
          disabled={deleting || markingPaid}
          className="flex items-center justify-center space-x-1 rounded-lg bg-red-50 px-2 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm"
        >
          {deleting ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{deleting ? 'Deleting...' : 'Delete'}</span>
          <span className="sm:hidden">{deleting ? '...' : 'Delete'}</span>
        </button>

        {canAct && (
          <button
            type="button"
            onClick={() => onMarkPaid(invoice)}
            disabled={markingPaid || deleting}
            className="col-span-2 flex items-center justify-center space-x-1 rounded-lg bg-teal-600 px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-1 sm:px-3 sm:text-sm"
          >
            {markingPaid ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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

export default ContractorInvoiceCard;
