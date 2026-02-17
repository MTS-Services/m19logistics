import React from 'react';

const LoadingState = () => {
    return (
        <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-teal-600"></div>
            <p className="mt-4 text-sm text-gray-600">Loading audit logs...</p>
        </div>
    );
};

export default LoadingState;
