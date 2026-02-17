import React from 'react';
import { XCircle } from 'lucide-react';

const AuditLogsModal = ({ selectedLog, isViewLoading, formatDateTime, formatDate, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Activity Details</h3>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                            <XCircle className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-4">
                    {isViewLoading ? (
                        <div className="py-12 text-center">
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-teal-600"></div>
                            <p className="mt-4 text-sm text-gray-600">Loading details...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div>
                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    Basic Information
                                </h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Action</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {selectedLog.action || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600">Timestamp</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {formatDateTime(selectedLog.createdAt)}
                                        </p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium text-gray-600">Description</label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {selectedLog.description || 'N/A'}
                                        </p>
                                    </div>
                                    {selectedLog.reason && (
                                        <div className="sm:col-span-2">
                                            <label className="text-xs font-medium text-gray-600">Reason</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedLog.reason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Info */}
                            {selectedLog.delivery && (
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                        Delivery Information
                                    </h4>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600">Delivery ID</label>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    #{selectedLog.deliveryId}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600">Status</label>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {selectedLog.delivery.status || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="text-xs font-medium text-gray-600">Address</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {selectedLog.delivery.deliveryAddress || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600">Delivery Date</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    {formatDate(selectedLog.delivery.deliveryDate)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* After Data (if available) */}
                            {selectedLog.afterData && (
                                <div>
                                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
                                        Updated Data
                                    </h4>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {selectedLog.afterData.spoNumber && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">SPO Number</label>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                                        {selectedLog.afterData.spoNumber}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLog.afterData.weight && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Weight</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedLog.afterData.weight} kg
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLog.afterData.status && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Status</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedLog.afterData.status}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLog.afterData.totalPrice && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Total Price</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        £{selectedLog.afterData.totalPrice}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLog.afterData.customerName && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">Customer Name</label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedLog.afterData.customerName}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedLog.afterData.customerPhone && (
                                                <div>
                                                    <label className="text-xs font-medium text-gray-600">
                                                        Customer Phone
                                                    </label>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {selectedLog.afterData.customerPhone}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-teal-700 hover:to-teal-600 sm:w-auto"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogsModal;
