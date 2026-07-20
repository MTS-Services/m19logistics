import { XCircle } from 'lucide-react';

const EmptyFailedState = ({ hasFilters }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <XCircle className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">
      {hasFilters ? 'No failed deliveries found' : 'No failed deliveries yet'}
    </h3>
    <p className="mt-2 text-base text-gray-600">
      {hasFilters
        ? 'Try adjusting your search or filter criteria.'
        : 'Failed delivery records will appear here when drivers report issues.'}
    </p>
  </div>
);

export default EmptyFailedState;
