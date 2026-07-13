import { PROFILE_INPUT_CLASS } from './profileConstants';

const BankPayForm = ({ form, updateField }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.bankName}
            onChange={(e) => updateField('bankName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Name</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.accountName}
            onChange={(e) => updateField('accountName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Code</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.sortCode}
            onChange={(e) => updateField('sortCode', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.accountNumber}
            onChange={(e) => updateField('accountNumber', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference</label>
          <input
            className={PROFILE_INPUT_CLASS}
            value={form.reference}
            onChange={(e) => updateField('reference', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Pay Structure</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay Type</label>
            <select
              className={PROFILE_INPUT_CLASS}
              value={form.payType}
              onChange={(e) => updateField('payType', e.target.value)}
              disabled
              title="Set by Admin"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Fortnightly</option>
              <option>Four Weekly</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">Set by Admin (read-only for now)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rate (£)</label>
            <input
              type="number"
              className={PROFILE_INPUT_CLASS}
              value={form.rate}
              onChange={(e) => updateField('rate', Number(e.target.value))}
              disabled
              title="Set by Admin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankPayForm;
