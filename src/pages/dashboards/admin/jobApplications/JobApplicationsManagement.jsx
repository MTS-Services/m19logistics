import React, { useState, useEffect, useCallback } from 'react';
import {
  Briefcase,
  Search,
  Eye,
  Download,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  XCircle,
  Star,
  Loader2,
  RefreshCw,
  MoreVertical,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';
import Pagination from '../../../../components/Pagination';
import axiosInstance from '../../../../services/axiosInstance';
import Loading from '../../../../components/Loading';
import DeleteApplicationModal from './components/DeleteApplicationModal';
import StatusUpdateModal from './components/StatusUpdateModal';
import ViewApplicationModal from './components/ViewApplicationModal';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: Clock,
  },
  REVIEWED: {
    label: 'Reviewed',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: Eye,
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: Star,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: XCircle,
  },
};

const JobApplicationsManagement = () => {
  const [stats, setStats] = useState(null);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0, flipUp: false });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusTarget, setStatusTarget] = useState({ app: null, newStatus: '' });
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const itemsPerPage = 5;

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/admin/job-applications/stats');
      const data = response.data?.data || {};
      setStats(data);

      // Flatten applications from byStatus, injecting status per group
      const byStatus = data.byStatus || {};
      const flattened = [];
      const statusKeys = ['pending', 'reviewed', 'shortlisted', 'rejected'];
      statusKeys.forEach((key) => {
        const group = byStatus[key];
        if (group && Array.isArray(group.applications)) {
          group.applications.forEach((app) => {
            flattened.push({ ...app, status: key.toUpperCase() });
          });
        }
      });
      setAllApplications(flattened);
    } catch {
      setError('Failed to load job applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Filter & search
  const filtered = allApplications.filter((app) => {
    const matchesSearch =
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phoneNumber?.includes(searchTerm) ||
      app.positionOfInterest?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleView = (app) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApp(null);
  };

  const handleApplicationLoaded = useCallback((data) => {
    if (!data?.id) return;
    // Sync list row with latest API details (e.g. isRead)
    setAllApplications((prev) =>
      prev.map((app) => (app.id === data.id ? { ...app, ...data } : app))
    );
  }, []);

  const handleStatusMenuClick = (appId, e) => {
    if (openDropdownId === appId) {
      setOpenDropdownId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const DROPDOWN_HEIGHT = 272; // approx: header ~36px + 4 status items ~46px + separator + delete btn ~50px
    const DROPDOWN_WIDTH = 192; // w-48
    const GAP = 4;

    // Flip upward if not enough space below
    const spaceBelow = window.innerHeight - rect.bottom;
    const flipUp = spaceBelow < DROPDOWN_HEIGHT && rect.top >= DROPDOWN_HEIGHT;

    // Align right edge of dropdown with right edge of button;
    // if that would overflow left, clamp so it stays 8px from left edge
    let right = window.innerWidth - rect.right;
    if (rect.right - DROPDOWN_WIDTH < 8) {
      right = window.innerWidth - Math.min(rect.right, window.innerWidth - 8) - DROPDOWN_WIDTH;
      right = Math.max(right, 8);
    }

    setDropdownPos({
      // fixed is viewport-relative; getBoundingClientRect() is also viewport-relative
      // — do NOT add window.scrollY here
      top: flipUp ? rect.top - DROPDOWN_HEIGHT - GAP : rect.bottom + GAP,
      right,
      flipUp,
    });
    setOpenDropdownId(appId);
  };

  const handleStatusOptionClick = (app, newStatus) => {
    setStatusTarget({ app, newStatus });
    setAdminNotes('');
    setShowStatusModal(true);
    setOpenDropdownId(null);
  };

  const handleStatusUpdate = async () => {
    if (!statusTarget.app) return;
    setIsUpdating(true);
    try {
      await axiosInstance.patch(`/api/admin/job-applications/${statusTarget.app.id}/status`, {
        status: statusTarget.newStatus,
        ...(adminNotes.trim() ? { adminNotes: adminNotes.trim() } : {}),
      });
      setAllApplications((prev) =>
        prev.map((a) =>
          a.id === statusTarget.app.id ? { ...a, status: statusTarget.newStatus } : a
        )
      );
      setShowStatusModal(false);
      setStatusTarget({ app: null, newStatus: '' });
      setAdminNotes('');
    } catch {
      // silently fail — user can retry
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setStatusTarget({ app: null, newStatus: '' });
    setAdminNotes('');
  };

  const handleDeleteClick = (app) => {
    setDeleteTarget(app);
    setShowDeleteModal(true);
    setOpenDropdownId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await axiosInstance.delete(`/api/admin/job-applications/${deleteTarget.id}`);
      setAllApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setShowDeleteModal(false);
      setDeleteTarget(null);
      // Refresh stats so counts update immediately
      fetchStats();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || 'Failed to delete application. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setDeleteError(null);
  };

  const handleExportXL = () => {
    if (filtered.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Position', 'Status', 'Applied Date'];
    const rows = filtered.map((app) => [
      app.fullName || '',
      app.email || '',
      app.phoneNumber || '',
      app.positionOfInterest || '',
      app.status || '',
      app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : '',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['PENDING'];
    const Icon = cfg.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        <Icon className="h-3 w-3" />
        {cfg.label}
      </span>
    );
  };

  // Stat card counts from stats
  const statsCards = [
    {
      label: 'Total Applications',
      value: stats?.total ?? 0,
      icon: Briefcase,
      color: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      label: 'Pending',
      value: stats?.byStatus?.pending?.count ?? 0,
      icon: Clock,
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      label: 'Reviewed',
      value: stats?.byStatus?.reviewed?.count ?? 0,
      icon: Eye,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Shortlisted',
      value: stats?.byStatus?.shortlisted?.count ?? 0,
      icon: Star,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Rejected',
      value: stats?.byStatus?.rejected?.count ?? 0,
      icon: XCircle,
      color: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      label: 'Unread',
      value: stats?.unread ?? 0,
      icon: Mail,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  const filterTabs = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Reviewed', value: 'REVIEWED' },
    { label: 'Shortlisted', value: 'SHORTLISTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="p-3 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Jobs Application
          </h1>
          <p className="mt-2 text-base text-gray-600">Manage and review all job applications</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-16">
          <Loading message="Loading Applications" submessage="Fetching job applications..." size="medium" />
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base text-gray-600">{card.label}</p>
                      <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`rounded-lg p-2 ${card.color}`}>
                      <Icon className={`h-5 w-5 ${card.iconColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Filter */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
            {/* Search + Export row */}
            <div className="mb-3 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleExportXL}
                disabled={filtered.length === 0}
                title="Export to Excel / CSV"
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export XL</span>
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleFilterChange(tab.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all ${filterStatus === tab.value
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'
                    }`}
                >
                  {tab.label}
                  {tab.value !== 'ALL' && stats?.byStatus?.[tab.value.toLowerCase()]?.count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${filterStatus === tab.value
                          ? 'bg-white/25 text-white'
                          : 'bg-gray-100 text-gray-500'
                        }`}
                    >
                      {stats.byStatus[tab.value.toLowerCase()].count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Briefcase className="mb-3 h-12 w-12 text-gray-300" />
                <p className="text-sm font-medium">No applications found</p>
                <p className="mt-1 text-xs text-gray-400">
                  {searchTerm || filterStatus !== 'ALL'
                    ? 'Try adjusting your search or filter'
                    : 'No job applications have been submitted yet'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-175 text-base">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          Applicant
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          Applied Date
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          CV
                        </th>
                        <th className="px-4 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {currentItems.map((app) => (
                        <tr
                          key={app.id}
                          className={`transition-colors hover:bg-gray-50 ${!app.isRead ? 'bg-teal-50/30' : ''}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-teal-700">
                                {app.fullName?.charAt(0)?.toUpperCase() || 'A'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{app.fullName}</p>
                                {!app.isRead && (
                                  <span className="text-base font-medium text-teal-600">New</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-0.5">
                              <p className="flex items-center gap-1 text-base text-gray-600">
                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                {app.email}
                              </p>
                              <p className="flex items-center gap-1 text-base text-gray-600">
                                <Phone className="h-3.5 w-3.5 text-gray-400" />
                                {app.phoneNumber}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-base font-medium text-indigo-700">
                              <Briefcase className="h-3 w-3" />
                              {app.positionOfInterest}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 text-base text-gray-600">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              {formatDate(app.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                          <td className="px-4 py-3">
                            {app.cvUrl ? (
                              <a
                                href={app.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-base font-medium whitespace-nowrap text-teal-700 transition-all hover:bg-teal-100"
                              >
                                <Download className="h-3 w-3" />
                                Download CV
                              </a>
                            ) : (
                              <span className="text-base text-gray-400">No CV</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* View button */}
                              <button
                                onClick={() => handleView(app)}
                                className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-base font-medium text-gray-600 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </button>

                              {/* 3-dot status dropdown */}
                              <button
                                onClick={(e) => handleStatusMenuClick(app.id, e)}
                                className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                                title="Change Status"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      totalItems={filtered.length}
                      compact
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Backdrop + fixed dropdown portal */}
      {openDropdownId && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
          <div
            className="fixed z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
            style={{
              top: dropdownPos.top,
              right: dropdownPos.right,
              maxHeight: 'calc(100vh - 16px)',
              overflowY: 'auto',
            }}
          >
            <p className="border-b border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Change Status
            </p>
            {['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'].map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              const currentApp = allApplications.find((a) => a.id === openDropdownId);
              const isCurrent = currentApp?.status === s;
              return (
                <button
                  key={s}
                  onClick={() => currentApp && handleStatusOptionClick(currentApp, s)}
                  disabled={isCurrent}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-medium transition-colors ${isCurrent ? 'cursor-default bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                  {isCurrent && <span className="text-xs text-gray-400">Current</span>}
                </button>
              );
            })}
            {/* Delete option */}
            <div className="border-t border-gray-100">
              <button
                onClick={() => {
                  const currentApp = allApplications.find((a) => a.id === openDropdownId);
                  if (currentApp) handleDeleteClick(currentApp);
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Application
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <DeleteApplicationModal
          application={deleteTarget}
          isDeleting={isDeleting}
          deleteError={deleteError}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Status Update Confirmation Modal */}
      {showStatusModal && statusTarget.app && (
        <StatusUpdateModal
          application={statusTarget.app}
          newStatus={statusTarget.newStatus}
          adminNotes={adminNotes}
          isUpdating={isUpdating}
          getStatusBadge={getStatusBadge}
          onAdminNotesChange={setAdminNotes}
          onClose={handleCloseStatusModal}
          onConfirm={handleStatusUpdate}
        />
      )}

      {/* View Modal */}
      {showModal && selectedApp && (
        <ViewApplicationModal
          applicationId={selectedApp.id}
          getStatusBadge={getStatusBadge}
          formatDate={formatDate}
          onClose={handleCloseModal}
          onLoaded={handleApplicationLoaded}
        />
      )}
    </div>
  );
};

export default JobApplicationsManagement;
