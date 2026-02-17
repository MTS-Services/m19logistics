import React from 'react';
import { Eye, User, Package, Calendar } from 'lucide-react';

const AuditLogsMobileCard = ({ log, onViewLog }) => {
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
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getActionBadge(log.action)}`}
                        >
                            {log.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-medium text-gray-500">#{log.id}</span>
                    </div>

                    <div className="text-sm text-gray-700">{log.description}</div>

                    <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center space-x-2 text-xs">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-700">
                                {log.user?.fullName || 'System'}
                            </span>
                        </div>

                        {log.delivery && (
                            <div className="flex items-center space-x-2 text-xs">
                                <Package className="h-4 w-4 text-gray-400" />
                                <span className="text-gray-600">
                                    {log.delivery.spoNumber || `#${log.delivery.id}`}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center space-x-2 text-xs">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-500">
                                {new Date(log.createdAt).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onViewLog(log)}
                    className="ml-3 rounded-lg bg-teal-600 p-2 text-white shadow-sm transition-all hover:bg-teal-500 active:scale-95"
                >
                    <Eye className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default AuditLogsMobileCard;
