import { useEffect, useMemo, useState } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import Loading from '../../../../components/Loading';
import {
  getAdminContractorInvoices,
  markAdminContractorInvoicePaid,
  exportContractorInvoicePDFByNumber,
  deleteContractorInvoice,
} from '../../../../services/invoiceService';
import ContractorInvoiceCard from './components/ContractorInvoiceCard';
import ContractorInvoiceViewModal from './components/ContractorInvoiceViewModal';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatStatusLabel = (status) => {
  if (!status) return '—';
  return status
    .toString()
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const normalizeInvoice = (invoice) => {
  const contractorName =
    invoice.contractor?.driverProfile?.tradingName ||
    invoice.contractor?.fullName ||
    '—';

  return {
    ...invoice,
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
    contractor: contractorName,
    contractorEmail: invoice.contractor?.email || '',
    period: `${formatDate(invoice.periodStart)} – ${formatDate(invoice.periodEnd)}`,
    jobsCount: invoice.jobCount ?? invoice.items?.length ?? 0,
    amount: Number(invoice.amount) || 0,
    rate: Number(invoice.rate) || 0,
    status: formatStatusLabel(invoice.status),
    statusRaw: (invoice.status || '').toString().toUpperCase(),
    submittedAt: formatDate(invoice.issuedAt || invoice.createdAt),
    items: Array.isArray(invoice.items) ? invoice.items : [],
  };
};

const ITEMS_PER_PAGE = 10;

export default function ContractorInvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [markingPaidId, setMarkingPaidId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(
    function fetchAdminContractorInvoicesOnPageOrFilterChange() {
      let isMounted = true;

      const fetchInvoices = async () => {
        setLoading(true);
        try {
          const params = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          };
          if (statusFilter !== 'all') {
            params.status = statusFilter.toUpperCase();
          }

          const response = await getAdminContractorInvoices(params);
          console.log('Admin contractor invoices response:', response);

          if (!isMounted) return;

          if (response?.success && Array.isArray(response.data)) {
            const apiPagination = response.pagination || {};
            setInvoices(response.data.map(normalizeInvoice));
            setPagination({
              page: apiPagination.page || currentPage,
              limit: apiPagination.limit || ITEMS_PER_PAGE,
              total: apiPagination.total ?? response.count ?? response.data.length,
              totalPages: apiPagination.totalPages || 1,
            });
          } else {
            throw new Error(response?.message || 'Failed to load contractor invoices');
          }
        } catch (error) {
          console.error('Error loading admin contractor invoices:', error);
          if (isMounted) {
            toast.error(error.response?.data?.message || 'Failed to load contractor invoices');
            setInvoices([]);
            setPagination({
              page: 1,
              limit: ITEMS_PER_PAGE,
              total: 0,
              totalPages: 1,
            });
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchInvoices();

      return function cleanupAdminContractorInvoicesFetch() {
        isMounted = false;
      };
    },
    [currentPage, statusFilter]
  );

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (item) =>
        item.invoiceNumber.toLowerCase().includes(q) ||
        item.contractor.toLowerCase().includes(q) ||
        item.contractorEmail.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedInvoice(null);
  };

  const handleDownload = async (invoice) => {
    if (downloadingId || !invoice?.invoiceNumber) return;

    setDownloadingId(invoice.id);
    try {
      const resp = await exportContractorInvoicePDFByNumber(invoice.invoiceNumber);
      console.log('Contractor invoice PDF response:', resp);

      const blob = new Blob([resp.data], { type: resp.data?.type || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${invoice.invoiceNumber} PDF downloaded`);
    } catch (error) {
      console.error('Error downloading contractor invoice PDF:', error);
      toast.error(error.response?.data?.message || 'Failed to download PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleMarkPaid = async (invoice) => {
    if (markingPaidId) return;

    setMarkingPaidId(invoice.id);
    try {
      const response = await markAdminContractorInvoicePaid(invoice.id);
      console.log('Mark contractor invoice paid response:', response);

      if (response?.success) {
        const updated = response.data;
        setInvoices((prev) =>
          prev.map((item) =>
            item.id === invoice.id
              ? {
                  ...item,
                  ...(updated ? normalizeInvoice(updated) : {}),
                  status: 'Paid',
                  statusRaw: 'PAID',
                  paidAt: updated?.paidAt || new Date().toISOString(),
                }
              : item
          )
        );
        toast.success(response.message || `${invoice.invoiceNumber} marked as paid`);
      } else {
        throw new Error(response?.message || 'Failed to mark invoice as paid');
      }
    } catch (error) {
      console.error('Error marking contractor invoice as paid:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to mark as paid');
    } finally {
      setMarkingPaidId(null);
    }
  };

  const handleDelete = async (invoice) => {
    if (deletingId) return;

    setDeletingId(invoice.id);
    try {
      const response = await deleteContractorInvoice(invoice.id);
      console.log('Delete contractor invoice response:', response);

      if (response?.success !== false) {
        setInvoices((prev) => prev.filter((item) => item.id !== invoice.id));
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
        toast.success(response?.message || `${invoice.invoiceNumber} deleted`);
      } else {
        throw new Error(response?.message || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting contractor invoice:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to delete invoice');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 p-3 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Contractor Invoice
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Review and manage contractor submitted invoices
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by invoice number or contractor..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-9 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-lg border border-gray-300 py-2.5 pr-8 pl-9 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Outstanding">Outstanding</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Invoice Records</h2>
        </div>

        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center p-6">
            <Loading />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-3 text-sm text-gray-600">No contractor invoices found.</p>
          </div>
        ) : (
          <div className="space-y-4 p-4 sm:p-5">
            {filteredInvoices.map((item) => (
              <ContractorInvoiceCard
                key={item.id}
                invoice={item}
                onView={handleView}
                onDownload={handleDownload}
                onMarkPaid={handleMarkPaid}
                onDelete={handleDelete}
                markingPaid={markingPaidId === item.id}
                deleting={deletingId === item.id}
                downloading={downloadingId === item.id}
              />
            ))}
          </div>
        )}

        {!loading && pagination.total > 0 && (
          <div className="border-t border-gray-200 px-4 sm:px-6">
            <Pagination
              currentPage={pagination.page || currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={pagination.limit || ITEMS_PER_PAGE}
              totalItems={pagination.total}
              compact
            />
          </div>
        )}
      </div>

      {showViewModal && (
        <ContractorInvoiceViewModal
          invoice={selectedInvoice}
          onClose={handleCloseViewModal}
        />
      )}
    </div>
  );
}
