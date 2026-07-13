import { X } from 'lucide-react';
import { formatMoney } from '../../contractorDummyData';

const CompletedDeliveryDetailModal = ({ delivery, onClose }) => {
  if (!delivery) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex max-h-[75vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">SPO</dt>
              <dd className="mt-1 font-medium text-gray-900">{delivery.spoNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Amount</dt>
              <dd className="mt-1 font-medium text-gray-900">{formatMoney(delivery.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Customer</dt>
              <dd className="mt-1 font-medium text-gray-900">{delivery.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Phone</dt>
              <dd className="mt-1 font-medium text-gray-900">{delivery.customerPhone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Address</dt>
              <dd className="mt-1 font-medium text-gray-900">{delivery.deliveryAddress}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Completed</dt>
              <dd className="mt-1 font-medium text-gray-900">{delivery.completedAt}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Received By
              </dt>
              <dd className="mt-1 font-medium text-gray-900">{delivery.receivedBy}</dd>
            </div>
            {delivery.driverNotes && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Notes</dt>
                <dd className="mt-1 font-medium text-gray-900">{delivery.driverNotes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CompletedDeliveryDetailModal;
