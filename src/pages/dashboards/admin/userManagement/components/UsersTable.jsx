import React from 'react';
import { Mail, Phone, EllipsisVertical, Edit, Trash2 } from 'lucide-react';

const UsersTable = ({
  users,
  roleConfig,
  showActionDropdown,
  setShowActionDropdown,
  handleEditUser,
  handleDeleteUser,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-base font-semibold text-gray-600 uppercase">User</th>
            <th className="px-6 py-3 text-base font-semibold text-gray-600 uppercase">Contact</th>
            <th className="px-6 py-3 text-base font-semibold text-gray-600 uppercase">Role</th>
            <th className="px-6 py-3 text-base font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-6 py-3 text-base font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => {
            const RoleIcon = roleConfig[user.role]?.icon || null;
            return (
              <tr key={user.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-base text-gray-600">@{user.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-900">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {user.phone}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-base font-semibold ${roleConfig[user.role]?.color}`}
                  >
                    {RoleIcon ? <RoleIcon className="h-3 w-3" /> : null}
                    {roleConfig[user.role]?.label}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-base font-semibold ${user.passwordReset ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                  >
                    {user.passwordReset ? 'Reset Required' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowActionDropdown(showActionDropdown === user.id ? null : user.id)
                      }
                      className="rounded-lg p-2 hover:bg-gray-100"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </button>
                    {showActionDropdown === user.id && (
                      <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" /> Edit User
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" /> Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
