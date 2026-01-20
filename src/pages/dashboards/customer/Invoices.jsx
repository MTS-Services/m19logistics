import React, { useState } from 'react';
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

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sample invoice data
  const invoices = [
    {
      id: 1,
      invoiceNumber: 'T0326',
      date: '2026-01-12',
      weekEnding: '2026-01-12',
      status: 'Paid',
      deliveries: [
        {
          spoNumber: 'SPO013349',
          date: '2026-01-10',
          address: '4 Bumpers Lane, Chester, CH1 4LY',
          basePrice: 37.5,
          distanceSurcharge: 0,
          vat: 7.5,
          total: 45.0,
        },
        {
          spoNumber: 'SPO013348',
          date: '2026-01-11',
          address: 'Unit 4, Lyme Court, Newcastle, ST5 3TF',
          basePrice: 75.0,
          distanceSurcharge: 0,
          vat: 15.0,
          total: 90.0,
        },
      ],
      additionalCharges: [],
      subtotal: 112.5,
      totalVAT: 22.5,
      total: 135.0,
      paidDate: '2026-01-15',
    },
    {
      id: 2,
      invoiceNumber: 'T0325',
      date: '2026-01-05',
      weekEnding: '2026-01-05',
      status: 'Paid',
      deliveries: [
        {
          spoNumber: 'SPO013347',
          date: '2026-01-04',
          address: '152 Vale Road, Rhyl, LL18 2PD',
          basePrice: 37.5,
          distanceSurcharge: 0,
          vat: 7.5,
          total: 45.0,
        },
      ],
      additionalCharges: [
        {
          description: 'Toll Charge - M6 Toll',
          amount: 10.0,
        },
      ],
      subtotal: 47.5,
      totalVAT: 9.5,
      total: 57.0,
      paidDate: '2026-01-08',
    },
    {
      id: 3,
      invoiceNumber: 'T0324',
      date: '2025-12-29',
      weekEnding: '2025-12-29',
      status: 'Pending',
      deliveries: [
        {
          spoNumber: 'SPO013346',
          date: '2025-12-27',
          address: 'Wadebrook Retail Park, Northwich, CW9 5NN',
          basePrice: 37.5,
          distanceSurcharge: 0,
          vat: 7.5,
          total: 45.0,
        },
        {
          spoNumber: 'SPO013345',
          date: '2025-12-28',
          address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
          basePrice: 75.0,
          distanceSurcharge: 0,
          vat: 15.0,
          total: 90.0,
        },
      ],
      additionalCharges: [],
      subtotal: 112.5,
      totalVAT: 22.5,
      total: 135.0,
      paidDate: null,
    },
    {
      id: 4,
      invoiceNumber: 'T0323',
      date: '2025-12-22',
      weekEnding: '2025-12-22',
      status: 'Overdue',
      deliveries: [
        {
          spoNumber: 'SPO013344',
          date: '2025-12-20',
          address: '4 Bumpers Lane, Chester, CH1 4LY',
          basePrice: 37.5,
          distanceSurcharge: 0,
          vat: 7.5,
          total: 45.0,
        },
      ],
      additionalCharges: [],
      subtotal: 37.5,
      totalVAT: 7.5,
      total: 45.0,
      paidDate: null,
    },
    {
      id: 5,
      invoiceNumber: 'T0323',
      date: '2025-12-22',
      weekEnding: '2025-12-22',
      status: 'Overdue',
      deliveries: [
        {
          spoNumber: 'SPO013344',
          date: '2025-12-20',
          address: '4 Bumpers Lane, Chester, CH1 4LY',
          basePrice: 37.5,
          distanceSurcharge: 0,
          vat: 7.5,
          total: 45.0,
        },
      ],
      additionalCharges: [],
      subtotal: 37.5,
      totalVAT: 7.5,
      total: 45.0,
      paidDate: null,
    },
    {
      id: 6,
      invoiceNumber: 'T0399',
      date: '2025-12-22',
      weekEnding: '2025-12-22',
      status: 'Overdue',
      deliveries: [
        {
          spoNumber: 'SPO013344',
          date: '2025-12-20',
          address: '4 Bumpers Lane, Chester, CH1 4LY',
          basePrice: 37.5,
          distanceSurcharge: 0,
          vat: 7.5,
          total: 45.0,
        },
      ],
      additionalCharges: [],
      subtotal: 37.5,
      totalVAT: 7.5,
      total: 45.0,
      paidDate: null,
    },
  ];

  // Calculate statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === 'Paid').length,
    pending: invoices.filter((i) => i.status === 'Pending').length,
    overdue: invoices.filter((i) => i.status === 'Overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    paidAmount: invoices
      .filter((i) => i.status === 'Paid')
      .reduce((sum, inv) => sum + inv.total, 0),
    unpaidAmount: invoices
      .filter((i) => i.status !== 'Paid')
      .reduce((sum, inv) => sum + inv.total, 0),
  };

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
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

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change with page reset
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
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
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  // Handle download Excel
  const handleDownloadExcel = (invoice) => {
    // Prepare invoice data for Excel
    const invoiceData = [
      ['M19 Logistics Limited'],
      ['84 Acton Hall Walks, Wrexham, LL12 7YJ'],
      ['Tel: 07971415430 / 01978439739'],
      ['Email: m19logistics@gmail.com'],
      ['VAT Number: 447 5918 54'],
      [''],
      ['Invoice Number', invoice.invoiceNumber],
      ['Date', invoice.date],
      ['Week Ending', invoice.weekEnding],
      ['Status', invoice.status],
      ...(invoice.paidDate ? [['Paid Date', invoice.paidDate]] : []),
      [''],
      ['Delivery Items'],
      ['SPO Number', 'Date', 'Address', 'Base Price', 'Distance Surcharge', 'VAT', 'Total'],
      ...invoice.deliveries.map((d) => [
        d.spoNumber,
        d.date,
        d.address,
        `£${d.basePrice.toFixed(2)}`,
        `£${d.distanceSurcharge.toFixed(2)}`,
        `£${d.vat.toFixed(2)}`,
        `£${d.total.toFixed(2)}`,
      ]),
      [''],
    ];

    if (invoice.additionalCharges.length > 0) {
      invoiceData.push(['Additional Charges']);
      invoiceData.push(['Description', 'Amount']);
      invoice.additionalCharges.forEach((charge) => {
        invoiceData.push([charge.description, `£${charge.amount.toFixed(2)}`]);
      });
      invoiceData.push(['']);
    }

    invoiceData.push(
      ['Subtotal', `£${invoice.subtotal.toFixed(2)}`],
      ['VAT (20%)', `£${invoice.totalVAT.toFixed(2)}`],
      ['Total', `£${invoice.total.toFixed(2)}`]
    );

    // Convert to CSV
    const csvContent = invoiceData
      .map((row) =>
        row
          .map((cell) => {
            const value = cell || '';
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(',')
      )
      .join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Invoice_${invoice.invoiceNumber}_${invoice.date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* Statistics Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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

      {/* Filters and Search */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('paid')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'paid'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => handleFilterChange('pending')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('overdue')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                filterStatus === 'overdue'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Overdue
            </button>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
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
                            Week ending: <span className="font-medium">{invoice.weekEnding}</span>
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
                        className="flex items-center gap-1 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-3 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                      >
                        <Download className="h-4 w-4" />
                        Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filteredInvoices.length > 0 && (
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
              {/* Invoice Header */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900">M19 Logistics Limited</h4>
                  <p className="text-sm text-gray-600">84 Acton Hall Walks</p>
                  <p className="text-sm text-gray-600">Wrexham, LL12 7YJ</p>
                  <p className="text-sm text-gray-600">Tel: 07971415430 / 01978439739</p>
                  <p className="text-sm text-gray-600">Email: m19logistics@gmail.com</p>
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
                      <p className="font-semibold text-gray-900">{selectedInvoice.weekEnding}</p>
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
                          <td className="px-4 py-3 text-sm text-gray-600">{delivery.address}</td>
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
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
              >
                <Download className="h-4 w-4" />
                Download Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
