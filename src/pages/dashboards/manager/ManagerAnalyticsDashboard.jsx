import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Package, Users } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import axiosInstance from '../../../services/axiosInstance';

const ManagerAnalyticsDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [deliveriesByStatus, setDeliveriesByStatus] = useState({});
  const [recentDeliveries, setRecentDeliveries] = useState([]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/admin/analytics');
      const data = response.data?.data || {};
      setSummary(data.summary || {});
      setDeliveriesByStatus(data.deliveriesByStatus || {});
      setRecentDeliveries(
        (data.recentDeliveries || []).map((d) => ({
          id: d.id,
          spoNumber: d.spoNumber,
          customerName: d.customerName,
          driverName: d.driver?.fullName || 'N/A',
          deliveryDate: d.deliveryDate,
          timeSlot: d.timeSlot,
          amount: parseFloat(d.totalPrice || 0),
          status: d.status,
        }))
      );
    } catch {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // eslint-disable-next-line no-unused-vars
  const getDataByDateRange = () => {
    const dataByRange = {
      'this-week': {
        overviewStats: {
          totalRevenue: 12450.0,
          revenueChange: 12.5,
          totalDeliveries: 278,
          deliveriesChange: 8.3,
          avgRevenuePerDelivery: 44.78,
          avgChange: 3.8,
          totalVAT: 2490.0,
          vatChange: 12.5,
          outstandingInvoices: 1250.0,
          outstandingCount: 3,
          completionRate: 94.6,
          completionChange: 2.1,
        },
        storePerformance: [
          {
            id: 1,
            name: 'Topps Chester',
            deliveries: 52,
            revenue: 2340.0,
            change: 15.2,
            share: 18.7,
          },
          {
            id: 2,
            name: 'Topps Newcastle',
            deliveries: 48,
            revenue: 2400.0,
            change: -5.3,
            share: 17.3,
          },
          {
            id: 3,
            name: 'Topps Wrexham',
            deliveries: 45,
            revenue: 2025.0,
            change: 8.7,
            share: 16.2,
          },
          { id: 4, name: 'Topps Rhyl', deliveries: 42, revenue: 1890.0, change: 12.4, share: 15.1 },
          {
            id: 5,
            name: 'Topps Nantwich',
            deliveries: 38,
            revenue: 1710.0,
            change: 6.8,
            share: 13.7,
          },
          {
            id: 6,
            name: 'Topps Northwich',
            deliveries: 53,
            revenue: 2085.0,
            change: 18.9,
            share: 19.0,
          },
        ],
        driverPerformance: [
          {
            id: 1,
            name: 'BK',
            deliveries: 278,
            avgTime: '45 mins',
            completionRate: 94.6,
            lateDeliveries: 15,
            proofsAttached: 263,
            feedbackCount: 245,
            rating: 4.8,
          },
        ],
        weeklyData: [
          { day: 'Mon', deliveries: 42, revenue: 1890.0 },
          { day: 'Tue', deliveries: 38, revenue: 1710.0 },
          { day: 'Wed', deliveries: 45, revenue: 2025.0 },
          { day: 'Thu', deliveries: 52, revenue: 2340.0 },
          { day: 'Fri', deliveries: 48, revenue: 2160.0 },
          { day: 'Sat', deliveries: 35, revenue: 1575.0 },
          { day: 'Sun', deliveries: 18, revenue: 810.0 },
        ],
      },
      'last-week': {
        overviewStats: {
          totalRevenue: 11100.0,
          revenueChange: -10.8,
          totalDeliveries: 256,
          deliveriesChange: -7.9,
          avgRevenuePerDelivery: 43.36,
          avgChange: -3.2,
          totalVAT: 2220.0,
          vatChange: -10.8,
          outstandingInvoices: 980.0,
          outstandingCount: 2,
          completionRate: 92.5,
          completionChange: -2.1,
        },
        storePerformance: [
          {
            id: 1,
            name: 'Topps Chester',
            deliveries: 45,
            revenue: 2025.0,
            change: -13.5,
            share: 17.6,
          },
          {
            id: 2,
            name: 'Topps Newcastle',
            deliveries: 51,
            revenue: 2550.0,
            change: 6.3,
            share: 19.9,
          },
          {
            id: 3,
            name: 'Topps Wrexham',
            deliveries: 41,
            revenue: 1845.0,
            change: -8.9,
            share: 16.0,
          },
          {
            id: 4,
            name: 'Topps Rhyl',
            deliveries: 37,
            revenue: 1665.0,
            change: -11.9,
            share: 14.5,
          },
          {
            id: 5,
            name: 'Topps Nantwich',
            deliveries: 36,
            revenue: 1620.0,
            change: -5.3,
            share: 14.1,
          },
          {
            id: 6,
            name: 'Topps Northwich',
            deliveries: 46,
            revenue: 1840.0,
            change: -11.8,
            share: 18.0,
          },
        ],
        driverPerformance: [
          {
            id: 1,
            name: 'BK',
            deliveries: 256,
            avgTime: '47 mins',
            completionRate: 92.5,
            lateDeliveries: 19,
            proofsAttached: 237,
            feedbackCount: 223,
            rating: 4.6,
          },
        ],
        weeklyData: [
          { day: 'Mon', deliveries: 38, revenue: 1710.0 },
          { day: 'Tue', deliveries: 35, revenue: 1575.0 },
          { day: 'Wed', deliveries: 41, revenue: 1845.0 },
          { day: 'Thu', deliveries: 45, revenue: 2025.0 },
          { day: 'Fri', deliveries: 44, revenue: 1980.0 },
          { day: 'Sat', deliveries: 37, revenue: 1665.0 },
          { day: 'Sun', deliveries: 16, revenue: 720.0 },
        ],
      },
      'this-month': {
        overviewStats: {
          totalRevenue: 48800.0,
          revenueChange: 15.3,
          totalDeliveries: 1098,
          deliveriesChange: 12.7,
          avgRevenuePerDelivery: 44.44,
          avgChange: 2.3,
          totalVAT: 9760.0,
          vatChange: 15.3,
          outstandingInvoices: 3250.0,
          outstandingCount: 7,
          completionRate: 93.8,
          completionChange: 1.3,
        },
        storePerformance: [
          {
            id: 1,
            name: 'Topps Chester',
            deliveries: 205,
            revenue: 9225.0,
            change: 18.2,
            share: 18.9,
          },
          {
            id: 2,
            name: 'Topps Newcastle',
            deliveries: 192,
            revenue: 9600.0,
            change: 11.6,
            share: 17.5,
          },
          {
            id: 3,
            name: 'Topps Wrexham',
            deliveries: 178,
            revenue: 8010.0,
            change: 14.8,
            share: 16.2,
          },
          { id: 4, name: 'Topps Rhyl', deliveries: 165, revenue: 7425.0, change: 9.9, share: 15.0 },
          {
            id: 5,
            name: 'Topps Nantwich',
            deliveries: 151,
            revenue: 6795.0,
            change: 12.4,
            share: 13.8,
          },
          {
            id: 6,
            name: 'Topps Northwich',
            deliveries: 207,
            revenue: 8280.0,
            change: 20.3,
            share: 18.9,
          },
        ],
        driverPerformance: [
          {
            id: 1,
            name: 'BK',
            deliveries: 1098,
            avgTime: '46 mins',
            completionRate: 93.8,
            lateDeliveries: 68,
            proofsAttached: 1030,
            feedbackCount: 967,
            rating: 4.7,
          },
        ],
        weeklyData: [
          { day: 'Week 1', deliveries: 256, revenue: 11520.0 },
          { day: 'Week 2', deliveries: 278, revenue: 12510.0 },
          { day: 'Week 3', deliveries: 285, revenue: 12825.0 },
          { day: 'Week 4', deliveries: 279, revenue: 12555.0 },
        ],
      },
      'last-month': {
        overviewStats: {
          totalRevenue: 42300.0,
          revenueChange: -13.3,
          totalDeliveries: 974,
          deliveriesChange: -11.3,
          avgRevenuePerDelivery: 43.43,
          avgChange: -2.3,
          totalVAT: 8460.0,
          vatChange: -13.3,
          outstandingInvoices: 2100.0,
          outstandingCount: 5,
          completionRate: 92.5,
          completionChange: -1.3,
        },
        storePerformance: [
          {
            id: 1,
            name: 'Topps Chester',
            deliveries: 173,
            revenue: 7785.0,
            change: -15.6,
            share: 17.8,
          },
          {
            id: 2,
            name: 'Topps Newcastle',
            deliveries: 172,
            revenue: 8600.0,
            change: 0.6,
            share: 17.7,
          },
          {
            id: 3,
            name: 'Topps Wrexham',
            deliveries: 155,
            revenue: 6975.0,
            change: -10.9,
            share: 15.9,
          },
          {
            id: 4,
            name: 'Topps Rhyl',
            deliveries: 150,
            revenue: 6750.0,
            change: -3.2,
            share: 15.4,
          },
          {
            id: 5,
            name: 'Topps Nantwich',
            deliveries: 134,
            revenue: 6030.0,
            change: -10.7,
            share: 13.8,
          },
          {
            id: 6,
            name: 'Topps Northwich',
            deliveries: 190,
            revenue: 7600.0,
            change: 8.6,
            share: 19.5,
          },
        ],
        driverPerformance: [
          {
            id: 1,
            name: 'BK',
            deliveries: 974,
            avgTime: '48 mins',
            completionRate: 92.5,
            lateDeliveries: 73,
            proofsAttached: 901,
            feedbackCount: 845,
            rating: 4.5,
          },
        ],
        weeklyData: [
          { day: 'Week 1', deliveries: 234, revenue: 10530.0 },
          { day: 'Week 2', deliveries: 245, revenue: 11025.0 },
          { day: 'Week 3', deliveries: 251, revenue: 11295.0 },
          { day: 'Week 4', deliveries: 244, revenue: 10980.0 },
        ],
      },
      'this-year': {
        overviewStats: {
          totalRevenue: 585600.0,
          revenueChange: 22.8,
          totalDeliveries: 13200,
          deliveriesChange: 19.5,
          avgRevenuePerDelivery: 44.36,
          avgChange: 2.8,
          totalVAT: 117120.0,
          vatChange: 22.8,
          outstandingInvoices: 12500.0,
          outstandingCount: 28,
          completionRate: 94.2,
          completionChange: 2.7,
        },
        storePerformance: [
          {
            id: 1,
            name: 'Topps Chester',
            deliveries: 2464,
            revenue: 110880.0,
            change: 25.2,
            share: 18.7,
          },
          {
            id: 2,
            name: 'Topps Newcastle',
            deliveries: 2310,
            revenue: 115500.0,
            change: 15.8,
            share: 17.5,
          },
          {
            id: 3,
            name: 'Topps Wrexham',
            deliveries: 2145,
            revenue: 96525.0,
            change: 20.3,
            share: 16.3,
          },
          {
            id: 4,
            name: 'Topps Rhyl',
            deliveries: 1980,
            revenue: 89100.0,
            change: 18.7,
            share: 15.0,
          },
          {
            id: 5,
            name: 'Topps Nantwich',
            deliveries: 1815,
            revenue: 81675.0,
            change: 16.2,
            share: 13.8,
          },
          {
            id: 6,
            name: 'Topps Northwich',
            deliveries: 2486,
            revenue: 99440.0,
            change: 28.9,
            share: 18.8,
          },
        ],
        driverPerformance: [
          {
            id: 1,
            name: 'BK',
            deliveries: 13200,
            avgTime: '46 mins',
            completionRate: 94.2,
            lateDeliveries: 765,
            proofsAttached: 12435,
            feedbackCount: 11616,
            rating: 4.7,
          },
        ],
        weeklyData: [
          { day: 'Jan', deliveries: 1098, revenue: 48800.0 },
          { day: 'Feb', deliveries: 1045, revenue: 46980.0 },
          { day: 'Mar', deliveries: 1123, revenue: 50535.0 },
          { day: 'Apr', deliveries: 1089, revenue: 49005.0 },
          { day: 'May', deliveries: 1134, revenue: 51030.0 },
          { day: 'Jun', deliveries: 1156, revenue: 52020.0 },
          { day: 'Jul', deliveries: 1201, revenue: 54045.0 },
          { day: 'Aug', deliveries: 1178, revenue: 53010.0 },
          { day: 'Sep', deliveries: 1167, revenue: 52515.0 },
          { day: 'Oct', deliveries: 1189, revenue: 53505.0 },
          { day: 'Nov', deliveries: 1145, revenue: 51525.0 },
          { day: 'Dec', deliveries: 1175, revenue: 52875.0 },
        ],
      },
      custom: {
        overviewStats: {
          totalRevenue: 28900.0,
          revenueChange: 8.5,
          totalDeliveries: 645,
          deliveriesChange: 6.2,
          avgRevenuePerDelivery: 44.81,
          avgChange: 2.2,
          totalVAT: 5780.0,
          vatChange: 8.5,
          outstandingInvoices: 1890.0,
          outstandingCount: 4,
          completionRate: 93.2,
          completionChange: 0.7,
        },
        storePerformance: [
          {
            id: 1,
            name: 'Topps Chester',
            deliveries: 120,
            revenue: 5400.0,
            change: 10.1,
            share: 18.6,
          },
          {
            id: 2,
            name: 'Topps Newcastle',
            deliveries: 113,
            revenue: 5650.0,
            change: 5.6,
            share: 17.5,
          },
          {
            id: 3,
            name: 'Topps Wrexham',
            deliveries: 105,
            revenue: 4725.0,
            change: 7.7,
            share: 16.3,
          },
          { id: 4, name: 'Topps Rhyl', deliveries: 97, revenue: 4365.0, change: 6.6, share: 15.0 },
          {
            id: 5,
            name: 'Topps Nantwich',
            deliveries: 89,
            revenue: 4005.0,
            change: 8.5,
            share: 13.8,
          },
          {
            id: 6,
            name: 'Topps Northwich',
            deliveries: 121,
            revenue: 4840.0,
            change: 12.0,
            share: 18.8,
          },
        ],
        driverPerformance: [
          {
            id: 1,
            name: 'BK',
            deliveries: 645,
            avgTime: '45 mins',
            completionRate: 93.2,
            lateDeliveries: 44,
            proofsAttached: 601,
            feedbackCount: 567,
            rating: 4.7,
          },
        ],
        weeklyData: [
          { day: 'Period 1', deliveries: 161, revenue: 7245.0 },
          { day: 'Period 2', deliveries: 163, revenue: 7335.0 },
          { day: 'Period 3', deliveries: 159, revenue: 7155.0 },
          { day: 'Period 4', deliveries: 162, revenue: 7290.0 },
        ],
      },
    };

    return dataByRange['this-week'];
  };

  const overviewStats = {
    totalRevenue: parseFloat(summary.totalRevenue || 0),
    totalDeliveries: summary.totalDeliveries || 0,
    activeCustomers: summary.activeCustomers || 0,
  };

  // All deliveries data (API data)
  const allDeliveries = recentDeliveries;
  const _hardcodedDeliveries = [
    {
      id: 'DEL-001',
      customer: 'Topps Chester',
      driver: 'John Smith',
      status: 'Delivered',
      date: '2026-02-19',
      time: '10:30 AM',
      amount: 45.5,
      store: 'Topps Chester',
    },
    {
      id: 'DEL-002',
      customer: 'Topps Wrexham',
      driver: 'Sarah Johnson',
      status: 'Allocated',
      date: '2026-02-19',
      time: '11:15 AM',
      amount: 52.3,
      store: 'Topps Wrexham',
    },
    {
      id: 'DEL-003',
      customer: 'Topps Bangor',
      driver: 'Mike Wilson',
      status: 'Delivered',
      date: '2026-02-19',
      time: '09:45 AM',
      amount: 38.75,
      store: 'Topps Bangor',
    },
    {
      id: 'DEL-004',
      customer: 'Topps Conwy',
      driver: 'Emma Davis',
      status: 'Received',
      date: '2026-02-19',
      time: '12:00 PM',
      amount: 67.2,
      store: 'Topps Conwy',
    },
    {
      id: 'DEL-005',
      customer: 'Topps Llandudno',
      driver: 'David Brown',
      status: 'Delivered',
      date: '2026-02-18',
      time: '02:30 PM',
      amount: 41.9,
      store: 'Topps Llandudno',
    },
    {
      id: 'DEL-006',
      customer: 'Topps Chester',
      driver: 'John Smith',
      status: 'Allocated',
      date: '2026-02-18',
      time: '03:15 PM',
      amount: 55.8,
      store: 'Topps Chester',
    },
    {
      id: 'DEL-007',
      customer: 'Topps Wrexham',
      driver: 'Sarah Johnson',
      status: 'Delivered',
      date: '2026-02-18',
      time: '01:45 PM',
      amount: 48.3,
      store: 'Topps Wrexham',
    },
    {
      id: 'DEL-008',
      customer: 'Topps Bangor',
      driver: 'Mike Wilson',
      status: 'Cancelled',
      date: '2026-02-18',
      time: '04:00 PM',
      amount: 0.0,
      store: 'Topps Bangor',
    },
    {
      id: 'DEL-009',
      customer: 'Topps Conwy',
      driver: 'Emma Davis',
      status: 'Delivered',
      date: '2026-02-17',
      time: '10:00 AM',
      amount: 62.4,
      store: 'Topps Conwy',
    },
    {
      id: 'DEL-010',
      customer: 'Topps Llandudno',
      driver: 'David Brown',
      status: 'Delivered',
      date: '2026-02-17',
      time: '11:30 AM',
      amount: 39.5,
      store: 'Topps Llandudno',
    },
    {
      id: 'DEL-011',
      customer: 'Topps Chester',
      driver: 'John Smith',
      status: 'Allocated',
      date: '2026-02-17',
      time: '02:15 PM',
      amount: 71.2,
      store: 'Topps Chester',
    },
    {
      id: 'DEL-012',
      customer: 'Topps Wrexham',
      driver: 'Sarah Johnson',
      status: 'Delivered',
      date: '2026-02-17',
      time: '03:45 PM',
      amount: 44.6,
      store: 'Topps Wrexham',
    },
    {
      id: 'DEL-013',
      customer: 'Topps Bangor',
      driver: 'Mike Wilson',
      status: 'Received',
      date: '2026-02-16',
      time: '09:30 AM',
      amount: 58.9,
      store: 'Topps Bangor',
    },
    {
      id: 'DEL-014',
      customer: 'Topps Conwy',
      driver: 'Emma Davis',
      status: 'Delivered',
      date: '2026-02-16',
      time: '01:00 PM',
      amount: 36.7,
      store: 'Topps Conwy',
    },
    {
      id: 'DEL-015',
      customer: 'Topps Llandudno',
      driver: 'David Brown',
      status: 'Delivered',
      date: '2026-02-16',
      time: '02:30 PM',
      amount: 49.8,
      store: 'Topps Llandudno',
    },
    {
      id: 'DEL-016',
      customer: 'Topps Chester',
      driver: 'John Smith',
      status: 'Delivered',
      date: '2026-02-15',
      time: '10:45 AM',
      amount: 53.2,
      store: 'Topps Chester',
    },
    {
      id: 'DEL-017',
      customer: 'Topps Wrexham',
      driver: 'Sarah Johnson',
      status: 'Allocated',
      date: '2026-02-15',
      time: '11:20 AM',
      amount: 47.5,
      store: 'Topps Wrexham',
    },
    {
      id: 'DEL-018',
      customer: 'Topps Bangor',
      driver: 'Mike Wilson',
      status: 'Delivered',
      date: '2026-02-15',
      time: '03:00 PM',
      amount: 65.3,
      store: 'Topps Bangor',
    },
    {
      id: 'DEL-019',
      customer: 'Topps Conwy',
      driver: 'Emma Davis',
      status: 'Delivered',
      date: '2026-02-14',
      time: '09:15 AM',
      amount: 42.8,
      store: 'Topps Conwy',
    },
    {
      id: 'DEL-020',
      customer: 'Topps Llandudno',
      driver: 'David Brown',
      status: 'Delivered',
      date: '2026-02-14',
      time: '12:45 PM',
      amount: 56.9,
      store: 'Topps Llandudno',
    },
  ];

  // const getMaxValue = (data, key) => Math.max(...data.map((item) => item[key]));

  // Pagination logic for Deliveries
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDeliveries = allDeliveries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allDeliveries.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-2 sm:p-6 md:p-8 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Comprehensive performance metrics and reports</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total Deliveries</p>
              <p className="text-3xl font-bold text-gray-900">{overviewStats.totalDeliveries}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">{overviewStats.activeCustomers}</p>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Total Deliveries Table */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Package className="h-6 w-6 text-teal-600" />
            Total Deliveries Details
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, allDeliveries.length)} of{' '}
            {allDeliveries.length} deliveries
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Delivery ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Store
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-teal-600">{delivery.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{delivery.customerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{delivery.driverName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{delivery.deliveryDate}</p>
                    <p className="text-sm text-gray-600">{delivery.timeSlot}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-teal-600">£{delivery.amount.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        delivery.status === 'Delivered'
                          ? 'bg-green-100 text-green-600'
                          : delivery.status === 'Allocated'
                            ? 'bg-blue-100 text-blue-600'
                            : delivery.status === 'Received'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allDeliveries.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={allDeliveries.length}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerAnalyticsDashboard;
