import React, { useState } from 'react';
import { X, PoundSterling, CalendarClock, UserCheck } from 'lucide-react';

const PAY_TYPE_LABELS = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  FORTNIGHTLY: 'Fortnightly',
  FOUR_WEEKLY: 'Four Weekly',
  RATE_ON_JOB: 'Rate on Job',
};

export const RATE_MODE = {
  PAY_STRUCTURE: 'PAY_STRUCTURE',
  JOB_RATE: 'JOB_RATE',
};

const ContractorRateModal = ({ driver, delivery, onClose, onConfirm }) => {
  const payType = driver?.payType || '';
  const defaultRate = driver?.rate ?? '';
  const deliveryRate = delivery?.contractorRate ?? delivery?.jobRate ?? '';
  const isPerJob = payType === 'RATE_ON_JOB' || payType === 'Rate on Job';

  const initialJobRate = () => {
    if (deliveryRate !== '' && deliveryRate != null) return String(deliveryRate);
    if (isPerJob && defaultRate !== '' && defaultRate != null) return String(defaultRate);
    return '';
  };

  const [mode, setMode] = useState(isPerJob ? RATE_MODE.JOB_RATE : RATE_MODE.PAY_STRUCTURE);
  const [jobRate, setJobRate] = useState(initialJobRate);
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (mode === RATE_MODE.JOB_RATE && (jobRate === '' || Number(jobRate) <= 0)) {
      setError('Enter a valid rate for this job');
      return;
    }
    onConfirm({
      rateMode: mode,
      payType,
      jobRate: mode === RATE_MODE.JOB_RATE ? Number(jobRate) : null,
    });
  };

  const tabClass = (active) =>
    `flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Contractor Rate</h3>
            <p className="text-sm text-gray-500">
              {driver?.name} · {delivery?.spoNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              className={tabClass(mode === RATE_MODE.PAY_STRUCTURE)}
              onClick={() => {
                setMode(RATE_MODE.PAY_STRUCTURE);
                setError('');
              }}
            >
              Pay Structure
            </button>
            <button
              type="button"
              className={tabClass(mode === RATE_MODE.JOB_RATE)}
              onClick={() => setMode(RATE_MODE.JOB_RATE)}
            >
              Rate for this Job
            </button>
          </div>

          {mode === RATE_MODE.PAY_STRUCTURE ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 text-teal-600" />
                <div>
                  <p className="text-sm text-gray-500">Contractor's existing pay structure</p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {PAY_TYPE_LABELS[payType] || payType || 'Not set'}
                    {defaultRate !== '' && defaultRate !== null && (
                      <span className="text-gray-600"> · £{Number(defaultRate).toFixed(2)}</span>
                    )}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    This job will be paid under the contractor's existing pay structure.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-medium text-gray-700">
                <PoundSterling className="h-4 w-4 text-gray-400" />
                Specific Rate for this Job (£) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={jobRate}
                onChange={(e) => {
                  setJobRate(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full rounded-md border ${
                  error ? 'border-red-300' : 'border-gray-300'
                } px-4 py-2 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none`}
                placeholder="e.g., 45"
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              <p className="mt-2 text-sm text-gray-500">
                This rate applies only to this job and overrides the contractor's pay structure.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-6 py-2 text-white shadow-md hover:from-teal-700 hover:to-teal-600 sm:w-auto"
          >
            <UserCheck className="h-5 w-5" />
            Confirm & Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractorRateModal;
