import React from 'react';
import { FileSearch } from 'lucide-react';

const AuditLogsEmptyState = () => {
    return (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 shadow-md">
            <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <FileSearch className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No Audit Logs Found</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Try adjusting your search or filters to find what you're looking for.
                </p>
            </div>
        </div>
    );
};

export default AuditLogsEmptyState;
