import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  MapPin,
  Weight,
  FileText,
  Search,
  Eye,
  Edit,
  PlusCircle,
  Phone,
  User,
  X,
  PoundSterling,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Loading from '../../../../components/Loading';
import { getAllDeliveries } from '../../../../services/deliveryService';
import EditJobModal from './components/EditJobModal';

const getStatusColor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'received':
      return 'bg-blue-100 text-blue-800';
    case 'allocated':
      return 'bg-yellow-100 text-yellow-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatStatus = (status) => {
  if (!status) return '—';
  return String(status)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTimeSlot = (slot) => {
  if (slot === 'AM') return 'Morning (AM)';
  if (slot === 'PM') return 'Afternoon (PM)';
  if (slot === 'SAME_DAY') return 'Same Day';
  return slot || '—';
};

const mapApiJobToUi = (item) => ({
  id: item.id,
  spoNumber: item.spoNumber || '—',
  deliveryDate: item.deliveryDate,
  timeSlot: item.timeSlot,
  weight: item.weight,
  address: item.deliveryAddress || '—',
  collectionPoints: Array.isArray(item.collectionPoints) ? item.collectionPoints : [],
  jobRate: item.contractorRate != null && item.contractorRate !== '' ? Number(item.contractorRate) : null,
  customer: item.customerName || '—',
  phone: item.customerPhone || '—',
  requestedBy: item.requestedBy || '—',
  instructions: item.specialInstructions || '',
  status: formatStatus(item.status),
  rawStatus: item.status,
  totalPrice: item.totalPrice,
  createdAt: item.createdAt,
});

const AdminMyBookings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllDeliveries();
      const list = Array.isArray(response?.data) ? response.data : [];
      setJobs(list.map(mapApiJobToUi));
    } catch (error) {
      console.error('Error loading admin my bookings:', error);
      toast.error(error.response?.data?.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.spoNumber?.toLowerCase().includes(q) ||
        job.customer?.toLowerCase().includes(q) ||
        job.address?.toLowerCase().includes(q) ||
        job.phone?.toLowerCase().includes(q) ||
        job.collectionPoints?.some((point) => point?.toLowerCase().includes(q))
    );
  }, [jobs, searchQuery]);

  const receivedCount = jobs.filter((j) => j.rawStatus === 'RECEIVED').length;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center p-6">
        <Loading message="Loading My Bookings" submessage="Fetching admin jobs..." />
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              My Bookings
            </h1>
            <p className="mt-2 text-gray-600">
              Jobs created by admin — customer bookings are not shown here
            </p>
          </div>
          <Link
            to="/admin/create-job"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            <PlusCircle className="h-4 w-4" />
            Create Job
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Admin Jobs</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{jobs.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Received</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">{receivedCount}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Showing</p>
            <p className="mt-1 text-2xl font-bold text-teal-600">{filteredJobs.length}</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SPO, customer, address, phone..."
              className="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Admin Job Records</h2>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No admin jobs found</h3>
              <p className="mt-2 text-base text-gray-600">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Create a job to see it listed here'}
              </p>
              {!searchQuery && (
                <Link
                  to="/admin/create-job"
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Job
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        SPO Number
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Delivery Address
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Weight
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-base font-semibold tracking-wider text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{job.spoNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-base font-medium text-gray-900">
                                {formatDate(job.deliveryDate)}
                              </p>
                              <p className="text-base text-gray-600">{job.timeSlot}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                            <div>
                              <p className="text-base text-gray-900">{job.customer}</p>
                              <p className="text-base text-gray-600">{job.address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Weight className="h-4 w-4 text-gray-400" />
                            <span className="text-base text-gray-900">{job.weight} kg</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-base font-semibold ${getStatusColor(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedJob(job)}
                              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:border-teal-400 hover:bg-gray-50"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingJob(job)}
                              className="rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:border-teal-400 hover:bg-gray-50"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-gray-200 lg:hidden">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{job.spoNumber}</span>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-900">
                        {formatDate(job.deliveryDate)} · {job.timeSlot}
                      </p>
                      <p className="text-gray-700">{job.customer}</p>
                      <p className="text-gray-600">{job.address}</p>
                      <p className="text-gray-600">{job.weight} kg</p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingJob(job)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Job Details</h3>
                <p className="text-sm text-gray-500">{selectedJob.spoNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(selectedJob.status)}`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="font-semibold text-gray-900">{selectedJob.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Date</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedJob.deliveryDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time Slot</p>
                  <p className="font-semibold text-gray-900">
                    {formatTimeSlot(selectedJob.timeSlot)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </p>
                <p className="font-semibold text-gray-900">{selectedJob.address}</p>
              </div>

              {selectedJob.collectionPoints?.length > 0 && (
                <div>
                  <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    Collection From
                  </p>
                  <ul className="list-disc space-y-1 pl-5">
                    {selectedJob.collectionPoints.map((point, index) => (
                      <li key={index} className="font-semibold text-gray-900">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.jobRate != null && !Number.isNaN(selectedJob.jobRate) && (
                <div>
                  <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                    <PoundSterling className="h-4 w-4" />
                    Contractor Rate (Rate on Job)
                  </p>
                  <p className="font-semibold text-gray-900">
                    £{Number(selectedJob.jobRate).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    Customer
                  </p>
                  <p className="font-semibold text-gray-900">{selectedJob.customer}</p>
                </div>
                <div>
                  <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900">{selectedJob.phone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Requested By</p>
                <p className="font-semibold text-gray-900">{selectedJob.requestedBy}</p>
              </div>

              {selectedJob.instructions && (
                <div>
                  <p className="text-sm text-gray-500">Special Instructions</p>
                  <p className="font-semibold text-gray-900">{selectedJob.instructions}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setEditingJob(selectedJob);
                  setSelectedJob(null);
                }}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-gray-700 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={() => {
            setEditingJob(null);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
};

export default AdminMyBookings;
