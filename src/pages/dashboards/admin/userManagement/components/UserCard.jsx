import React from 'react';
import { Mail, Phone, Edit, Trash2, Key } from 'lucide-react';

const UserCard = ({ user, roleConfig, onEdit, onDelete, onReset }) => {
    const RoleIcon = roleConfig[user.role]?.icon;
    return (
        <div className="text-base rounded-lg border bg-white p-3 sm:p-4 shadow-sm overflow-hidden">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => onEdit(user)} className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => onReset(user)} className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded">
                        <Key className="h-4 w-4" />
                    </button>
                    <button onClick={() => onDelete(user)} className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{user.phone}</span>
                </div>
                <div className="mt-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${roleConfig[user.role]?.color ?? 'text-gray-700 bg-gray-100'}`}>
                        {RoleIcon ? <RoleIcon className="h-3 w-3" /> : null}
                        {roleConfig[user.role]?.label ?? user.role}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
