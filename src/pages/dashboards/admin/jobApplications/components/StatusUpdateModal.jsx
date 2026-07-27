import { Loader2, MessageSquare, XCircle } from 'lucide-react';

const StatusUpdateModal = ({
  application,
  newStatus,
  adminNotes,
  isUpdating,
  getStatusBadge,
  onAdminNotesChange,
  onClose,
  onConfirm,
}) => {
  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Update Application Status</h2>
            <p className="mt-0.5 text-xs text-gray-500">{application.fullName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
            <div className="text-center">
              <p className="mb-1 text-xs text-gray-400">From</p>
              {getStatusBadge(application.status)}
            </div>
            <span className="text-lg font-bold text-gray-400">→</span>
            <div className="text-center">
              <p className="mb-1 text-xs text-gray-400">To</p>
              {getStatusBadge(newStatus)}
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              Admin Notes
              <span className="text-xs font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => onAdminNotesChange(e.target.value)}
              rows={3}
              placeholder="e.g. Strong candidate, schedule interview for next week..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition-colors outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
            />
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUpdating}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-700 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Confirm Update'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
