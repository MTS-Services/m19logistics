import React from 'react';
import { X } from 'lucide-react';

const ResetPasswordModal = ({ user, onCancel, onConfirm }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onCancel()}>
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-lg font-bold">Reset Password</h2>
                <button onClick={onCancel}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 text-center">
                <p className="mb-6">Send password reset link to <b>{user?.email}</b>?</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Send Link</button>
                </div>
            </div>
        </div>
    </div>
);

export default ResetPasswordModal;
