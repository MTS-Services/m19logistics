import React from 'react';
import { Eye, User, Package } from 'lucide-react';

const AuditLogsTable = ({ logs, onViewLog }) => {
    const getActionBadge = (action) => {
        const styles = {
            CREATE_DELIVERY: 'bg-green-100 text-green-700',
            UPDATE_DELIVERY: 'bg-blue-100 text-blue-700',
            CANCEL_DELIVERY: 'bg-red-100 text-red-700',
            ALLOCATE_DELIVERY: 'bg-purple-100 text-purple-700',
            COMPLETE_DELIVERY: 'bg-teal-100 text-teal-700',
            DEFAULT: 'bg-gray-100 text-gray-700',
        };
        return styles[action] || styles.DEFAULT;
    };

    return (
        <div className="overflow-hidden rounded-t-lg bg-white shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-600">
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-600">
                                Action
                            </th>
                            <th className="px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-600">
                                Description
                            </th>
                            <th className="px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-600">
                                User
                            </th>
                            <th className="px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-600">
                                Delivery
                            </th>
                            <th className="px-4 py-3 text-left text-base font-semibold uppercase tracking-wider text-gray-600">
                                Timestamp
                            </th>
                            <th className="px-4 py-3 text-right text-base font-semibold uppercase tracking-wider text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {logs.map((log) => (
                            <tr key={log.id} className="transition-colors hover:bg-gray-50">
                                <td className="whitespace-nowrap px-4 py-4 text-base font-medium text-gray-900">
                                    #{log.id}
                                </td>
                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-base font-medium ${getActionBadge(log.action)}`}
                                    >
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="max-w-md px-4 py-4 text-base text-gray-700">
                                    <div className="line-clamp-2">{log.description}</div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-base font-medium text-teal-700">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-base font-medium text-gray-900">
                                                {log.user?.fullName || 'System'}
                                            </div>
                                            <div className="text-base text-gray-500">{log.user?.email || '-'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    {log.delivery ? (
                                        <div className="flex items-center space-x-2">
                                            <Package className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <div className="text-base font-medium text-gray-700">
                                                    {log.delivery.spoNumber || `#${log.delivery.id}`}
                                                </div>
                                                <div className="text-base text-gray-500">
                                                    {log.delivery.status}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-base text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-base text-gray-500">
                                    {new Date(log.createdAt).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-right text-base">
                                    <button
                                        onClick={() => onViewLog(log)}
                                        className="inline-flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-base font-medium text-white shadow-sm transition-all hover:bg-teal-500 hover:shadow-md active:scale-95"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>View</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogsTable;
