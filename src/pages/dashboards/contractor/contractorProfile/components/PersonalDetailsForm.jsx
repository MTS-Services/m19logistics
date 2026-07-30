import { User, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { PROFILE_INPUT_CLASS } from './profileConstants';

const PersonalDetailsForm = ({ form, updateField }) => {
  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-2xl font-bold text-white">
          {(form.tradingName || 'C').charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{form.tradingName}</p>
          <p className="text-sm text-gray-500">{form.displayRole || 'Contractor'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Trading Name *</label>
          <div className="relative">
            <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className={`${PROFILE_INPUT_CLASS} pl-9`}
              value={form.tradingName}
              onChange={(e) => updateField('tradingName', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Name</label>
          <div className="relative">
            <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className={`${PROFILE_INPUT_CLASS} pl-9`}
              value={form.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone *</label>
          <div className="relative">
            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className={`${PROFILE_INPUT_CLASS} pl-9`}
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className={`${PROFILE_INPUT_CLASS} pl-9`}
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address *</label>
          <div className="relative">
            <MapPin className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <textarea
              rows={2}
              className={`${PROFILE_INPUT_CLASS} pl-9`}
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Trading Address *</label>
          <textarea
            rows={2}
            className={PROFILE_INPUT_CLASS}
            value={form.tradingAddress}
            onChange={(e) => updateField('tradingAddress', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Driver’s Licence Number *
          </label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.driversLicenceNumber}
            onChange={(e) => updateField('driversLicenceNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">VAT Registered?</label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={form.vatRegistered === true}
                onChange={() => updateField('vatRegistered', true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                checked={form.vatRegistered === false}
                onChange={() => updateField('vatRegistered', false)}
              />
              No
            </label>
          </div>
        </div>
        {form.vatRegistered && (
          <div>
            <label className="block text-sm font-medium text-gray-700">VAT Number</label>
            <input
              className={PROFILE_INPUT_CLASS}
              value={form.vatNumber}
              onChange={(e) => updateField('vatNumber', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
