import React from 'react';
import { Mail, Phone, Edit, Trash2 } from 'lucide-react';

const UserCard = ({ user, roleConfig, onEdit, onDelete }) => {
  const RoleIcon = roleConfig[user.role]?.icon;
  return (
    <div className="overflow-hidden rounded-lg border bg-white p-3 text-base shadow-sm sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 font-bold text-white">
            {user.name?.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">@{user.username}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(user)}
            className="rounded p-1.5 text-gray-600 hover:bg-gray-50 sm:p-2"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="rounded p-1.5 text-red-600 hover:bg-red-50 sm:p-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-gray-600">
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Phone className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{user.phone}</span>
        </div>
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${roleConfig[user.role]?.color ?? 'bg-gray-100 text-gray-700'}`}
          >
            {RoleIcon ? <RoleIcon className="h-3 w-3" /> : null}
            {roleConfig[user.role]?.label ?? user.role}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
