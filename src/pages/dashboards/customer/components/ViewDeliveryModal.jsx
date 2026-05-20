import React from 'react';
import { XCircle, AlertCircle, Loader2 } from 'lucide-react';

const ViewDeliveryModal = ({ isOpen, delivery, isLoading, onClose, getStatusColor }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">Delivery Details</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2">
            <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-3 p-12">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-gray-600">Loading delivery details...</span>
          </div>
        ) : delivery ? (
          <div className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4">
              <div>
                <p className="text-sm text-gray-600">SPO Number</p>
                <p className="text-xl font-bold text-gray-900">{delivery.spoNumber}</p>
              </div>
              <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getStatusColor(delivery.status)}`}>
                {delivery.status}
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-3 text-base font-bold text-gray-900">Delivery Information</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-600">Delivery Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString('en-GB') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Time Slot</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.timeSlot}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Weight</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.weight}kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Distance from Depot</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.distanceFromDepot} miles</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs text-gray-600">Delivery Address</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Customer Name</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Customer Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.customerPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Requested By</p>
                  <p className="text-sm font-semibold text-gray-900">{delivery.requestedBy || '—'}</p>
                </div>
              </div>

              {delivery.specialInstructions && (
                <div className="mt-3 rounded-lg bg-teal-50 p-3">
                  <p className="text-xs font-semibold text-gray-700">Special Instructions</p>
                  <p className="mt-1 text-sm text-gray-900">{delivery.specialInstructions}</p>
                </div>
              )}
            </div>

            {delivery.customer && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h3 className="mb-3 text-base font-bold text-gray-900">Customer Account</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-600">Full Name</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.customer.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.customer.phone}</p>
                  </div>
                  {delivery.customer.customerProfile?.depotAddress && (
                    <div>
                      <p className="text-xs text-gray-600">Depot Address</p>
                      <p className="text-sm font-semibold text-gray-900">{delivery.customer.customerProfile.depotAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
              <h3 className="mb-3 text-base font-bold text-gray-900">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-semibold text-gray-900">£{parseFloat(delivery.calculatedBasePrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance Surcharge</span>
                  <span className="font-semibold text-gray-900">£{parseFloat(delivery.distanceSurcharge || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">£{parseFloat(delivery.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <span className="font-semibold text-gray-900">£{parseFloat(delivery.vatAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-teal-300 pt-2">
                  <span className="font-bold text-gray-900">Total Price</span>
                  <span className="text-lg font-bold text-teal-600">£{parseFloat(delivery.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {delivery.driver && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-3 text-base font-bold text-gray-900">Driver</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900"><span className="font-semibold">Name:</span> {delivery.driver.fullName || delivery.driver.name || '—'}</p>
                  {delivery.acceptedAt && (
                    <p className="text-sm text-gray-900"><span className="font-semibold">Accepted At:</span> {new Date(delivery.acceptedAt).toLocaleString('en-GB')}</p>
                  )}
                </div>
              </div>
            )}

            {delivery.deliveredAt && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-3 text-base font-bold text-gray-900">Delivery Complete</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900"><span className="font-semibold">Delivered At:</span> {new Date(delivery.deliveredAt).toLocaleString('en-GB')}</p>
                  {delivery.receivedBy && (
                    <p className="text-sm text-gray-900"><span className="font-semibold">Received By:</span> {delivery.receivedBy}</p>
                  )}
                  {delivery.signatureUrl && (
                    <p className="text-sm"><a href={delivery.signatureUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline hover:text-green-800">View Signature</a></p>
                  )}
                  {delivery.photoUrl && (
                    <p className="text-sm"><a href={delivery.photoUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline hover:text-green-800">View Photo</a></p>
                  )}
                </div>
              </div>
            )}

            {delivery.cancelledAt && (
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
                <h3 className="mb-3 text-base font-bold text-gray-900">Cancelled</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900"><span className="font-semibold">Cancelled At:</span> {new Date(delivery.cancelledAt).toLocaleDateString('en-GB')}</p>
                  {delivery.cancelledBy && (
                    <p className="text-sm text-gray-900"><span className="font-semibold">Cancelled By:</span> {delivery.cancelledBy}</p>
                  )}
                  {delivery.cancellationReason && (
                    <p className="text-sm text-gray-900"><span className="font-semibold">Reason:</span> {delivery.cancellationReason}</p>
                  )}
                </div>
              </div>
            )}

            {delivery.rejectedAt && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <h3 className="mb-3 text-base font-bold text-gray-900">Rejected</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900"><span className="font-semibold">Rejected At:</span> {new Date(delivery.rejectedAt).toLocaleString('en-GB')}</p>
                  {delivery.rejectionReason && (
                    <p className="text-sm text-gray-900"><span className="font-semibold">Reason:</span> {delivery.rejectionReason}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">No delivery details available</p>
          </div>
        )}

        <div className="sticky bottom-0 z-10 flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4">
          <button onClick={onClose} className="w-full rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 sm:text-base">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewDeliveryModal;
