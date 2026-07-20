import { AlertTriangle } from 'lucide-react';

const FailedDeliveriesHeader = () => (
  <div className="mb-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Failed Deliveries
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Review and manage deliveries that could not be completed
        </p>
      </div>
      
    </div>
  </div>
);

export default FailedDeliveriesHeader;
