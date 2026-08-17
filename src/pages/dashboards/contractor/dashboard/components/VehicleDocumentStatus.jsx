import { AlertTriangle } from 'lucide-react';
import { formatDate } from '../../contractorDummyData';

const expiryStyles = {
  ok: 'border-gray-200 bg-white text-gray-700',
  warning_30: 'border-red-200 bg-red-50 text-red-700',
  warning_14: 'border-red-300 bg-red-50 text-red-800',
  warning_7: 'border-red-400 bg-red-100 text-red-900',
  expired: 'border-red-600 bg-red-200 text-red-950',
};

const formatDaysRemaining = (daysRemaining) => {
  if (daysRemaining == null || Number.isNaN(Number(daysRemaining))) return '—';

  const days = Number(daysRemaining);

  if (days < 0) {
    const ago = Math.abs(days);
    return ago === 1 ? 'Expired 1 day ago' : `Expired ${ago} days ago`;
  }

  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires in 1 day';
  return `Expires in ${days} days`;
};

const VehicleDocumentStatus = ({ documents = [] }) => {
  console.log('VehicleDocumentStatus received documents:', documents);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">Vehicle Document Status</h2>
        <p className="text-sm text-gray-500">
          Shows how many days until expiry. Highlighted in red when within 30 days or expired.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {documents.map((doc) => (
          <div
            key={doc.label}
            className={`rounded-lg border p-4 ${expiryStyles[doc.urgency] || expiryStyles.ok}`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium">{doc.label}</p>
              {(doc.highlight || doc.urgency !== 'ok') && (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
            </div>
            <p className="mt-2 text-lg font-bold">{formatDate(doc.date)}</p>
            <p className="mt-1 text-xs font-semibold tracking-wide uppercase">
              {formatDaysRemaining(doc.daysRemaining)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleDocumentStatus;
