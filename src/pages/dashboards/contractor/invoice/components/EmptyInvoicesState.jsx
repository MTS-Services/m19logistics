import { FileText } from 'lucide-react';

const EmptyInvoicesState = ({ hasFilters }) => {
  return (
    <div className="p-12 text-center">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
      <p className="mt-2 text-sm text-gray-600">
        {hasFilters
          ? 'Try adjusting your search or filter'
          : 'Generate your first invoice for this period.'}
      </p>
    </div>
  );
};

export default EmptyInvoicesState;
