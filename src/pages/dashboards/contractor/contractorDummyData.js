/** Frontend-only dummy data for Contractor dashboard. Backend will replace later. */

export const DEMO_CONTRACTOR_CREDENTIALS = {
  email: 'contractor@demo.com',
  password: 'demo123',
};

export const DEMO_CONTRACTOR_USER = {
  id: 'demo-contractor-001',
  role: 'driver',
  driverType: 'CONTRACTOR',
  fullName: 'Ahmed Hassan',
  name: 'Ahmed Hassan',
  email: 'contractor@demo.com',
  phone: '07700 900123',
  tradingName: 'Hassan Courier Services',
  contactName: 'Ahmed Hassan',
  address: '14 Green Lane, Birmingham, B12 0XY',
  tradingAddress: 'Unit 3, Industrial Estate, Birmingham, B12 1AB',
  driversLicenceNumber: 'HASSAN912345AH9XY',
  vatRegistered: true,
  vatNumber: 'GB123456789',
  vehicle: {
    vanRegistration: 'AB12 CDE',
    make: 'Ford',
    model: 'Transit',
    motExpiry: '2026-07-20',
    insuranceExpiry: '2026-08-05',
    goodsInTransitExpiry: '2026-07-18',
    publicLiabilityExpiry: '2026-09-01',
  },
  bank: {
    bankName: 'Barclays',
    accountName: 'Hassan Courier Services',
    sortCode: '20-00-00',
    accountNumber: '12345678',
    reference: 'HCS-M19',
  },
  payStructure: {
    payType: 'Weekly',
    rate: 180,
  },
};

export const DEMO_CONTRACTOR_TOKEN = 'demo-contractor-token';

export const contractorDashboardData = {
  currentPeriod: {
    label: 'Weekly',
    startDate: '2026-07-07',
    endDate: '2026-07-13',
  },
  completedJobs: 12,
  currentEarnings: 2160,
  currency: 'GBP',
  invoiceStatus: {
    paid: 9,
    outstanding: 1,
    latestStatus: 'Outstanding',
  },
};

export const dummyAssignedDeliveries = [
  {
    id: 1,
    spoNumber: 'SPO-10501',
    weight: '12 kg',
    customerName: 'City Retail Ltd',
    customerPhone: '0121 555 0101',
    depotAddress: 'M19 Depot, Birmingham',
    deliveryAddress: '88 High Street, Solihull, B91 3AB',
    date: '2026-07-13',
    timeSlot: '09:00 - 12:00',
    instructions: 'Leave with reception',
    status: 'Assigned',
    amount: 180,
  },
  {
    id: 2,
    spoNumber: 'SPO-10502',
    weight: '8 kg',
    customerName: 'Northside Stores',
    customerPhone: '0121 555 0202',
    depotAddress: 'M19 Depot, Birmingham',
    deliveryAddress: '14 Station Road, Sutton Coldfield, B73 5XY',
    date: '2026-07-13',
    timeSlot: '12:00 - 15:00',
    instructions: 'Call on arrival',
    status: 'Accepted',
    amount: 180,
  },
  {
    id: 3,
    spoNumber: 'SPO-10503',
    weight: '20 kg',
    customerName: 'Metro Wholesale',
    customerPhone: '0121 555 0303',
    depotAddress: 'M19 Depot, Birmingham',
    deliveryAddress: '5 Industrial Way, Coventry, CV1 2AA',
    date: '2026-07-14',
    timeSlot: '09:00 - 12:00',
    instructions: '',
    status: 'Assigned',
    amount: 180,
  },
];

export const dummyCompletedDeliveries = [
  {
    id: 101,
    spoNumber: 'SPO-10421',
    weight: '10 kg',
    customerName: 'City Retail Ltd',
    customerPhone: '0121 555 0101',
    deliveryAddress: '88 High Street, Solihull, B91 3AB',
    date: '2026-07-12',
    timeSlot: '09:00 - 12:00',
    completedAt: '12 Jul 2026, 11:20',
    receivedBy: 'Sarah Khan',
    driverNotes: 'Delivered to reception',
    status: 'Completed',
    amount: 180,
  },
  {
    id: 102,
    spoNumber: 'SPO-10408',
    weight: '15 kg',
    customerName: 'Northside Stores',
    customerPhone: '0121 555 0202',
    deliveryAddress: '14 Station Road, Sutton Coldfield, B73 5XY',
    date: '2026-07-11',
    timeSlot: '12:00 - 15:00',
    completedAt: '11 Jul 2026, 14:05',
    receivedBy: 'James Wilson',
    driverNotes: '',
    status: 'Completed',
    amount: 180,
  },
  {
    id: 103,
    spoNumber: 'SPO-10395',
    weight: '7 kg',
    customerName: 'Metro Wholesale',
    customerPhone: '0121 555 0303',
    deliveryAddress: '5 Industrial Way, Coventry, CV1 2AA',
    date: '2026-07-10',
    timeSlot: '09:00 - 12:00',
    completedAt: '10 Jul 2026, 10:45',
    receivedBy: 'Priya Patel',
    driverNotes: 'Signed by warehouse manager',
    status: 'Completed',
    amount: 180,
  },
  {
    id: 104,
    spoNumber: 'SPO-10382',
    weight: '18 kg',
    customerName: 'Green Valley Foods',
    customerPhone: '0121 555 0404',
    deliveryAddress: '22 Farm Lane, Warwick, CV34 1ZZ',
    date: '2026-07-09',
    timeSlot: '15:00 - 18:00',
    completedAt: '9 Jul 2026, 16:30',
    receivedBy: 'Tom Green',
    driverNotes: '',
    status: 'Completed',
    amount: 180,
  },
];

export const dummyInvoices = [
  {
    id: 'INV-C-2026-010',
    period: '5 May – 11 May 2026',
    startDate: '2026-05-05',
    endDate: '2026-05-11',
    jobs: 9,
    amount: 1620,
    status: 'Paid',
    issuedAt: '2026-05-12',
  },
  {
    id: 'INV-C-2026-011',
    period: '12 May – 18 May 2026',
    startDate: '2026-05-12',
    endDate: '2026-05-18',
    jobs: 10,
    amount: 1800,
    status: 'Paid',
    issuedAt: '2026-05-19',
  },
  {
    id: 'INV-C-2026-012',
    period: '19 May – 25 May 2026',
    startDate: '2026-05-19',
    endDate: '2026-05-25',
    jobs: 8,
    amount: 1440,
    status: 'Paid',
    issuedAt: '2026-05-26',
  },
  {
    id: 'INV-C-2026-013',
    period: '26 May – 1 Jun 2026',
    startDate: '2026-05-26',
    endDate: '2026-06-01',
    jobs: 11,
    amount: 1980,
    status: 'Paid',
    issuedAt: '2026-06-02',
  },
  {
    id: 'INV-C-2026-014',
    period: '2 Jun – 8 Jun 2026',
    startDate: '2026-06-02',
    endDate: '2026-06-08',
    jobs: 12,
    amount: 2160,
    status: 'Paid',
    issuedAt: '2026-06-09',
  },
  {
    id: 'INV-C-2026-015',
    period: '9 Jun – 15 Jun 2026',
    startDate: '2026-06-09',
    endDate: '2026-06-15',
    jobs: 10,
    amount: 1800,
    status: 'Paid',
    issuedAt: '2026-06-16',
  },
  {
    id: 'INV-C-2026-016',
    period: '16 Jun – 22 Jun 2026',
    startDate: '2026-06-16',
    endDate: '2026-06-22',
    jobs: 9,
    amount: 1620,
    status: 'Paid',
    issuedAt: '2026-06-23',
  },
  {
    id: 'INV-C-2026-017',
    period: '23 Jun – 29 Jun 2026',
    startDate: '2026-06-23',
    endDate: '2026-06-29',
    jobs: 10,
    amount: 1800,
    status: 'Paid',
    issuedAt: '2026-06-30',
  },
  {
    id: 'INV-C-2026-018',
    period: '30 Jun – 6 Jul 2026',
    startDate: '2026-06-30',
    endDate: '2026-07-06',
    jobs: 11,
    amount: 1980,
    status: 'Paid',
    issuedAt: '2026-07-07',
  },
  {
    id: 'INV-C-2026-019',
    period: '7 Jul – 13 Jul 2026',
    startDate: '2026-07-07',
    endDate: '2026-07-13',
    jobs: 12,
    amount: 2160,
    status: 'Outstanding',
    issuedAt: '2026-07-13',
  },
];

export function formatMoney(amount, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount || 0);
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** @returns {'ok'|'warning_30'|'warning_14'|'warning_7'|'expired'} */
export function getExpiryUrgency(dateStr, today = new Date()) {
  if (!dateStr) return 'ok';
  const expiry = new Date(dateStr);
  if (Number.isNaN(expiry.getTime())) return 'ok';

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfExpiry = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
  const diffDays = Math.ceil((startOfExpiry - startOfToday) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'warning_7';
  if (diffDays <= 14) return 'warning_14';
  if (diffDays <= 30) return 'warning_30';
  return 'ok';
}

export function getExpiryLabel(urgency) {
  switch (urgency) {
    case 'expired':
      return 'Expired';
    case 'warning_7':
      return 'Expires within 7 days';
    case 'warning_14':
      return 'Expires within 14 days';
    case 'warning_30':
      return 'Expires within 30 days';
    default:
      return 'Valid';
  }
}
