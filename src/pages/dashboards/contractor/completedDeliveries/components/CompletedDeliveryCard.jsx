import { CheckCircle, MapPin, Calendar, FileText, User, Phone } from 'lucide-react';
import { formatMoney, formatDate } from '../../contractorDummyData';

const CompletedDeliveryCard = ({ delivery, onViewDetails }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="shrink-0 self-start rounded-lg bg-green-50 p-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">SPO: {delivery.spoNumber}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                <CheckCircle className="h-3 w-3" />
                Completed
              </span>
              <span className="text-sm font-semibold text-teal-700">
                {formatMoney(delivery.amount)}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{delivery.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{delivery.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{delivery.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(delivery.date)} · {delivery.timeSlot}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Completed: {delivery.completedAt}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto lg:ml-6 lg:min-w-45">
          <button
            type="button"
            onClick={() => onViewDetails(delivery)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-teal-700 hover:to-teal-600"
          >
            <FileText className="h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedDeliveryCard;
