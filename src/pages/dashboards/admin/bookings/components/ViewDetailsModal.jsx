import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Weight,
  Truck,
  Camera,
  PenLine,
  ImageOff,
  MessageSquare,
} from 'lucide-react';
import axiosInstance from '../../../../../services/axiosInstance';

/** Parse photoUrl / photoUrls into a clean URL array */
const getPhotoUrls = (delivery) => {
  if (!delivery) return [];

  const urls = [];

  const add = (value) => {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach(add);
      return;
    }

    // object with url field
    if (typeof value === 'object' && value.url) {
      add(value.url);
      return;
    }

    let str = String(value).trim();
    if (!str || str === 'null' || str === 'undefined') return;

    // Remove wrapping quotes
    str = str.replace(/^["']|["']$/g, '');

    // Split comma-separated absolute URLs
    let parts;
    if (str.includes(',http')) {
      parts = str.split(/,(?=https?:\/\/)/);
    } else if ((str.match(/https?:\/\//g) || []).length > 1) {
      parts = str.split(/(?=https?:\/\/)/).map((p) => p.replace(/^,/, ''));
    } else if (str.includes(',')) {
      parts = str.split(',');
    } else {
      parts = [str];
    }

    parts.forEach((part) => {
      const url = part.trim();
      if (url) urls.push(url);
    });
  };

  add(delivery.photoUrls);
  add(delivery.photoUrl);
  add(delivery.photos);

  return [...new Set(urls)];
};

const toDisplayUrl = (url) => String(url || '').replace(/ /g, '%20');

const ViewDetailsModal = ({ delivery, onClose, formatDate, formatCurrency, getStatusColor }) => {
  const [detail, setDetail] = useState(delivery);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});

  // Keep local detail in sync + try fetch full record (includes photoUrl)
  useEffect(() => {
    if (!delivery?.id) {
      setDetail(delivery);
      return;
    }

    setDetail(delivery);
    setBrokenImages({});

    let cancelled = false;

    const loadFullDelivery = async () => {
      setLoadingDetail(true);
      try {
        // Try single delivery endpoint first
        let full = null;
        try {
          const byId = await axiosInstance.get(`/api/admin/deliveries/${delivery.id}`);
          console.log('ViewDetailsModal backend response (by id):', byId.data);
          full = byId.data?.data || byId.data;
          if (Array.isArray(full)) {
            full = full.find((d) => d.id === delivery.id) || null;
          }
        } catch {
          // Fallback: list endpoint and find by id
          const listRes = await axiosInstance.get('/api/admin/deliveries');
          console.log('ViewDetailsModal backend response (list fallback):', listRes.data);
          const list = listRes.data?.data || [];
          full = list.find((d) => d.id === delivery.id) || null;
        }

        if (!cancelled && full) {
          const merged = {
            ...delivery,
            ...full,
            // keep UI-mapped fields from list item when API uses different names
            customer: delivery.customer || full.customerName || full.customer?.fullName,
            phone: delivery.phone || full.customerPhone,
            contact: delivery.contact || full.customerName,
            address: delivery.address || full.deliveryAddress,
            cost: delivery.cost ?? full.totalPrice,
            status: delivery.status || full.status,
            driver: delivery.driver || full.driver?.fullName || null,
            driverPhone: delivery.driverPhone || full.driver?.phone || null,
            driverEmail: delivery.driverEmail || full.driver?.email || null,
            photoUrl: full.photoUrl ?? delivery.photoUrl,
            photoUrls: full.photoUrls ?? delivery.photoUrls,
            signatureUrl: full.signatureUrl ?? delivery.signatureUrl,
            receivedBy: full.receivedBy ?? delivery.receivedBy,
            deliveredAt: full.deliveredAt ?? delivery.deliveredAt,
            driverFeedback: full.driverFeedback ?? delivery.driverFeedback ?? null,
          };
          setDetail(merged);
          console.log('ViewDetailsModal full delivery loaded:', merged);
          console.log('ViewDetailsModal raw photoUrl:', merged.photoUrl);
          console.log('ViewDetailsModal raw photoUrls:', merged.photoUrls);
        }
      } catch (err) {
        console.error('Failed to load full delivery detail:', err);
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    };

    loadFullDelivery();

    return () => {
      cancelled = true;
    };
  }, [delivery]);

  const photoUrls = useMemo(() => getPhotoUrls(detail), [detail]);

  useEffect(() => {
    console.log('ViewDetailsModal parsed photos:', {
      count: photoUrls.length,
      urls: photoUrls,
    });
  }, [photoUrls]);

  if (!delivery) return null;

  const data = detail || delivery;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-4 sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
            <p className="mt-1 text-base text-gray-600">{data.spoNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-base font-semibold ${getStatusColor(data.status)}`}
              >
                {data.status}
              </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-base text-gray-500 uppercase">Customer</p>
                    <p className="font-medium text-gray-900">{data.customer}</p>
                  </div>
                </div>
                {data.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Phone</p>
                      <p className="font-medium text-gray-900">{data.phone}</p>
                    </div>
                  </div>
                )}
                {data.contact && (
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Contact Person</p>
                      <p className="font-medium text-gray-900">{data.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-base text-gray-500 uppercase">Address</p>
                    <p className="font-medium text-gray-900">{data.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Scheduled Date & Time</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(data.deliveryDate)} - {data.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Weight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Weight</p>
                      <p className="font-medium text-gray-900">{data.weight}</p>
                    </div>
                  </div>
                </div>
                {data.driver && (
                  <div className="flex items-start gap-2">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-base text-gray-500 uppercase">Assigned Driver</p>
                      <p className="font-medium text-gray-900">{data.driver}</p>
                      {data.driverId && (
                        <p className="text-sm text-gray-500">ID: {data.driverId}</p>
                      )}
                      {data.driverPhone && (
                        <p className="text-base text-gray-600">{data.driverPhone}</p>
                      )}
                      {data.driverEmail && (
                        <p className="text-base text-gray-600">{data.driverEmail}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
              <h3 className="text-base font-semibold text-teal-900 uppercase">Total Cost</h3>
              <p className="text-3xl font-bold text-teal-600">£{formatCurrency(data.cost)}</p>
            </div>

            {/* Delivery Proof Photos — always visible */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-gray-200 pb-2">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">
                    Delivery Photos {photoUrls.length > 0 ? `(${photoUrls.length})` : ''}
                  </h3>
                </div>
                {loadingDetail && <span className="text-xs text-gray-500">Loading proof...</span>}
              </div>

              {photoUrls.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {photoUrls.map((url, index) => {
                    const src = toDisplayUrl(url);
                    const isBroken = brokenImages[index];
                    return (
                      <a
                        key={`${url}-${index}`}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block overflow-hidden rounded-lg border border-gray-200 bg-white"
                      >
                        {isBroken ? (
                          <div className="flex h-28 flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400">
                            <ImageOff className="h-6 w-6" />
                            <span className="text-[11px]">Failed to load</span>
                          </div>
                        ) : (
                          <img
                            src={src}
                            alt={`Delivery proof ${index + 1}`}
                            className="h-28 w-full object-cover transition-transform group-hover:scale-105"
                            onError={() => setBrokenImages((prev) => ({ ...prev, [index]: true }))}
                          />
                        )}
                        <p className="truncate px-2 py-1 text-[11px] text-gray-500" title={url}>
                          Photo {index + 1}
                        </p>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
                  <ImageOff className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm font-medium text-gray-600">No delivery photos found</p>
                  <p className="mt-1 text-xs text-gray-400">
                    photoUrl empty — check this delivery was completed with proof upload
                  </p>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                <PenLine className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Customer Signature</h3>
              </div>
              {data.signatureUrl ? (
                <a
                  href={toDisplayUrl(data.signatureUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block overflow-hidden rounded-lg border border-gray-200 bg-white p-2"
                >
                  <img
                    src={toDisplayUrl(data.signatureUrl)}
                    alt="Customer signature"
                    className="max-h-40 w-auto object-contain"
                  />
                </a>
              ) : (
                <p className="text-sm text-gray-500">No signature uploaded</p>
              )}
            </div>

            {data.deliveredAt && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-900">Delivery Status</h3>
                <p className="text-base font-medium text-green-700">
                  Delivered at: {data.deliveredAt}
                </p>
                {data.receivedBy && (
                  <p className="text-base text-green-700">Received by: {data.receivedBy}</p>
                )}
              </div>
            )}

            {(data.driverFeedback?.notes || data.driverFeedback?.comments) && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">Driver Feedback</h3>
                </div>
                <p className="text-base whitespace-pre-wrap text-gray-800">
                  {data.driverFeedback.notes || data.driverFeedback.comments}
                </p>
                {/* {data.driverFeedback.createdAt && (
                  <p className="mt-2 text-sm text-gray-500">
                    Submitted: {formatDate(data.driverFeedback.createdAt)}
                  </p>
                )} */}
              </div>
            )}

            {data.cancelReason && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-2 font-semibold text-red-900">Cancellation Details</h3>
                <p className="text-base text-red-700">{data.cancelReason}</p>
                {data.cancelledAt && (
                  <p className="mt-1 text-base text-red-500">Cancelled at: {data.cancelledAt}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end space-x-3 border-t border-gray-200 bg-gray-50 p-4">
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
