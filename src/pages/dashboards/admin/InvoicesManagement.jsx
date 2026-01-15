import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Save,
  Trash2,
  Building,
  Package,
  TrendingUp,
  Printer,
} from 'lucide-react';

const InvoicesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Invoice data based on requirements
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'T0326',
      customer: 'Topps Rhyl',
      customerUsername: 'T211',
      customerEmail: 'topps211@toppstiles.co.uk',
      invoiceDate: '2026-01-08',
      dueDate: '2026-02-08',
      status: 'paid',
      deliveries: [
        {
          spo: 'SPO013349',
          date: '2026-01-05',
          address: '152 Vale Road, Rhyl',
          basePrice: 37.5,
          distanceSurcharge: 0,
          extraCharges: [],
        },
        {
          spo: 'SPO013350',
          date: '2026-01-06',
          address: 'Unit 2, Industrial Estate, Rhyl',
          basePrice: 37.5,
          distanceSurcharge: 0,
          extraCharges: [],
        },
      ],
      subtotal: 75.0,
      vat: 15.0,
      total: 90.0,
      paidDate: '2026-01-25',
    },
    {
      id: 2,
      invoiceNumber: 'T0327',
      customer: 'Topps Chester',
      customerUsername: 'T022',
      customerEmail: 'topps022@toppstiles.co.uk',
      invoiceDate: '2026-01-08',
      dueDate: '2026-02-08',
      status: 'sent',
      deliveries: [
        {
          spo: 'SPO013351',
          date: '2026-01-04',
          address: '4 Bumpers Lane, Sealand Ind Est, Chester',
          basePrice: 37.5,
          distanceSurcharge: 18.75,
          extraCharges: [{ description: 'M6 Toll', amount: 10.0 }],
        },
      ],
      subtotal: 66.25,
      vat: 13.25,
      total: 79.5,
      paidDate: null,
    },
    {
      id: 3,
      invoiceNumber: 'T0328',
      customer: 'Topps Newcastle',
      customerUsername: 'T167',
      customerEmail: 'topps167@toppstiles.co.uk',
      invoiceDate: '2026-01-15',
      dueDate: '2026-02-15',
      status: 'draft',
      deliveries: [
        {
          spo: 'SPO013352',
          date: '2026-01-12',
          address: 'Unit 4, Lyme Court, ST5 3TF',
          basePrice: 41.67,
          distanceSurcharge: 0,
          extraCharges: [],
        },
        {
          spo: 'SPO013353',
          date: '2026-01-13',
          address: 'Unit 4, Lyme Court, ST5 3TF',
          basePrice: 41.67,
          distanceSurcharge: 0,
          extraCharges: [{ description: 'Extra Run - Weekend', amount: 20.0 }],
        },
      ],
      subtotal: 103.34,
      vat: 20.67,
      total: 124.01,
      paidDate: null,
    },
    {
      id: 4,
      invoiceNumber: 'T0329',
      customer: 'Topps Wrexham',
      customerUsername: 'T217',
      customerEmail: 'topps217@toppstiles.co.uk',
      invoiceDate: '2026-01-08',
      dueDate: '2026-02-08',
      status: 'overdue',
      deliveries: [
        {
          spo: 'SPO013354',
          date: '2025-12-30',
          address: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham',
          basePrice: 37.5,
          distanceSurcharge: 0,
          extraCharges: [],
        },
      ],
      subtotal: 37.5,
      vat: 7.5,
      total: 45.0,
      paidDate: null,
    },
  ]);

  const customers = [
    { value: 'all', label: 'All Customers' },
    { value: 'T022', label: 'Topps Chester' },
    { value: 'T167', label: 'Topps Newcastle' },
    { value: 'T211', label: 'Topps Rhyl' },
    { value: 'T217', label: 'Topps Wrexham' },
    { value: 'T226', label: 'Topps Nantwich' },
    { value: 'T143', label: 'Topps Northwich' },
  ];

  const statusConfig = {
    draft: {
      icon: Edit,
      color: 'bg-gray-100 text-gray-700',
      label: 'Draft',
      dotColor: 'bg-gray-500',
    },
    sent: {
      icon: Mail,
      color: 'bg-blue-100 text-blue-700',
      label: 'Sent',
      dotColor: 'bg-blue-500',
    },
    paid: {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700',
      label: 'Paid',
      dotColor: 'bg-green-500',
    },
    overdue: {
      icon: AlertCircle,
      color: 'bg-red-100 text-red-700',
      label: 'Overdue',
      dotColor: 'bg-red-500',
    },
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerUsername.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || invoice.customerUsername === filterCustomer;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleDownloadInvoice = (invoice) => {
    alert(`Downloading invoice ${invoice.invoiceNumber} as PDF...`);
  };

  const handleEmailInvoice = (invoice) => {
    if (window.confirm(`Send invoice ${invoice.invoiceNumber} to ${invoice.customerEmail}?`)) {
      alert('Invoice email sent!');
    }
  };

  const handlePrintInvoice = (invoice) => {
    alert(`Printing invoice ${invoice.invoiceNumber}...`);
  };

  const calculateStats = () => {
    const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const outstanding = invoices
      .filter((inv) => inv.status !== 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const overdue = invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);

    return { total, paid, outstanding, overdue };
  };

  const stats = calculateStats();

  const InvoiceCard = ({ invoice }) => {
    const StatusIcon = statusConfig[invoice.status].icon;

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        {/* Invoice Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
              <span
                className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[invoice.status].color}`}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{statusConfig[invoice.status].label}</span>
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building className="h-4 w-4" />
                <span>
                  {invoice.customer} ({invoice.customerUsername})
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  Issued: {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')} | Due:{' '}
                  {new Date(invoice.dueDate).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Package className="h-4 w-4" />
                <span>
                  {invoice.deliveries.length}{' '}
                  {invoice.deliveries.length === 1 ? 'delivery' : 'deliveries'}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Amount */}
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">£{invoice.total.toFixed(2)}</p>
            <p className="text-xs text-gray-500">inc. VAT £{invoice.vat.toFixed(2)}</p>
            {invoice.paidDate && (
              <p className="mt-1 text-xs text-green-600">
                Paid: {new Date(invoice.paidDate).toLocaleDateString('en-GB')}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center space-x-2 border-t border-gray-100 pt-4">
          <button
            onClick={() => handleViewInvoice(invoice)}
            className="flex items-center space-x-1 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </button>
          <button
            onClick={() => handleEditInvoice(invoice)}
            className="flex items-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDownloadInvoice(invoice)}
            className="flex items-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleEmailInvoice(invoice)}
            className="flex items-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </button>
          <button
            onClick={() => handlePrintInvoice(invoice)}
            className="flex items-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
        </div>
      </div>
    );
  };

  const ViewInvoiceModal = ({ invoice, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Invoice {invoice.invoiceNumber}</h2>
            <p className="mt-1 text-sm text-gray-600">{invoice.customer}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-6">
          {/* Company Header */}
          <div className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">M19 Logistics Limited</h3>
                <p className="mt-2 text-sm text-gray-600">84 Acton Hall Walks</p>
                <p className="text-sm text-gray-600">Wrexham</p>
                <p className="text-sm text-gray-600">LL12 7YJ</p>
                <p className="mt-2 text-sm text-gray-600">Tel: 07971415430 / 01978439739</p>
                <p className="text-sm text-gray-600">Email: m19logistics@gmail.com</p>
                <p className="mt-2 text-sm font-medium text-gray-700">VAT Number: 447 5918 54</p>
              </div>

              <div className="text-right">
                <h4 className="text-3xl font-bold text-gray-900">INVOICE</h4>
                <p className="mt-2 text-sm text-gray-600">Invoice No: {invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600">
                  Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice To */}
          <div className="mb-8">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">Invoice To:</h4>
            <p className="text-sm font-medium text-gray-900">{invoice.customer}</p>
            <p className="text-sm text-gray-600">{invoice.customerEmail}</p>
          </div>

          {/* Deliveries Table */}
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
                {invoice.deliveries.map((delivery, index) => {
                  const deliverySubtotal = delivery.basePrice + delivery.distanceSurcharge;
                  const extraChargesTotal = delivery.extraCharges.reduce(
                    (sum, charge) => sum + charge.amount,
                    0
                  );
                  const lineTotal = deliverySubtotal + extraChargesTotal;
                  const lineVat = lineTotal * 0.2;

                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            Delivery - SPO: {delivery.spo}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(delivery.date).toLocaleDateString('en-GB')}
                          </p>
                          <p className="text-xs text-gray-600">{delivery.address}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          £{deliverySubtotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          £{lineVat.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          £{(lineTotal + lineVat).toFixed(2)}
                        </td>
                      </tr>
                      {delivery.extraCharges.map((charge, chargeIndex) => (
                        <tr key={`${index}-charge-${chargeIndex}`} className="bg-gray-50">
                          <td className="px-4 py-2 pl-8">
                            <p className="text-xs text-gray-600">+ {charge.description}</p>
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-gray-600">
                            £{charge.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right text-xs text-gray-600">
                            £{(charge.amount * 0.2).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right text-xs font-medium text-gray-600">
                            £{(charge.amount * 1.2).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">£{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (20%):</span>
                <span className="font-medium text-gray-900">£{invoice.vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                <span className="font-semibold text-gray-900">TOTAL:</span>
                <span className="font-bold text-gray-900">£{invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-900">
              Payment Terms: 30 Days (End of Month)
            </p>
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium">Bank Details:</p>
              <p>Bank Name: NatWest Bank</p>
              <p>Account Holder: M19 Logistics Limited</p>
              <p>Sort Code: 01-10-01</p>
              <p>Account Number: 72696370</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              onClick={() => handleDownloadInvoice(invoice)}
              className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => handleEmailInvoice(invoice)}
              className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              <Mail className="h-4 w-4" />
              <span>Email Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const EditInvoiceModal = ({ invoice, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Invoice {invoice.invoiceNumber}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form className="space-y-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input
                  type="text"
                  defaultValue={invoice.invoiceNumber}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <select
                  defaultValue={invoice.customerUsername}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  {customers
                    .filter((c) => c.value !== 'all')
                    .map((customer) => (
                      <option key={customer.value} value={customer.value}>
                        {customer.label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                <input
                  type="date"
                  defaultValue={invoice.invoiceDate}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  defaultValue={invoice.dueDate}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  defaultValue={invoice.status}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Deliveries Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Delivery Entries</h3>
                <button
                  type="button"
                  className="inline-flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Delivery</span>
                </button>
              </div>

              <div className="space-y-3">
                {invoice.deliveries.map((delivery, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          SPO Number
                        </label>
                        <input
                          type="text"
                          defaultValue={delivery.spo}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Date</label>
                        <input
                          type="date"
                          defaultValue={delivery.date}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          defaultValue={delivery.address}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Base Price (£)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={delivery.basePrice}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Distance Surcharge (£)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={delivery.distanceSurcharge}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove Delivery</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Generate, manage, and track customer invoices
          </p>
        </div>
        <button className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
          <Plus className="h-5 w-5" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">£{stats.total.toFixed(2)}</p>
            </div>
            <DollarSign className="h-10 w-10 text-teal-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-teal-600">£{stats.paid.toFixed(2)}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-teal-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-teal-600">£{stats.outstanding.toFixed(2)}</p>
            </div>
            <Clock className="h-10 w-10 text-teal-600" />
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">£{stats.overdue.toFixed(2)}</p>
            </div>
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Search */}
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices by number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          >
            {customers.map((customer) => (
              <option key={customer.value} value={customer.value}>
                {customer.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => <InvoiceCard key={invoice.id} invoice={invoice} />)
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
            <p className="mt-2 text-sm text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showViewModal && selectedInvoice && (
        <ViewInvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
      {showEditModal && selectedInvoice && (
        <EditInvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoicesManagement;
