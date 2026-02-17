import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  User,
  Package,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Eye,
  X,
} from 'lucide-react';
import adminAuditLogService from '../../../../services/adminAuditLogService';
import Loading from '../../../../components/Loading';
import Pagination from '../../../../components/Pagination';

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAuditLogService.getAuditLogs();

      if (response.data.success) {
        const data = response.data.data;
        // Handle both array and paginated response
        if (Array.isArray(data)) {
          // Client-side pagination
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          setAuditLogs(data.slice(startIndex, endIndex));
          setTotalItems(data.length);
          setTotalPages(Math.ceil(data.length / itemsPerPage));
        } else {
          setAuditLogs(data.logs || data.data || []);
          setTotalItems(data.total || data.totalItems || 0);
          setTotalPages(data.totalPages || Math.ceil((data.total || 0) / itemsPerPage));
        }
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError(err.response?.data?.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const openModal = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionBadgeStyle = (action) => {
    const styles = {
      CREATE_DELIVERY: 'bg-green-100 text-green-800 border-green-200',
      UPDATE_DELIVERY: 'bg-blue-100 text-blue-800 border-blue-200',
      DELETE_DELIVERY: 'bg-red-100 text-red-800 border-red-200',
      CANCEL_DELIVERY: 'bg-orange-100 text-orange-800 border-orange-200',
      ASSIGN_DRIVER: 'bg-purple-100 text-purple-800 border-purple-200',
      ACCEPT_DELIVERY: 'bg-teal-100 text-teal-800 border-teal-200',
      REJECT_DELIVERY: 'bg-red-100 text-red-800 border-red-200',
      COMPLETE_DELIVERY: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return styles[action] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getActionIcon = (action) => {
    const icons = {
      CREATE_DELIVERY: <CheckCircle className="h-4 w-4" />,
      UPDATE_DELIVERY: <RefreshCw className="h-4 w-4" />,
      DELETE_DELIVERY: <XCircle className="h-4 w-4" />,
      CANCEL_DELIVERY: <XCircle className="h-4 w-4" />,
      ASSIGN_DRIVER: <User className="h-4 w-4" />,
      ACCEPT_DELIVERY: <CheckCircle className="h-4 w-4" />,
      REJECT_DELIVERY: <XCircle className="h-4 w-4" />,
      COMPLETE_DELIVERY: <CheckCircle className="h-4 w-4" />,
    };
    return icons[action] || <Activity className="h-4 w-4" />;
  };

  const formatActionText = (action) => {
    return action.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusBadge = (status) => {
    const styles = {
      RECEIVED: 'bg-blue-100 text-blue-800 border-blue-200',
      ALLOCATED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ACCEPTED: 'bg-teal-100 text-teal-800 border-teal-200',
      PICKED_UP: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      CANCELLED: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loading message="Loading Audit Logs" submessage="Fetching audit trail data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-red-600" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900">Error Loading Audit Logs</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchAuditLogs}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Audit Logs</h1>
              <p className="mt-2 text-base text-gray-600">
                Track all system activities and changes
              </p>
            </div>

          </div>
        </div>

        {/* Table */}
        {auditLogs.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No Audit Logs Found</h3>
            <p className="mt-2 text-sm text-gray-600">
              There are no audit logs to display at this time.
            </p>
          </div>
        ) : (
          <div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>

                      <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        status
                      </th>
                      <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Delivery ID
                      </th>
                      <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-center text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">#{log.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          {log.user ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">{log.user.fullName}</p>
                              <p className="text-xs text-gray-500">{log.user.email}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900 max-w-xs truncate">{log.description}</p>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getActionBadgeStyle(log.action)}`}
                          >
                            {getActionIcon(log.action)}
                            {formatActionText(log.action)}
                          </span>
                        </td>


                        <td className="px-4 py-4 whitespace-nowrap">
                          {log.deliveryId ? (
                            <span className="text-sm text-gray-900">#{log.deliveryId}</span>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">{formatDate(log.createdAt)}</p>
                            <p className="text-xs text-gray-500">{formatTime(log.createdAt)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => openModal(log)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 bg-white px-3 py-1.5 text-sm font-medium text-teal-600 transition-all hover:bg-teal-50"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
              />
            </div>

            {/* Pagination */}

          </div>

        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedLog && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 bg-opacity-50 p-4 sm:items-center"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl transition-all my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Audit Log Details</h2>
                <p className="mt-1 text-sm text-gray-600">Log ID: #{selectedLog.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Action & Description */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Action</label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getActionBadgeStyle(selectedLog.action)}`}
                        >
                          {getActionIcon(selectedLog.action)}
                          {formatActionText(selectedLog.action)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedLog.description}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedLog.createdAt)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Time</label>
                        <p className="mt-1 text-sm text-gray-900">{formatTime(selectedLog.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                {selectedLog.user && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">User Information</h3>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <User className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Full Name</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedLog.user.fullName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedLog.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">User ID</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              #{selectedLog.user.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Activity className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Role</p>
                            <span className="mt-1 inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                              {selectedLog.user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Information */}
                {(selectedLog.delivery || selectedLog.afterData?.id) && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Delivery Information</h3>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <Package className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Delivery ID</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              #{selectedLog.delivery?.id || selectedLog.afterData?.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Delivery Date</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatDate(selectedLog.delivery?.deliveryDate || selectedLog.afterData?.deliveryDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedLog.delivery?.deliveryAddress || selectedLog.afterData?.deliveryAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Activity className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <span
                              className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(selectedLog.delivery?.status || selectedLog.afterData?.status)}`}
                            >
                              {selectedLog.delivery?.status || selectedLog.afterData?.status}
                            </span>
                          </div>
                        </div>
                        {selectedLog.afterData?.spoNumber && (
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">SPO Number</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {selectedLog.afterData.spoNumber}
                              </p>
                            </div>
                          </div>
                        )}
                        {selectedLog.afterData?.weight && (
                          <div className="flex items-start gap-3">
                            <Package className="mt-0.5 h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Weight (kg)</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {selectedLog.afterData.weight / 1000}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason */}
                {selectedLog.reason && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Reason</h3>
                    <div className="rounded-lg border border-gray-200 bg-yellow-50 p-4">
                      <p className="text-sm text-gray-900">{selectedLog.reason}</p>
                    </div>
                  </div>
                )}



                {/* Customer Details */}
                {selectedLog.afterData?.customer && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Customer Details</h3>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <User className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Name</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedLog.afterData.customer.fullName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedLog.afterData.customer.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {selectedLog.afterData.customer.phone}
                            </p>
                          </div>
                        </div>
                        {selectedLog.afterData.customer.customerProfile?.loginId && (
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Login ID</p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {selectedLog.afterData.customer.customerProfile.loginId}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
