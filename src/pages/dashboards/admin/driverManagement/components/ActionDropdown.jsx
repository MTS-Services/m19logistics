import React from 'react';
import { BarChart3, Edit, Key, Trash2, CheckCircle, XCircle, CalendarDays } from 'lucide-react';

const ActionDropdown = ({
  driver,
  onViewAnalytics,
  onEdit,
  onResetPassword,
  onDelete,
  onToggleStatus,
  onViewAvailability,
}) => (
  <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-xl">
    <div className="py-1">
      {/* <button onClick={() => onViewAnalytics(driver)} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"><BarChart3 className="h-4 w-4" />View Analytics</button> */}
      <button
        onClick={() => onEdit(driver)}
        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Edit className="h-4 w-4" />
        Edit Driver
      </button>
      <button
        onClick={() => onViewAvailability(driver)}
        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-teal-700 transition-colors hover:bg-teal-50"
      >
        <CalendarDays className="h-4 w-4" />
        View Availability
      </button>
      {/* <button onClick={() => onResetPassword(driver)} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"><Key className="h-4 w-4" />Reset Password</button> */}
      {driver.status === 'inactive' ? (
        <button
          onClick={() => onToggleStatus(driver)}
          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 transition-colors hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4" />
          Activate Driver
        </button>
      ) : (
        <button
          onClick={() => onToggleStatus(driver)}
          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-orange-600 transition-colors hover:bg-orange-50"
        >
          <XCircle className="h-4 w-4" />
          Deactivate Driver
        </button>
      )}
      <button
        onClick={() => onDelete(driver)}
        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete Driver
      </button>
    </div>
  </div>
);

export default ActionDropdown;
