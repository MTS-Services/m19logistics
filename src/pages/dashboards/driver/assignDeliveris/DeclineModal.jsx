import React from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { respondToDelivery } from '../../../../services/driverService';

const DeclineModal = ({
    isOpen,
    selectedDelivery,
    declineReason,
    onDeclineReasonChange,
    onClose,
    onSuccess
}) => {
    const handleConfirmDecline = async () => {
        if (!declineReason.trim()) {
            toast.error('Please provide a reason for declining');
            return;
        }
        try {
            const response = await respondToDelivery(selectedDelivery.id, 'reject', declineReason);
            if (response && response.success) {
                toast.success(`Delivery ${selectedDelivery.spoNumber} declined`);
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error declining delivery:', error);
            toast.error('Failed to decline delivery');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Decline Delivery</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                    SPO: <span className="font-semibold">{selectedDelivery?.spoNumber}</span>
                </p>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Reason for Declining <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        value={declineReason}
                        onChange={(e) => onDeclineReasonChange(e.target.value)}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                        placeholder="Enter reason for declining this delivery..."
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDecline}
                        className="flex-1 rounded-md bg-linear-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-red-700 hover:to-red-600"
                    >
                        Confirm Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeclineModal;
