import { Search, Filter } from 'lucide-react';
import { FAILURE_REASONS, FAILURE_STATUSES } from '../failedDeliveriesDummyData';

const FailedDeliveriesFilters = ({
  searchQuery,
  statusFilter,
  reasonFilter,
  onSearchChange,
  onStatusChange,
  onReasonChange,
}) => (
  <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by SPO, customer, driver or address..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            {FAILURE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <select
          value={reasonFilter}
          onChange={(e) => onReasonChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
        >
          <option value="all">All Reasons</option>
          {FAILURE_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  </div>
);

export default FailedDeliveriesFilters;
