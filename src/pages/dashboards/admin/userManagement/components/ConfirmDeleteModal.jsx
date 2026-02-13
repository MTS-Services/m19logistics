import React from 'react';
import { X, Loader2 } from 'lucide-react';

const ConfirmDeleteModal = ({ user, onCancel, onConfirm, isDeleting = false }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && !isDeleting && onCancel()}>
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between">
                <h2 className="text-xl font-bold">Confirm Delete</h2>
                <button onClick={onCancel} disabled={isDeleting}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
                <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete <b>{user?.name}</b>? This action is permanent.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                    <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-2">
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>Delete</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ConfirmDeleteModal;
