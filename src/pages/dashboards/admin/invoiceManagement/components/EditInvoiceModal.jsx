import React from 'react';
import { X, Plus, Save, Trash2 } from 'lucide-react';

const EditInvoiceModal = ({ invoice, onClose, customers }) => {
    // Safely handle deliveries array
    const deliveries = invoice.deliveries || [];
    // Safely handle customers array
    const customersList = customers || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Invoice {invoice.invoiceNumber}</h2>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
                </div>

                <div className="p-6">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                                <input type="text" defaultValue={invoice.invoiceNumber} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Customer</label>
                                <select defaultValue={invoice.customerUsername} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none">
                                    {customersList.filter((c) => c.value !== 'all').map((customer) => (
                                        <option key={customer.value} value={customer.value}>{customer.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
                                <input type="date" defaultValue={invoice.invoiceDate} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input type="date" defaultValue={invoice.dueDate} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select defaultValue={invoice.status} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none">
                                    <option value="draft">Draft</option>
                                    <option value="sent">Sent</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-700">Delivery Entries</h3>
                                <button type="button" className="inline-flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-700"><Plus className="h-3 w-3" /><span>Add Delivery</span></button>
                            </div>

                            <div className="space-y-3">
                                {deliveries.map((delivery, index) => (
                                    <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">SPO Number</label>
                                                <input type="text" defaultValue={delivery.spo} className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Date</label>
                                                <input type="date" defaultValue={delivery.date} className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-700">Address</label>
                                                <input type="text" defaultValue={delivery.address} className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Base Price (£)</label>
                                                <input type="number" step="0.01" defaultValue={delivery.basePrice} className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Distance Surcharge (£)</label>
                                                <input type="number" step="0.01" defaultValue={delivery.distanceSurcharge} className="mt-1 block w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none" />
                                            </div>
                                        </div>

                                        <button type="button" className="mt-3 inline-flex items-center space-x-1 text-xs text-red-600 hover:text-red-700"><Trash2 className="h-3 w-3" /><span>Remove Delivery</span></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-4">
                            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="inline-flex items-center space-x-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"><Save className="h-4 w-4" /><span>Save Changes</span></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditInvoiceModal;
