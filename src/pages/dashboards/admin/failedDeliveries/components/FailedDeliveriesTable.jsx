import { Eye, MapPin, Truck, User } from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getReasonStyle,
  getStatusStyle,
} from '../failedDeliveriesDummyData';

const FailedDeliveriesTable = ({ deliveries, onView }) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
    {/* Desktop table */}
    <div className="hidden lg:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              SPO / Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Driver
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Failed At
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">{delivery.spoNumber}</div>
                <div className="text-sm text-gray-500">{delivery.customer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{delivery.driver}</div>
                <div className="text-sm text-gray-500">{delivery.driverPhone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDateTime(delivery.failedAt)}</div>
                <div className="text-sm text-gray-500">
                  Scheduled: {formatDate(delivery.scheduledDate)}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getReasonStyle()}`}
                >
                  {delivery.reason}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(delivery.status)}`}
                >
                  {delivery.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <button
                  onClick={() => onView(delivery)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile / tablet cards */}
    <div className="divide-y divide-gray-200 lg:hidden">
      {deliveries.map((delivery) => (
        <div key={delivery.id} className="p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{delivery.spoNumber}</p>
              <p className="text-sm text-gray-500">{delivery.customer}</p>
            </div>
            <span
              className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(delivery.status)}`}
            >
              {delivery.status}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span>{delivery.driver}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span className="line-clamp-2">{delivery.deliveryAddress}</span>
            </div>
            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span>Failed: {formatDateTime(delivery.failedAt)}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getReasonStyle()}`}
            >
              {delivery.reason}
            </span>
            <span className="text-sm font-medium text-gray-900">{formatMoney(delivery.cost)}</span>
          </div>

          <button
            onClick={() => onView(delivery)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700"
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default FailedDeliveriesTable;
