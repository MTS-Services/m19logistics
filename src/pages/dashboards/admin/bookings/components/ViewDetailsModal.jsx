
import React from 'react';
import { X, User, Phone, MapPin, Calendar, Weight, Truck } from 'lucide-react';

const ViewDetailsModal = ({ delivery, onClose, formatDate, formatCurrency, getStatusColor }) => {
  if (!delivery) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl rounded-lg bg-white shadow-xl flex flex-col overflow-hidden">

        {/* Modal Header - Fixed at top */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
            <p className="mt-1 text-base text-gray-600">{delivery.spoNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-base font-semibold ${getStatusColor(delivery.status)}`}
              >
                {delivery.status}
              </span>
            </div>

            {/* Customer Information */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900 border-b border-gray-200 pb-2">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-base text-gray-500 uppercase">Customer</p>
                    <p className="font-medium text-gray-900">{delivery.customer}</p>
                  </div>
                </div>
                {delivery.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Phone</p>
                      <p className="font-medium text-gray-900">{delivery.phone}</p>
                    </div>
                  </div>
                )}
                {delivery.contact && (
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Contact Person</p>
                      <p className="font-medium text-gray-900">{delivery.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900 border-b border-gray-200 pb-2">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="text-base text-gray-500 uppercase">Address</p>
                    <p className="font-medium text-gray-900">{delivery.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Scheduled Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(delivery.deliveryDate)} - {delivery.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Weight className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Weight</p>
                      <p className="font-medium text-gray-900">{delivery.weight}</p>
                    </div>
                  </div>
                </div>
                {delivery.driver && (
                  <div className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Assigned Driver</p>
                      <p className="font-medium text-gray-900">{delivery.driver}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Information */}
            <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
              <h3 className="text-base font-semibold text-teal-900 uppercase">Total Cost</h3>
              <p className="text-3xl font-bold text-teal-600">
                £{formatCurrency(delivery.cost)}
              </p>
            </div>

            {/* Delivery Completed Info */}
            {delivery.deliveredAt && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-900">Delivery Status</h3>
                <p className="text-base text-green-700 font-medium">
                  Delivered at: {delivery.deliveredAt}
                </p>
                {delivery.receivedBy && (
                  <p className="text-base text-green-700">
                    Received by: {delivery.receivedBy}
                  </p>
                )}
              </div>
            )}

            {/* Cancellation Info */}
            {delivery.cancelReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-2 font-semibold text-red-900 font-medium">Cancellation Details</h3>
                <p className="text-base text-red-700">{delivery.cancelReason}</p>
                {delivery.cancelledAt && (
                  <p className="mt-1 text-base text-red-500">
                    Cancelled at: {delivery.cancelledAt}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer - Fixed at bottom */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 p-4 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsModal;