import React, { useState } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Truck,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import Pagination from '../../../components/Pagination';

const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState('this-week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dynamic data based on date range
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

    return dataByRange[dateRange] || dataByRange['this-week'];
  };

  const currentData = getDataByDateRange();
  const overviewStats = currentData.overviewStats;
  const storePerformance = currentData.storePerformance;
  const driverPerformance = currentData.driverPerformance;
  const weeklyData = currentData.weeklyData;

  const monthlyTrends = [
    { month: 'Aug', revenue: 48500, deliveries: 1078 },
    { month: 'Sep', revenue: 51200, deliveries: 1138 },
    { month: 'Oct', revenue: 49800, deliveries: 1106 },
    { month: 'Nov', revenue: 52600, deliveries: 1169 },
    { month: 'Dec', revenue: 54300, deliveries: 1207 },
    { month: 'Jan', revenue: 12450, deliveries: 278 },
  ];

  const handleExport = (format) => {
    if (format === 'csv') {
      exportCSV();
    } else if (format === 'pdf') {
      exportPDF();
    }
  };

  const exportCSV = () => {
    let csvContent = '';

    if (selectedMetric === 'overview' || selectedMetric === 'stores') {
      // Overview Stats CSV
      csvContent += 'Overview Statistics\n';
      csvContent += 'Metric,Value,Change\n';
      csvContent += `Total Revenue,£${overviewStats.totalRevenue.toLocaleString()},${overviewStats.revenueChange}%\n`;
      csvContent += `Total Deliveries,${overviewStats.totalDeliveries},${overviewStats.deliveriesChange}%\n`;
      csvContent += `Avg Revenue/Delivery,£${overviewStats.avgRevenuePerDelivery},${overviewStats.avgChange}%\n`;
      csvContent += `Total VAT,£${overviewStats.totalVAT.toLocaleString()},${overviewStats.vatChange}%\n`;
      csvContent += `Outstanding Invoices,£${overviewStats.outstandingInvoices.toLocaleString()},${overviewStats.outstandingCount} invoices\n`;
      csvContent += `Completion Rate,${overviewStats.completionRate}%,${overviewStats.completionChange}%\n\n`;
    }

    if (selectedMetric === 'stores' || selectedMetric === 'overview') {
      // Store Performance CSV
      csvContent += 'Store Performance\n';
      csvContent += 'Store Name,Deliveries,Revenue,Change %,Market Share %\n';
      storePerformance.forEach((store) => {
        csvContent += `${store.name},${store.deliveries},£${store.revenue.toLocaleString()},${store.change}%,${store.share}%\n`;
      });
      csvContent += '\n';
    }

    if (selectedMetric === 'drivers' || selectedMetric === 'overview') {
      // Driver Performance CSV
      csvContent += 'Driver Performance\n';
      csvContent +=
        'Driver,Deliveries,Avg Time,Completion Rate,Late Deliveries,Proofs Attached,Feedback Count,Rating\n';
      driverPerformance.forEach((driver) => {
        csvContent += `${driver.name},${driver.deliveries},${driver.avgTime},${driver.completionRate}%,${driver.lateDeliveries},${driver.proofsAttached},${driver.feedbackCount},${driver.rating}\n`;
      });
      csvContent += '\n';
    }

    if (selectedMetric === 'trends' || selectedMetric === 'overview') {
      // Weekly Data CSV
      csvContent += 'Weekly Performance\n';
      csvContent += 'Day,Deliveries,Revenue\n';
      weeklyData.forEach((day) => {
        csvContent += `${day.day},${day.deliveries},£${day.revenue.toLocaleString()}\n`;
      });
      csvContent += '\n';

      // Monthly Trends CSV
      csvContent += 'Monthly Trends\n';
      csvContent += 'Month,Revenue,Deliveries\n';
      monthlyTrends.forEach((month) => {
        csvContent += `${month.month},£${month.revenue.toLocaleString()},${month.deliveries}\n`;
      });
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `analytics_${selectedMetric}_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = async () => {
    // Dynamic import jsPDF
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    const lineHeight = 7;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(13, 148, 136); // Teal color
    doc.text('M19 LOGISTICS', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Analytics Dashboard Report', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      margin,
      yPosition
    );
    yPosition += 5;
    doc.text(`Date Range: ${dateRange}`, margin, yPosition);
    yPosition += 5;
    doc.text(
      `Report Type: ${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}`,
      margin,
      yPosition
    );
    yPosition += 10;

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    if (selectedMetric === 'overview' || selectedMetric === 'stores') {
      // Overview Statistics
      doc.setFontSize(14);
      doc.setTextColor(13, 148, 136);
      doc.text('Overview Statistics', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const overviewData = [
        [
          'Total Revenue:',
          `£${overviewStats.totalRevenue.toLocaleString()}`,
          `+${overviewStats.revenueChange}%`,
        ],
        [
          'Total Deliveries:',
          `${overviewStats.totalDeliveries}`,
          `+${overviewStats.deliveriesChange}%`,
        ],
        [
          'Avg Revenue/Delivery:',
          `£${overviewStats.avgRevenuePerDelivery}`,
          `+${overviewStats.avgChange}%`,
        ],
        [
          'Total VAT:',
          `£${overviewStats.totalVAT.toLocaleString()}`,
          `+${overviewStats.vatChange}%`,
        ],
        [
          'Outstanding Invoices:',
          `£${overviewStats.outstandingInvoices.toLocaleString()}`,
          `${overviewStats.outstandingCount} invoices`,
        ],
        [
          'Completion Rate:',
          `${overviewStats.completionRate}%`,
          `+${overviewStats.completionChange}%`,
        ],
      ];

      overviewData.forEach(([label, value, change]) => {
        doc.text(label, margin, yPosition);
        doc.text(value, margin + 60, yPosition);
        doc.setTextColor(0, 128, 0);
        doc.text(change, margin + 110, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += lineHeight;
      });

      yPosition += 5;
    }

    if (selectedMetric === 'stores' || selectedMetric === 'overview') {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Store Performance
      doc.setFontSize(14);
      doc.setTextColor(13, 148, 136);
      doc.text('Store Performance', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text('Store', margin, yPosition);
      doc.text('Deliveries', margin + 60, yPosition);
      doc.text('Revenue', margin + 90, yPosition);
      doc.text('Change', margin + 120, yPosition);
      doc.text('Share', margin + 145, yPosition);
      yPosition += 6;
      doc.setFont(undefined, 'normal');

      storePerformance.forEach((store) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(store.name, margin, yPosition);
        doc.text(store.deliveries.toString(), margin + 60, yPosition);
        doc.text(`£${store.revenue.toLocaleString()}`, margin + 90, yPosition);
        doc.setTextColor(store.change > 0 ? 0 : 255, store.change > 0 ? 128 : 0, 0);
        doc.text(`${store.change > 0 ? '+' : ''}${store.change}%`, margin + 120, yPosition);
        doc.setTextColor(0, 0, 0);
        doc.text(`${store.share}%`, margin + 145, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 5;
    }

    if (selectedMetric === 'drivers' || selectedMetric === 'overview') {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Driver Performance
      doc.setFontSize(14);
      doc.setTextColor(13, 148, 136);
      doc.text('Driver Performance', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);

      driverPerformance.forEach((driver) => {
        doc.setFont(undefined, 'bold');
        doc.text(`Driver: ${driver.name}`, margin, yPosition);
        yPosition += 6;
        doc.setFont(undefined, 'normal');

        doc.text(`Deliveries: ${driver.deliveries}`, margin + 5, yPosition);
        doc.text(`Avg Time: ${driver.avgTime}`, margin + 60, yPosition);
        yPosition += 6;
        doc.text(`Completion Rate: ${driver.completionRate}%`, margin + 5, yPosition);
        doc.text(`Late: ${driver.lateDeliveries}`, margin + 60, yPosition);
        yPosition += 6;
        doc.text(`Proofs: ${driver.proofsAttached}`, margin + 5, yPosition);
        doc.text(`Feedback: ${driver.feedbackCount}`, margin + 60, yPosition);
        yPosition += 6;
        doc.text(`Rating: ${driver.rating}/5.0`, margin + 5, yPosition);
        yPosition += 8;
      });
    }

    if (selectedMetric === 'trends' || selectedMetric === 'overview') {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      // Weekly Performance
      doc.setFontSize(14);
      doc.setTextColor(13, 148, 136);
      doc.text('Weekly Performance', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text('Day', margin, yPosition);
      doc.text('Deliveries', margin + 40, yPosition);
      doc.text('Revenue', margin + 80, yPosition);
      yPosition += 6;
      doc.setFont(undefined, 'normal');

      weeklyData.forEach((day) => {
        doc.text(day.day, margin, yPosition);
        doc.text(day.deliveries.toString(), margin + 40, yPosition);
        doc.text(`£${day.revenue.toLocaleString()}`, margin + 80, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 8;

      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      // Monthly Trends
      doc.setFontSize(14);
      doc.setTextColor(13, 148, 136);
      doc.text('Monthly Trends', margin, yPosition);
      yPosition += 8;

      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text('Month', margin, yPosition);
      doc.text('Revenue', margin + 40, yPosition);
      doc.text('Deliveries', margin + 80, yPosition);
      yPosition += 6;
      doc.setFont(undefined, 'normal');

      monthlyTrends.forEach((month, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(month.month, margin, yPosition);
        doc.text(`£${month.revenue.toLocaleString()}`, margin + 40, yPosition);
        doc.text(month.deliveries.toString(), margin + 80, yPosition);

        if (index > 0) {
          const prevRevenue = monthlyTrends[index - 1].revenue;
          const change = (((month.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1);
          doc.setTextColor(parseFloat(change) > 0 ? 0 : 255, parseFloat(change) > 0 ? 128 : 0, 0);
          doc.text(`${parseFloat(change) > 0 ? '+' : ''}${change}%`, margin + 120, yPosition);
          doc.setTextColor(0, 0, 0);
        }
        yPosition += lineHeight;
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
      doc.text('M19 Logistics - Confidential', margin, doc.internal.pageSize.height - 10);
    }

    // Save PDF
    doc.save(
      `analytics_${selectedMetric}_${dateRange}_${new Date().toISOString().split('T')[0]}.pdf`
    );
  };

  const getMaxValue = (data, key) => Math.max(...data.map((item) => item[key]));

  // Pagination logic for Store Performance
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStores = storePerformance.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(storePerformance.length / itemsPerPage);

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

      {/* Date Range Selector */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <span className="text-sm font-semibold text-gray-700">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
            >
              <option value="this-week">This Week</option>
              <option value="last-week">Last Week</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === 'custom' && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                />
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-2 text-white shadow-md transition-all hover:shadow-lg"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.totalRevenue.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.revenueChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.revenueChange > 0 ? '+' : ''}
                  {overviewStats.revenueChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
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
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.deliveriesChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.deliveriesChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.deliveriesChange > 0 ? '+' : ''}
                  {overviewStats.deliveriesChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <Package className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Avg Revenue/Delivery</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.avgRevenuePerDelivery}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.avgChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.avgChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.avgChange > 0 ? '+' : ''}
                  {overviewStats.avgChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <TrendingUp className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Total VAT Collected</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.totalVAT.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.vatChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.vatChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.vatChange > 0 ? '+' : ''}
                  {overviewStats.vatChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <FileText className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Outstanding Invoices</p>
              <p className="text-3xl font-bold text-gray-900">
                £{overviewStats.outstandingInvoices.toLocaleString()}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-sm text-gray-500">
                  {overviewStats.outstandingCount} unpaid invoices
                </span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <XCircle className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="mb-1 text-sm text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{overviewStats.completionRate}%</p>
              <div className="mt-2 flex items-center gap-1">
                {overviewStats.completionChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-semibold ${overviewStats.completionChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {overviewStats.completionChange > 0 ? '+' : ''}
                  {overviewStats.completionChange}%
                </span>
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="rounded-lg bg-teal-50 p-3">
              <CheckCircle className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMetric('overview')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'overview'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedMetric('stores')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'stores'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Store Performance
          </button>
          <button
            onClick={() => setSelectedMetric('drivers')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'drivers'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Driver Analytics
          </button>
          <button
            onClick={() => setSelectedMetric('trends')}
            className={`rounded-lg px-4 py-2 font-medium transition-all ${
              selectedMetric === 'trends'
                ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Trends & Charts
          </button>
        </div>
      </div>

      {/* Overview Content */}
      {selectedMetric === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Revenue Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <DollarSign className="h-5 w-5 text-teal-600" />
                  Revenue Overview
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="text-lg font-bold text-teal-600">
                    £{overviewStats.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total VAT</span>
                  <span className="text-lg font-bold text-gray-900">
                    £{overviewStats.totalVAT.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg per Delivery</span>
                  <span className="text-lg font-bold text-gray-900">
                    £{overviewStats.avgRevenuePerDelivery}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Outstanding</span>
                  <span className="text-lg font-bold text-red-600">
                    £{overviewStats.outstandingInvoices.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Summary */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Package className="h-5 w-5 text-teal-600" />
                  Delivery Overview
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Deliveries</span>
                  <span className="text-lg font-bold text-teal-600">
                    {overviewStats.totalDeliveries}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-lg font-bold text-green-600">
                    {overviewStats.completionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Invoices</span>
                  <span className="text-lg font-bold text-gray-900">
                    {overviewStats.outstandingCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Change vs Last Period</span>
                  <span
                    className={`text-lg font-bold ${overviewStats.deliveriesChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {overviewStats.deliveriesChange > 0 ? '+' : ''}
                    {overviewStats.deliveriesChange}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Stores */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                Top Performing Stores
              </h3>
            </div>
            <div className="space-y-3">
              {storePerformance
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((store, index) => (
                  <div key={store.id} className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-600">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{store.name}</p>
                      <p className="text-sm text-gray-600">
                        {store.deliveries} deliveries • £{store.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${store.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {store.change > 0 ? '+' : ''}
                        {store.change}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                {overviewStats.revenueChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p
                className={`text-2xl font-bold ${overviewStats.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {overviewStats.revenueChange > 0 ? '+' : ''}
                {overviewStats.revenueChange}%
              </p>
              <p className="mt-1 text-xs text-gray-500">vs last period</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Delivery Growth</span>
                {overviewStats.deliveriesChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p
                className={`text-2xl font-bold ${overviewStats.deliveriesChange > 0 ? 'text-green-600' : 'text-red-600'}`}
              >
                {overviewStats.deliveriesChange > 0 ? '+' : ''}
                {overviewStats.deliveriesChange}%
              </p>
              <p className="mt-1 text-xs text-gray-500">vs last period</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{overviewStats.completionRate}%</p>
              <p className="mt-1 text-xs text-gray-500">
                {overviewStats.completionChange > 0 ? '+' : ''}
                {overviewStats.completionChange}% vs last period
              </p>
            </div>
          </div>

          {/* Weekly Trend Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <LineChart className="h-5 w-5 text-teal-600" />
                {dateRange === 'this-month' || dateRange === 'last-month' ? 'Weekly' : 'Daily'}{' '}
                Performance
              </h3>
            </div>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-semibold text-gray-600">{day.day}</div>
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="flex h-8 items-center justify-end rounded-full bg-gradient-to-r from-teal-600 to-teal-500 pr-3 transition-all"
                        style={{
                          width: `${(day.deliveries / getMaxValue(weeklyData, 'deliveries')) * 100}%`,
                        }}
                      >
                        <span className="text-sm font-semibold text-white">{day.deliveries}</span>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm font-bold text-teal-600">
                        £{day.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Store Performance View */}
      {selectedMetric === 'stores' && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <BarChart3 className="h-6 w-6 text-teal-600" />
              Store Performance Analysis
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Store
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Deliveries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Market Share
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentStores.map((store) => (
                  <tr key={store.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{store.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{store.deliveries}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-teal-600">
                        £{store.revenue.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {store.change > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-semibold ${store.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {store.change > 0 ? '+' : ''}
                          {store.change}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 max-w-[100px] flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500"
                            style={{ width: `${store.share * 5}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{store.share}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          store.change > 15
                            ? 'bg-green-100 text-green-600'
                            : store.change > 5
                              ? 'bg-teal-100 text-teal-600'
                              : store.change > 0
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {store.change > 15
                          ? 'Excellent'
                          : store.change > 5
                            ? 'Good'
                            : store.change > 0
                              ? 'Average'
                              : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {storePerformance.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={storePerformance.length}
            />
          )}
        </div>
      )}

      {/* Driver Analytics View */}
      {selectedMetric === 'drivers' && (
        <div className="space-y-6">
          {driverPerformance.map((driver) => (
            <div
              key={driver.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 text-2xl font-bold text-white shadow-md">
                    {driver.name}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{driver.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {driver.rating}/5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-teal-50 px-4 py-2">
                  <p className="text-xs text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-teal-600">{driver.completionRate}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Deliveries</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.deliveries}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Avg Time</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.avgTime}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Late</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.lateDeliveries}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Proofs</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.proofsAttached}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Feedback</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{driver.feedbackCount}</p>
                </div>

                <div className="rounded-lg bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-teal-600" />
                    <p className="text-xs text-gray-600">Efficiency</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">98%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trends & Charts View */}
      {selectedMetric === 'trends' && (
        <div className="space-y-6">
          {/* Weekly Bar Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <BarChart3 className="h-6 w-6 text-teal-600" />
                Weekly Deliveries & Revenue
              </h2>
            </div>
            <div className="space-y-3">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-semibold text-gray-600">{day.day}</div>
                  <div className="flex flex-1 items-center gap-4">
                    <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="flex h-8 items-center justify-end rounded-full bg-gradient-to-r from-teal-600 to-teal-500 pr-3 transition-all"
                        style={{
                          width: `${(day.deliveries / getMaxValue(weeklyData, 'deliveries')) * 100}%`,
                        }}
                      >
                        <span className="text-sm font-semibold text-white">{day.deliveries}</span>
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm font-bold text-teal-600">
                        £{day.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <LineChart className="h-6 w-6 text-teal-600" />
                Monthly Revenue Trends
              </h2>
            </div>
            <div className="space-y-3">
              {monthlyTrends.map((month, index) => {
                const prevRevenue = index > 0 ? monthlyTrends[index - 1].revenue : month.revenue;
                const change = (((month.revenue - prevRevenue) / prevRevenue) * 100).toFixed(1);
                return (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-semibold text-gray-600">{month.month}</div>
                    <div className="flex flex-1 items-center gap-4">
                      <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="flex h-8 items-center justify-end rounded-full bg-gradient-to-r from-teal-600 to-teal-500 pr-3 transition-all"
                          style={{
                            width: `${(month.revenue / getMaxValue(monthlyTrends, 'revenue')) * 100}%`,
                          }}
                        >
                          <span className="text-sm font-semibold text-white">
                            {month.deliveries}
                          </span>
                        </div>
                      </div>
                      <div className="w-32 text-right">
                        <p className="text-sm font-bold text-teal-600">
                          £{month.revenue.toLocaleString()}
                        </p>
                        {index > 0 && (
                          <p
                            className={`text-xs font-semibold ${parseFloat(change) > 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {parseFloat(change) > 0 ? '+' : ''}
                            {change}%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Store Share Pie Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                <PieChart className="h-6 w-6 text-teal-600" />
                Store Market Share
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-64">
                  <svg viewBox="0 0 100 100" className="-rotate-90 transform">
                    {
                      storePerformance.reduce(
                        (acc, store, index) => {
                          const colors = [
                            '#0d9488',
                            '#14b8a6',
                            '#2dd4bf',
                            '#5eead4',
                            '#99f6e4',
                            '#ccfbf1',
                          ];
                          const startAngle = acc.angle;
                          const angle = (store.share / 100) * 360;
                          const endAngle = startAngle + angle;
                          const largeArc = angle > 180 ? 1 : 0;

                          const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                          const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                          const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                          const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

                          acc.paths.push(
                            <path
                              key={store.id}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={colors[index]}
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          );
                          acc.angle = endAngle;
                          return acc;
                        },
                        { angle: 0, paths: [] }
                      ).paths
                    }
                    <circle cx="50" cy="50" r="20" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{storePerformance.length}</p>
                      <p className="text-xs text-gray-600">Stores</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {storePerformance.map((store, index) => {
                  const colors = [
                    'bg-teal-600',
                    'bg-teal-500',
                    'bg-teal-400',
                    'bg-teal-300',
                    'bg-teal-200',
                    'bg-teal-100',
                  ];
                  return (
                    <div
                      key={store.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded ${colors[index]}`} />
                        <span className="text-sm font-semibold text-gray-900">{store.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal-600">{store.share}%</p>
                        <p className="text-xs text-gray-500">{store.deliveries} deliveries</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
