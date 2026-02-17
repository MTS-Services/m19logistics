import React from 'react';
import { Shield } from 'lucide-react';

const AuditLogsEmptyState = ({ searchQuery }) => {
    return (
        <div className="p-12 text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No activity logs found</h3>
            <p className="mt-2 text-sm text-gray-600">
                {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'No activities match the selected filter'}
            </p>
        </div>
    );
};

export default AuditLogsEmptyState;
