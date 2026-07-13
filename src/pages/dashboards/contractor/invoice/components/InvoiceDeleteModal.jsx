import { X, Trash2 } from 'lucide-react';
import { formatMoney } from '../../contractorDummyData';

const InvoiceDeleteModal = ({ invoice, onCancel, onConfirm }) => {
  if (!invoice) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">Delete Invoice</h3>
          <p className="mb-4 text-center text-sm text-gray-600">
            Are you sure you want to delete <strong>{invoice.id}</strong>? This action cannot be
            undone.
          </p>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice:</span>
                <span className="font-medium text-gray-900">{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium text-gray-900">{invoice.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">{formatMoney(invoice.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-gray-900">{invoice.status}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDeleteModal;
