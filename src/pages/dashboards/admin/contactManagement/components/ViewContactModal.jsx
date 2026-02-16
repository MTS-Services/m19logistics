import React from 'react';
import { X, Mail, Phone, MessageSquare, User, Calendar, CheckCircle, Clock } from 'lucide-react';

const ViewContactModal = ({ contact, onClose }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900">Contact Message</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="max-h-[70vh] overflow-y-auto p-6">
                    {/* Status Badge */}
                    <div className="mb-4">
                        {contact.isRead ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                Read
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800">
                                <Clock className="h-4 w-4" />
                                Unread
                            </span>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-600">
                                <User className="h-4 w-4" />
                                Name
                            </label>
                            <p className="text-base font-semibold text-gray-900">{contact.name}</p>
                        </div>

                        {/* Contact Details */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </label>
                                <p className="break-all text-base font-medium text-gray-900">{contact.email}</p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    Phone
                                </label>
                                <p className="text-base font-medium text-gray-900">{contact.phone}</p>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
                                <MessageSquare className="h-4 w-4" />
                                Message
                            </label>
                            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-900">
                                {contact.message}
                            </p>
                        </div>

                        {/* Date */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-600">
                                <Calendar className="h-4 w-4" />
                                Submitted On
                            </label>
                            <p className="text-base font-medium text-gray-900">{formatDate(contact.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
                    >
                        <Mail className="h-4 w-4" />
                        Reply via Email
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ViewContactModal;
