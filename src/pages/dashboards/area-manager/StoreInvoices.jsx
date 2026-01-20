import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Building2,
  Download,
  Mail,
  Printer,
  X,
  Calendar,
} from 'lucide-react';

const StoreInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const stores = [
    'All',
    'Topps Chester',
    'Topps Nantwich',
    'Topps Newcastle',
    'Topps Northwich',
    'Topps Rhyl',
    'Topps Wrexham',
  ];

  const [invoices] = useState([
    {
      id: 1,
      invoiceNumber: 'T0326',
      storeName: 'Topps Chester',
      date: '2026-01-10',
      dueDate: '2026-02-09',
      subtotal: 450.0,
      vat: 90.0,
      total: 540.0,
      status: 'Paid',
      deliveries: 12,
    },
    {
      id: 2,
      invoiceNumber: 'T0327',
      storeName: 'Topps Newcastle',
      date: '2026-01-10',
      dueDate: '2026-02-09',
      subtotal: 625.0,
      vat: 125.0,
      total: 750.0,
      status: 'Unpaid',
      deliveries: 15,
    },
    {
      id: 3,
      invoiceNumber: 'T0328',
      storeName: 'Topps Wrexham',
      date: '2026-01-10',
      dueDate: '2026-02-09',
      subtotal: 337.5,
      vat: 67.5,
      total: 405.0,
      status: 'Paid',
      deliveries: 9,
    },
  ]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.storeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStore = storeFilter === 'All' || invoice.storeName === storeFilter;

    return matchesSearch && matchesStore;
  });

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              Store Invoices
            </h1>
            <p className="mt-2 text-gray-600">
              View invoices for all assigned Topps Tiles stores (Read-Only)
            </p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  £
                  {invoices
                    .filter((inv) => inv.status === 'Paid')
                    .reduce((sum, inv) => sum + inv.total, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Unpaid</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  £
                  {invoices
                    .filter((inv) => inv.status === 'Unpaid')
                    .reduce((sum, inv) => sum + inv.total, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by invoice number or store..."
                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Store Filter */}
            <div className="relative">
              <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {stores.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInvoices.length === 0 ? (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
              <p className="mt-2 text-sm text-gray-600">
                {searchQuery || storeFilter !== 'All'
                  ? 'Try adjusting your filters'
                  : 'No invoices available'}
              </p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-teal-50 p-3">
                      <FileText className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">{invoice.storeName}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      invoice.status === 'Paid'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{invoice.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deliveries:</span>
                    <span className="font-medium text-gray-900">{invoice.deliveries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      £{invoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT (20%):</span>
                    <span className="font-medium text-gray-900">£{invoice.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-teal-600">£{invoice.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewInvoice(invoice)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  <Eye className="h-4 w-4" />
                  View Invoice
                </button>
              </div>
            ))
          )}
        </div>

        {/* View Invoice Modal */}
        {showViewModal && selectedInvoice && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Invoice Content */}
              <div className="p-6">
                {/* M19 Header */}
                <div className="mb-6 border-b border-gray-200 pb-6">
                  <h1 className="text-2xl font-bold text-teal-600">M19 Logistics Limited</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    84 Acton Hall Walks
                    <br />
                    Wrexham
                    <br />
                    LL12 7YJ
                    <br />
                    Tel.: 07971415430 / 01978439739
                    <br />
                    Email: m19logistics@gmail.com
                    <br />
                    VAT Number: 447 5918 54
                  </p>
                </div>

                {/* Invoice Details */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Invoice To:</h3>
                    <p className="text-sm text-gray-600">{selectedInvoice.storeName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Invoice Number:</span>{' '}
                      {selectedInvoice.invoiceNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Date:</span> {selectedInvoice.date}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Due Date:</span> {selectedInvoice.dueDate}
                    </p>
                  </div>
                </div>

                {/* Invoice Items */}
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-900">Description</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-gray-600">
                          Deliveries ({selectedInvoice.deliveries})
                        </td>
                        <td className="px-4 py-3 text-right text-gray-900">
                          £{selectedInvoice.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          Subtotal:
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          £{selectedInvoice.subtotal.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          VAT (20%):
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          £{selectedInvoice.vat.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-right text-lg font-bold text-gray-900">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right text-lg font-bold text-teal-600">
                          £{selectedInvoice.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Payment Terms */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">Payment Terms:</h3>
                  <p className="text-sm text-gray-600">30 Days (End of Month)</p>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Bank:</span> NatWest Bank
                    <br />
                    <span className="font-semibold">Account Holder:</span> M19 Logistics Limited
                    <br />
                    <span className="font-semibold">Sort Code:</span> 01-10-01
                    <br />
                    <span className="font-semibold">Account Number:</span> 72696370
                  </p>
                </div>

                {/* Read-Only Notice */}
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900">Read-Only Access</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        You cannot edit, download, or email this invoice. Contact an administrator
                        for these actions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreInvoices;
