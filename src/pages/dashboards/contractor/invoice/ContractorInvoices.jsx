import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import Loading from '../../../../components/Loading';
import { getContractorInvoices } from '../../../../services/driverService';
import { formatDate } from '../contractorDummyData';
import InvoicesHeader from './components/InvoicesHeader';
import InvoicesFilters from './components/InvoicesFilters';
import EmptyInvoicesState from './components/EmptyInvoicesState';
import InvoicesTable from './components/InvoicesTable';
import InvoiceViewModal from './components/InvoiceViewModal';
import InvoiceDeleteModal from './components/InvoiceDeleteModal';

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
  const periodStart = invoice.periodStart || null;
  const periodEnd = invoice.periodEnd || null;
  const period =
    periodStart || periodEnd
      ? `${formatDate(periodStart)} – ${formatDate(periodEnd)}`
      : '—';

  return {
    ...invoice,
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber || `INV-${invoice.id}`,
    period,
    jobs: invoice.jobCount ?? invoice.items?.length ?? 0,
    amount: Number(invoice.amount) || 0,
    rate: Number(invoice.rate) || 0,
    status: formatStatusLabel(invoice.status),
    statusRaw: (invoice.status || '').toString().toUpperCase(),
    issuedAt: invoice.issuedAt || invoice.createdAt || null,
    items: Array.isArray(invoice.items) ? invoice.items : [],
  };
};

const ContractorInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(
    function fetchContractorInvoicesOnPageOrFilterChange() {
      let isMounted = true;

      const fetchContractorInvoices = async () => {
        setLoading(true);
        try {
          const params = {
            page: currentPage,
            limit: itemsPerPage,
          };
          if (statusFilter !== 'all') {
            params.status = statusFilter.toUpperCase();
          }

          const response = await getContractorInvoices(params);
          console.log('Contractor invoices response:', response);

          if (!isMounted) return;

          if (response?.success && Array.isArray(response.data)) {
            const apiPagination = response.pagination || {};
            setInvoices(response.data.map(normalizeInvoice));
            setPagination({
              page: apiPagination.page || currentPage,
              limit: apiPagination.limit || itemsPerPage,
              total: apiPagination.total ?? response.count ?? response.data.length,
              totalPages: apiPagination.totalPages || 1,
            });
          } else {
            throw new Error(response?.message || 'Failed to load invoices');
          }
        } catch (error) {
          console.error('Error loading contractor invoices:', error);
          if (isMounted) {
            toast.error(error.response?.data?.message || 'Failed to load invoices');
            setInvoices([]);
            setPagination({
              page: 1,
              limit: itemsPerPage,
              total: 0,
              totalPages: 1,
            });
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchContractorInvoices();

      return function cleanupContractorInvoicesFetch() {
        isMounted = false;
      };
    },
    [currentPage, statusFilter]
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.period.toLowerCase().includes(q)
    );
  }, [invoices, searchQuery]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleDelete = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedInvoice) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== selectedInvoice.id));
    setPagination((prev) => ({
      ...prev,
      total: Math.max(0, prev.total - 1),
    }));
    toast.success(`${selectedInvoice.invoiceNumber} removed from list`);
    setShowDeleteModal(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <InvoicesHeader />
      <InvoicesFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[30vh] items-center justify-center p-6">
            <Loading />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyInvoicesState hasFilters={!!searchQuery || statusFilter !== 'all'} />
        ) : (
          <>
            <InvoicesTable
              invoices={filtered}
              onView={handleView}
              onDelete={handleDelete}
            />

            {/* Pagination — same as admin Bookings Delivery Records */}
            {pagination.total > 0 && (
              <div className="border-t border-gray-200 px-4 sm:px-6">
                <Pagination
                  currentPage={pagination.page || currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={pagination.limit || itemsPerPage}
                  totalItems={pagination.total}
                  compact
                />
              </div>
            )}
          </>
        )}
      </div>

      {showViewModal && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowViewModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {showDeleteModal && (
        <InvoiceDeleteModal
          invoice={selectedInvoice}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedInvoice(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default ContractorInvoices;
