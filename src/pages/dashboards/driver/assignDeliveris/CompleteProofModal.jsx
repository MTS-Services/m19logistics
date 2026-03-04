import React, { useEffect } from 'react';
import { X, Camera, PenTool } from 'lucide-react';
import { toast } from 'react-toastify';
import { getToken } from '../../../../utils/storage';

const CompleteProofModal = ({
    isOpen,
    selectedDelivery,
    completionData,
    photoPreview,
    canvasRef,
    fileInputRef,
    onPhotoChange,
    onCompletionDataChange,
    onClose,
    onSuccess,
    onStartDrawing,
    onDraw,
    onStopDrawing,
    onClearSignature,
    onSaveSignature,
    initializeCanvas,
}) => {
    const submitCompletion = async () => {
        if (!completionData.photo) {
            toast.error('Please upload a delivery photo');
            return;
        }
        if (!completionData.signature) {
            toast.error('Please provide a signature');
            return;
        }

        try {
            // Create FormData with signature and photo
            const formData = new FormData();

            // Convert signature (base64) to blob
            const signatureBase64 = completionData.signature;
            const signatureBlob = await fetch(signatureBase64).then(res => res.blob());
            formData.append('signature', signatureBlob, 'signature.png');

            // Add photo file
            formData.append('photo', completionData.photo);

            // Add other data
            formData.append('receivedBy', completionData.receivedBy);
            formData.append('driverNotes', completionData.driverNotes);

            // Call API to upload proof
            const token = getToken();
            const response = await fetch(
                `/api/driver/deliveries/${selectedDelivery.id}/upload-proof`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful:', result);

                // Show success toast from backend
                toast.success(result.message || 'Proof uploaded successfully');

                // Call onSuccess callback with response data
                onSuccess(result.data);

                // Reset modal data
                onCompletionDataChange({
                    photo: null,
                    signature: null,
                    receivedBy: '',
                    driverNotes: '',
                });
            } else {
                // Try to parse error message, fallback if not JSON
                let errorMessage = 'Failed to upload proof';
                try {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } catch {
                    // Response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                console.error('Upload failed:', response.status, errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error uploading proof:', error);
            toast.error('Error uploading proof. Please try again.');
        }
    };

    useEffect(() => {
        if (isOpen && canvasRef.current) {
            // Set canvas dimensions only once when modal opens
            // Setting width/height attributes in JSX causes canvas to clear on re-render
            canvasRef.current.width = 600;
            canvasRef.current.height = 200;

            // Initialize canvas
            initializeCanvas();
        }
    }, [isOpen, canvasRef, initializeCanvas]);

    if (!isOpen) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
            <div className="mx-auto my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Complete Delivery</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <p className="mb-6 text-sm text-gray-600">
                    SPO: <span className="font-semibold">{selectedDelivery?.spoNumber}</span>
                </p>

                <div className="space-y-6">
                    {/* Photo Upload */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Delivery Photo <span className="text-red-600">*</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onPhotoChange}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                            >
                                <Camera className="h-4 w-4" />
                                Upload Photo
                            </button>
                            {photoPreview && (
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="h-20 w-20 rounded-md border border-gray-200 object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* Signature Canvas */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Customer Signature <span className="text-red-600">*</span>
                        </label>
                        <div className="rounded-md border-2 border-gray-300 bg-white overflow-hidden">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={onStartDrawing}
                                onMouseMove={onDraw}
                                onMouseUp={onStopDrawing}
                                onMouseLeave={onStopDrawing}
                                className="w-full cursor-crosshair block"
                                style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
                            />
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button
                                type="button"
                                onClick={onClearSignature}
                                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 transition-all hover:bg-gray-50"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={onSaveSignature}
                                className="rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-3 py-1 text-sm text-white transition-all hover:from-teal-700 hover:to-teal-600"
                            >
                                <PenTool className="inline h-3 w-3" /> Save Signature
                            </button>
                        </div>
                    </div>

                    {/* Driver Notes */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Driver Notes / Feedback
                        </label>
                        <textarea
                            value={completionData.driverNotes}
                            onChange={(e) =>
                                onCompletionDataChange({ ...completionData, driverNotes: e.target.value })
                            }
                            rows={4}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            placeholder="Any additional notes or feedback..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submitCompletion}
                        className="flex-1 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                    >
                        upload proof
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteProofModal;
