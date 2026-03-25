import React, { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle,
  Search,
  MapPin,
  Calendar,
  FileText,
  User,
  Phone,
  Camera,
  PenTool,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getDriverDeliveries } from '../../../services/driverService';
import Pagination from '../../../components/Pagination';
import Loading from '../../../components/Loading';

const CompletedDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCompleted = async () => {
      setLoading(true);
      try {
        const res = await getDriverDeliveries('DELIVERED');
        if (!isMounted) return;
        if (res && res.success && res.data) {
          const normalized = res.data.map((d) => ({
            id: d.id,
            spoNumber: d.spoNumber,
            weight: d.weight || d.packWeight || d.packageWeight || '',
            customerName: d.customerName || (d.customer && d.customer.fullName) || '',
            customerPhone: d.customerPhone || (d.customer && d.customer.phone) || '',
            depotAddress:
              (d.customer && d.customer.customerProfile && d.customer.customerProfile.depotAddress) ||
              '',
            deliveryAddress: d.deliveryAddress || '',
            date: d.deliveryDate ? new Date(d.deliveryDate).toISOString().split('T')[0] : '',
            timeSlot: d.timeSlot || '',
            completedAt: d.deliveredAt ? new Date(d.deliveredAt).toLocaleString() : d.updatedAt ? new Date(d.updatedAt).toLocaleString() : '',
            receivedBy: d.receivedBy || '',
            driverNotes: (d.driverFeedback && d.driverFeedback.notes) || d.specialInstructions || '',
            photoUrl: d.photoUrl || '',
            signatureUrl: d.signatureUrl || '',
            status: d.status || '',
          }));

          setCompletedDeliveries(normalized);
        }
      } catch (error) {
        console.error('Error loading completed deliveries:', error);
        toast.error('Failed to load completed deliveries');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCompleted();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDeliveries = completedDeliveries.filter(
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
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Completed Deliveries
          </h1>
          <p className="mt-2 text-gray-600">
            View your delivery history ({completedDeliveries.length} completed)
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SPO, customer name, or address..."
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          {loading ? (
            <Loading message="Loading Completed Deliveries" submessage="Retrieving your delivery history..." size="medium" />
          ) : filteredDeliveries.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No completed deliveries found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Your completed deliveries will appear here'}
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
                      {/* Delivery Info */}
                      <div className="flex-1">
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                          <div className="rounded-lg bg-green-50 p-3 shrink-0">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex flex-col gap-3">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                <h3 className="text-lg font-bold text-gray-900">
                                  SPO: {delivery.spoNumber}
                                </h3>
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600 w-fit">
                                  <CheckCircle className="h-3 w-3" />
                                  Completed
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm text-gray-600">
                                <User className="h-4 w-4 shrink-0 hidden sm:block" />
                                <span className="font-medium">{delivery.customerName}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 shrink-0 hidden sm:block" />
                                <span>{delivery.customerPhone}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 shrink-0 sm:mt-0.5" />
                                <span>{delivery.deliveryAddress}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm text-gray-600">
                                <Calendar className="h-4 w-4 shrink-0 hidden sm:block" />
                                <span>
                                  {delivery.date} - {delivery.timeSlot}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm font-medium text-green-600">
                                <CheckCircle className="h-4 w-4 shrink-0 hidden sm:block" />
                                <span>Completed: {delivery.completedAt}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="w-full sm:w-auto flex flex-col gap-2 lg:ml-6 lg:min-w-45">
                        <button
                          onClick={() => handleViewDetails(delivery)}
                          className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                        >
                          <FileText className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Pagination */}
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

        {/* Detail Modal */}
        {showDetailModal && selectedDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-3xl max-h-[75vh] rounded-lg bg-white  shadow-xl flex flex-col">
              {/* Header - Sticky */}
              <div className="border-b border-gray-200 bg-white rounded-lg px-6 py-4 shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Delivery Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        SPO Number
                      </label>
                      <p className="text-sm text-gray-900">{selectedDelivery.spoNumber}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </span>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Customer Name
                      </label>
                      <p className="text-sm text-gray-900">{selectedDelivery.customerName}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <p className="text-sm text-gray-900">{selectedDelivery.customerPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Depot Address
                      </label>
                      <p className="text-sm text-gray-900">{selectedDelivery.depotAddress}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Delivery Address
                      </label>
                      <p className="text-sm text-gray-900">{selectedDelivery.deliveryAddress}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Delivery Date
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedDelivery.date} - {selectedDelivery.timeSlot}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Weight</label>
                      <p className="text-sm text-gray-900">{selectedDelivery.weight ? `${selectedDelivery.weight} kg` : '—'}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Completed At
                      </label>
                      <p className="text-sm font-medium text-green-600">
                        {selectedDelivery.completedAt}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Received By
                      </label>
                      <p className="text-sm text-gray-900">{selectedDelivery.receivedBy}</p>
                    </div>
                  </div>

                  {/* Delivery Photo */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Camera className="h-4 w-4" />
                      Delivery Photo
                    </label>
                    <img
                      src={selectedDelivery.photoUrl}
                      alt="Delivery"
                      className="h-64 w-full rounded-md border border-gray-200 object-cover"
                    />
                  </div>

                  {/* Signature */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <PenTool className="h-4 w-4" />
                      Customer Signature
                    </label>
                    {selectedDelivery.signatureUrl ? (
                      <img
                        src={selectedDelivery.signatureUrl}
                        alt="Signature"
                        className="h-40 w-full rounded-md border border-gray-200 bg-white object-contain"
                      />
                    ) : (
                      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                        <div className="flex h-32 items-center justify-center text-sm text-gray-500">
                          No signature available
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Driver Notes */}
                  {selectedDelivery.driverNotes && (
                    <div>
                      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FileText className="h-4 w-4" />
                        Driver Notes
                      </label>
                      <p className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">
                        {selectedDelivery.driverNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer - Sticky */}
              <div className="border-t border-gray-200 rounded-lg bg-white px-6 py-4 flex justify-end shrink-0">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className=" rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDeliveries;
