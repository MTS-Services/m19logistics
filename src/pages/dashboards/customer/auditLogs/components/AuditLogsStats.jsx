import React from 'react';
import { Activity } from 'lucide-react';

const AuditLogsStats = ({ totalActivities }) => {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-teal-600" />
                <div>
                    <p className="text-sm text-gray-600">Total Activities</p>
                    <p className="text-2xl font-bold text-gray-900">{totalActivities}</p>
                </div>
            </div>
        </div>
    );
};

export default AuditLogsStats;
