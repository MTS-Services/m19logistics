import React from 'react';
import { X, Download } from 'lucide-react';

const ViewInvoiceModal = ({ invoice, onClose, onDownload }) => {
  const customerName = invoice.customer?.fullName || invoice.customer?.username || 'N/A';
  const customerEmail = invoice.customer?.email || '';

  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const subtotal = parseFloat(invoice.subtotal) || 0;
  const vatTotal = parseFloat(invoice.vatTotal) || 0;
  const grandTotal = parseFloat(invoice.grandTotal) || 0;

  const invoiceDate = invoice.invoiceDate
    ? new Date(invoice.invoiceDate).toLocaleDateString('en-GB')
    : 'N/A';
  const dueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-GB') : 'N/A';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Invoice {invoice.invoiceNumber || 'N/A'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{customerName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Company + Invoice info */}
          <div className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">M19 Logistics Limited</h3>
                <p className="mt-2 text-sm text-gray-600">84 Acton Hall Walks</p>
                <p className="text-sm text-gray-600">Wrexham</p>
                <p className="text-sm text-gray-600">LL12 7YJ</p>
                <p className="mt-2 text-sm text-gray-600">
                  Tel: 07818077110 / WhatsApp 07577574676
                </p>
                <p className="mt-2 text-sm font-medium text-gray-700">VAT Number: 447 5918 54</p>
              </div>
              <div className="text-right">
                <h4 className="text-3xl font-bold text-gray-900">INVOICE</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Invoice No: {invoice.invoiceNumber || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Invoice Date: {invoiceDate}</p>
                <p className="text-sm text-gray-600">Due Date: {dueDate}</p>
                {invoice.paymentTerms && (
                  <p className="mt-1 text-xs text-gray-500">{invoice.paymentTerms}</p>
                )}
              </div>
            </div>
          </div>

          {/* Invoice To */}
          <div className="mb-8">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Invoice To:</h4>
            <p className="text-sm font-medium text-gray-900">{customerName}</p>
            {customerEmail && <p className="text-sm text-gray-600">{customerEmail}</p>}
          </div>

          {/* Items table */}
          <div className="mb-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                    Description / Delivery Date / Location
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">
                    VAT
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900">{item.description || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      £{parseFloat(item.unitCost || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      £{parseFloat(item.vatAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      £{parseFloat(item.total || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (20%):</span>
                <span className="font-medium text-gray-900">£{vatTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                <span className="font-semibold text-gray-900">TOTAL:</span>
                <span className="font-bold text-gray-900">£{grandTotal.toFixed(2)}</span>
              </div>
              {invoice.isPaid && invoice.paidAt && (
                <div className="flex justify-between pt-1 text-xs text-green-600">
                  <span>Paid on:</span>
                  <span>{new Date(invoice.paidAt).toLocaleDateString('en-GB')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              onClick={onClose}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onDownload?.(invoice)}
              className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;
