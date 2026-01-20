import React, { useState, useRef } from 'react';
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  Navigation,
  CheckCircle,
  XCircle,
  Camera,
  PenTool,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AssignedDeliveries = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      spoNumber: 'SPO013349',
      customerName: 'Topps Chester',
      customerPhone: '01244398888',
      depotAddress: '84 Acton Hall Walks, Wrexham, LL12 7YJ',
      deliveryAddress: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
      date: '2026-01-16',
      timeSlot: 'AM',
      instructions: 'Please call before arrival',
      status: 'Assigned',
    },
    {
      id: 2,
      spoNumber: 'SPO013350',
      customerName: 'Topps Newcastle',
      customerPhone: '01782717000',
      depotAddress: '84 Acton Hall Walks, Wrexham, LL12 7YJ',
      deliveryAddress: 'Unit 4, Lyme Court, Newcastle, ST5 3TF',
      date: '2026-01-16',
      timeSlot: 'PM',
      instructions: 'Deliver to rear entrance',
      status: 'Assigned',
    },
  ]);

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [completionData, setCompletionData] = useState({
    photo: null,
    signature: null,
    receivedBy: '',
    driverNotes: '',
  });

  // Handle Accept Delivery
  const handleAccept = (delivery) => {
    setDeliveries(deliveries.map((d) => (d.id === delivery.id ? { ...d, status: 'Accepted' } : d)));
    toast.success(`Delivery ${delivery.spoNumber} accepted`);
  };

  // Handle Decline Delivery
  const handleDecline = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDeclineModal(true);
  };

  const confirmDecline = () => {
    if (!declineReason.trim()) {
      toast.error('Please provide a reason for declining');
      return;
    }
    setDeliveries(deliveries.filter((d) => d.id !== selectedDelivery.id));
    toast.success(`Delivery ${selectedDelivery.spoNumber} declined`);
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
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL();
    setCompletionData({ ...completionData, signature: signatureData });
  };

  // Submit completion
  const submitCompletion = () => {
    if (!completionData.photo) {
      toast.error('Please upload a delivery photo');
      return;
    }
    if (!completionData.signature) {
      toast.error('Please provide a signature');
      return;
    }
    if (!completionData.receivedBy.trim()) {
      toast.error('Please enter who received the delivery');
      return;
    }

    setDeliveries(deliveries.filter((d) => d.id !== selectedDelivery.id));
    toast.success(`Delivery ${selectedDelivery.spoNumber} marked as completed`);

    // Reset
    setShowCompleteModal(false);
    setSelectedDelivery(null);
    setPhotoPreview(null);
    setCompletionData({
      photo: null,
      signature: null,
      receivedBy: '',
      driverNotes: '',
    });
  };

  // Handle navigate
  const handleNavigate = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    toast.success('Opening navigation...');
  };

  // Handle call
  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
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
          {deliveries.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No assigned deliveries</h3>
              <p className="mt-2 text-sm text-gray-600">
                You currently have no deliveries assigned
              </p>
            </div>
          ) : (
            deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Delivery Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-teal-50 p-3">
                        <Package className="h-6 w-6 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            SPO: {delivery.spoNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                              delivery.status === 'Accepted'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {delivery.status}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{delivery.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <a
                              href={`tel:${delivery.customerPhone}`}
                              className="font-medium text-teal-600 hover:text-teal-700"
                            >
                              {delivery.customerPhone}
                            </a>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Depot:</p>
                              <p>{delivery.depotAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Delivery:</p>
                              <p>{delivery.deliveryAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {delivery.date} - {delivery.timeSlot}
                            </span>
                          </div>
                          {delivery.instructions && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span className="italic">{delivery.instructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:ml-6 lg:min-w-[180px]">
                    <button
                      onClick={() => handleNavigate(delivery.deliveryAddress)}
                      className="flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                    >
                      <Navigation className="h-4 w-4" />
                      Navigate
                    </button>
                    <button
                      onClick={() => handleCall(delivery.customerPhone)}
                      className="flex items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </button>
                    {delivery.status === 'Assigned' ? (
                      <>
                        <button
                          onClick={() => handleAccept(delivery)}
                          className="flex items-center justify-center gap-2 rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
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
            ))
          )}
        </div>

        {/* Decline Modal */}
        {showDeclineModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Decline Delivery</h2>
                <button
                  onClick={() => setShowDeclineModal(false)}
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
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  placeholder="Enter reason for declining this delivery..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeclineModal(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDecline}
                  className="flex-1 rounded-md bg-linear-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-red-700 hover:to-red-600"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Complete Delivery Modal */}
        {showCompleteModal && (
          <div className="bg-opacity-50 fixed inset-0 z-50 overflow-y-auto bg-black p-4">
            <div className="mx-auto my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Complete Delivery</h2>
                <button
                  onClick={() => setShowCompleteModal(false)}
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
                      onChange={handlePhotoChange}
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
                  <div className="rounded-md border-2 border-gray-300">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={200}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full cursor-crosshair rounded-md bg-gray-50"
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={clearSignature}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={saveSignature}
                      className="rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-3 py-1 text-sm text-white transition-all hover:from-teal-700 hover:to-teal-600"
                    >
                      <PenTool className="inline h-3 w-3" /> Save Signature
                    </button>
                  </div>
                </div>

                {/* Received By */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Received By <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={completionData.receivedBy}
                    onChange={(e) =>
                      setCompletionData({ ...completionData, receivedBy: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Enter name of person who received delivery"
                  />
                </div>

                {/* Driver Notes */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Driver Notes / Feedback
                  </label>
                  <textarea
                    value={completionData.driverNotes}
                    onChange={(e) =>
                      setCompletionData({ ...completionData, driverNotes: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                    placeholder="Any additional notes or feedback..."
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCompletion}
                  className="flex-1 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  Complete Delivery
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedDeliveries;
