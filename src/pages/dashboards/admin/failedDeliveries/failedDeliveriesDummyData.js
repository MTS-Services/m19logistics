export const FAILURE_REASONS = [
  'Customer not available',
  'Wrong address',
  'Refused delivery',
  'Damaged goods',
  'Access issue',
  'Vehicle breakdown',
];

export const FAILURE_STATUSES = ['Pending Review', 'Re-attempt Scheduled', 'Resolved'];

export const dummyFailedDeliveries = [
  {
    id: 'fd-001',
    spoNumber: 'SPO-2026-0142',
    customer: 'B&Q Warehouse',
    customerPhone: '07700 900142',
    driver: 'James Mitchell',
    driverPhone: '07700 900201',
    deliveryAddress: '12 Industrial Estate Rd, Manchester, M12 4XY',
    scheduledDate: '2026-07-18',
    timeSlot: '09:00 - 12:00',
    failedAt: '2026-07-18T10:45:00',
    reason: 'Customer not available',
    status: 'Pending Review',
    driverNotes:
      'Arrived on site at 10:30. No one available to receive delivery. Called customer twice, no answer.',
    weight: '420 kg',
    cost: 185.5,
  },
  {
    id: 'fd-002',
    spoNumber: 'SPO-2026-0138',
    customer: 'Wickes Store',
    customerPhone: '07700 900138',
    driver: 'Sarah Thompson',
    driverPhone: '07700 900215',
    deliveryAddress: '45 High Street, Leeds, LS1 5AB',
    scheduledDate: '2026-07-17',
    timeSlot: '13:00 - 16:00',
    failedAt: '2026-07-17T14:20:00',
    reason: 'Wrong address',
    status: 'Re-attempt Scheduled',
    driverNotes:
      'Address on booking did not match site. Customer confirmed correct address is unit 7 at rear of building.',
    weight: '310 kg',
    cost: 142.0,
    reattemptDate: '2026-07-21',
    reattemptSlot: '09:00 - 12:00',
  },
  {
    id: 'fd-003',
    spoNumber: 'SPO-2026-0129',
    customer: 'Toolstation',
    customerPhone: '07700 900129',
    driver: 'David Clarke',
    driverPhone: '07700 900198',
    deliveryAddress: '88 Commerce Park, Birmingham, B7 4RT',
    scheduledDate: '2026-07-16',
    timeSlot: '09:00 - 12:00',
    failedAt: '2026-07-16T11:05:00',
    reason: 'Refused delivery',
    status: 'Resolved',
    driverNotes:
      'Store manager refused delivery due to incorrect items on pallet. Returned to depot.',
    weight: '560 kg',
    cost: 210.75,
    resolution: 'Items corrected and redelivered on 17 Jul',
  },
  {
    id: 'fd-004',
    spoNumber: 'SPO-2026-0115',
    customer: 'Screwfix',
    customerPhone: '07700 900115',
    driver: 'Amir Khan',
    driverPhone: '07700 900176',
    deliveryAddress: '3 Retail Park Way, Sheffield, S9 2GH',
    scheduledDate: '2026-07-15',
    timeSlot: '13:00 - 16:00',
    failedAt: '2026-07-15T15:30:00',
    reason: 'Damaged goods',
    status: 'Pending Review',
    driverNotes:
      'Visible damage to outer packaging on 3 boxes. Customer requested refusal until inspection.',
    weight: '275 kg',
    cost: 128.5,
  },
  {
    id: 'fd-005',
    spoNumber: 'SPO-2026-0108',
    customer: 'Jewson',
    customerPhone: '07700 900108',
    driver: 'Emma Wilson',
    driverPhone: '07700 900233',
    deliveryAddress: '22 Dock Road, Liverpool, L1 8JQ',
    scheduledDate: '2026-07-14',
    timeSlot: '09:00 - 12:00',
    failedAt: '2026-07-14T09:50:00',
    reason: 'Access issue',
    status: 'Re-attempt Scheduled',
    driverNotes:
      'Road closed for maintenance. Could not reach delivery bay. Contacted depot for re-route.',
    weight: '390 kg',
    cost: 165.0,
    reattemptDate: '2026-07-19',
    reattemptSlot: '13:00 - 16:00',
  },
  {
    id: 'fd-006',
    spoNumber: 'SPO-2026-0097',
    customer: 'Travis Perkins',
    customerPhone: '07700 900097',
    driver: 'Michael Brown',
    driverPhone: '07700 900154',
    deliveryAddress: '15 Builders Way, Bristol, BS2 0QT',
    scheduledDate: '2026-07-13',
    timeSlot: '13:00 - 16:00',
    failedAt: '2026-07-13T16:10:00',
    reason: 'Vehicle breakdown',
    status: 'Resolved',
    driverNotes: 'Van developed tyre issue en route. Replacement van dispatched next day.',
    weight: '480 kg',
    cost: 192.25,
    resolution: 'Delivered successfully on 14 Jul with backup vehicle',
  },
  {
    id: 'fd-007',
    spoNumber: 'SPO-2026-0084',
    customer: 'Howdens',
    customerPhone: '07700 900084',
    driver: 'Lisa Patel',
    driverPhone: '07700 900267',
    deliveryAddress: '7 Trade Centre, Nottingham, NG2 3PL',
    scheduledDate: '2026-07-12',
    timeSlot: '09:00 - 12:00',
    failedAt: '2026-07-12T10:15:00',
    reason: 'Customer not available',
    status: 'Pending Review',
    driverNotes: 'Loading bay locked. Waited 25 minutes. No staff on site.',
    weight: '335 kg',
    cost: 148.0,
  },
  {
    id: 'fd-008',
    spoNumber: 'SPO-2026-0076',
    customer: 'Selco Builders',
    customerPhone: '07700 900076',
    driver: 'Robert Hughes',
    driverPhone: '07700 900189',
    deliveryAddress: '99 Mill Lane, Coventry, CV1 5AA',
    scheduledDate: '2026-07-11',
    timeSlot: '13:00 - 16:00',
    failedAt: '2026-07-11T14:45:00',
    reason: 'Refused delivery',
    status: 'Resolved',
    driverNotes: 'Customer disputed quantity on delivery note. Issue escalated to admin.',
    weight: '295 kg',
    cost: 135.5,
    resolution: 'Quantity verified and accepted on re-delivery',
  },
];

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatMoney = (amount) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

export const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending Review':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Re-attempt Scheduled':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getReasonStyle = () => 'bg-red-50 text-red-700 border-red-200';
