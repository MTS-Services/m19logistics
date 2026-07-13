import React, { useState } from 'react';
import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../../components/Pagination';
import { dummyAssignedDeliveries, formatMoney } from './contractorDummyData';

const ContractorAssignedDeliveries = () => {
  const [deliveries, setDeliveries] = useState(dummyAssignedDeliveries);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleAccept = (id) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Accepted' } : d))
    );
    toast.success('Delivery accepted (dummy — backend later)');
  };

  const pageItems = deliveries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 p-3 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Assigned Deliveries</h1>
        <p className="mt-2 text-gray-600">
          Jobs allocated to you ({deliveries.length} assigned) — dummy data
        </p>
      </div>

      <div className="space-y-4">
        {pageItems.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No assigned deliveries</h3>
            <p className="mt-2 text-sm text-gray-600">New allocations will appear here.</p>
          </div>
        ) : (
          pageItems.map((delivery) => (
            <div
              key={delivery.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-1 gap-4">
                  <div className="rounded-lg bg-blue-50 p-3 shrink-0">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">SPO: {delivery.spoNumber}</h3>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        <Clock className="h-3 w-3" />
                        {delivery.status}
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
                        <a href={`tel:${delivery.customerPhone}`} className="text-teal-600 hover:text-teal-700">
                          {delivery.customerPhone}
                        </a>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{delivery.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {delivery.date} · {delivery.timeSlot}
                        </span>
                      </div>
                      {delivery.instructions && (
                        <div className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                          <span className="italic">{delivery.instructions}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 lg:ml-6 lg:w-auto lg:min-w-45">
                  {delivery.status === 'Assigned' && (
                    <button
                      type="button"
                      onClick={() => handleAccept(delivery.id)}
                      className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-teal-700 hover:to-teal-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                  )}
                  <a
                    href={`tel:${delivery.customerPhone}`}
                    className="flex items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
                  >
                    <Phone className="h-4 w-4" />
                    Call Customer
                  </a>
                </div>
              </div>
            </div>
          ))
        )}

        {deliveries.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(deliveries.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={deliveries.length}
          />
        )}
      </div>
    </div>
  );
};

export default ContractorAssignedDeliveries;
