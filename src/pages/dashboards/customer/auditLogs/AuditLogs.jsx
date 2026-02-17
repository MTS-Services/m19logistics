import React, { useEffect, useState } from 'react';
import { Package, XCircle, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMyAuditLogs, getAuditLogById } from '../../../../services/auditLogService';
import Pagination from '../../../../components/Pagination';

// Import components
import AuditLogsHeader from './components/AuditLogsHeader';
import AuditLogsStats from './components/AuditLogsStats';
import AuditLogsFilters from './components/AuditLogsFilters';
import AuditLogsTable from './components/AuditLogsTable';
import AuditLogsMobileCard from './components/AuditLogsMobileCard';
import AuditLogsModal from './components/AuditLogsModal';
import AuditLogsEmptyState from './components/AuditLogsEmptyState';
import LoadingState from './components/LoadingState';

// Helper functions
const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const AuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [isViewLoading, setIsViewLoading] = useState(false);

    const itemsPerPage = 8;

    // Fetch audit logs
    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        setLoading(true);
        try {
            const response = await getMyAuditLogs();
            const logs = response?.data || [];
            setAuditLogs(logs);
            setFilteredLogs(logs);
        } catch (error) {
            toast.error('Failed to load audit logs');
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logs based on search and action filter
    useEffect(() => {
        let result = [...auditLogs];

        // Apply action filter
        if (filterAction !== 'all') {
            result = result.filter((log) => log.action === filterAction);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (log) =>
                    log.description?.toLowerCase().includes(query) ||
                    log.action?.toLowerCase().includes(query) ||
                    log.delivery?.deliveryAddress?.toLowerCase().includes(query) ||
                    log.delivery?.status?.toLowerCase().includes(query)
            );
        }

        setFilteredLogs(result);
        setCurrentPage(1);
    }, [searchQuery, filterAction, auditLogs]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Get unique actions for filter
    const uniqueActions = [...new Set(auditLogs.map((log) => log.action))].filter(Boolean);

    // Get action color and icon
    const getActionStyle = (action) => {
        switch (action) {
            case 'CREATE_DELIVERY':
                return {
                    color: 'bg-blue-100 text-blue-600',
                    icon: Package,
                    label: 'Created',
                };
            case 'CANCEL_DELIVERY':
                return {
                    color: 'bg-red-100 text-red-600',
                    icon: XCircle,
                    label: 'Cancelled',
                };
            case 'UPDATE_DELIVERY':
                return {
                    color: 'bg-yellow-100 text-yellow-600',
                    icon: AlertCircle,
                    label: 'Updated',
                };
            case 'COMPLETE_DELIVERY':
                return {
                    color: 'bg-green-100 text-green-600',
                    icon: CheckCircle,
                    label: 'Completed',
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-600',
                    icon: Activity,
                    label: action || 'Unknown',
                };
        }
    };

    // View log details
    const handleViewLog = async (log) => {
        setSelectedLog(log);
        setShowViewModal(true);

        if (log?.id) {
            setIsViewLoading(true);
            try {
                const response = await getAuditLogById(log.id);
                setSelectedLog(response?.data || log);
            } catch (error) {
                console.error('Error fetching log details:', error);
            } finally {
                setIsViewLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <AuditLogsHeader />

            {/* Stats Card */}
            <AuditLogsStats totalActivities={auditLogs.length} />

            {/* Filters and Search */}
            <AuditLogsFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterAction={filterAction}
                setFilterAction={setFilterAction}
                uniqueActions={uniqueActions}
                getActionStyle={getActionStyle}
            />

            {/* Audit Logs List */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                {/* Table Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">Activity History</h2>
                </div>

                {/* Loading State */}
                {loading ? (
                    <LoadingState />
                ) : filteredLogs.length === 0 ? (
                    <AuditLogsEmptyState searchQuery={searchQuery} />
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <AuditLogsTable
                            paginatedLogs={paginatedLogs}
                            getActionStyle={getActionStyle}
                            formatDateTime={formatDateTime}
                            formatDate={formatDate}
                            handleViewLog={handleViewLog}
                        />

                        {/* Mobile Card View */}
                        <AuditLogsMobileCard
                            paginatedLogs={paginatedLogs}
                            getActionStyle={getActionStyle}
                            formatDateTime={formatDateTime}
                            formatDate={formatDate}
                            handleViewLog={handleViewLog}
                        />

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredLogs.length}
                            compact={true}
                        />
                    </>
                )}
            </div>

            {/* View Details Modal */}
            {showViewModal && selectedLog && (
                <AuditLogsModal
                    selectedLog={selectedLog}
                    isViewLoading={isViewLoading}
                    formatDateTime={formatDateTime}
                    formatDate={formatDate}
                    onClose={() => setShowViewModal(false)}
                />
            )}
        </div>
    );
};

export default AuditLogs;
