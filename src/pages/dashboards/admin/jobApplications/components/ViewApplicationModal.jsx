import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  XCircle,
} from 'lucide-react';
import axiosInstance from '../../../../../services/axiosInstance';

const ViewApplicationModal = ({
  applicationId,
  getStatusBadge,
  formatDate,
  onClose,
  onLoaded,
}) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!applicationId) return;

    let cancelled = false;

    const fetchApplication = async () => {
      setLoading(true);
      setError(null);
      setApplication(null);

      try {
        const response = await axiosInstance.get(`/api/admin/job-applications/${applicationId}`);
        const data = response.data?.data || response.data;

        if (!cancelled) {
          setApplication(data);
          if (typeof onLoaded === 'function') {
            onLoaded(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message || 'Failed to load application details. Please try again.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      cancelled = true;
    };
  }, [applicationId, onLoaded]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-teal-700">
              {application?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-gray-900">
                {loading ? 'Loading...' : application?.fullName || 'Application Details'}
              </h2>
              <p className="text-xs text-gray-500">Application #{applicationId}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              <p className="text-sm text-gray-500">Loading application details...</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-sm text-red-600">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          )}

          {!loading && !error && application && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                {getStatusBadge(application.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Read Status</span>
                {application.isRead ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    <CheckCircle className="h-3 w-3" />
                    Read
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                    <Clock className="h-3 w-3" />
                    Unread
                  </span>
                )}
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="text-sm font-medium break-all text-gray-800">
                      {application.email || '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {application.phoneNumber || '—'}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  Application Details
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Briefcase className="h-3 w-3" /> Position
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {application.positionOfInterest || '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Calendar className="h-3 w-3" /> Applied Date
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(application.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {application.coverLetter && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                      Cover Letter
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                        {application.coverLetter}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {application.adminNotes && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-1 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Admin Notes
                    </h3>
                    <div className="rounded-lg bg-amber-50 p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-800">
                        {application.adminNotes}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {application.cvUrl && (
                <>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                      CV / Resume
                    </h3>
                    <a
                      href={application.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-700"
                    >
                      <FileText className="h-4 w-4" />
                      View / Download CV
                      <Download className="h-4 w-4" />
                    </a>
                    <p className="text-center text-xs text-gray-400">Opens in a new tab</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {!loading && !error && application && (
          <div className="shrink-0 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewApplicationModal;
