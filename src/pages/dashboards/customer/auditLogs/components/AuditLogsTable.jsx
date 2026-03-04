import React from 'react';
import { Calendar, Eye } from 'lucide-react';

const AuditLogsTable = ({
  paginatedLogs,
  getActionStyle,
  formatDateTime,
  formatDate,
  handleViewLog,
}) => {
  return (
    <div className="hidden overflow-x-auto lg:block">
      <table className="w-full">
        <thead className="border-b-2 border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
              Date & Time
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
              Delivery Info
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
              Description
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {paginatedLogs.map((log) => {
            const { color, icon: ActionIcon, label } = getActionStyle(log.action);
            return (
              <tr key={log.id} className="transition-all duration-200 hover:bg-gray-50 hover:shadow-sm">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{formatDateTime(log.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {log.delivery ? (
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">Delivery #{log.deliveryId}</p>
                      <p className="mt-0.5 text-xs text-gray-600">{log.delivery.deliveryAddress}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Date: {formatDate(log.delivery.deliveryDate)}
                      </p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </td>

                <td className="px-6 py-5">
                  <p className="text-sm text-gray-900">{log.description}</p>
                  {log.reason && (
                    <p className="mt-1 text-xs text-gray-600">
                      <span className="font-semibold">Reason:</span> {log.reason}
                    </p>
                  )}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}
                  >
                    <ActionIcon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                </td>

                <td className="px-6 py-5 whitespace-nowrap">
                  <button
                    onClick={() => handleViewLog(log)}
                    className="flex items-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-all duration-200 hover:bg-teal-100 hover:border-teal-400"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsTable;
