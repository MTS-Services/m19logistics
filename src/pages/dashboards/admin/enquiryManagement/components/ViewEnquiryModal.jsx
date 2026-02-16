import React from 'react';
import { X, User, Building2, Mail, Phone, FileText, MessageSquare, Calendar } from 'lucide-react';

const ViewEnquiryModal = ({ enquiry, onClose }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User className="h-4 w-4 text-teal-600" />
                                Full Name
                            </label>
                            <p className="text-base text-gray-900">{enquiry.fullName}</p>
                        </div>

                        {/* Company Name */}
                        {enquiry.companyName && (
                            <div>
                                <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Building2 className="h-4 w-4 text-teal-600" />
                                    Company Name
                                </label>
                                <p className="text-base text-gray-900">{enquiry.companyName}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Mail className="h-4 w-4 text-teal-600" />
                                Email
                            </label>
                            <a
                                href={`mailto:${enquiry.email}`}
                                className="text-base text-teal-600 hover:underline"
                            >
                                {enquiry.email}
                            </a>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Phone className="h-4 w-4 text-teal-600" />
                                Phone Number
                            </label>
                            <a
                                href={`tel:${enquiry.phoneNumber}`}
                                className="text-base text-teal-600 hover:underline"
                            >
                                {enquiry.phoneNumber}
                            </a>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="h-4 w-4 text-teal-600" />
                                Subject
                            </label>
                            <p className="text-base text-gray-900">{enquiry.subject}</p>
                        </div>

                        {/* Message */}
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <MessageSquare className="h-4 w-4 text-teal-600" />
                                Message
                            </label>
                            <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-base text-gray-900">
                                {enquiry.message}
                            </p>
                        </div>

                        {/* Submitted Date */}
                        <div>
                            <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Calendar className="h-4 w-4 text-teal-600" />
                                Submitted On
                            </label>
                            <p className="text-base text-gray-900">{formatDate(enquiry.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                    <a
                        href={`mailto:${enquiry.email}?subject=Re: ${encodeURIComponent(enquiry.subject)}`}
                        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                    >
                        Reply via Email
                    </a>
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewEnquiryModal;
