import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getDriverDeliveries, respondToDelivery } from '../../../../services/driverService';
import Pagination from '../../../../components/Pagination';
import Loading from '../../../../components/Loading';
import DeclineModal from './DeclineModal';
import CompleteProofModal from './CompleteProofModal';
import FinalCompleteModal from './FinalCompleteModal';

const AssignedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showFinalCompleteModal, setShowFinalCompleteModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [proofUploadResponse, setProofUploadResponse] = useState(null);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [completionData, setCompletionData] = useState({
    photo: null,
    signature: null,
    receivedBy: '',
    driverNotes: '',
  });

  const [finalCompletionData, setFinalCompletionData] = useState({
    receivedBy: '',
  });

  // Fetch all ALLOCATED deliveries on component mount
  useEffect(() => {
    let isMounted = true;

    const loadAssignedDeliveries = async () => {
      setLoading(true);
      try {
        const response = await getDriverDeliveries('ALLOCATED');
        if (!isMounted) return;

        if (response && response.success && response.data) {
          // Normalize API fields to the UI shape
          const normalized = response.data.map((d) => ({
            id: d.id,
            spoNumber: d.spoNumber,
            customerName: d.customerName || (d.customer && d.customer.fullName) || '',
            customerPhone: d.customerPhone || (d.customer && d.customer.phone) || '',
            depotAddress:
              (d.customer &&
                d.customer.customerProfile &&
                d.customer.customerProfile.depotAddress) ||
              '',
            deliveryAddress: d.deliveryAddress || '',
            date: d.deliveryDate ? new Date(d.deliveryDate).toISOString().split('T')[0] : '',
            timeSlot: d.timeSlot || '',
            instructions: d.specialInstructions || '',
            status: d.status === 'ALLOCATED' ? 'Assigned' : d.status,
            acceptedAt: d.acceptedAt || null,
          }));

          setDeliveries(normalized);
        }
      } catch (error) {
        console.error('Error loading assigned deliveries:', error);
        if (isMounted) {
          toast.error('Failed to load assigned deliveries');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAssignedDeliveries();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Accept Delivery
  const handleAccept = async (delivery) => {
    setAcceptingId(delivery.id);
    try {
      const response = await respondToDelivery(delivery.id, 'accept');
      if (response && response.success) {
        setDeliveries(
          deliveries.map((d) =>
            d.id === delivery.id
              ? { ...d, status: 'Accepted', acceptedAt: response.data?.acceptedAt || new Date().toISOString() }
              : d
          )
        );
        toast.success(`Delivery ${delivery.spoNumber} accepted`);
      }
    } catch (error) {
      console.error('Error accepting delivery:', error);
      toast.error('Failed to accept delivery');
    } finally {
      setAcceptingId(null);
    }
  };

  // Handle Decline Delivery
  const handleDecline = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeclineModal(true);
  };

  const handleDeclineSuccess = () => {
    setDeliveries(deliveries.filter((d) => d.id !== selectedDelivery.id));
    setShowDeclineModal(false);
    setDeclineReason('');
    setSelectedDelivery(null);
  };

  // Handle Complete Delivery
  const handleComplete = (delivery) => {
    setSelectedDelivery(delivery);
    setShowCompleteModal(true);
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setCompletionData({ ...completionData, photo: file });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle signature canvas
  const getCanvasPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate scale factors to fix position mismatch
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    // Handle touch events (mobile/tablet)
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    // Handle mouse events (desktop)
    else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate correct position with scaling
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();

    setIsDrawing(true);
    isDrawingRef.current = true;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasPosition(e);

    // Set drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getCanvasPosition(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log('Signature cleared');
  };

  // Initialize canvas when modal opens
  useEffect(() => {
    if (showCompleteModal && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      console.log('Canvas initialized with white background');

      // Native touch event handlers with passive: false
      const handleTouchStart = (e) => {
        console.log('Touch start detected');
        e.preventDefault();
        isDrawingRef.current = true;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        console.log('Touch position:', { x, y });

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const handleTouchMove = (e) => {
        if (!isDrawingRef.current) return;

        console.log('Touch move');
        e.preventDefault();

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        ctx.lineTo(x, y);
        ctx.stroke();
      };

      const handleTouchEnd = (e) => {
        console.log('Touch end');
        if (isDrawingRef.current) {
          e.preventDefault();
        }
        isDrawingRef.current = false;
      };

      // Add native listeners with passive: false
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

      // Cleanup
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [showCompleteModal]);

  // Submit completion
  const handleProofUploadSuccess = (responseData) => {
    // Store the response data (signatureUrl and photoUrl)
    setProofUploadResponse(responseData);

    // Close first modal and open second modal
    setShowCompleteModal(false);
    setShowFinalCompleteModal(true);

    // Reset first modal data
    setPhotoPreview(null);
  };

  const handleFinalCompleteSuccess = () => {
    // Remove delivery from list
    setDeliveries(deliveries.filter((d) => d.id !== selectedDelivery.id));

    // Reset and close modal
    setShowFinalCompleteModal(false);
    setSelectedDelivery(null);
    setProofUploadResponse(null);
  };

  // Initialize canvas callback - wrapped to prevent unnecessary re-renders
  const initializeCanvasCallback = useCallback(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      console.log('Canvas initialized with white background');

      // Native touch event handlers with passive: false
      const handleTouchStart = (e) => {
        console.log('Touch start detected');
        e.preventDefault();
        isDrawingRef.current = true;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        console.log('Touch position:', { x, y });

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
      };

      const handleTouchMove = (e) => {
        if (!isDrawingRef.current) return;

        console.log('Touch move');
        e.preventDefault();

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        ctx.lineTo(x, y);
        ctx.stroke();
      };

      const handleTouchEnd = (e) => {
        console.log('Touch end');
        if (isDrawingRef.current) {
          e.preventDefault();
        }
        isDrawingRef.current = false;
      };

      // Add native listeners with passive: false
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    }
  }, []);

  // Handle call
  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Assigned Deliveries
          </h1>
          <p className="mt-2 text-gray-600">
            View and manage your assigned deliveries ({deliveries.length})
          </p>
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          {loading ? (
            <Loading message="Loading Deliveries" submessage="Fetching your assigned deliveries..." size="medium" />
          ) : deliveries.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No assigned deliveries</h3>
              <p className="mt-2 text-sm text-gray-600">
                You currently have no deliveries assigned
              </p>
            </div>
          ) : (
            <>
              {deliveries
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((delivery) => (
                  <div
                    key={delivery.id}
                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      {/* Delivery Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <div className="rounded-lg bg-teal-50 p-3 shrink-0">
                            <Package className="h-6 w-6 text-teal-600" />
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <h3 className="text-lg font-bold text-gray-900">
                                SPO: {delivery.spoNumber}
                              </h3>
                              <span
                                className={`w-fit inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${delivery.status === 'Accepted'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-blue-100 text-blue-600'
                                  }`}
                              >
                                {delivery.status}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4 shrink-0" />
                                <span className="font-medium">{delivery.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 shrink-0" />
                                <a
                                  href={`tel:${delivery.customerPhone}`}
                                  className="font-medium text-teal-600 hover:text-teal-700"
                                >
                                  {delivery.customerPhone}
                                </a>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">Depot:</p>
                                  <p>{delivery.depotAddress}</p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">Delivery:</p>
                                  <p>{delivery.deliveryAddress}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span>
                                  {delivery.date} - {delivery.timeSlot}
                                </span>
                              </div>
                              {delivery.instructions && (
                                <div className="flex flex-col sm:flex-row sm:items-start gap-2 text-sm text-gray-600">
                                  <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                                  <span className="italic">{delivery.instructions}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:ml-6 lg:min-w-45">
                        <button
                          onClick={() => handleCall(delivery.customerPhone)}
                          className="flex items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </button>
                        {!delivery.acceptedAt ? (
                          <>
                            <button
                              onClick={() => handleAccept(delivery)}
                              disabled={acceptingId === delivery.id}
                              className={`flex items-center justify-center gap-2 rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all ${acceptingId === delivery.id ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-100'}`}
                            >
                              {acceptingId === delivery.id ? (
                                <>
                                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-green-600" />
                                  <span>Accepting...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Accept
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDecline(delivery)}
                              className="flex items-center justify-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
                            >
                              <XCircle className="h-4 w-4" />
                              Decline
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleComplete(delivery)}
                            className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-green-600 to-green-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-green-700 hover:to-green-600"
                          >
                            <Check className="h-4 w-4" />
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(deliveries.length / itemsPerPage)}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={deliveries.length}
              />
            </>
          )}
        </div>

        {/* Modals */}
        <DeclineModal
          isOpen={showDeclineModal}
          selectedDelivery={selectedDelivery}
          declineReason={declineReason}
          onDeclineReasonChange={setDeclineReason}
          onClose={() => {
            setShowDeclineModal(false);
            setDeclineReason('');
            setSelectedDelivery(null);
          }}
          onSuccess={handleDeclineSuccess}
        />

        <CompleteProofModal
          isOpen={showCompleteModal}
          selectedDelivery={selectedDelivery}
          completionData={completionData}
          photoPreview={photoPreview}
          canvasRef={canvasRef}
          fileInputRef={fileInputRef}
          onPhotoChange={handlePhotoChange}
          onCompletionDataChange={setCompletionData}
          onClose={() => {
            setShowCompleteModal(false);
            setPhotoPreview(null);
            setCompletionData({
              photo: null,
              signature: null,
              receivedBy: '',
              driverNotes: '',
            });
          }}
          onSuccess={handleProofUploadSuccess}
          onStartDrawing={startDrawing}
          onDraw={draw}
          onStopDrawing={stopDrawing}
          onClearSignature={clearSignature}
          initializeCanvas={initializeCanvasCallback}
        />

        <FinalCompleteModal
          isOpen={showFinalCompleteModal}
          selectedDelivery={selectedDelivery}
          proofUploadResponse={proofUploadResponse}
          finalCompletionData={finalCompletionData}
          onFinalCompletionDataChange={setFinalCompletionData}
          onClose={() => {
            setShowFinalCompleteModal(false);
          }}
          onSuccess={handleFinalCompleteSuccess}
        />
      </div>
    </div>
  );
};

export default AssignedDeliveries;
