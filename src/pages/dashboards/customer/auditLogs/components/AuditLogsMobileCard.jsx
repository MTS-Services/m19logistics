import React from 'react';
import { Clock, Eye } from 'lucide-react';

const AuditLogsMobileCard = ({ paginatedLogs, getActionStyle, formatDateTime, formatDate, handleViewLog }) => {
    return (
        <div className="divide-y divide-gray-100 lg:hidden">
            {paginatedLogs.map((log) => {
                const { color, icon: ActionIcon, label } = getActionStyle(log.action);
                return (
                    <div key={log.id} className="p-5 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm">
                        {/* Card Header */}
                        <div className="mb-4 flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-700">{formatDateTime(log.createdAt)}</span>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${color}`}
                            >
                                <ActionIcon className="h-3.5 w-3.5" />
                                {label}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-900">{log.description}</p>
                            {log.reason && (
                                <p className="mt-2 text-xs text-gray-600">
                                    <span className="font-semibold">Reason:</span> {log.reason}
                                </p>
                            )}
                        </div>

                        {/* Delivery Info */}
                        {log.delivery && (
                            <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                                <p className="mb-2 text-xs font-semibold text-gray-800">Delivery #{log.deliveryId}</p>
                                <p className="text-xs text-gray-700">{log.delivery.deliveryAddress}</p>
                                <p className="mt-2 text-xs text-gray-600">
                                    Date: {formatDate(log.delivery.deliveryDate)}
                                </p>
                            </div>
                        )}

                        {/* Action Button */}
                        <button
                            onClick={() => handleViewLog(log)}
                            className="flex w-full items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2.5 text-sm font-medium text-teal-700 transition-all duration-200 hover:bg-teal-100 hover:border-teal-400"
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
