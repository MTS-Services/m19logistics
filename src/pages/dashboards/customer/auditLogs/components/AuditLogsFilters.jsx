import React from 'react';
import { Search } from 'lucide-react';

const AuditLogsFilters = ({
    searchQuery,
    setSearchQuery,
    filterAction,
    setFilterAction,
    uniqueActions,
    getActionStyle,
}) => {
    return (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search */}
                <div className="flex-1 md:max-w-md">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by description, action, or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 sm:text-base"
                        />
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterAction('all')}
                        className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${filterAction === 'all'
                                ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        All
                    </button>
                    {uniqueActions.map((action) => {
                        const { label } = getActionStyle(action);
                        return (
                            <button
                                key={action}
                                onClick={() => setFilterAction(action)}
                                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:text-sm ${filterAction === action
                                        ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AuditLogsFilters;
