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
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, action, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none sm:text-base"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        {/* <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterAction('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filterAction === 'all'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Activities
          </button>
          {uniqueActions.map((action) => {
            const style = getActionStyle(action);
            const Icon = style.icon;
            return (
              <button
                key={action}
                onClick={() => setFilterAction(action)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filterAction === action
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {style.label}
              </button>
            );
          })}
        </div> */}
      </div>
    </div>
  );
};

export default AuditLogsFilters;
