import React, { useState } from 'react';
import {
  Package,
  CheckCircle,
  Search,
  MapPin,
  Calendar,
  FileText,
  User,
  Phone,
  X,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';
import { dummyCompletedDeliveries, formatMoney, formatDate } from './contractorDummyData';

const ContractorCompletedDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredDeliveries = dummyCompletedDeliveries.filter(
    (delivery) =>
      delivery.spoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8" >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Completed Deliveries</h1>
        <p className="mt-2 text-gray-600">
          View your delivery history ({dummyCompletedDeliveries.length} completed) — dummy data
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by SPO, customer name, or address..."
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDeliveries.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No completed deliveries found</h3>
            <p className="mt-2 text-sm text-gray-600">
              {searchQuery ? 'Try adjusting your search' : 'Your completed deliveries will appear here'}
            </p>
          </div>
        ) : (
          <>
            {filteredDeliveries
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((delivery) => (
                <div
                  key={delivery.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 gap-4">
                      <div className="rounded-lg bg-green-50 p-3 shrink-0">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            SPO: {delivery.spoNumber}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                          <span className="text-sm font-semibold text-teal-700">
                            {formatMoney(delivery.amount)}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{delivery.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{delivery.customerPhone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{delivery.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(delivery.date)} · {delivery.timeSlot}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-medium text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Completed: {delivery.completedAt}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto lg:ml-6 lg:min-w-45">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(delivery)}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-teal-700 hover:to-teal-600"
                      >
                        <FileText className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredDeliveries.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredDeliveries.length}
            />
          </>
        )}
      </div>

      {showDetailModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[75vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">SPO</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.spoNumber}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Amount</dt>
                  <dd className="mt-1 font-medium text-gray-900">
                    {formatMoney(selectedDelivery.amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Customer</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.customerName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Phone</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.customerPhone}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Address</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.deliveryAddress}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Completed</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.completedAt}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Received By</dt>
                  <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.receivedBy}</dd>
                </div>
                {selectedDelivery.driverNotes && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Notes</dt>
                    <dd className="mt-1 font-medium text-gray-900">{selectedDelivery.driverNotes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorCompletedDeliveries;
