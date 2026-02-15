import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Plus, Download, Mail } from 'lucide-react';
import InvoiceCard from './components/InvoiceCard';
import ViewInvoiceModal from './components/ViewInvoiceModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import { getAllInvoices, getInvoiceById, exportInvoicePDF } from '../../../../services/invoiceService';

const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: () => null },
    sent: { label: 'Sent', color: 'bg-amber-100 text-amber-700', icon: () => null },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: () => null },
    overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: () => null },
};

export default function InvoicesManagement() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllInvoices();
            console.log('Raw API response:', data);
            console.log('Type:', typeof data, 'Is array?', Array.isArray(data));

            // Handle different response structures
            let invoicesList = [];
            if (Array.isArray(data)) {
                invoicesList = data;
            } else if (data && Array.isArray(data.data)) {
                invoicesList = data.data;
            } else if (data && data.invoices && Array.isArray(data.invoices)) {
                invoicesList = data.invoices;
            }

            console.log('Processed invoices:', invoicesList);
            setInvoices(invoicesList);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleViewInvoice = async (invoice) => {
        try {
            setLoading(true);
            const full = await getInvoiceById(invoice.id || invoice._id || invoice.invoiceId);
            setSelectedInvoice(full);
            setShowViewModal(true);
        } catch (err) {
            toast.error('Failed to load invoice');
        } finally {
            setLoading(false);
        }
    };

    const handleEditInvoice = async (invoice) => {
        setSelectedInvoice(invoice);
        setShowEditModal(true);
    };

    const handleDownloadInvoice = async (invoice) => {
        try {
            const id = invoice.id || invoice._id || invoice.invoiceId;
            const resp = await exportInvoicePDF(id);
            const blob = new Blob([resp.data], { type: resp.data.type || 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${invoice.invoiceNumber || id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Invoice PDF downloaded');
        } catch (err) {
            console.error(err);
            toast.error('Failed to download PDF');
        }
    };

    const handleEmailInvoice = (invoice) => {
        // Placeholder: wiring for email endpoint can be added here
        toast.info(`Email action for ${invoice.invoiceNumber || invoice.id}`);
    };

    const handlePrintInvoice = (invoice) => {
        // Simple print stub: open PDF in new tab if available
        toast.info('Print requested');
    };

    const calculateStats = () => {
        const total = invoices.reduce((s, inv) => s + (Number(inv.total) || 0), 0);
        const paid = invoices.filter((inv) => inv.status === 'paid').reduce((s, inv) => s + (Number(inv.total) || 0), 0);
        const outstanding = invoices.filter((inv) => inv.status !== 'paid' && inv.status !== 'overdue').reduce((s, inv) => s + (Number(inv.total) || 0), 0);
        const overdue = invoices.filter((inv) => inv.status === 'overdue').reduce((s, inv) => s + (Number(inv.total) || 0), 0);
        return { total, paid, outstanding, overdue };
    };

    const stats = calculateStats();

    return (
        <div className="p-2 sm:p-6 ">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Invoice Management</h1>
                    <p className="mt-1 text-sm text-gray-600 sm:text-base">Generate, manage, and track customer invoices</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => toast.info('Generate flow not implemented')}
                        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Generate Invoice</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex items-center gap-2 py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                    <span className="text-gray-600">Loading invoices...</span>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-red-700">{error}</p>
                    <button onClick={fetchInvoices} className="mt-2 rounded bg-red-600 px-3 py-1 text-white">Retry</button>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4 mb-6">
                        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                            <p className="text-xs text-gray-600">Total Revenue</p>
                            <p className="text-lg font-bold">£{stats.total.toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                            <p className="text-xs text-gray-600">Paid</p>
                            <p className="text-lg font-bold">£{stats.paid.toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                            <p className="text-xs text-gray-600">Outstanding</p>
                            <p className="text-lg font-bold">£{stats.outstanding.toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                            <p className="text-xs text-gray-600">Overdue</p>
                            <p className="text-lg font-bold text-red-600">£{stats.overdue.toFixed(2)}</p>
                        </div>
                    </div>



                    <div className="grid gap-4">
                        {invoices.length === 0 && <p className="text-gray-600">No invoices found.</p>}
                        {invoices.map((inv) => (
                            <InvoiceCard
                                key={inv.id || inv._id || inv.invoiceNumber}
                                invoice={inv}
                                statusConfig={statusConfig}
                                onView={handleViewInvoice}
                                onEdit={handleEditInvoice}
                                onDownload={handleDownloadInvoice}
                                onEmail={handleEmailInvoice}
                                onPrint={handlePrintInvoice}
                            />
                        ))}
                    </div>
                </>
            )}

            {showViewModal && selectedInvoice && (
                <ViewInvoiceModal
                    invoice={selectedInvoice}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedInvoice(null);
                    }}
                    onDownload={() => handleDownloadInvoice(selectedInvoice)}
                    onEmail={() => handleEmailInvoice(selectedInvoice)}
                />
            )}

            {showEditModal && selectedInvoice && (
                <EditInvoiceModal
                    invoice={selectedInvoice}
                    customers={[]}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedInvoice(null);
                    }}
                />
            )}
        </div>
    );
}
