import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Plus, Bell } from 'lucide-react';
import Loading from '../../../../components/Loading';
import InvoiceCard from './components/InvoiceCard';
import ViewInvoiceModal from './components/ViewInvoiceModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import GenerateInvoiceModal from './components/GenerateInvoiceModal';
import {
  getAllAdminInvoices,
  getAdminInvoiceById,
  exportAdminInvoicePDF,
  markAdminInvoicePaid,
  sendAdminInvoiceReminders,
} from '../../../../services/invoiceService';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: () => null },
  sent: { label: 'Sent', color: 'bg-amber-100 text-amber-700', icon: () => null },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: () => null },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: () => null },
};

export default function InvoicesManagement() {
  const [invoices, setInvoices] = useState([]);
  const [summary, setSummary] = useState({
    totalInvoices: 0,
    totalPaid: '0.00',
    totalUnpaid: '0.00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [markingPaidId, setMarkingPaidId] = useState(null);
  const [sendingReminders, setSendingReminders] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAdminInvoices();
      // API returns { success, data: [...], count, summary: { totalInvoices, totalPaid, totalUnpaid } }
      setInvoices(Array.isArray(data?.data) ? data.data : []);
      if (data?.summary) setSummary(data.summary);
    } catch (err) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (invoice) => {
    try {
      const resp = await getAdminInvoiceById(invoice.id || invoice._id || invoice.invoiceId);
      setSelectedInvoice(resp?.data || resp);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error loading invoice:', err);
      toast.error('Failed to load invoice');
    }
  };

  const handleEditInvoice = async (invoice) => {
    try {
      const resp = await getAdminInvoiceById(invoice.id || invoice._id || invoice.invoiceId);
      setEditingInvoice(resp?.data || resp);
      setShowEditModal(true);
    } catch (err) {
      console.error('Error loading invoice for editing:', err);
      toast.error('Failed to load invoice for editing');
    }
  };

  const handleSendReminders = async () => {
    setSendingReminders(true);
    try {
      const res = await sendAdminInvoiceReminders();
      toast.success(res?.message || 'Payment reminders sent to customers');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reminders');
    } finally {
      setSendingReminders(false);
    }
  };

  const handleMarkPaid = async (invoice) => {
    const id = invoice.id || invoice._id || invoice.invoiceId;
    setMarkingPaidId(id);
    try {
      await markAdminInvoicePaid(id, true);
      toast.success(`Invoice ${invoice.invoiceNumber || id} marked as paid`);
      fetchInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark invoice as paid');
    } finally {
      setMarkingPaidId(null);
    }
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      const id = invoice.id || invoice._id || invoice.invoiceId;
      const resp = await exportAdminInvoicePDF(id);
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

  // Use summary from API; derive totalAmount from paid + unpaid
  const stats = {
    totalInvoices: summary.totalInvoices ?? invoices.length,
    totalAmount: (Number(summary.totalPaid) + Number(summary.totalUnpaid)).toFixed(2),
    totalPaid: Number(summary.totalPaid).toFixed(2),
    totalUnpaid: Number(summary.totalUnpaid).toFixed(2),
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Invoice Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Generate, manage, and track customer invoices
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:gap-3">
          <button
            onClick={handleSendReminders}
            disabled={sendingReminders}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-600 px-3 py-2 text-xs sm:text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60 flex-1 sm:flex-initial"
          >
            {sendingReminders ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            <span>{sendingReminders ? 'Sending...' : 'Send Reminders'}</span>
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-xs sm:text-sm font-medium text-white shadow hover:bg-teal-700 flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-6">
          <Loading message="Loading Invoices" submessage="Fetching invoices..." size="medium" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
          <button onClick={fetchInvoices} className="mt-2 rounded bg-red-600 px-3 py-1 text-white">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-3 sm:p-4 md:p-6 shadow-sm">
              <p className="text-xs text-gray-600">Total Invoices</p>
              <p className="text-base sm:text-lg font-bold mt-1">{stats.totalInvoices}</p>
            </div>

            <div className="rounded-lg bg-white p-3 sm:p-4 md:p-6 shadow-sm">
              <p className="text-xs text-gray-600">Total Paid</p>
              <p className="text-base sm:text-lg font-bold text-green-600 mt-1">£{stats.totalPaid}</p>
            </div>
            <div className="rounded-lg bg-white p-3 sm:p-4 md:p-6 shadow-sm">
              <p className="text-xs text-gray-600">Total Unpaid</p>
              <p className="text-base sm:text-lg font-bold text-red-600 mt-1">£{stats.totalUnpaid}</p>
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
                onMarkPaid={handleMarkPaid}
                markingPaid={markingPaidId === (inv.id || inv._id || inv.invoiceId)}
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
        />
      )}

      {showEditModal && editingInvoice && (
        <EditInvoiceModal
          invoice={editingInvoice}
          onClose={() => {
            setShowEditModal(false);
            setEditingInvoice(null);
          }}
          onSuccess={() => {
            fetchInvoices();
          }}
        />
      )}

      {showGenerateModal && (
        <GenerateInvoiceModal
          onClose={() => setShowGenerateModal(false)}
          onSuccess={() => {
            fetchInvoices();
          }}
        />
      )}
    </div>
  );
}
