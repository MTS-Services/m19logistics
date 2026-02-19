import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Mail,
  Printer,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination';
import Loading from '../../../components/Loading';
import { getAllInvoices, getInvoiceById, exportInvoicePDF } from '../../../services/invoiceService';

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // API states
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingInvoiceDetails, setLoadingInvoiceDetails] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState({});

  // Date range for filtering (default to current month)
  const [startDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate] = useState(() => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  });

  // Helper function to calculate days from invoice date
  const getDaysFromInvoice = (dateString) => {
    const invoiceDate = new Date(dateString);
    return Math.floor((new Date() - invoiceDate) / (1000 * 60 * 60 * 24));
  };

  // Helper function to map invoice data (optimized)
  const mapInvoiceData = (invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate).toISOString().split('T')[0];
    const isPaid = invoice.isPaid;
    const daysOld = getDaysFromInvoice(invoiceDate);

    // Determine status
    let status = 'Pending';
    if (isPaid) {
      status = 'Paid';
    } else if (daysOld > 30) {
      status = 'Overdue';
    } else if (invoice.status === 'Draft') {
      status = 'Pending';
    } else {
      status = invoice.status;
    }

    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      date: invoiceDate,
      weekEnding: new Date(invoice.weekEndDate).toISOString().split('T')[0],
      status,
      deliveries:
        invoice.items
          ?.filter((item) => !item.isAdditional)
          .map((item) => ({
            spoNumber: item.delivery?.spoNumber || item.spoNumber || 'N/A',
            date: item.delivery?.deliveryDate
              ? new Date(item.delivery.deliveryDate).toISOString().split('T')[0]
              : '',
            address: item.delivery?.deliveryAddress || item.description || '',
            basePrice: Number(item.unitCost || 0),
            distanceSurcharge: 0,
            vat: Number(item.vatAmount || 0),
            total: Number(item.total || 0),
          })) || [],
      additionalCharges:
        invoice.items
          ?.filter((item) => item.isAdditional)
          .map((item) => ({
            description: item.description,
            amount: Number(item.total || 0),
          })) || [],
      subtotal: Number(invoice.subtotal || 0),
      totalVAT: Number(invoice.vatTotal || 0),
      total: Number(invoice.grandTotal || 0),
      paidDate: invoice.paidAt ? new Date(invoice.paidAt).toISOString().split('T')[0] : null,
    };
  };

  // Fetch invoices from API
  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        startDate,
        endDate,
      };

      // Add isPaid filter based on status
      if (filterStatus === 'paid') {
        params.isPaid = true;
      } else if (filterStatus === 'pending' || filterStatus === 'overdue') {
        params.isPaid = false;
      }

      const response = await getAllInvoices(params);

      if (response.success && response.data) {
        // Map and filter invoices efficiently
        const mappedInvoices = response.data.map(mapInvoiceData);

        // Filter by status if needed
        const filteredData =
          filterStatus === 'all'
            ? mappedInvoices
            : mappedInvoices.filter(
                (inv) => inv.status.toLowerCase() === filterStatus.toLowerCase()
              );

        setInvoices(filteredData);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message || 'Failed to fetch invoices');
      toast.error('Failed to load invoices. Please try again.');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from all invoices (memoized for performance)
  const stats = useMemo(() => {
    return {
      total: invoices.length,
      paid: invoices.filter((i) => i.status === 'Paid').length,
      pending: invoices.filter((i) => i.status === 'Pending').length,
      overdue: invoices.filter((i) => i.status === 'Overdue').length,
      totalAmount: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
      paidAmount: invoices
        .filter((i) => i.status === 'Paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0),
      unpaidAmount: invoices
        .filter((i) => i.status !== 'Paid')
        .reduce((sum, inv) => sum + (inv.total || 0), 0),
    };
  }, [invoices]);

  // Filter invoices (memoized for performance)
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus =
        filterStatus === 'all' || invoice.status.toLowerCase() === filterStatus.toLowerCase();

      // Clean search query by removing "Invoice #", "Invoice#", or "#" prefix
      const cleanedSearch = searchQuery
        .toLowerCase()
        .replace(/^invoice\s*#\s*/i, '')
        .replace(/^#\s*/i, '')
        .trim();

      const matchesSearch =
        searchQuery === '' ||
        invoice.invoiceNumber.toLowerCase().includes(cleanedSearch) ||
        invoice.deliveries.some((d) => d.spoNumber.toLowerCase().includes(cleanedSearch));
      return matchesStatus && matchesSearch;
    });
  }, [invoices, filterStatus, searchQuery]);

  // Pagination logic (memoized for performance)
  const { totalPages, paginatedInvoices } = useMemo(() => {
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
    return { totalPages, paginatedInvoices };
  }, [filteredInvoices, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change with page reset
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    // API will be refetched via useEffect
  };

  // Handle search with page reset
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'Overdue':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return CheckCircle;
      case 'Pending':
        return Clock;
      case 'Overdue':
        return XCircle;
      default:
        return FileText;
    }
  };

  // Handle view invoice
  const handleViewInvoice = async (invoice) => {
    try {
      setLoadingInvoiceDetails(true);
      setShowViewModal(true);
      setSelectedInvoice(invoice); // Set initial data

      // Fetch full invoice details from API
      const response = await getInvoiceById(invoice.id);

      if (response.success && response.data) {
        // Map API response to component structure
        const fullInvoice = {
          id: response.data.id,
          invoiceNumber: response.data.invoiceNumber,
          date: new Date(response.data.invoiceDate).toISOString().split('T')[0],
          weekEnding: new Date(response.data.weekEndDate).toISOString().split('T')[0],
          status: response.data.isPaid
            ? 'Paid'
            : response.data.status === 'Draft'
              ? 'Pending'
              : response.data.status,
          deliveries:
            response.data.items?.map((item) => ({
              spoNumber: item.delivery?.spoNumber || item.spoNumber || 'N/A',
              date: item.delivery?.deliveryDate
                ? new Date(item.delivery.deliveryDate).toISOString().split('T')[0]
                : '',
              address: item.delivery?.deliveryAddress || item.description || '',
              basePrice: parseFloat(item.unitCost || 0),
              distanceSurcharge: 0,
              vat: parseFloat(item.vatAmount || 0),
              total: parseFloat(item.total || 0),
            })) || [],
          additionalCharges:
            response.data.items
              ?.filter((item) => item.isAdditional)
              .map((item) => ({
                description: item.description,
                amount: parseFloat(item.total || 0),
              })) || [],
          subtotal: parseFloat(response.data.subtotal || 0),
          totalVAT: parseFloat(response.data.vatTotal || 0),
          total: parseFloat(response.data.grandTotal || 0),
          paidDate: response.data.paidAt
            ? new Date(response.data.paidAt).toISOString().split('T')[0]
            : null,
        };

        setSelectedInvoice(fullInvoice);
      }
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      toast.error('Failed to load invoice details. Showing cached data.');
      // Keep the initial invoice data if API fails
    } finally {
      setLoadingInvoiceDetails(false);
    }
  };

  // Handle download Excel/PDF
  const handleDownloadExcel = async (invoice) => {
    try {
      // Set loading state for this specific invoice
      setDownloadingPDF((prev) => ({ ...prev, [invoice.id]: true }));

      toast.info('Preparing invoice PDF...');

      // Call API to export PDF
      const response = await exportInvoicePDF(invoice.id);

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoice.invoiceNumber}_${invoice.date}.pdf`);

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Invoice ${invoice.invoiceNumber} downloaded successfully!`);
    } catch (err) {
      console.error('Error downloading invoice PDF:', err);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      // Remove loading state
      setDownloadingPDF((prev) => ({ ...prev, [invoice.id]: false }));
    }
  };

  // Handle email invoice
  const handleEmailInvoice = (invoice) => {
    toast.success(`Invoice ${invoice.invoiceNumber} sent to your email`);
    // Email logic would go here
  };

  // Handle print invoice
  const handlePrintInvoice = (invoice) => {
    toast.info(`Preparing to print invoice ${invoice.invoiceNumber}...`);
    // Print logic would go here
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Invoices</h1>
          <p className="mt-2 text-gray-600">View and manage your delivery invoices</p>
        </div>
      </div>

      {/* Content Container with minimum height to prevent layout shift */}
      <div className="min-h-150">
        {/* Loading State */}
        {loading && (
          <Loading
            message="Loading Invoices..."
            submessage="Please wait while we fetch your data"
            size="large"
          />
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800">Error: {error}</p>
            </div>
            <button
              onClick={fetchInvoices}
              className="mt-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 transition-all duration-300 md:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    £{stats.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">
                    £{stats.paidAmount.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unpaid</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">
                    £{stats.unpaidAmount.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-3">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        {!loading && !error && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="flex-1 md:max-w-md">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by invoice number or SPO..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    filterStatus === 'all'
                      ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('paid')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    filterStatus === 'paid'
                      ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Paid
                </button>
                <button
                  onClick={() => handleFilterChange('pending')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoice List */}
        {!loading && !error && (
          <div className="space-y-4 transition-all duration-300">
            {filteredInvoices.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'No invoices match the selected filter'}
                </p>
              </div>
            ) : (
              paginatedInvoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status);
                return (
                  <div
                    key={invoice.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Invoice Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="rounded-lg bg-teal-50 p-3">
                            <FileText className="h-6 w-6 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold text-gray-900">
                                Invoice #{invoice.invoiceNumber}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                                  invoice.status
                                )}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                {invoice.status}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Date: {invoice.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>{invoice.deliveries.length} deliveries</span>
                              </div>
                              {invoice.paidDate && (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-green-600">Paid: {invoice.paidDate}</span>
                                </div>
                              )}
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-600">
                                Week ending:{' '}
                                <span className="font-medium">{invoice.weekEnding}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="flex flex-col items-end gap-3 lg:ml-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-2xl font-bold text-gray-900">
                            £{invoice.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            inc. VAT £{invoice.totalVAT.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="flex items-center gap-1 rounded-md border border-teal-300 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadExcel(invoice)}
                            disabled={downloadingPDF[invoice.id]}
                            className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white shadow-md transition-all ${
                              downloadingPDF[invoice.id]
                                ? 'cursor-not-allowed bg-gray-400'
                                : 'bg-linear-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600'
                            }`}
                          >
                            {downloadingPDF[invoice.id] ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4" />
                                Excel
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredInvoices.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredInvoices.length}
          />
        )}

        {/* View Invoice Modal */}
        {showViewModal && selectedInvoice && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      Invoice #{selectedInvoice.invoiceNumber}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        selectedInvoice.status
                      )}`}
                    >
                      {React.createElement(getStatusIcon(selectedInvoice.status), {
                        className: 'h-3 w-3',
                      })}
                      {selectedInvoice.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 transition-colors hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] overflow-y-auto p-6">
                {/* Loading State for Invoice Details */}
                {loadingInvoiceDetails ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative mb-6">
                      {/* Spinning ring */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-400"></div>
                      </div>
                      {/* Logo */}
                      <div className="relative flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center">
                          <img
                            src="/images/logo.png"
                            alt="M19 Logistics"
                            className="h-12 w-12 animate-pulse object-contain drop-shadow-lg"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-base font-semibold text-gray-700">
                      Loading invoice details...
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Please wait</p>
                  </div>
                ) : (
                  <>
                    {/* Invoice Header */}
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-gray-900">M19 Logistics Limited</h4>
                        <p className="text-sm text-gray-600">84 Acton Hall Walks</p>
                        <p className="text-sm text-gray-600">Wrexham, LL12 7YJ</p>
                        <p className="text-sm text-gray-600">
                          Tel: 07971415430 / WhatsApp 07577574676
                        </p>
                        <p className="text-sm text-gray-600">VAT Number: 447 5918 54</p>
                      </div>
                      <div className="border-t border-gray-300 pt-4">
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <p className="text-sm text-gray-600">Invoice Date</p>
                            <p className="font-semibold text-gray-900">{selectedInvoice.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Week Ending</p>
                            <p className="font-semibold text-gray-900">
                              {selectedInvoice.weekEnding}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Line Items */}
                    <div className="mb-6">
                      <h4 className="mb-3 font-bold text-gray-900">Delivery Items</h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full">
                          <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                SPO Number
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Address
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                Unit Price
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                VAT
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {selectedInvoice.deliveries.map((delivery, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-900">
                                  {delivery.spoNumber}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-600">
                                  {delivery.date}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {delivery.address}
                                </td>
                                <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900">
                                  £{delivery.basePrice.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-gray-900">
                                  £{delivery.vat.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-900">
                                  £{delivery.total.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Additional Charges */}
                    {selectedInvoice.additionalCharges.length > 0 && (
                      <div className="mb-6">
                        <h4 className="mb-3 font-bold text-gray-900">Additional Charges</h4>
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                          <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                  Description
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {selectedInvoice.additionalCharges.map((charge, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {charge.description}
                                  </td>
                                  <td className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-gray-900">
                                    £{charge.amount.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Invoice Summary */}
                    <div className="rounded-lg border-2 border-teal-200 bg-teal-50 p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            £{selectedInvoice.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">VAT (20%):</span>
                          <span className="font-semibold text-gray-900">
                            £{selectedInvoice.totalVAT.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t-2 border-teal-300 pt-2">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-teal-600">
                              £{selectedInvoice.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={() => handleEmailInvoice(selectedInvoice)}
                  className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </button>
                <button
                  onClick={() => handleDownloadExcel(selectedInvoice)}
                  disabled={downloadingPDF[selectedInvoice.id]}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-white shadow-md transition-all ${
                    downloadingPDF[selectedInvoice.id]
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-linear-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600'
                  }`}
                >
                  {downloadingPDF[selectedInvoice.id] ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Download Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
