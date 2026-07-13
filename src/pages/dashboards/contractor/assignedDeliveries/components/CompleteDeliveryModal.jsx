import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';
import { toast } from 'react-toastify';

const CompleteDeliveryModal = ({ isOpen, delivery, onClose, onConfirm }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setSubmitting(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const point = e.touches?.[0] || e;
      return {
        x: (point.clientX - rect.left) * scaleX,
        y: (point.clientY - rect.top) * scaleY,
      };
    };

    const start = (e) => {
      e.preventDefault();
      isDrawingRef.current = true;
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const move = (e) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stop = () => {
      isDrawingRef.current = false;
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', stop, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mousemove', move);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchmove', move);
      canvas.removeEventListener('touchend', stop);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5000000) {
      toast.error('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(file);
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const isCanvasBlank = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const empty = document.createElement('canvas');
    empty.width = canvas.width;
    empty.height = canvas.height;
    const emptyCtx = empty.getContext('2d');
    emptyCtx.fillStyle = '#FFFFFF';
    emptyCtx.fillRect(0, 0, empty.width, empty.height);
    return canvas.toDataURL('image/png') === empty.toDataURL('image/png');
  };

  const handleSubmit = () => {
    if (!photo) {
      toast.error('Please upload a delivery photo');
      return;
    }
    if (isCanvasBlank()) {
      toast.error('Please provide a signature');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onConfirm(delivery.id);
      setSubmitting(false);
      resetForm();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Complete Delivery</h2>
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

        <p className="mb-6 text-base text-gray-600">
          SPO: <span className="font-semibold">{delivery?.spoNumber}</span>
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Delivery Photo <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Customer Signature <span className="text-red-600">*</span>
            </label>
            <div className="overflow-hidden rounded-md border-2 border-gray-300 bg-white">
              <canvas
                ref={canvasRef}
                className="block w-full cursor-crosshair"
                style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
              />
            </div>
            <button
              type="button"
              onClick={clearSignature}
              className="mt-2 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex-1 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md ${
              submitting ? 'cursor-not-allowed opacity-70' : 'hover:from-teal-700 hover:to-teal-600'
            }`}
          >
            {submitting ? 'Uploading...' : 'Upload Proof'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteDeliveryModal;
