import { useState, useEffect } from 'react';
import { EllipsisVertical, FileText, MapPin, Truck, User, Eye, Trash2 } from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  formatMoney,
  getReasonStyle,
  getStatusStyle,
} from '../utils';

const FailedDeliveriesTable = ({ deliveries, onView, onDelete }) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                SPO / Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Failed At
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {deliveries.map((delivery, index) => {
              const openUpward = deliveries.length > 1 && index >= deliveries.length - 2;
              return (
                <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{delivery.spoNumber}</p>
                        <p className="text-sm text-gray-600">{delivery.customer}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{delivery.driver}</p>
                        <p className="text-xs text-gray-500">{delivery.driverPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{formatDateTime(delivery.failedAt)}</div>
                    <div className="text-xs text-gray-500">
                      Scheduled: {formatDate(delivery.scheduledDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {delivery.reason ? (
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getReasonStyle()}`}
                      >
                        {delivery.reason}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(delivery.status)}`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="dropdown-container relative inline-block text-left">
                      <button
                        onClick={(e) => toggleDropdown(delivery.id, e)}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-all hover:border-teal-400 hover:bg-gray-50"
                        aria-label="View failed delivery actions"
                      >
                        <EllipsisVertical className="h-4 w-4" />
                      </button>
                      {openDropdownId === delivery.id && (
                        <div
                          className={`absolute right-0 z-50 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg ring-opacity-5 focus:outline-none ${
                            openUpward
                              ? 'bottom-full mb-2 origin-bottom-right'
                              : 'top-full mt-2 origin-top-right'
                          }`}
                        >
                          <button
                            onClick={() => {
                              onView(delivery);
                              setOpenDropdownId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="mr-2 h-4 w-4 text-gray-500" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              onDelete(delivery.id);
                              setOpenDropdownId(null);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet cards */}
      <div className="divide-y divide-gray-200 lg:hidden">
        {deliveries.map((delivery, index) => {
          const openUpward = deliveries.length > 1 && index >= deliveries.length - 2;
          return (
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
                {delivery.reason ? (
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getReasonStyle()}`}
                  >
                    {delivery.reason}
                  </span>
                ) : <span />}
                <span className="text-sm font-medium text-gray-900">{formatMoney(delivery.cost)}</span>
              </div>

              <div className="dropdown-container relative mt-3 w-full">
                <button
                  onClick={(e) => toggleDropdown(`mobile-${delivery.id}`, e)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-teal-400 hover:bg-gray-50"
                >
                  <EllipsisVertical className="h-4 w-4" />
                  Actions
                </button>
                {openDropdownId === `mobile-${delivery.id}` && (
                  <div
                    className={`absolute right-0 z-50 w-full rounded-md border border-teal-500 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                      openUpward ? 'bottom-full mb-1' : 'top-full mt-1'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onView(delivery);
                        setOpenDropdownId(null);
                      }}
                      className="flex w-full items-center justify-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="mr-2 h-4 w-4 text-gray-500" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        onDelete(delivery.id);
                        setOpenDropdownId(null);
                      }}
                      className="flex w-full items-center justify-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FailedDeliveriesTable;
