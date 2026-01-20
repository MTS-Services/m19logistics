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
import { jsPDF } from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvoicesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    invoiceDate: '',
    dueDate: '',
    status: 'draft',
  });

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
    setSelectedInvoice(invoice);
    setShowPDFModal(true);
  };

  const handleEmailInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEmailModal(true);
  };

  const handlePrintInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPrintModal(true);
  };

  const confirmDownloadPDF = () => {
    if (!selectedInvoice) return;

    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Header - Company Info
    doc.setFontSize(20);
    doc.setTextColor(13, 148, 136);
    doc.text('M19 LOGISTICS', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text('Invoice', 20, 28);

    // Invoice Details - Right Side
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #${selectedInvoice.invoiceNumber}`, pageWidth - 20, 20, { align: 'right' });

    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text(
      `Date: ${new Date(selectedInvoice.invoiceDate).toLocaleDateString('en-GB')}`,
      pageWidth - 20,
      27,
      { align: 'right' }
    );
    doc.text(
      `Due: ${new Date(selectedInvoice.dueDate).toLocaleDateString('en-GB')}`,
      pageWidth - 20,
      33,
      { align: 'right' }
    );

    // Status Badge
    const statusColors = {
      paid: [16, 185, 129],
      sent: [59, 130, 246],
      draft: [107, 114, 128],
      overdue: [239, 68, 68],
    };
    const color = statusColors[selectedInvoice.status] || [107, 114, 128];
    doc.setFontSize(10);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(selectedInvoice.status.toUpperCase(), pageWidth - 20, 40, { align: 'right' });

    // Line separator
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 48, pageWidth - 20, 48);

    // Bill To Section
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Bill To:', 20, 58);

    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(selectedInvoice.customer, 20, 66);
    doc.text(`Username: ${selectedInvoice.customerUsername}`, 20, 72);
    doc.text(selectedInvoice.customerEmail, 20, 78);

    // Deliveries Table Header
    let yPosition = 95;
    doc.setFillColor(13, 148, 136);
    doc.rect(20, yPosition, pageWidth - 40, 10, 'F');

    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('SPO', 25, yPosition + 7);
    doc.text('Date', 60, yPosition + 7);
    doc.text('Address', 90, yPosition + 7);
    doc.text('Amount', pageWidth - 25, yPosition + 7, { align: 'right' });

    yPosition += 10;

    // Deliveries Table Rows
    doc.setTextColor(0, 0, 0);
    selectedInvoice.deliveries.forEach((delivery, index) => {
      const rowColor = index % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
      doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
      doc.rect(20, yPosition, pageWidth - 40, 12, 'F');

      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(delivery.spo, 25, yPosition + 8);
      doc.text(new Date(delivery.date).toLocaleDateString('en-GB'), 60, yPosition + 8);

      const addressLines = doc.splitTextToSize(delivery.address, 80);
      doc.text(addressLines[0], 90, yPosition + 8);

      doc.text(`£${delivery.basePrice.toFixed(2)}`, pageWidth - 25, yPosition + 8, {
        align: 'right',
      });

      yPosition += 12;

      // Distance Surcharge
      if (delivery.distanceSurcharge > 0) {
        doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
        doc.rect(20, yPosition, pageWidth - 40, 8, 'F');

        doc.setFontSize(7);
        doc.setTextColor(102, 102, 102);
        doc.text('Distance Surcharge', 90, yPosition + 5);
        doc.text(`£${delivery.distanceSurcharge.toFixed(2)}`, pageWidth - 25, yPosition + 5, {
          align: 'right',
        });
        yPosition += 8;
      }

      // Extra Charges
      delivery.extraCharges?.forEach((charge) => {
        doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
        doc.rect(20, yPosition, pageWidth - 40, 8, 'F');

        doc.setFontSize(7);
        doc.setTextColor(102, 102, 102);
        doc.text(charge.description, 90, yPosition + 5);
        doc.text(`£${charge.amount.toFixed(2)}`, pageWidth - 25, yPosition + 5, { align: 'right' });
        yPosition += 8;
      });
    });

    // Totals Section
    yPosition += 10;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(130, yPosition, pageWidth - 20, yPosition);

    yPosition += 8;
    doc.setFontSize(9);
    doc.setTextColor(102, 102, 102);
    doc.text('Subtotal:', 130, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(`£${selectedInvoice.subtotal.toFixed(2)}`, pageWidth - 25, yPosition, {
      align: 'right',
    });

    yPosition += 8;
    doc.setTextColor(102, 102, 102);
    doc.text('VAT (20%):', 130, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(`£${selectedInvoice.vat.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });

    yPosition += 8;
    doc.setDrawColor(229, 231, 235);
    doc.line(130, yPosition, pageWidth - 20, yPosition);

    yPosition += 8;
    doc.setFontSize(11);
    doc.setTextColor(13, 148, 136);
    doc.text('Total:', 130, yPosition);
    doc.setFontSize(12);
    doc.text(`£${selectedInvoice.total.toFixed(2)}`, pageWidth - 25, yPosition, { align: 'right' });

    // Payment Info
    if (selectedInvoice.paidDate) {
      yPosition += 12;
      doc.setFontSize(9);
      doc.setTextColor(16, 185, 129);
      doc.text(
        `Paid on ${new Date(selectedInvoice.paidDate).toLocaleDateString('en-GB')}`,
        130,
        yPosition
      );
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(153, 153, 153);
    doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('M19 Logistics - Professional Delivery Services', pageWidth / 2, pageHeight - 15, {
      align: 'center',
    });

    // Download the PDF
    doc.save(`Invoice_${selectedInvoice.invoiceNumber}.pdf`);

    setShowPDFModal(false);
    setSelectedInvoice(null);
  };

  const confirmEmailInvoice = () => {
    console.log('Sending email for invoice:', selectedInvoice.invoiceNumber);
    // Add actual email sending logic here
    alert(`Invoice email sent to ${selectedInvoice.customerEmail}`);
    setShowEmailModal(false);
    setSelectedInvoice(null);
  };

  const confirmPrintInvoice = () => {
    console.log('Printing invoice:', selectedInvoice.invoiceNumber);
    // Add actual print logic here
    window.print();
    setShowPrintModal(false);
    setSelectedInvoice(null);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
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
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Invoice Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Generate, manage, and track customer invoices
              </p>
            </div>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6"
            >
              <Plus className="h-5 w-5" />
              <span>Generate Invoice</span>
            </button>
          </div>
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

        {/* PDF Download Modal */}
        {showPDFModal && selectedInvoice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Download Invoice PDF</h2>
                <button
                  onClick={() => setShowPDFModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                  Download PDF
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Download invoice <strong>{selectedInvoice.invoiceNumber}</strong> as PDF?
                </p>

                {/* Invoice Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-900">{selectedInvoice.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedInvoice.invoiceDate).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-teal-600">
                        £{selectedInvoice.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowPDFModal(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDownloadPDF}
                    className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Invoice Modal */}
        {showEmailModal && selectedInvoice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Email Invoice</h2>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                  Send Invoice via Email
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Send invoice <strong>{selectedInvoice.invoiceNumber}</strong> to customer?
                </p>

                {/* Invoice Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{selectedInvoice.customer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {selectedInvoice.customerEmail}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-teal-600">
                        £{selectedInvoice.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                  <p className="text-xs text-blue-800">
                    📧 The invoice will be sent as a PDF attachment to the customer's registered
                    email address.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmEmailInvoice}
                    className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Print Invoice Modal */}
        {showPrintModal && selectedInvoice && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Print Invoice</h2>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                  Print Invoice
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                  Print invoice <strong>{selectedInvoice.invoiceNumber}</strong>?
                </p>

                {/* Invoice Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice #:</span>
                      <span className="font-medium text-gray-900">
                        {selectedInvoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium text-gray-900">{selectedInvoice.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deliveries:</span>
                      <span className="font-medium text-gray-900">
                        {selectedInvoice.deliveries.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium text-teal-600">
                        £{selectedInvoice.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-600">
                    🖨️ This will open the browser's print dialog. Make sure your printer is ready.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPrintInvoice}
                    className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Invoice Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-900">Generate New Invoice</h2>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Customer Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newInvoice.customer}
                        onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="">Select a customer</option>
                        <option value="Topps Rhyl">Topps Rhyl (T211)</option>
                        <option value="Topps Chester">Topps Chester (T022)</option>
                        <option value="Topps Newcastle">Topps Newcastle (T167)</option>
                        <option value="Topps Wrexham">Topps Wrexham (T217)</option>
                      </select>
                    </div>

                    {/* Invoice Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Invoice Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newInvoice.invoiceDate}
                        onChange={(e) =>
                          setNewInvoice({ ...newInvoice, invoiceDate: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newInvoice.status}
                        onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>

                    {/* Info Note */}
                    <div className="rounded-lg bg-teal-50 p-4">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-teal-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-teal-900">Invoice Generation</p>
                          <p className="mt-1 text-xs text-teal-700">
                            After creating the invoice, you'll be able to add deliveries and
                            calculate totals in the edit screen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end space-x-3 border-t bg-gray-50 px-6 py-4">
                  <button
                    onClick={() => {
                      setShowGenerateModal(false);
                      setNewInvoice({
                        customer: '',
                        invoiceDate: '',
                        dueDate: '',
                        status: 'draft',
                      });
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newInvoice.customer && newInvoice.invoiceDate && newInvoice.dueDate) {
                        // Get customer details based on selection
                        const customerMap = {
                          'Topps Rhyl': { username: 'T211', email: 'topps211@toppstiles.co.uk' },
                          'Topps Chester': { username: 'T022', email: 'topps022@toppstiles.co.uk' },
                          'Topps Newcastle': {
                            username: 'T167',
                            email: 'topps167@toppstiles.co.uk',
                          },
                          'Topps Wrexham': { username: 'T217', email: 'topps217@toppstiles.co.uk' },
                        };

                        const customerInfo = customerMap[newInvoice.customer];

                        // Generate new invoice number
                        const maxId = Math.max(...invoices.map((inv) => inv.id));
                        const newInvoiceNumber = `T0${330 + maxId}`;

                        // Create new invoice object
                        const createdInvoice = {
                          id: maxId + 1,
                          invoiceNumber: newInvoiceNumber,
                          customer: newInvoice.customer,
                          customerUsername: customerInfo.username,
                          customerEmail: customerInfo.email,
                          invoiceDate: newInvoice.invoiceDate,
                          dueDate: newInvoice.dueDate,
                          status: newInvoice.status,
                          deliveries: [],
                          subtotal: 0,
                          vat: 0,
                          total: 0,
                          paidDate: newInvoice.status === 'paid' ? newInvoice.invoiceDate : null,
                        };

                        // Add to invoices list
                        setInvoices([...invoices, createdInvoice]);

                        // Close modal and reset form
                        setShowGenerateModal(false);
                        setNewInvoice({
                          customer: '',
                          invoiceDate: '',
                          dueDate: '',
                          status: 'draft',
                        });
                      } else {
                        toast.error('Please fill in all required fields');
                      }
                    }}
                    className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Generate Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default InvoicesManagement;
