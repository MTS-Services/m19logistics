import React, { useState, useEffect } from 'react';
import {
    Mail,
    Phone,
    MessageSquare,
    Search,
    Filter,
    Eye,
    Trash2,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    Calendar,
    Loader2,
    Building2,
    FileText,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import { getAllEnquiries, markEnquiryAsRead, deleteEnquiry } from '../../../../services/contactService';
import ViewEnquiryModal from './components/ViewEnquiryModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const EnquiriesManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 5;

    // Fetch enquiries from API
    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (filterStatus === 'read') params.isRead = true;
            if (filterStatus === 'unread') params.isRead = false;

            const response = await getAllEnquiries(params);

            if (response.success) {
                setEnquiries(response.data || []);
            } else {
                setError('Failed to fetch enquiries');
            }
        } catch (err) {
            console.error('Error fetching enquiries:', err);
            setError(err.response?.data?.message || 'An error occurred while fetching enquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    // Filter enquiries based on search
    const filteredEnquiries = enquiries.filter((enquiry) => {
        const matchesSearch =
            enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phoneNumber.includes(searchTerm) ||
            enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (enquiry.companyName && enquiry.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle filter change
    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setCurrentPage(1);
    };

    // Handle search change
    const handleSearchChange = (query) => {
        setSearchTerm(query);
        setCurrentPage(1);
    };

    // Handle view enquiry (only opens modal)
    const handleViewEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowViewModal(true);
    };

    // Handle mark as read (separate action)
    const handleMarkAsRead = async (enquiry) => {
        if (!enquiry || enquiry.isRead) return;
        try {
            await markEnquiryAsRead(enquiry.id);
            setEnquiries((prev) => prev.map((e) => (e.id === enquiry.id ? { ...e, isRead: true } : e)));
            toast.success('Enquiry marked as read');
        } catch (err) {
            console.error('Error marking as read:', err);
            toast.error(err.response?.data?.message || 'Failed to mark as read');
        }
    };

    // Handle delete enquiry
    const handleDeleteEnquiry = (enquiry) => {
        setSelectedEnquiry(enquiry);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteEnquiry(selectedEnquiry.id);
            toast.success('Enquiry deleted successfully');

            // Remove from local state
            setEnquiries((prev) => prev.filter((e) => e.id !== selectedEnquiry.id));

            setShowDeleteModal(false);
            setSelectedEnquiry(null);
        } catch (err) {
            console.error('Error deleting enquiry:', err);
            toast.error(err.response?.data?.message || 'Failed to delete enquiry');
        } finally {
            setIsDeleting(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Stats
    const totalEnquiries = enquiries.length;
    const unreadEnquiries = enquiries.filter((e) => !e.isRead).length;
    const readEnquiries = enquiries.filter((e) => e.isRead).length;

    return (
        <div className="p-2 sm:p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                                Enquiry Submissions
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                View and manage customer enquiry submissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                        <span className="ml-2 text-gray-600">Loading enquiries...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start">
                            <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-red-600" />
                            <div>
                                <h3 className="text-base font-semibold text-red-900">Error Loading Enquiries</h3>
                                <p className="mt-1 text-base text-red-700">{error}</p>
                                <button
                                    onClick={fetchEnquiries}
                                    className="mt-3 rounded bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* Stats Overview */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Enquiries</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalEnquiries}</p>
                                    </div>
                                    <FileText className="h-10 w-10 text-teal-600" />
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Unread</p>
                                        <p className="text-2xl font-bold text-orange-600">{unreadEnquiries}</p>
                                    </div>
                                    <Mail className="h-10 w-10 text-orange-600" />
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Read</p>
                                        <p className="text-2xl font-bold text-green-600">{readEnquiries}</p>
                                    </div>
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:space-y-0">
                            {/* Search */}
                            <div className="relative flex-1 md:max-w-md">
                                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone, subject, or message..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-gray-400" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="all">All Enquiries</option>
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                </select>
                            </div>
                        </div>

                        {/* Enquiries List */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-bold text-gray-900">Enquiry Submissions</h2>
                            </div>

                            {filteredEnquiries.length === 0 ? (
                                <div className="p-12 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No enquiries found</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Try adjusting your search or filter criteria
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden overflow-x-auto lg:block">
                                        <table className="w-full">
                                            <thead className="border-b border-gray-200 bg-gray-50">
                                                <tr>
                                                   
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Name
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Company
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Phone
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Subject
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Date
                                                    </th>
                                                     <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {paginatedEnquiries.map((enquiry) => (
                                                    <tr
                                                        key={enquiry.id}
                                                        className={`transition-colors hover:bg-gray-50 ${!enquiry.isRead ? 'bg-blue-50/50' : ''
                                                            }`}
                                                    >
                                                        
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                                                <User className="h-4 w-4 text-gray-400" />
                                                                <span>{enquiry.fullName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-3 w-3 text-gray-400" />
                                                                <span>{enquiry.companyName || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 break-words">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-3 w-3 text-gray-400" />
                                                                <span>{enquiry.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                <span>{enquiry.phoneNumber}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="line-clamp-2 max-w-xs text-sm text-gray-700">
                                                                {enquiry.subject}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                {formatDate(enquiry.createdAt)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {enquiry.isRead ? (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Read
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                                                                    <Clock className="h-3 w-3" />
                                                                    Unread
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleViewEnquiry(enquiry)}
                                                                    className="rounded-lg border border-teal-300 bg-teal-50 p-2 text-teal-700 transition-all hover:bg-teal-100"
                                                                    title="View"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </button>

                                                                {!enquiry.isRead && (
                                                                    <button
                                                                        onClick={() => handleMarkAsRead(enquiry)}
                                                                        className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-amber-700 transition-all hover:bg-amber-100"
                                                                        title="Mark as Read"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => handleDeleteEnquiry(enquiry)}
                                                                    className="rounded-lg border border-red-300 bg-red-50 p-2 text-red-700 transition-all hover:bg-red-100"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="divide-y divide-gray-200 lg:hidden">
                                        {paginatedEnquiries.map((enquiry) => (
                                            <div
                                                key={enquiry.id}
                                                className={`p-4 transition-colors ${!enquiry.isRead ? 'bg-blue-50/50' : ''
                                                    }`}
                                            >
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                        <span className="font-semibold text-gray-900">
                                                            {enquiry.fullName}
                                                        </span>
                                                    </div>
                                                    {enquiry.isRead ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                                                            <CheckCircle className="h-3 w-3" />
                                                            Read
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
                                                            <Clock className="h-3 w-3" />
                                                            Unread
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 text-sm">
                                                    {enquiry.companyName && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <Building2 className="h-4 w-4 text-gray-400" />
                                                            <span>{enquiry.companyName}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span>{enquiry.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span>{enquiry.phoneNumber}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-gray-700">
                                                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                                        <p className="line-clamp-2 font-medium">{enquiry.subject}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-xs">{formatDate(enquiry.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex gap-2 border-t border-gray-200 pt-3">
                                                    <button
                                                        onClick={() => handleViewEnquiry(enquiry)}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </button>
                                                    {!enquiry.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(enquiry)}
                                                            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-all hover:bg-amber-100"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                            Read
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteEnquiry(enquiry)}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Pagination */}
                            {filteredEnquiries.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredEnquiries.length}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* Modals */}
                {showViewModal && selectedEnquiry && (
                    <ViewEnquiryModal
                        enquiry={selectedEnquiry}
                        onClose={() => {
                            setShowViewModal(false);
                            setSelectedEnquiry(null);
                        }}
                    />
                )}

                {showDeleteModal && selectedEnquiry && (
                    <DeleteConfirmModal
                        enquiry={selectedEnquiry}
                        isDeleting={isDeleting}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedEnquiry(null);
                        }}
                        onConfirm={confirmDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default EnquiriesManagement;
