import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
    return (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-white p-8 shadow-md">
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600" />
                <p className="mt-4 text-sm font-medium text-gray-600">Loading audit logs...</p>
            </div>
        </div>
    );
};

export default LoadingState;
