import { useMemo, useState } from 'react';
import { FileText, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import ContractorInvoiceCard from './components/ContractorInvoiceCard';

const dummyContractorInvoices = [
  { id: 1, invoiceNumber: 'CINV-2026-001', contractor: 'Rapid Haul Ltd', period: '01 Jul - 07 Jul', amount: 1260, vat: 210, jobsCount: 7, status: 'Pending', submittedAt: '2026-07-08' },
  { id: 2, invoiceNumber: 'CINV-2026-002', contractor: 'Northline Couriers', period: '01 Jul - 07 Jul', amount: 980, vat: 163.33, jobsCount: 5, status: 'Approved', submittedAt: '2026-07-08' },
  { id: 3, invoiceNumber: 'CINV-2026-003', contractor: 'AK Transport', period: '08 Jul - 14 Jul', amount: 1440, vat: 240, jobsCount: 8, status: 'Paid', submittedAt: '2026-07-15' },
  { id: 4, invoiceNumber: 'CINV-2026-004', contractor: 'Metro Van Services', period: '08 Jul - 14 Jul', amount: 1100, vat: 183.33, jobsCount: 6, status: 'Pending', submittedAt: '2026-07-15' },
  { id: 5, invoiceNumber: 'CINV-2026-005', contractor: 'SwiftDrop Solutions', period: '15 Jul - 21 Jul', amount: 890, vat: 148.33, jobsCount: 4, status: 'Rejected', submittedAt: '2026-07-22' },
  { id: 6, invoiceNumber: 'CINV-2026-006', contractor: 'Rapid Haul Ltd', period: '15 Jul - 21 Jul', amount: 1320, vat: 220, jobsCount: 7, status: 'Approved', submittedAt: '2026-07-22' },
  { id: 7, invoiceNumber: 'CINV-2026-007', contractor: 'Northline Couriers', period: '22 Jul - 28 Jul', amount: 1025, vat: 170.83, jobsCount: 5, status: 'Pending', submittedAt: '2026-07-29' },
];

const ITEMS_PER_PAGE = 5;

export default function ContractorInvoiceManagement() {
  const [invoices, setInvoices] = useState(dummyContractorInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [markingPaidId, setMarkingPaidId] = useState(null);

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return invoices.filter((item) => {
      const matchesSearch =
        item.invoiceNumber.toLowerCase().includes(q) ||
        item.contractor.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleView = (invoice) => {
    toast.info(`View invoice ${invoice.invoiceNumber} (dummy)`);
  };

  const handleEdit = (invoice) => {
    toast.info(`Edit invoice ${invoice.invoiceNumber} (dummy)`);
  };

  const handleDownload = (invoice) => {
    toast.success(`PDF download for ${invoice.invoiceNumber} (dummy)`);
  };

  const handleMarkPaid = (invoice) => {
    setMarkingPaidId(invoice.id);
    setTimeout(() => {
      setInvoices((prev) => prev.map((item) => (item.id === invoice.id ? { ...item, status: 'Paid' } : item)));
      setMarkingPaidId(null);
      toast.success(`${invoice.invoiceNumber} marked as paid`);
    }, 500);
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
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">Invoice Records</h2>
        </div>

        {paginatedInvoices.length === 0 ? (
          <div className="p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-3 text-sm text-gray-600">No contractor invoices found.</p>
          </div>
        ) : (
          <div className="space-y-4 p-4 sm:p-5">
            {paginatedInvoices.map((item) => (
              <ContractorInvoiceCard
                key={item.id}
                invoice={item}
                onView={handleView}
                onEdit={handleEdit}
                onDownload={handleDownload}
                onMarkPaid={handleMarkPaid}
                markingPaid={markingPaidId === item.id}
              />
            ))}
          </div>
        )}
      </div>

      {filteredInvoices.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredInvoices.length}
        />
      )}
    </div>
  );
}
