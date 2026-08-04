import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { completeDelivery, submitDeliveryFeedback } from '../../../../services/driverService';

const FinalCompleteModal = ({
  isOpen,
  selectedDelivery,
  proofUploadResponse,
  finalCompletionData,
  onFinalCompletionDataChange,
  onClose,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const submitFinalCompletion = async () => {
    if (!finalCompletionData.receivedBy?.trim()) {
      toast.error('Please enter who received the delivery');
      return;
    }

    setSubmitting(true);
    try {
      const result = await completeDelivery(
        selectedDelivery.id,
        finalCompletionData.receivedBy.trim()
      );
      console.log('Delivery completed:', result);

      const comments = finalCompletionData.comments?.trim() || '';
      if (comments) {
        const feedbackPayload = {
          comments,
          name: finalCompletionData.receivedBy.trim(),
        };
        console.log('Delivery feedback payload:', feedbackPayload);
        const feedbackResult = await submitDeliveryFeedback(selectedDelivery.id, feedbackPayload);
        console.log('Delivery feedback response:', feedbackResult);
      }

      toast.success(result.message || 'Delivery completed successfully');
      onSuccess();
      onFinalCompletionDataChange({
        receivedBy: '',
        comments: '',
      });
    } catch (error) {
      console.error('Error completing delivery:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete delivery';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Complete Delivery</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-base text-gray-600">
          SPO: <span className="font-semibold">{selectedDelivery?.spoNumber}</span>
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Signature URL</label>
            <input
              type="text"
              value={proofUploadResponse?.signatureUrl || ''}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Photo URLs</label>
            {(proofUploadResponse?.photoUrls || []).length > 0 ? (
              <div className="space-y-2">
                {(proofUploadResponse.photoUrls || []).map((url, index) => (
                  <div key={`${url}-${index}`} className="flex items-start gap-3">
                    <img
                      src={url}
                      alt={`Proof ${index + 1}`}
                      className="h-16 w-16 shrink-0 rounded-md border border-gray-200 object-cover"
                    />
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={proofUploadResponse?.photoUrl || ''}
                readOnly
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              />
            )}
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">
              Received By <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={finalCompletionData.receivedBy || ''}
              onChange={(e) =>
                onFinalCompletionDataChange({
                  ...finalCompletionData,
                  receivedBy: e.target.value,
                })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter name of person who received delivery"
            />
          </div>

          <div>
            <label className="mb-2 block text-base font-medium text-gray-700">Comments</label>
            <textarea
              value={finalCompletionData.comments || ''}
              onChange={(e) =>
                onFinalCompletionDataChange({
                  ...finalCompletionData,
                  comments: e.target.value,
                })
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              placeholder="Enter feedback comments (optional)"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all ${
              submitting ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitFinalCompletion}
            disabled={submitting}
            className={`flex-1 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all ${
              submitting ? 'cursor-not-allowed opacity-70' : 'hover:from-teal-700 hover:to-teal-600'
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-teal-200" />
                <span>Completing...</span>
              </div>
            ) : (
              'Complete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalCompleteModal;
