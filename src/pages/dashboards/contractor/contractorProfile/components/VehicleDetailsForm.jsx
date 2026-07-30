import { AlertTriangle } from 'lucide-react';
import { formatDate } from '../../contractorDummyData';
import { PROFILE_INPUT_CLASS, EXPIRY_STYLES } from './profileConstants';

const expiryFields = [
  { key: 'motExpiry', label: 'MOT Expiry *' },
  { key: 'insuranceExpiry', label: 'Insurance Expiry' },
  { key: 'goodsInTransitExpiry', label: 'Goods In Transit Insurance' },
  { key: 'publicLiabilityExpiry', label: 'Public Liability Insurance' },
];

const mapDocStatusToUrgency = (status) => {
  const value = (status || '').toString().toUpperCase();
  if (value === 'EXPIRED') return 'expired';
  if (value === 'WITHIN_7_DAYS') return 'warning_7';
  if (value === 'WITHIN_14_DAYS') return 'warning_14';
  if (value === 'WITHIN_30_DAYS') return 'warning_30';
  return 'ok';
};

const VehicleDetailsForm = ({ form, updateField, documentStatus = {} }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Van Registration *</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.vanRegistration}
            onChange={(e) => updateField('vanRegistration', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Make</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.make}
            onChange={(e) => updateField('make', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.model}
            onChange={(e) => updateField('model', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {expiryFields.map((field) => {
          const doc = documentStatus[field.key] || {};
          const urgency = mapDocStatusToUrgency(doc.status);
          return (
            <div
              key={field.key}
              className={`rounded-lg border p-4 ${EXPIRY_STYLES[urgency] || EXPIRY_STYLES.ok}`}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                {(doc.highlight || urgency !== 'ok') && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-800">
                    <AlertTriangle className="h-3 w-3" />
                    {doc.label || 'Attention'}
                  </span>
                )}
              </div>
              <input
                type="date"
                className={PROFILE_INPUT_CLASS}
                value={form[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-600">{formatDate(form[field.key] || doc.date)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleDetailsForm;
