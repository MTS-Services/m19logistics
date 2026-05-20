import React from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  User,
  Weight,
  Loader2,
} from 'lucide-react';

const DeliveriesList = ({ loading, deliveries, handleViewDelivery, handleEditDelivery, handleCancelDelivery, getStatusColor }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
        <span className="text-gray-600">Loading deliveries...</span>
      </div>
    );
  }

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-xl font-semibold text-gray-900">No deliveries found</h3>
        <p className="mb-6 text-gray-600">Get started by requesting your first delivery</p>
      </div>
    );
  }

  return (
    <>
      {deliveries.map((delivery) => (
        <div key={delivery.id || delivery._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-base font-bold text-gray-900 sm:text-lg">{delivery.spoNumber}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold sm:px-3 sm:py-1 ${getStatusColor(delivery.status)}`}>{delivery.status}</span>
                </div>

                <div className="flex gap-1.5 lg:hidden">
                  <button onClick={() => handleViewDelivery(delivery)} className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2 text-teal-600 transition-colors hover:bg-teal-100" title="View Details">
                    <Eye className="h-4 w-4" />
                  </button>
                  {(delivery.status === 'RECEIVED' || delivery.status === 'ALLOCATED') && (
                    <>
                      <button onClick={() => handleEditDelivery(delivery)} className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2 text-teal-600 transition-colors hover:bg-teal-100" title="Edit Delivery">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleCancelDelivery(delivery)} className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100" title="Cancel Delivery">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.deliveryDate ? new Date(delivery.deliveryDate).toLocaleDateString('en-GB') : '—'} - {delivery.timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <User className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Weight className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-sm font-semibold text-gray-900">{delivery.weight}kg</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:flex-col lg:gap-2 lg:border-l lg:border-gray-100 lg:pl-4">
              <button onClick={() => handleViewDelivery(delivery)} className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2.5 text-teal-600 transition-colors hover:bg-teal-100" title="View Details">
                <Eye className="h-5 w-5" />
              </button>
              {(delivery.status === 'RECEIVED' || delivery.status === 'ALLOCATED') && (
                <>
                  <button onClick={() => handleEditDelivery(delivery)} className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-teal-50 p-2.5 text-teal-600 transition-colors hover:bg-teal-100" title="Edit Delivery">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleCancelDelivery(delivery)} className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100" title="Cancel Delivery">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DeliveriesList;
