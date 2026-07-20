import { X, User, Phone, MapPin, Calendar, Weight, Truck, FileText } from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getReasonStyle,
  getStatusStyle,
} from '../utils';

const FailedDeliveryViewModal = ({ delivery, onClose }) => {
  if (!delivery) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4 sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Failed Delivery Details</h2>
            <p className="mt-1 text-base text-gray-600">{delivery.spoNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${getReasonStyle()}`}
              >
                {delivery.reason}
              </span>
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${getStatusStyle(delivery.status)}`}
              >
                {delivery.status}
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Customer</p>
                    <p className="font-medium text-gray-900">{delivery.customer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phone</p>
                    <p className="font-medium text-gray-900">{delivery.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Address</p>
                    <p className="font-medium text-gray-900">{delivery.deliveryAddress}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Scheduled</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(delivery.scheduledDate)} · {delivery.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Failed At</p>
                      <p className="font-medium text-red-700">{formatDateTime(delivery.failedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Weight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Weight</p>
                      <p className="font-medium text-gray-900">{delivery.weight}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Cost</p>
                      <p className="font-medium text-gray-900">{formatMoney(delivery.cost)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">
                Driver Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Driver</p>
                    <p className="font-medium text-gray-900">{delivery.driver}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Driver Phone</p>
                    <p className="font-medium text-gray-900">{delivery.driverPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 font-semibold text-red-900">Driver Notes</h3>
              <p className="text-sm leading-relaxed text-red-800">{delivery.driverNotes}</p>
            </div>

            {delivery.reattemptDate && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">Re-attempt Scheduled</h3>
                <p className="text-sm text-blue-800">
                  {formatDate(delivery.reattemptDate)} · {delivery.reattemptSlot}
                </p>
              </div>
            )}

            {delivery.resolution && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-900">Resolution</h3>
                <p className="text-sm text-green-800">{delivery.resolution}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedDeliveryViewModal;
