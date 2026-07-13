/** Shared helpers for driver document expiry highlighting. */

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

export const EXPIRY_STYLES = {
  ok: 'border-gray-200 bg-white',
  warning_30: 'border-red-200 bg-red-50',
  warning_14: 'border-red-300 bg-red-50',
  warning_7: 'border-red-400 bg-red-100',
  expired: 'border-red-600 bg-red-200',
};

export const DRIVER_TYPE = {
  EMPLOYEE: 'EMPLOYEE',
  CONTRACTOR: 'CONTRACTOR',
};

export const PAY_TYPES = ['Daily', 'Weekly', 'Fortnightly', 'Four Weekly'];

export const emptyContractorFields = {
  tradingName: '',
  contactName: '',
  address: '',
  tradingAddress: '',
  driversLicenceNumber: '',
  vatRegistered: false,
  vatNumber: '',
  vanRegistration: '',
  vehicleMake: '',
  vehicleModel: '',
  motExpiry: '',
  insuranceExpiry: '',
  goodsInTransitExpiry: '',
  publicLiabilityExpiry: '',
  bankName: '',
  accountName: '',
  sortCode: '',
  accountNumber: '',
  bankReference: '',
  payType: 'Weekly',
  rate: '',
};

export function validateContractorFields(formData) {
  const errors = {};
  if (!formData.tradingName?.trim()) errors.tradingName = 'Trading name is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';
  if (!formData.tradingAddress?.trim()) errors.tradingAddress = 'Trading address is required';
  if (!formData.phone?.trim()) errors.phone = 'Phone is required';
  if (!formData.email?.trim()) errors.email = 'Email is required';
  if (!formData.driversLicenceNumber?.trim()) {
    errors.driversLicenceNumber = "Driver's licence number is required";
  }
  if (formData.vatRegistered && !formData.vatNumber?.trim()) {
    errors.vatNumber = 'VAT number is required when VAT registered';
  }
  if (!formData.vanRegistration?.trim()) {
    errors.vanRegistration = 'Van registration is required';
  }
  if (!formData.motExpiry) errors.motExpiry = 'MOT expiry is required';
  if (!formData.payType) errors.payType = 'Pay type is required';
  if (formData.rate === '' || formData.rate === null || Number(formData.rate) < 0) {
    errors.rate = 'Rate is required';
  }
  return errors;
}

export function buildContractorPayload(formData) {
  return {
    driverType: DRIVER_TYPE.CONTRACTOR,
    tradingName: formData.tradingName.trim(),
    contactName: formData.contactName?.trim() || '',
    address: formData.address.trim(),
    tradingAddress: formData.tradingAddress.trim(),
    driversLicenceNumber: formData.driversLicenceNumber.trim(),
    vatRegistered: !!formData.vatRegistered,
    vatNumber: formData.vatRegistered ? formData.vatNumber.trim() : '',
    vehicle: {
      vanRegistration: formData.vanRegistration.trim(),
      make: formData.vehicleMake?.trim() || '',
      model: formData.vehicleModel?.trim() || '',
      motExpiry: formData.motExpiry,
      insuranceExpiry: formData.insuranceExpiry || null,
      goodsInTransitExpiry: formData.goodsInTransitExpiry || null,
      publicLiabilityExpiry: formData.publicLiabilityExpiry || null,
    },
    bank: {
      bankName: formData.bankName?.trim() || '',
      accountName: formData.accountName?.trim() || '',
      sortCode: formData.sortCode?.trim() || '',
      accountNumber: formData.accountNumber?.trim() || '',
      reference: formData.bankReference?.trim() || '',
    },
    payStructure: {
      payType: formData.payType,
      rate: Number(formData.rate),
    },
  };
}
