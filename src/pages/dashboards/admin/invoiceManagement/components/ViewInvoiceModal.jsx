import React from 'react';
import { X, Download, Mail, Building, Calendar, Package } from 'lucide-react';

const ViewInvoiceModal = ({ invoice, onClose, onDownload, onEmail }) => {
    // Handle customer as object or string
    const customerName = typeof invoice.customer === 'object' && invoice.customer !== null
        ? (invoice.customer.fullName || invoice.customer.name || 'N/A')
        : (invoice.customer || 'N/A');

    const customerEmail = typeof invoice.customer === 'object' && invoice.customer !== null
        ? invoice.customer.email
        : (invoice.customerEmail || '');

    // Safely handle deliveries array
    const deliveries = invoice.deliveries || [];
    const subtotal = invoice.subtotal || 0;
    const vat = invoice.vat || 0;
    const total = invoice.total || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Invoice {invoice.invoiceNumber}</h2>
                        <p className="mt-1 text-sm text-gray-600">{customerName}</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-8 border-b border-gray-200 pb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">M19 Logistics Limited</h3>
                                <p className="mt-2 text-sm text-gray-600">84 Acton Hall Walks</p>
                                <p className="text-sm text-gray-600">Wrexham</p>
                                <p className="text-sm text-gray-600">LL12 7YJ</p>
                                <p className="mt-2 text-sm text-gray-600">Tel: 07971415430 / WhatsApp 07577574676</p>
                                <p className="mt-2 text-sm font-medium text-gray-700">VAT Number: 447 5918 54</p>
                            </div>

                            <div className="text-right">
                                <h4 className="text-3xl font-bold text-gray-900">INVOICE</h4>
                                <p className="mt-2 text-sm text-gray-600">Invoice No: {invoice.invoiceNumber}</p>
                                <p className="text-sm text-gray-600">Invoice Date: {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="mb-2 text-sm font-semibold text-gray-900">Invoice To:</h4>
                        <p className="text-sm font-medium text-gray-900">{customerName}</p>
                        <p className="text-sm text-gray-600">{customerEmail}</p>
                    </div>

                    <div className="mb-8 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">Description / Delivery Date / Location</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">Unit Cost</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">VAT</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {deliveries.map((delivery, index) => {
                                    const deliverySubtotal = (delivery.basePrice || 0) + (delivery.distanceSurcharge || 0);
                                    const extraChargesTotal = (delivery.extraCharges || []).reduce((sum, c) => sum + (c.amount || 0), 0);
                                    const lineTotal = deliverySubtotal + extraChargesTotal;
                                    const lineVat = lineTotal * 0.2;

                                    return (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-900">Delivery - SPO: {delivery.spo}</p>
                                                    <p className="text-xs text-gray-600">{new Date(delivery.date).toLocaleDateString('en-GB')}</p>
                                                    <p className="text-xs text-gray-600">{delivery.address}</p>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-900">£{deliverySubtotal.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-900">£{lineVat.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">£{(lineTotal + lineVat).toFixed(2)}</td>
                                            </tr>
                                            {(delivery.extraCharges || []).map((charge, chargeIndex) => (
                                                <tr key={`${index}-charge-${chargeIndex}`} className="bg-gray-50">
                                                    <td className="px-4 py-2 pl-8"><p className="text-xs text-gray-600">+ {charge.description}</p></td>
                                                    <td className="px-4 py-2 text-right text-xs text-gray-600">£{charge.amount.toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-right text-xs text-gray-600">£{(charge.amount * 0.2).toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-right text-xs font-medium text-gray-600">£{(charge.amount * 1.2).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span className="font-medium text-gray-900">£{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">VAT (20%):</span><span className="font-medium text-gray-900">£{vat.toFixed(2)}</span></div>
                            <div className="flex justify-between border-t border-gray-200 pt-2 text-base"><span className="font-semibold text-gray-900">TOTAL:</span><span className="font-bold text-gray-900">£{total.toFixed(2)}</span></div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
                        <button onClick={() => onDownload?.(invoice)} className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                            <Download className="h-4 w-4" />
                            <span>Download PDF</span>
                        </button>
                        <button onClick={() => onEmail?.(invoice)} className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg">
                            <Mail className="h-4 w-4" />
                            <span>Email Invoice</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInvoiceModal;
