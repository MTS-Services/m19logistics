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
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../../components/Pagination';
import { getAllContacts, markContactAsRead, deleteContact } from '../../../../services/contactService';
import ViewContactModal from './components/ViewContactModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const ContactsManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 5;

    // Fetch contacts from API
    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {};
            if (filterStatus === 'read') params.isRead = true;
            if (filterStatus === 'unread') params.isRead = false;

            const response = await getAllContacts(params);

            if (response.success) {
                setContacts(response.data || []);
            } else {
                setError('Failed to fetch contacts');
            }
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setError(err.response?.data?.message || 'An error occurred while fetching contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    // Filter contacts based on search
    const filteredContacts = contacts.filter((contact) => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.phone.includes(searchTerm) ||
            contact.message.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

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

    // Handle view contact (only opens modal)
    const handleViewContact = (contact) => {
        setSelectedContact(contact);
        setShowViewModal(true);
    };

    // Handle mark as read (separate action)
    const handleMarkAsRead = async (contact) => {
        if (!contact || contact.isRead) return;
        try {
            await markContactAsRead(contact.id);
            setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c)));
            toast.success('Contact marked as read');
        } catch (err) {
            console.error('Error marking as read:', err);
            toast.error(err.response?.data?.message || 'Failed to mark as read');
        }
    };

    // Handle delete contact
    const handleDeleteContact = (contact) => {
        setSelectedContact(contact);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteContact(selectedContact.id);
            toast.success('Contact deleted successfully');

            // Remove from local state
            setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));

            setShowDeleteModal(false);
            setSelectedContact(null);
        } catch (err) {
            console.error('Error deleting contact:', err);
            toast.error(err.response?.data?.message || 'Failed to delete contact');
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
    const totalContacts = contacts.length;
    const unreadContacts = contacts.filter((c) => !c.isRead).length;
    const readContacts = contacts.filter((c) => c.isRead).length;

    return (
        <div className="p-2 sm:p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                                Contact Messages
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                View and manage customer contact submissions
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                        <span className="ml-2 text-gray-600">Loading contacts...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start">
                            <AlertCircle className="mr-3 h-5 w-5 shrink-0 text-red-600" />
                            <div>
                                <h3 className="text-base font-semibold text-red-900">Error Loading Contacts</h3>
                                <p className="mt-1 text-base text-red-700">{error}</p>
                                <button
                                    onClick={fetchContacts}
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
                                        <p className="text-sm text-gray-600">Total Messages</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
                                    </div>
                                    <MessageSquare className="h-10 w-10 text-teal-600" />
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Unread</p>
                                        <p className="text-2xl font-bold text-orange-600">{unreadContacts}</p>
                                    </div>
                                    <Mail className="h-10 w-10 text-orange-600" />
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Read</p>
                                        <p className="text-2xl font-bold text-green-600">{readContacts}</p>
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
                                    placeholder="Search by name, email, phone, or message..."
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
                                    <option value="all">All Messages</option>
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                </select>
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                                <h2 className="text-lg font-bold text-gray-900">Contact Submissions</h2>
                            </div>

                            {filteredContacts.length === 0 ? (
                                <div className="p-12 text-center">
                                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No contacts found</h3>
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
                                                        Email
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Phone
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {paginatedContacts.map((contact) => (
                                                    <tr
                                                        key={contact.id}
                                                        className={`transition-colors hover:bg-gray-50 ${!contact.isRead ? 'bg-blue-50/50' : ''
                                                            }`}
                                                    >
                                                       
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2 font-semibold text-gray-900">
                                                                <User className="h-4 w-4 text-gray-400" />
                                                                <span>{contact.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 break-words">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-3 w-3 text-gray-400" />
                                                                <span>{contact.email}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                <span>{contact.phone}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {contact.isRead ? (
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                {formatDate(contact.createdAt)}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleViewContact(contact)}
                                                                    className="rounded-lg border border-teal-300 bg-teal-50 p-2 text-teal-700 transition-all hover:bg-teal-100"
                                                                    title="View"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </button>

                                                                {!contact.isRead && (
                                                                    <button
                                                                        onClick={() => handleMarkAsRead(contact)}
                                                                        className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-amber-700 transition-all hover:bg-amber-100"
                                                                        title="Mark as Read"
                                                                    >
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => handleDeleteContact(contact)}
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
                                        {paginatedContacts.map((contact) => (
                                            <div
                                                key={contact.id}
                                                className={`p-4 transition-colors ${!contact.isRead ? 'bg-blue-50/50' : ''
                                                    }`}
                                            >
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                        <span className="font-semibold text-gray-900">{contact.name}</span>
                                                    </div>
                                                    {contact.isRead ? (
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
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span>{contact.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span>{contact.phone}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-gray-700">
                                                        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                                        <p className="line-clamp-2">{contact.message}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-xs">{formatDate(contact.createdAt)}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex gap-2 border-t border-gray-200 pt-3">
                                                    <button
                                                        onClick={() => handleViewContact(contact)}
                                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteContact(contact)}
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
                            {filteredContacts.length > 0 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={filteredContacts.length}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* Modals */}
                {showViewModal && selectedContact && (
                    <ViewContactModal
                        contact={selectedContact}
                        onClose={() => {
                            setShowViewModal(false);
                            setSelectedContact(null);
                        }}
                    />
                )}

                {showDeleteModal && selectedContact && (
                    <DeleteConfirmModal
                        contact={selectedContact}
                        isDeleting={isDeleting}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setSelectedContact(null);
                        }}
                        onConfirm={confirmDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default ContactsManagement;
