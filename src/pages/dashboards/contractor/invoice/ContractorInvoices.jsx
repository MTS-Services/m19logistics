import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import { dummyInvoices } from '../contractorDummyData';
import InvoicesHeader from './components/InvoicesHeader';
import InvoicesFilters from './components/InvoicesFilters';
import EmptyInvoicesState from './components/EmptyInvoicesState';
import InvoicesTable from './components/InvoicesTable';
import InvoiceViewModal from './components/InvoiceViewModal';

const ContractorInvoices = () => {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.period.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const pageItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleDelete = (invoice) => {
    const confirmed = window.confirm(`Delete invoice ${invoice.id}?`);
    if (!confirmed) return;

    setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
    toast.success(`${invoice.id} deleted (dummy — backend later)`);

    const remaining = filtered.length - 1;
    const nextTotalPages = Math.ceil(remaining / itemsPerPage) || 1;
    if (currentPage > nextTotalPages) {
      setCurrentPage(nextTotalPages);
    }
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

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <EmptyInvoicesState hasFilters={!!searchQuery || statusFilter !== 'all'} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <InvoicesTable
                invoices={pageItems}
                onView={handleView}
                onDelete={handleDelete}
              />
            </div>
            <div className="border-t border-gray-200 px-6 py-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filtered.length}
                compact
              />
            </div>
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
    </div>
  );
};

export default ContractorInvoices;
