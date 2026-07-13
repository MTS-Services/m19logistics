import { AlertTriangle } from 'lucide-react';
import {
  EXPIRY_STYLES,
  PAY_TYPES,
  getExpiryLabel,
  getExpiryUrgency,
} from './driverTypeUtils';

const inputClass = (hasError) =>
  `mt-1 block w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 ${
    hasError ? 'border-red-500' : 'border-gray-300'
  }`;

const expiryFields = [
  { key: 'motExpiry', label: 'MOT Expiry *', required: true },
  { key: 'insuranceExpiry', label: 'Insurance Expiry' },
  { key: 'goodsInTransitExpiry', label: 'Goods In Transit Insurance' },
  { key: 'publicLiabilityExpiry', label: 'Public Liability Insurance' },
];

const ContractorDriverFields = ({ formData, errors = {}, onChange, onRadioChange }) => {
  const handleChange = (e) => onChange(e);
  const setField = (name, value) =>
    onChange({ target: { name, value, type: 'text' } });

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Personal Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Trading Name *</label>
            <input
              name="tradingName"
              value={formData.tradingName}
              onChange={handleChange}
              className={inputClass(errors.tradingName)}
              placeholder="Trading / business name"
            />
            {errors.tradingName && (
              <p className="mt-1 text-xs text-red-500">{errors.tradingName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className={inputClass()}
              placeholder="Contact person name"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className={inputClass(errors.address)}
              placeholder="Address"
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Trading Address *</label>
            <textarea
              name="tradingAddress"
              value={formData.tradingAddress}
              onChange={handleChange}
              rows={2}
              className={inputClass(errors.tradingAddress)}
              placeholder="Trading address"
            />
            {errors.tradingAddress && (
              <p className="mt-1 text-xs text-red-500">{errors.tradingAddress}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Driver’s Licence Number *
            </label>
            <input
              name="driversLicenceNumber"
              value={formData.driversLicenceNumber}
              onChange={handleChange}
              className={inputClass(errors.driversLicenceNumber)}
              placeholder="Licence number"
            />
            {errors.driversLicenceNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.driversLicenceNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">VAT Registered?</label>
            <div className="mt-2 flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="vatRegistered"
                  checked={formData.vatRegistered === true}
                  onChange={() => onRadioChange('vatRegistered', true)}
                />
                Yes
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="vatRegistered"
                  checked={formData.vatRegistered === false}
                  onChange={() => onRadioChange('vatRegistered', false)}
                />
                No
              </label>
            </div>
          </div>
          {formData.vatRegistered && (
            <div>
              <label className="block text-sm font-medium text-gray-700">VAT Number *</label>
              <input
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                className={inputClass(errors.vatNumber)}
                placeholder="GB123456789"
              />
              {errors.vatNumber && <p className="mt-1 text-xs text-red-500">{errors.vatNumber}</p>}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Phone &amp; Email use the main form fields above (required).
        </p>
      </div>

      {/* Vehicle Details */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Vehicle Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Van Registration *</label>
            <input
              name="vanRegistration"
              value={formData.vanRegistration}
              onChange={handleChange}
              className={inputClass(errors.vanRegistration)}
              placeholder="e.g., AB12 CDE"
            />
            {errors.vanRegistration && (
              <p className="mt-1 text-xs text-red-500">{errors.vanRegistration}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Make</label>
            <input
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleChange}
              className={inputClass()}
              placeholder="e.g., Ford"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
            <input
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              className={inputClass()}
              placeholder="e.g., Transit"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {expiryFields.map((field) => {
            const urgency = getExpiryUrgency(formData[field.key]);
            return (
              <div
                key={field.key}
                className={`rounded-lg border p-3 ${EXPIRY_STYLES[urgency] || EXPIRY_STYLES.ok}`}
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-gray-700">{field.label}</label>
                  {urgency !== 'ok' && formData[field.key] && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800">
                      <AlertTriangle className="h-3 w-3" />
                      {getExpiryLabel(urgency)}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  name={field.key}
                  value={formData[field.key]}
                  onChange={handleChange}
                  className={inputClass(errors[field.key])}
                />
                {errors[field.key] && (
                  <p className="mt-1 text-xs text-red-500">{errors[field.key]}</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">
          Expiry fields highlight in red within 30 / 14 / 7 days or when expired.
        </p>
      </div>

      {/* Bank Details */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Bank Details</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={inputClass()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              className={inputClass()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort Code</label>
            <input
              name="sortCode"
              value={formData.sortCode}
              onChange={handleChange}
              className={inputClass()}
              placeholder="20-00-00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={inputClass()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference</label>
            <input
              name="bankReference"
              value={formData.bankReference}
              onChange={handleChange}
              className={inputClass()}
            />
          </div>
        </div>
      </div>

      {/* Pay Structure */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900">Pay Structure</h3>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Pay Type *</label>
          <div className="flex flex-wrap gap-4">
            {PAY_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="payType"
                  checked={formData.payType === type}
                  onChange={() => setField('payType', type)}
                />
                {type}
              </label>
            ))}
          </div>
          {errors.payType && <p className="mt-1 text-xs text-red-500">{errors.payType}</p>}
        </div>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700">Rate (£) *</label>
          <input
            type="number"
            name="rate"
            min="0"
            step="0.01"
            value={formData.rate}
            onChange={handleChange}
            className={inputClass(errors.rate)}
            placeholder="e.g., 180"
          />
          {errors.rate && <p className="mt-1 text-xs text-red-500">{errors.rate}</p>}
          <p className="mt-1 text-xs text-gray-500">Admin sets the rate for the selected pay type</p>
        </div>
      </div>
    </div>
  );
};

export default ContractorDriverFields;
