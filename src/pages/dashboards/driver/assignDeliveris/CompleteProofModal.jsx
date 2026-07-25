import React, { useEffect, useState } from 'react';
import { X, Camera, Trash2, ImagePlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadDeliveryProof } from '../../../../services/driverService';

const MAX_PHOTOS = 10;

const CompleteProofModal = ({
  isOpen,
  selectedDelivery,
  completionData,
  canvasRef,
  fileInputRef,
  onPhotoChange,
  onRemovePhoto,
  onCompletionDataChange,
  onClose,
  onSuccess,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClearSignature,
  initializeCanvas,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const photos = completionData.photos || [];

  const openMultiPhotoPicker = async () => {
    if (photos.length >= MAX_PHOTOS) {
      toast.error(`You can upload up to ${MAX_PHOTOS} photos`);
      return;
    }

    if (typeof window.showOpenFilePicker === 'function') {
      try {
        const handles = await window.showOpenFilePicker({
          multiple: true,
          excludeAcceptAllOption: false,
          types: [
            {
              description: 'Images',
              accept: {
                'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
              },
            },
          ],
        });

        const files = await Promise.all(handles.map((handle) => handle.getFile()));
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        onPhotoChange({ target: { files: dt.files, value: '' } });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
        console.error('showOpenFilePicker failed, falling back to input:', error);
      }
    }

    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.dataTransfer.files?.length) return;
    onPhotoChange({ target: { files: e.dataTransfer.files, value: '' } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const submitCompletion = async () => {
    if (!photos.length) {
      toast.error('Please upload at least one delivery photo');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error('Please provide a signature');
      return;
    }

    const signatureData = canvas.toDataURL('image/png');

    const emptyCanvas = document.createElement('canvas');
    emptyCanvas.width = canvas.width;
    emptyCanvas.height = canvas.height;
    const emptyCtx = emptyCanvas.getContext('2d');
    emptyCtx.fillStyle = '#FFFFFF';
    emptyCtx.fillRect(0, 0, emptyCanvas.width, emptyCanvas.height);

    if (signatureData === emptyCanvas.toDataURL('image/png')) {
      toast.error('Please provide a signature');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      const signatureBlob = await fetch(signatureData).then((res) => res.blob());
      formData.append(
        'signature',
        new File([signatureBlob], 'signature.png', { type: 'image/png' })
      );

      // Build files array
      const photoFiles = photos.map((item, index) => {
        const file = item.file;
        if (file instanceof File) return file;
        return new File([file], file?.name || `photo-${index + 1}.jpg`, {
          type: file?.type || 'image/jpeg',
        });
      });

      // Multer expects field name "photo" (NOT "photoUrls")
      // photoUrls is only the RESPONSE field after upload
      // Same key repeated → backend receives photo as File[]
      photoFiles.forEach((file) => {
        formData.append('photo', file);
      });

      formData.append('receivedBy', completionData.receivedBy || '');
      formData.append('driverNotes', completionData.driverNotes || '');

      // Console: show as ARRAY
      console.log('Sending payload:', {
        signature: 'signature.png',
        photo: photoFiles, // File[] — multer field name
        photoCount: photoFiles.length,
        photoNames: photoFiles.map((f) => f.name),
        receivedBy: completionData.receivedBy || '',
        driverNotes: completionData.driverNotes || '',
      });
      console.log('photo isArray?', Array.isArray(photoFiles));

      const result = await uploadDeliveryProof(selectedDelivery.id, formData);

      console.log('Upload proof backend response (full):', result);
      console.log('Upload proof backend response data:', result?.data);
      console.log('photoUrls from backend:', result?.data?.photoUrls);
      console.log('signatureUrl from backend:', result?.data?.signatureUrl);

      toast.success(result.message || 'Proof uploaded successfully');
      onSuccess(result.data);

      onCompletionDataChange({
        photos: [],
        signature: null,
        receivedBy: '',
        driverNotes: '',
      });
    } catch (error) {
      console.error('Error uploading proof:', error);
      console.error('Backend error response:', error.response?.data);
      const isTimeout = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const errorMessage = isTimeout
        ? 'Upload timed out. Please try fewer/smaller images or check your connection.'
        : error.response?.data?.message ||
          error.message ||
          'Error uploading proof. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      canvasRef.current.width = 600;
      canvasRef.current.height = 200;
      initializeCanvas();
    }
  }, [isOpen, canvasRef, initializeCanvas]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Sticky Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Delivery</h2>
            <p className="mt-1 text-sm text-gray-600">
              SPO: <span className="font-semibold">{selectedDelivery?.spoNumber}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`rounded-lg p-2 text-gray-400 transition-colors ${
              submitting ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-100 hover:text-gray-600'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-700">
                  Delivery Photos <span className="text-red-600">*</span>
                </p>
                <span className="text-xs text-gray-500">
                  {photos.length}/{MAX_PHOTOS} uploaded
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp"
                multiple
                onChange={onPhotoChange}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`rounded-lg border-2 border-dashed p-6 text-center ${
                  photos.length >= MAX_PHOTOS
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-teal-300 bg-teal-50/50'
                }`}
              >
                <ImagePlus className="mx-auto h-10 w-10 text-teal-600" />
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Select multiple images together
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Or drag & drop multiple images here
                </p>

                <button
                  type="button"
                  onClick={openMultiPhotoPicker}
                  disabled={photos.length >= MAX_PHOTOS}
                  className={`mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm ${
                    photos.length >= MAX_PHOTOS
                      ? 'cursor-not-allowed opacity-60'
                      : 'hover:bg-teal-700'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  {photos.length ? 'Add More Photos' : 'Select Multiple Photos'}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Max {MAX_PHOTOS} images · Max 5MB each
              </p>

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {photos.map((photo, index) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.preview}
                        alt={`Delivery photo ${index + 1}`}
                        className="h-24 w-full rounded-md border border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => onRemovePhoto(photo.id)}
                        className="absolute top-2 right-2 rounded-md bg-white/95 p-1.5 text-red-600 shadow-sm hover:bg-red-50"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <p className="mt-1 truncate text-[11px] text-gray-500">
                        {photo.file?.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Customer Signature <span className="text-red-600">*</span>
              </label>
              <div className="overflow-hidden rounded-md border-2 border-gray-300 bg-white">
                <canvas
                  ref={canvasRef}
                  onMouseDown={onStartDrawing}
                  onMouseMove={onDraw}
                  onMouseUp={onStopDrawing}
                  onMouseLeave={onStopDrawing}
                  className="block w-full cursor-crosshair"
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
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex shrink-0 gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitCompletion}
            disabled={submitting}
            className={`flex-1 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all ${
              submitting ? 'cursor-not-allowed opacity-70' : 'hover:from-teal-700 hover:to-teal-600'
            }`}
          >
            {submitting ? (
              <div className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-teal-200" />
                <span>Uploading...</span>
              </div>
            ) : (
              'Upload Proof'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProofModal;
