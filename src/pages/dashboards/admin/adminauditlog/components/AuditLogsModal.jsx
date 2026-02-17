import React, { useEffect } from 'react';
import { X, User, Package, Calendar, FileText } from 'lucide-react';

const AuditLogsModal = ({ log, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!log) return null;

    const getActionBadge = (action) => {
        const styles = {
            CREATE_DELIVERY: 'bg-green-100 text-green-700',
            UPDATE_DELIVERY: 'bg-blue-100 text-blue-700',
            CANCEL_DELIVERY: 'bg-red-100 text-red-700',
            ALLOCATE_DELIVERY: 'bg-purple-100 text-purple-700',
            COMPLETE_DELIVERY: 'bg-teal-100 text-teal-700',
            DEFAULT: 'bg-gray-100 text-gray-700',
        };
        return styles[action] || styles.DEFAULT;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div
                className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3">
                                <h3 className="text-xl font-bold text-gray-900">Audit Log #{log.id}</h3>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getActionBadge(log.action)}`}
                                >
                                    {log.action.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <p className="mt-1 text-base text-gray-600">{log.description}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-6 p-6">
                    {/* Metadata */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="rounded-lg bg-gray-50 p-4">
                            <div className="mb-2 flex items-center space-x-2 text-gray-500">
                                <User className="h-5 w-5" />
                                <h4 className="text-base font-semibold">User Information</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="text-base font-medium text-gray-900">
                                    {log.user?.fullName || 'System'}
                                </div>
                                <div className="text-base text-gray-600">{log.user?.email || '-'}</div>
                                <div className="text-base text-gray-500">Role: {log.user?.role || '-'}</div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4">
                            <div className="mb-2 flex items-center space-x-2 text-gray-500">
                                <Calendar className="h-5 w-5" />
                                <h4 className="text-base font-semibold">Timestamp</h4>
                            </div>
                            <div className="space-y-1">
                                <div className="text-base font-medium text-gray-900">
                                    {new Date(log.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </div>
                                <div className="text-base text-gray-600">
                                    {new Date(log.createdAt).toLocaleTimeString('en-GB')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    {log.delivery && (
                        <div className="rounded-lg bg-teal-50 p-4">
                            <div className="mb-3 flex items-center space-x-2 text-teal-700">
                                <Package className="h-5 w-5" />
                                <h4 className="text-base font-semibold">Delivery Information</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-base">
                                <div>
                                    <div className="text-base text-teal-600">SPO Number</div>
                                    <div className="font-medium text-gray-900">
                                        {log.delivery.spoNumber || `#${log.delivery.id}`}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-base text-teal-600">Status</div>
                                    <div className="font-medium text-gray-900">{log.delivery.status}</div>
                                </div>
                                {log.delivery.deliveryAddress && (
                                    <div className="col-span-2">
                                        <div className="text-base text-teal-600">Address</div>
                                        <div className="font-medium text-gray-900">{log.delivery.deliveryAddress}</div>
                                    </div>
                                )}
                                {log.delivery.deliveryDate && (
                                    <div className="col-span-2">
                                        <div className="text-base text-teal-600">Delivery Date</div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(log.delivery.deliveryDate).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    {log.reason && (
                        <div className="rounded-lg bg-amber-50 p-4">
                            <div className="mb-2 flex items-center space-x-2 text-amber-700">
                                <FileText className="h-5 w-5" />
                                <h4 className="text-base font-semibold">Reason</h4>
                            </div>
                            <p className="text-base text-gray-700">{log.reason}</p>
                        </div>
                    )}

                    {/* Before Data */}
                    {log.beforeData && (
                        <div>
                            <h4 className="mb-2 flex items-center space-x-2 text-base font-semibold text-gray-700">
                                <FileText className="h-4 w-4" />
                                <span>Before Data</span>
                            </h4>
                            <pre className="max-h-64 overflow-auto rounded-lg bg-gray-900 p-4 text-base text-green-400 shadow-inner">
                                {JSON.stringify(log.beforeData, null, 2)}
                            </pre>
                        </div>
                    )}


                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-teal-600 px-6 py-2.5 text-base font-medium text-white transition-colors hover:bg-teal-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogsModal;
