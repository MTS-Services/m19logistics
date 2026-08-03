import { Search } from 'lucide-react';

const InvoicesFilters = ({ searchQuery, onSearchChange, statusFilter, onStatusChange }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by invoice ID or period..."
            className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Outstanding">Outstanding</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
};

export default InvoicesFilters;
