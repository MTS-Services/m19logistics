import React, { useState, useMemo } from 'react';
import {
  Package,
  DollarSign,
  TrendingUp,
  BarChart3,
  Building2,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';

const AreaManagerDashboardHome = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // All store data for different time periods
  const storeData = {
    week: {
      stats: {
        totalDeliveries: 156,
        totalRevenue: 7020,
        thisMonth: 38,
        avgPerDelivery: 45.0,
      },
      stores: [
        {
          name: 'Topps Chester',
          address: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
          deliveries: 38,
          revenue: 1710,
          status: 'Active',
          phone: '+44 1244 377771',
          email: 'chester@toppstiles.co.uk',
        },
        {
          name: 'Topps Nantwich',
          address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
          deliveries: 24,
          revenue: 1080,
          status: 'Active',
          phone: '+44 1270 627771',
          email: 'nantwich@toppstiles.co.uk',
        },
        {
          name: 'Topps Newcastle',
          address: 'Unit 4, Lyme Court, ST5 3TF',
          deliveries: 52,
          revenue: 2340,
          status: 'Active',
          phone: '+44 1782 717771',
          email: 'newcastle@toppstiles.co.uk',
        },
        {
          name: 'Topps Northwich',
          address: 'Wadebrook Retail Park, CW9 5NN',
          deliveries: 33,
          revenue: 1485,
          status: 'Active',
          phone: '+44 1606 337771',
          email: 'northwich@toppstiles.co.uk',
        },
        {
          name: 'Topps Rhyl',
          address: '152 Vale Road, Rhyl, LL18 2PD',
          deliveries: 22,
          revenue: 990,
          status: 'Active',
          phone: '+44 1745 337771',
          email: 'rhyl@toppstiles.co.uk',
        },
        {
          name: 'Topps Wrexham',
          address: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
          deliveries: 28,
          revenue: 1260,
          status: 'Active',
          phone: '+44 1978 357771',
          email: 'wrexham@toppstiles.co.uk',
        },
      ],
    },
    month: {
      stats: {
        totalDeliveries: 799,
        totalRevenue: 35955,
        thisMonth: 234,
        avgPerDelivery: 45.0,
      },
      stores: [
        {
          name: 'Topps Chester',
          address: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
          deliveries: 156,
          revenue: 7020,
          status: 'Active',
          phone: '+44 1244 377771',
          email: 'chester@toppstiles.co.uk',
        },
        {
          name: 'Topps Nantwich',
          address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
          deliveries: 98,
          revenue: 4410,
          status: 'Active',
          phone: '+44 1270 627771',
          email: 'nantwich@toppstiles.co.uk',
        },
        {
          name: 'Topps Newcastle',
          address: 'Unit 4, Lyme Court, ST5 3TF',
          deliveries: 210,
          revenue: 10500,
          status: 'Active',
          phone: '+44 1782 717771',
          email: 'newcastle@toppstiles.co.uk',
        },
        {
          name: 'Topps Northwich',
          address: 'Wadebrook Retail Park, CW9 5NN',
          deliveries: 134,
          revenue: 6030,
          status: 'Active',
          phone: '+44 1606 337771',
          email: 'northwich@toppstiles.co.uk',
        },
        {
          name: 'Topps Rhyl',
          address: '152 Vale Road, Rhyl, LL18 2PD',
          deliveries: 89,
          revenue: 4005,
          status: 'Active',
          phone: '+44 1745 337771',
          email: 'rhyl@toppstiles.co.uk',
        },
        {
          name: 'Topps Wrexham',
          address: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
          deliveries: 112,
          revenue: 5040,
          status: 'Active',
          phone: '+44 1978 357771',
          email: 'wrexham@toppstiles.co.uk',
        },
      ],
    },
    year: {
      stats: {
        totalDeliveries: 9588,
        totalRevenue: 431460,
        thisMonth: 234,
        avgPerDelivery: 45.0,
      },
      stores: [
        {
          name: 'Topps Chester',
          address: '4 Bumpers Lane, Sealand Ind Est, Chester, CH1 4LY',
          deliveries: 1872,
          revenue: 84240,
          status: 'Active',
          phone: '+44 1244 377771',
          email: 'chester@toppstiles.co.uk',
        },
        {
          name: 'Topps Nantwich',
          address: 'Unit 1, Nantwich Trade Park, CW5 6HL',
          deliveries: 1176,
          revenue: 52920,
          status: 'Active',
          phone: '+44 1270 627771',
          email: 'nantwich@toppstiles.co.uk',
        },
        {
          name: 'Topps Newcastle',
          address: 'Unit 4, Lyme Court, ST5 3TF',
          deliveries: 2520,
          revenue: 113400,
          status: 'Active',
          phone: '+44 1782 717771',
          email: 'newcastle@toppstiles.co.uk',
        },
        {
          name: 'Topps Northwich',
          address: 'Wadebrook Retail Park, CW9 5NN',
          deliveries: 1608,
          revenue: 72360,
          status: 'Active',
          phone: '+44 1606 337771',
          email: 'northwich@toppstiles.co.uk',
        },
        {
          name: 'Topps Rhyl',
          address: '152 Vale Road, Rhyl, LL18 2PD',
          deliveries: 1068,
          revenue: 48060,
          status: 'Active',
          phone: '+44 1745 337771',
          email: 'rhyl@toppstiles.co.uk',
        },
        {
          name: 'Topps Wrexham',
          address: 'Unit 7–9 Cambrian Price Ind. Est., Wrexham LL13 8DL',
          deliveries: 1344,
          revenue: 60480,
          status: 'Active',
          phone: '+44 1978 357771',
          email: 'wrexham@toppstiles.co.uk',
        },
      ],
    },
  };

  // Get current data based on time filter
  const currentData = useMemo(() => storeData[timeFilter], [timeFilter]);
  const stats = currentData.stats;
  const stores = currentData.stores;

  // Pagination calculations
  const totalItems = stores.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStores = stores.slice(startIndex, endIndex);

  // Reset to page 1 when time filter changes
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to store performance section
    const storeSection = document.getElementById('store-performance-section');
    if (storeSection) {
      storeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStore(null), 300);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Dashboard</h1>
            <p className="mt-2 text-gray-600">Overview of Topps Tiles stores performance</p>
          </div>
        </div>

        {/* Time Filter */}
        <div className="flex gap-2 rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          {['week', 'month', 'year'].map((filter) => (
            <button
              key={filter}
              onClick={() => handleTimeFilterChange(filter)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                timeFilter === filter
                  ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              This {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  £{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
              <div className="rounded-lg bg-teal-50 p-3">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Delivery</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  £{stats.avgPerDelivery.toFixed(2)}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Store Performance */}
        <div
          id="store-performance-section"
          className="rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-bold text-gray-900">Store Performance - Topps Tiles</h2>
            <p className="mt-1 text-sm text-gray-600">
              Showing {paginatedStores.length} of {totalItems} stores
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {paginatedStores.map((store, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md lg:flex-row lg:items-start lg:justify-between"
                >
                  {/* Store Info */}
                  <div className="flex items-start gap-4 lg:flex-1">
                    <div className="rounded-lg bg-teal-50 p-3">
                      <Building2 className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                      <p className="mt-1 text-sm text-gray-600">{store.address}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            store.status === 'Active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {store.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats and Actions Container */}
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-4">
                    {/* Stats */}
                    <div className="flex flex-col gap-2 lg:w-[220px]">
                      <div className="flex items-center justify-between rounded-md bg-blue-50 px-4 py-2.5">
                        <span className="text-sm font-medium text-blue-900">Deliveries</span>
                        <span className="text-base font-bold text-blue-600">
                          {store.deliveries}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-md bg-green-50 px-4 py-2.5">
                        <span className="text-sm font-medium text-green-900">Revenue</span>
                        <span className="text-base font-bold text-green-600">
                          £{store.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start lg:w-[140px]">
                      <button
                        onClick={() => openModal(store)}
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 transition-all hover:bg-teal-100"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>

        {/* Read-Only Notice */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Eye className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900">Read-Only Access</h3>
              <p className="mt-1 text-sm text-blue-700">
                You have view-only permissions for assigned store data. Contact an administrator to
                make changes to deliveries, invoices, or pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Details Modal */}
      {isModalOpen && selectedStore && (
        <div
          className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-teal-600 to-teal-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Store Details</h2>
              <button
                onClick={closeModal}
                className="hover:bg-opacity-20 rounded-lg p-1 text-white transition-colors hover:bg-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Store Info Section */}
                <div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-teal-50 p-3">
                      <Building2 className="h-8 w-8 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{selectedStore.name}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                            selectedStore.status === 'Active'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {selectedStore.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Address</p>
                        <p className="text-sm text-gray-600">{selectedStore.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Phone</p>
                        <p className="text-sm text-gray-600">{selectedStore.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Email</p>
                        <p className="text-sm text-gray-600">{selectedStore.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-gray-900">
                    Performance Metrics (
                    {timeFilter === 'week'
                      ? 'This Week'
                      : timeFilter === 'month'
                        ? 'This Month'
                        : 'This Year'}
                    )
                  </h4>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Total Deliveries</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {selectedStore.deliveries}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-2">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            £{selectedStore.revenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-900">View Only</h4>
                      <p className="mt-1 text-sm text-amber-700">
                        You can view store details and performance metrics. Contact your
                        administrator for permissions to modify store settings or delivery
                        schedules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaManagerDashboardHome;
