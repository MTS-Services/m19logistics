import {
  Package,
  MapPin,
  Phone,
  User,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { formatMoney } from '../../contractorDummyData';

const AssignedDeliveryCard = ({ delivery, onAccept }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="shrink-0 self-start rounded-lg bg-blue-50 p-3">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900">SPO: {delivery.spoNumber}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                <Clock className="h-3 w-3" />
                {delivery.status}
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
                <a
                  href={`tel:${delivery.customerPhone}`}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {delivery.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{delivery.deliveryAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {delivery.date} · {delivery.timeSlot}
                </span>
              </div>
              {delivery.instructions && (
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="italic">{delivery.instructions}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 lg:ml-6 lg:w-auto lg:min-w-45">
          {delivery.status === 'Assigned' && (
            <button
              type="button"
              onClick={() => onAccept(delivery.id)}
              className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-teal-600 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md hover:from-teal-700 hover:to-teal-600"
            >
              <CheckCircle className="h-4 w-4" />
              Accept
            </button>
          )}
          <a
            href={`tel:${delivery.customerPhone}`}
            className="flex items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
          >
            <Phone className="h-4 w-4" />
            Call Customer
          </a>
        </div>
      </div>
    </div>
  );
};

export default AssignedDeliveryCard;
