import React from 'react';
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ contact, isDeleting, onCancel, onConfirm }) => (
    <div
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel?.();
        }}
    >
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
                <button
                    onClick={onCancel}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
                <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-red-100 p-3">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                </div>

                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                    Delete Contact Message
                </h3>
                <p className="mb-4 text-center text-sm text-gray-600">
                    Are you sure you want to delete this contact message from{' '}
                    <strong>{contact.name}</strong>? This action cannot be undone.
                </p>

                {/* Contact Summary */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium text-gray-900">{contact.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium text-gray-900">{contact.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium text-gray-900">{contact.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-amber-50 p-3">
                    <p className="text-xs text-amber-800">
                        <strong>Warning:</strong> Once deleted, this contact message cannot be recovered.
                    </p>
                </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
                <button
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Deleting...</span>
                        </>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Message</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
);

export default DeleteConfirmModal;
