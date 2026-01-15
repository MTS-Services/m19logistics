// Demo users with preloaded data
export const demoUsers = [
  // Admin Users
  {
    id: 'admin001',
    username: 'admin',
    password: 'admin123',
    email: 'admin@m19logistics.com',
    name: 'Ben Admin',
    role: 'admin',
    phone: '07971415430',
    mustChangePassword: false,
    profilePhoto: null,
  },

  // Customers - Topps Tiles Stores
  {
    id: 'T022',
    username: 'T022',
    password: 'Password022',
    email: 'topps022@toppstiles.co.uk',
    name: 'Topps Chester',
    role: 'customer',
    phone: '01244398888',
    depotAddress: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
    pricingTier: 'tierB',
    mustChangePassword: true,
    profilePhoto: null,
  },
  {
    id: 'T226',
    username: 'T226',
    password: 'Password226',
    email: 'topps226@toppstiles.co.uk',
    name: 'Topps Nantwich',
    role: 'customer',
    phone: '01270610000',
    depotAddress: 'Unit 1, Nantwich Trade Park, CW5 6HL',
    pricingTier: 'tierB',
    mustChangePassword: true,
    profilePhoto: null,
  },
  {
    id: 'T167',
    username: 'T167',
    password: 'Password167',
    email: 'topps167@toppstiles.co.uk',
    name: 'Topps Newcastle',
    role: 'customer',
    phone: '01782717000',
    depotAddress: 'Unit 4, Lyme Court, ST5 3TF',
    pricingTier: 'tierA', // Custom pricing
    mustChangePassword: true,
    profilePhoto: null,
  },
  {
    id: 'T143',
    username: 'T143',
    password: 'Password143',
    email: 'topps143@toppstiles.co.uk',
    name: 'Topps Northwich',
    role: 'customer',
    phone: '01606331000',
    depotAddress: 'Wadebrook Retail Park, CW9 5NN',
    pricingTier: 'tierB',
    mustChangePassword: true,
    profilePhoto: null,
  },
  {
    id: 'T211',
    username: 'T211',
    password: 'Password211',
    email: 'topps211@toppstiles.co.uk',
    name: 'Topps Rhyl',
    role: 'customer',
    phone: '01745342152',
    depotAddress: '152 Vale Road, Rhyl, Denbighshire, LL18 2PD',
    pricingTier: 'tierB',
    mustChangePassword: true,
    profilePhoto: null,
  },
  {
    id: 'T217',
    username: 'T217',
    password: 'Password217',
    email: 'topps217@toppstiles.co.uk',
    name: 'Topps Wrexham',
    role: 'customer',
    phone: '01978358000',
    depotAddress: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
    pricingTier: 'tierB',
    mustChangePassword: true,
    profilePhoto: null,
  },

  // Drivers
  {
    id: 'BK01',
    username: 'BK01',
    password: 'M1901',
    email: 'wwwbk@yahoo.co.uk',
    name: 'BK',
    role: 'driver',
    phone: '07971415430',
    mustChangePassword: true,
    profilePhoto: '/assets/drivers/bk-profile.jpg',
  },

  // Area Manager
  {
    id: 'Rob01',
    username: 'Rob01',
    password: 'Topps01',
    email: 'rob.myers@toppstiles.com',
    name: 'Rob Myers',
    role: 'area_manager',
    phone: '07725957625',
    mustChangePassword: true,
    profilePhoto: null,
  },
];

// Pricing tiers
export const pricingTiers = {
  tierA: {
    name: 'Tier A',
    basePrice: 41.67,
    vatRate: 0.2,
    totalPerBlock: 50.0,
    description: 'Custom pricing for Topps Newcastle',
  },
  tierB: {
    name: 'Tier B',
    basePrice: 37.5,
    vatRate: 0.2,
    totalPerBlock: 45.0,
    description: 'Standard pricing',
  },
};

// Distance pricing rules
export const distancePricing = {
  baseDistanceMiles: 45,
  surchargePerZone: 0.5, // 50% of base price per additional 45 miles
  weightBlockKg: 800,
};

// Invoice settings
export const invoiceSettings = {
  currentInvoiceNumber: 325, // Last invoice was T0325
  prefix: 'T',
  startNumber: 1,
  paymentTerms: '30 Days (End of Month)',
  companyDetails: {
    name: 'M19 Logistics Limited',
    address: '84 Acton Hall Walks, Wrexham, LL12 7YJ',
    phone: '07971415430 / 01978439739',
    email: 'm19logistics@gmail.com',
    vatNumber: '447 5918 54',
    bankDetails: {
      bankName: 'NatWest Bank',
      accountHolder: 'M19 Logistics Limited',
      sortCode: '01-10-01',
      accountNumber: '72696370',
    },
  },
};

// Booking statuses
export const bookingStatuses = {
  RECEIVED: { value: 'received', label: 'Received', color: 'red', icon: 'inbox' },
  ALLOCATED: { value: 'allocated', label: 'Allocated', color: 'blue', icon: 'user-check' },
  DELIVERED: { value: 'delivered', label: 'Delivered', color: 'green', icon: 'check-circle' },
  CANCELLED: { value: 'cancelled', label: 'Cancelled', color: 'gray', icon: 'x-circle' },
};

// Extra charge types
export const extraChargeTypes = [
  { value: 'toll', label: 'Toll Charge' },
  { value: 'extra_run', label: 'Extra Run' },
  { value: 'waiting_time', label: 'Waiting Time' },
  { value: 'weekend_surcharge', label: 'Weekend Surcharge' },
  { value: 'other', label: 'Other' },
];
