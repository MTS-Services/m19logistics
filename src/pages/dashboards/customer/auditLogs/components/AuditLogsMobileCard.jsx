import React from 'react';
import { Clock, Eye } from 'lucide-react';

const AuditLogsMobileCard = ({ paginatedLogs, getActionStyle, formatDateTime, formatDate, handleViewLog }) => {
    return (
        <div className="divide-y divide-gray-200 lg:hidden">
            {paginatedLogs.map((log) => {
                const { color, icon: ActionIcon, label } = getActionStyle(log.action);
                return (
                    <div key={log.id} className="p-4 transition-colors hover:bg-gray-50">
                        {/* Card Header */}
                        <div className="mb-3 flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-xs text-gray-600">{formatDateTime(log.createdAt)}</span>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
                            >
                                <ActionIcon className="h-3 w-3" />
                                {label}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900">{log.description}</p>
                            {log.reason && (
                                <p className="mt-1 text-xs text-gray-600">
                                    <span className="font-medium">Reason:</span> {log.reason}
                                </p>
                            )}
                        </div>

                        {/* Delivery Info */}
                        {log.delivery && (
                            <div className="mb-3 rounded-lg bg-gray-50 p-3">
                                <p className="mb-1 text-xs font-semibold text-gray-700">Delivery #{log.deliveryId}</p>
                                <p className="text-xs text-gray-600">{log.delivery.deliveryAddress}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Date: {formatDate(log.delivery.deliveryDate)}
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={() => handleViewLog(log)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AuditLogsMobileCard;
