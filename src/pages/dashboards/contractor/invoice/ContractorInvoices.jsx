import React, { useMemo, useState } from 'react';
import Pagination from '../../../../components/Pagination';
import { dummyInvoices } from '../contractorDummyData';
import InvoicesHeader from './components/InvoicesHeader';
import InvoicesFilters from './components/InvoicesFilters';
import EmptyInvoicesState from './components/EmptyInvoicesState';
import InvoicesTable from './components/InvoicesTable';

const ContractorInvoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return dummyInvoices.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.period.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

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
        {filtered.length === 0 ? (
          <EmptyInvoicesState hasFilters={!!searchQuery || statusFilter !== 'all'} />
        ) : (
          <>
            <InvoicesTable invoices={pageItems} />
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
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
    </div>
  );
};

export default ContractorInvoices;
