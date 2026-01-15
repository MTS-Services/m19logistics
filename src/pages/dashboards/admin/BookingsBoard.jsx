import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Phone,
  Calendar,
  Weight,
  AlertCircle,
} from 'lucide-react';

const BookingsBoard = () => {
  const [bookings] = useState({
    received: [
      {
        id: 'T0330',
        customer: 'Topps Tiles Wrexham (T022)',
        deliveryDate: '2026-01-15',
        timeSlot: 'AM',
        weight: '800kg',
        address: '123 High Street, Chester, CH1 1AA',
        contact: 'John Smith',
        phone: '01978 123456',
        spoNumber: 'SPO-2024-001',
        price: '£50.00',
        isNew: true,
      },
      {
        id: 'T0329',
        customer: 'Topps Tiles Chester (T045)',
        deliveryDate: '2026-01-15',
        timeSlot: 'PM',
        weight: '1600kg',
        address: '456 Main Road, Llandudno, LL30 2BB',
        contact: 'Sarah Jones',
        phone: '01492 234567',
        spoNumber: 'SPO-2024-002',
        price: '£93.75',
        isNew: true,
      },
    ],
    allocated: [
      {
        id: 'T0328',
        customer: 'Topps Tiles Llandudno (T089)',
        deliveryDate: '2026-01-14',
        timeSlot: 'PM',
        weight: '800kg',
        address: '789 Park Lane, Colwyn Bay, LL29 3CC',
        driver: 'Ben Kinsella (BK01)',
        driverId: 'BK01',
        price: '£50.00',
      },
      {
        id: 'T0327',
        customer: 'Topps Tiles Mold (T067)',
        deliveryDate: '2026-01-14',
        timeSlot: 'AM',
        weight: '2400kg',
        address: '321 Station Road, Mold, CH7 1DD',
        driver: 'Ben Kinsella (BK01)',
        driverId: 'BK01',
        price: '£140.63',
      },
    ],
    delivered: [
      {
        id: 'T0326',
        customer: 'Topps Tiles Bangor (T112)',
        deliveryDate: '2026-01-13',
        timeSlot: 'AM',
        weight: '800kg',
        address: '567 High Street, Bangor, LL57 1EE',
        driver: 'Ben Kinsella (BK01)',
        completedAt: '2026-01-13 11:30',
        receivedBy: 'Mark Williams',
        price: '£50.00',
      },
    ],
    cancelled: [
      {
        id: 'T0325',
        customer: 'Topps Tiles Wrexham (T022)',
        deliveryDate: '2026-01-12',
        timeSlot: 'PM',
        weight: '800kg',
        cancelledAt: '2026-01-12 09:15',
        cancelReason: 'Customer requested cancellation',
        price: '£50.00',
      },
    ],
  });

  const getColumnColor = (status) => {
    const colors = {
      received: 'border-red-400 bg-red-50',
      allocated: 'border-yellow-400 bg-yellow-50',
      delivered: 'border-green-400 bg-green-50',
      cancelled: 'border-gray-400 bg-gray-50',
    };
    return colors[status];
  };

  const renderBookingCard = (booking, status) => (
    <div
      key={booking.id}
      className="group rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{booking.id}</h3>
            {booking.isNew && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                NEW
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{booking.customer}</p>
        </div>
        <Package className="h-5 w-5 text-gray-400" />
      </div>

      {/* Details */}
      <div className="space-y-2 border-t border-gray-100 pt-3 text-sm">
        {status === 'received' && (
          <>
            <div className="flex items-start gap-2 text-gray-600">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <span className="font-medium">{booking.deliveryDate}</span>
                <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                  {booking.timeSlot}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="line-clamp-2">{booking.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span>{booking.contact}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{booking.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Weight className="h-4 w-4" />
              <span>{booking.weight}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-lg font-bold text-teal-600">{booking.price}</span>
              <button className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700">
                Allocate Driver
              </button>
            </div>
          </>
        )}

        {status === 'allocated' && (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {booking.deliveryDate} - {booking.timeSlot}
              </span>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="line-clamp-2">{booking.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="h-4 w-4" />
              <span className="font-medium text-blue-600">{booking.driver}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Weight className="h-4 w-4" />
              <span>{booking.weight}</span>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3 text-right">
              <span className="text-lg font-bold text-teal-600">{booking.price}</span>
            </div>
          </>
        )}

        {status === 'delivered' && (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {booking.deliveryDate} - {booking.timeSlot}
              </span>
            </div>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="line-clamp-2">{booking.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Truck className="h-4 w-4" />
              <span>{booking.driver}</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs">Completed at {booking.completedAt}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-xs">Received by: {booking.receivedBy}</span>
            </div>
            <div className="mt-3 border-t border-gray-100 pt-3 text-right">
              <span className="text-lg font-bold text-teal-600">{booking.price}</span>
            </div>
          </>
        )}

        {status === 'cancelled' && (
          <>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {booking.deliveryDate} - {booking.timeSlot}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Weight className="h-4 w-4" />
              <span>{booking.weight}</span>
            </div>
            <div className="flex items-start gap-2 text-red-600">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-xs">{booking.cancelReason}</span>
            </div>
            <div className="text-xs text-gray-500">Cancelled at {booking.cancelledAt}</div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Board</h1>
          <p className="mt-1 text-sm text-gray-600">Manage all delivery bookings in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            + New Booking
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="flex items-center gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div>
          <p className="font-semibold text-red-900">
            {bookings.received.filter((b) => b.isNew).length} new bookings require allocation
          </p>
          <p className="text-sm text-red-700">Please assign drivers to pending deliveries</p>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Received Column */}
        <div className={`rounded-lg border-2 ${getColumnColor('received')} p-4`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Clock className="h-5 w-5 text-red-600" />
              Received
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
              {bookings.received.length}
            </span>
          </div>
          <div className="space-y-3">
            {bookings.received.map((booking) => renderBookingCard(booking, 'received'))}
          </div>
        </div>

        {/* Allocated Column */}
        <div className={`rounded-lg border-2 ${getColumnColor('allocated')} p-4`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Truck className="h-5 w-5 text-yellow-600" />
              Allocated
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-600 text-xs font-bold text-white">
              {bookings.allocated.length}
            </span>
          </div>
          <div className="space-y-3">
            {bookings.allocated.map((booking) => renderBookingCard(booking, 'allocated'))}
          </div>
        </div>

        {/* Delivered Column */}
        <div className={`rounded-lg border-2 ${getColumnColor('delivered')} p-4`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Delivered
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              {bookings.delivered.length}
            </span>
          </div>
          <div className="space-y-3">
            {bookings.delivered.map((booking) => renderBookingCard(booking, 'delivered'))}
          </div>
        </div>

        {/* Cancelled Column */}
        <div className={`rounded-lg border-2 ${getColumnColor('cancelled')} p-4`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <XCircle className="h-5 w-5 text-gray-600" />
              Cancelled
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
              {bookings.cancelled.length}
            </span>
          </div>
          <div className="space-y-3">
            {bookings.cancelled.map((booking) => renderBookingCard(booking, 'cancelled'))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsBoard;
