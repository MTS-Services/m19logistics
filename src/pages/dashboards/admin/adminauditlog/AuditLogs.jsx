import React, { useEffect, useMemo, useState } from 'react';
import adminAuditLogService from '../../../../services/adminAuditLogService';
import Pagination from '../../../../components/Pagination';
import {
  AuditLogsHeader,
  AuditLogsFilters,
  AuditLogsTable,
  AuditLogsMobileCard,
  AuditLogsModal,
  AuditLogsEmptyState,
  LoadingState,
} from './components';

const ITEMS_PER_PAGE = 10;

const AdminAuditLogs = () => {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchLogs = async (q = '') => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      const res = await adminAuditLogService.getAuditLogs(params);
      // API returns { success:true, data: [...], count }
      const resp = res?.data;
      if (resp) {
        const logsData = resp.data || resp || [];
        setAllLogs(logsData);
        setCurrentPage(1); // Reset to first page when data changes
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side pagination
  const { paginatedLogs, totalItems, totalPages } = useMemo(() => {
    // Reverse to show newest first (higher ID first)
    const reversedLogs = [...allLogs].reverse();
    const total = reversedLogs.length;
    const pages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginated = reversedLogs.slice(startIndex, endIndex);

    return {
      paginatedLogs: paginated,
      totalItems: total,
      totalPages: pages,
    };
  }, [allLogs, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(query);
  };

  const openLog = (log) => {
    setSelected(log);
  };

  const closeModal = () => setSelected(null);

  return (
    <div className="space-y-5 p-2 sm:p-6 ">
      {/* Header */}
      <AuditLogsHeader totalItems={totalItems} />

      {/* Filters */}
      <AuditLogsFilters query={query} setQuery={setQuery} onSearch={handleSearch} />

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : paginatedLogs.length === 0 ? (
        <AuditLogsEmptyState />
      ) : (
        <>
          {/* Desktop Table and Pagination - connected without gap */}
          <div className="hidden md:block">
            <AuditLogsTable logs={paginatedLogs} onViewLog={openLog} />
            <div className="border-t border-gray-200 bg-white shadow-md rounded-b-lg">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalItems}
                compact
              />
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {paginatedLogs.map((log) => (
              <AuditLogsMobileCard key={log.id} log={log} onViewLog={openLog} />
            ))}
          </div>

          {/* Mobile Pagination */}
          <div className="rounded-lg bg-white shadow-md md:hidden">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
              compact
            />
          </div>
        </>
      )}

      {/* Modal */}
      {selected && <AuditLogsModal log={selected} onClose={closeModal} />}
    </div>
  );
};

export default AdminAuditLogs;
