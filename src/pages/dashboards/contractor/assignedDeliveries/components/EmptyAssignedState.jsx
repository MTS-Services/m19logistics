import { Package } from 'lucide-react';

const EmptyAssignedState = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No assigned deliveries</h3>
      <p className="mt-2 text-sm text-gray-600">New allocations will appear here.</p>
    </div>
  );
};

export default EmptyAssignedState;
