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
  openUpward = false,
}) => (
  <div
    className={`absolute right-0 z-50 w-44 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-gray-200 ${
      openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
    }`}
  >
    <div className="py-1">
      <button
        onClick={() => onEdit(driver)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Edit className="h-4 w-4 text-gray-500" />
        Edit Driver
      </button>
      <div className="mx-3 border-t border-gray-100" />
      <button
        onClick={() => onViewAvailability(driver)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
      >
        <CalendarDays className="h-4 w-4" />
        View Availability
      </button>
      <div className="mx-3 border-t border-gray-100" />
      {driver.status === 'inactive' ? (
        <button
          onClick={() => onToggleStatus(driver)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
        >
          <CheckCircle className="h-4 w-4" />
          Activate Driver
        </button>
      ) : (
        <button
          onClick={() => onToggleStatus(driver)}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50"
        >
          <XCircle className="h-4 w-4" />
          Deactivate Driver
        </button>
      )}
      <div className="mx-3 border-t border-gray-100" />
      <button
        onClick={() => onDelete(driver)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete Driver
      </button>
    </div>
  </div>
);

export default ActionDropdown;
