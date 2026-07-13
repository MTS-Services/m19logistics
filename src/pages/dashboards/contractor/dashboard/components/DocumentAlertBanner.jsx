import { AlertTriangle } from 'lucide-react';

const DocumentAlertBanner = ({ show }) => {
  if (!show) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-900">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">Document attention required</p>
        <p className="text-sm">
          One or more vehicle documents expire soon or have expired. Expired documents may block
          job allocation.
        </p>
      </div>
    </div>
  );
};

export default DocumentAlertBanner;
