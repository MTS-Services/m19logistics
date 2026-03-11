import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Search,
  Eye,
  Building2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance';

const StoreInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [storeFilter, setStoreFilter] = useState('All');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalPaid: '0.00',
    totalUnpaid: '0.00',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/api/admin/invoices');
      if (response.data.success) {
        const mapped = response.data.data.map((d) => ({
          id: d.id,
          invoiceNumber: d.invoiceNumber,
          customerName: d.customer?.fullName || 'N/A',
          storeName: d.customer?.customerProfile?.storeName || d.customer?.fullName || 'N/A',
          invoiceDate: d.invoiceDate ? d.invoiceDate.split('T')[0] : 'N/A',
          weekStartDate: d.weekStartDate ? d.weekStartDate.split('T')[0] : 'N/A',
          weekEndDate: d.weekEndDate ? d.weekEndDate.split('T')[0] : 'N/A',
          dueDate: d.dueDate ? d.dueDate.split('T')[0] : null,
          status: d.status,
          subtotal: parseFloat(d.subtotal) || 0,
          vat: parseFloat(d.vatTotal) || 0,
          total: parseFloat(d.grandTotal) || 0,
          isPaid: d.isPaid || false,
          paidAt: d.paidAt ? d.paidAt.split('T')[0] : null,
          pdfUrl: d.pdfUrl || null,
          paymentTerms: d.paymentTerms || '30 Days (End of Month)',
          deliveries: d.items?.length || 0,
          items: d.items || [],
        }));
        setInvoices(mapped);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
      } else {
        setError('Failed to fetch invoices');
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleViewInvoice = async (invoice) => {
    setShowViewModal(true);
    setSelectedInvoice(null);
    setModalLoading(true);
    setModalError(null);
    try {
      const response = await axiosInstance.get(`/api/admin/invoices/${invoice.id}`);
      if (response.data.success) {
        const d = response.data.data;
        setSelectedInvoice({
          id: d.id,
          invoiceNumber: d.invoiceNumber,
          customerName: d.customer?.fullName || 'N/A',
          customerEmail: d.customer?.email || 'N/A',
          customerPhone: d.customer?.phone || 'N/A',
          storeName: d.customer?.customerProfile?.storeName || d.customer?.fullName || 'N/A',
          depotAddress: d.customer?.customerProfile?.depotAddress || 'N/A',
          invoiceDate: d.invoiceDate ? d.invoiceDate.split('T')[0] : 'N/A',
          weekStartDate: d.weekStartDate ? d.weekStartDate.split('T')[0] : 'N/A',
          weekEndDate: d.weekEndDate ? d.weekEndDate.split('T')[0] : 'N/A',
          dueDate: d.dueDate ? d.dueDate.split('T')[0] : null,
          status: d.status,
          subtotal: parseFloat(d.subtotal) || 0,
          vat: parseFloat(d.vatTotal) || 0,
          total: parseFloat(d.grandTotal) || 0,
          isPaid: d.isPaid || false,
          paidAt: d.paidAt ? d.paidAt.split('T')[0] : null,
          pdfUrl: d.pdfUrl || null,
          paymentTerms: d.paymentTerms || '30 Days (End of Month)',
          customerRef: d.customerRef || null,
          notes: d.notes || null,
          items: (d.items || []).map((item) => ({
            id: item.id,
            description: item.description,
            quantity: item.quantity,
            unitCost: parseFloat(item.unitCost) || 0,
            vatAmount: parseFloat(item.vatAmount) || 0,
            total: parseFloat(item.total) || 0,
            isAdditional: item.isAdditional || false,
            spoNumber: item.delivery?.spoNumber || item.spoNumber || null,
            deliveryDate: item.delivery?.deliveryDate
              ? item.delivery.deliveryDate.split('T')[0]
              : null,
            deliveryAddress: item.delivery?.deliveryAddress || null,
            deliveryStatus: item.delivery?.status || null,
          })),
        });
      } else {
        setModalError('Failed to load invoice details');
      }
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      setModalError(
        err.response?.data?.message || 'An error occurred while loading invoice details'
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Dynamic store list from fetched data
  const stores = [
    'All',
    ...Array.from(new Set(invoices.map((i) => i.storeName).filter((s) => s && s !== 'N/A'))).sort(),
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStore = storeFilter === 'All' || invoice.storeName === storeFilter;
    return matchesSearch && matchesStore;
  });

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-sm">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-100 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchInvoices}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Store Invoices
          </h1>
          <p className="mt-2 text-gray-600">
            View invoices for all assigned Topps Tiles stores (Read-Only)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{summary.totalInvoices}</p>
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
                  £{parseFloat(summary.totalPaid).toFixed(2)}
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
                  £{parseFloat(summary.totalUnpaid).toFixed(2)}
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
            <div className="relative">
              <Building2 className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                className="w-full appearance-none rounded-md border border-gray-300 py-2 pr-10 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              >
                {stores.map((store) => (
                  <option key={store} value={store}>
                    {store === 'All' ? 'All Stores' : store}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Invoice Cards */}
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
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${invoice.isPaid
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600'
                      }`}
                  >
                    {invoice.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{invoice.invoiceDate}</span>
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
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  <Eye className="h-4 w-4" />
                  View Invoice
                </button>
              </div>
            ))
          )}
        </div>

        {/* View Invoice Modal */}
        {showViewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
            <div className="max-h-[85vh] w-full max-w-3xl rounded-xl bg-white shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header - Sticky */}
              <div className="flex items-center justify-between rounded-t-xl bg-linear-to-r from-teal-600 to-teal-500 px-4 py-4 sm:px-6 sm:py-5 shrink-0">
                <div>
                  <p className="text-xs font-medium tracking-widest text-teal-100 uppercase">
                    Invoice
                  </p>
                  <h2 className="mt-0.5 text-xl font-bold text-white">
                    {modalLoading ? 'Loading...' : selectedInvoice?.invoiceNumber || '—'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-lg p-1.5 text-teal-200 transition-colors hover:bg-teal-700 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Loading state */}
                {modalLoading && (
                  <div className="flex flex-col items-center gap-3 py-12 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    <p className="text-sm">Loading invoice details...</p>
                  </div>
                )}

                {/* Error state */}
                {modalError && !modalLoading && (
                  <div className="flex flex-col items-center gap-3 py-12 text-center">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-sm text-red-600">{modalError}</p>
                  </div>
                )}

                {/* Content */}
                {!modalLoading && !modalError && selectedInvoice && (
                  <div className="space-y-5">
                    {/* M19 Branding + Invoice Meta */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <h1 className="text-xl font-bold text-teal-600">M19 Logistics Limited</h1>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                          84 Acton Hall Walks, Wrexham, LL12 7YJ
                          <br />
                          Tel: 07971415430 / WhatsApp: 07577574676
                          <br />
                          VAT Number: 447 5918 54
                        </p>
                      </div>
                      <div className="space-y-1 sm:text-right">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Invoice #:</span>{' '}
                          {selectedInvoice.invoiceNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Date:</span> {selectedInvoice.invoiceDate}
                        </p>
                        {selectedInvoice.dueDate && (
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Due Date:</span>{' '}
                            {selectedInvoice.dueDate}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Week:</span>{' '}
                          {selectedInvoice.weekStartDate} – {selectedInvoice.weekEndDate}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${selectedInvoice.isPaid
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-600'
                            }`}
                        >
                          {selectedInvoice.isPaid && <CheckCircle className="h-3 w-3" />}
                          {selectedInvoice.isPaid
                            ? `Paid${selectedInvoice.paidAt ? ' · ' + selectedInvoice.paidAt : ''}`
                            : 'Unpaid'}
                        </span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="rounded-lg border border-gray-200 p-4">
                      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Invoice To
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {selectedInvoice.storeName}
                      </p>
                      <p className="text-sm text-gray-600">{selectedInvoice.customerName}</p>
                      {selectedInvoice.customerEmail !== 'N/A' && (
                        <p className="text-xs text-gray-400">{selectedInvoice.customerEmail}</p>
                      )}
                      {selectedInvoice.customerPhone !== 'N/A' && (
                        <p className="text-xs text-gray-400">{selectedInvoice.customerPhone}</p>
                      )}
                    </div>

                    {/* Invoice Items */}
                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Items
                      </p>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 font-semibold text-gray-700">Description</th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                Unit
                              </th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                VAT
                              </th>
                              <th className="px-4 py-3 text-right font-semibold text-gray-700">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedInvoice.items.map((item) => (
                              <tr key={item.id}>
                                <td className="max-w-xs px-4 py-3 text-gray-600">
                                  <p className="text-sm">{item.description}</p>
                                  {item.isAdditional && (
                                    <span className="mt-0.5 inline-block rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">
                                      Additional
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-800">
                                  £{item.unitCost.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-800">
                                  £{item.vatAmount.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                  £{item.total.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-2 text-right text-sm font-medium text-gray-700"
                              >
                                Subtotal
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                £{selectedInvoice.subtotal.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-2 text-right text-sm font-medium text-gray-700"
                              >
                                VAT (20%)
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                                £{selectedInvoice.vat.toFixed(2)}
                              </td>
                            </tr>
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-3 text-right text-base font-bold text-gray-900"
                              >
                                Total
                              </td>
                              <td className="px-4 py-3 text-right text-base font-bold text-teal-600">
                                £{selectedInvoice.total.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Payment Terms
                      </p>
                      <p className="text-sm text-gray-700">{selectedInvoice.paymentTerms}</p>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        <span className="font-semibold">Bank:</span> NatWest Bank
                        <br />
                        <span className="font-semibold">Account Holder:</span> M19 Logistics Limited
                        <br />
                        <span className="font-semibold">Sort Code:</span> 01-10-01
                        <br />
                        <span className="font-semibold">Account Number:</span> 72696370
                      </p>
                    </div>

                    {/* Notes / Customer Ref */}
                    {(selectedInvoice.notes || selectedInvoice.customerRef) && (
                      <div className="rounded-lg border border-gray-200 p-4">
                        {selectedInvoice.customerRef && (
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Customer Ref:</span>{' '}
                            {selectedInvoice.customerRef}
                          </p>
                        )}
                        {selectedInvoice.notes && (
                          <p className="mt-1 text-sm text-gray-600">
                            <span className="font-semibold">Notes:</span> {selectedInvoice.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer - Sticky */}
              <div className="border-t border-gray-100 px-4 py-3 sm:px-6 sm:py-4 shrink-0">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
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
