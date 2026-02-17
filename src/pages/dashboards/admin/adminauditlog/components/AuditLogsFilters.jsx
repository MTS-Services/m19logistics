import React from 'react';
import { Search } from 'lucide-react';

const AuditLogsFilters = ({ query, setQuery, onSearch }) => {
    return (
        <div className="rounded-lg bg-white p-4 shadow-md">
            <form onSubmit={onSearch} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by description, SPO number, user name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-teal-500 hover:shadow-lg active:scale-95"
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default AuditLogsFilters;
