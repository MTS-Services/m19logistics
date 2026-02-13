import React from 'react';
import { X, Trash2, Loader2, Star } from 'lucide-react';

const DeleteConfirmModal = ({ driver, isDeleting, onCancel, onConfirm }) => (
    <div
        className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancel?.();
        }}
    >
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
                <button onClick={onCancel} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6">
                <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">Delete Driver</h3>
                <p className="mb-4 text-center text-sm text-gray-600">Are you sure you want to delete <strong>{driver.name}</strong>? This action cannot be undone and will remove all driver data.</p>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-600">Username:</span><span className="font-medium text-gray-900">@{driver.username}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Email:</span><span className="font-medium text-gray-900">{driver.email}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Total Deliveries:</span><span className="font-medium text-gray-900">{driver.totalDeliveries}</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Rating:</span><span className="flex items-center gap-1 font-medium text-gray-900"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{driver.rating}</span></div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                    <button onClick={onCancel} disabled={isDeleting} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">Cancel</button>
                    <button onClick={onConfirm} disabled={isDeleting} className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        <span>{isDeleting ? 'Deleting...' : 'Delete Driver'}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default DeleteConfirmModal;
