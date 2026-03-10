import React, { useState } from 'react';
import { X, AtSign, Save, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../services/axiosInstance';

const CCEmailModal = ({ user, onClose, onSuccess }) => {
  const [ccEmail, setCcEmail] = useState(user.ccEmail || '');
  const [saving, setSaving] = useState(false);

  const callApi = async (value) => {
    setSaving(true);
    try {
      await axiosInstance.put(`/api/admin/customers/${user.id}/cc-email`, { ccEmail: value });
      toast.success(value ? 'CC Email updated successfully' : 'CC Email removed');
      onSuccess(user.id, value);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update CC Email');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    if (ccEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ccEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    callApi(ccEmail || null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100">
              <AtSign className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">CC Email</h2>
              <p className="text-sm text-gray-500">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {user.ccEmail && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
              <AtSign className="h-4 w-4 shrink-0 text-gray-400" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Current CC Email</p>
                <p className="truncate text-sm font-medium text-gray-700">{user.ccEmail}</p>
              </div>
            </div>
          )}
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {user.ccEmail ? 'Update CC Email' : 'Set CC Email'}
          </label>
          <input
            type="email"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="email@example.com"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 transition outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <div>
            {user.ccEmail && (
              <button
                onClick={() => callApi(null)}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCEmailModal;
