import React from 'react';
import { Building, Calendar, Package, Eye, Edit, Download, Mail, Printer } from 'lucide-react';

const InvoiceCard = ({ invoice, statusConfig, onView, onEdit, onDownload, onEmail, onPrint }) => {
    // Safely access status icon with fallback
    const status = invoice.status || 'draft';
    const StatusIcon = statusConfig[status]?.icon || (() => null);

    // Handle different API response structures
    const invoiceNumber = invoice.invoiceNumber || invoice.invoiceId || invoice.id || 'N/A';

    // Handle customer as object or string
    const customer = typeof invoice.customer === 'object' && invoice.customer !== null
        ? (invoice.customer.fullName || invoice.customer.name || invoice.customer.email || 'N/A')
        : (invoice.customer || invoice.customerName || 'N/A');

    const customerUsername = invoice.customerUsername || invoice.username ||
        (typeof invoice.customer === 'object' ? invoice.customer.email : '');

    const invoiceDate = invoice.invoiceDate || invoice.createdAt || new Date();
    const dueDate = invoice.dueDate || invoice.createdAt || new Date();
    const deliveries = invoice.deliveries || [];
    const total = invoice.total || 0;
    const vat = invoice.vat || invoice.vatAmount || 0;
    const paidDate = invoice.paidDate || null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <div className="flex-1">
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{invoiceNumber}</h3>
                        <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[status]?.color || 'bg-gray-100 text-gray-700'} w-fit`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{statusConfig[status]?.label || status}</span>
                        </span>
                    </div>

                    <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building className="h-4 w-4 shrink-0" />
                            <span className="wrap-break-word">{customer} {customerUsername && `(${customerUsername})`}</span>
                        </div>
                        <div className="flex items-start space-x-2 text-xs sm:text-sm text-gray-500">
                            <Calendar className="h-4 w-4 shrink-0 mt-0.5" />
                            <span>
                                Issued: {new Date(invoiceDate).toLocaleDateString('en-GB')} | Due: {new Date(dueDate).toLocaleDateString('en-GB')}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Package className="h-4 w-4 shrink-0" />
                            <span>{deliveries.length} {deliveries.length === 1 ? 'delivery' : 'deliveries'}</span>
                        </div>
                    </div>
                </div>

                <div className="text-left sm:text-right">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">£{Number(total).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">inc. VAT £{Number(vat).toFixed(2)}</p>
                    {paidDate && (
                        <p className="mt-1 text-xs text-green-600">Paid: {new Date(paidDate).toLocaleDateString('en-GB')}</p>
                    )}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                <button onClick={() => onView(invoice)} className="flex items-center justify-center space-x-1 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 flex-1 sm:flex-initial min-w-20">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                </button>
                <button onClick={() => onEdit(invoice)} className="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 flex-1 sm:flex-initial min-w-20">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                </button>
                <button onClick={() => onDownload(invoice)} className="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 flex-1 sm:flex-initial min-w-20">
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                </button>
                <button onClick={() => onEmail(invoice)} className="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 flex-1 sm:flex-initial min-w-20">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                </button>
                <button onClick={() => onPrint(invoice)} className="flex items-center justify-center space-x-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 flex-1 sm:flex-initial min-w-20">
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                </button>
            </div>
        </div>
    );
};

export default InvoiceCard;
