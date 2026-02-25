import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import RootLayout from './layout/RootLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Public pages
import HomeView from '../pages/public/public_Home/HomeView';
import AboutView from '../pages/public/public_about/AboutView';
import ContactView from '../pages/public/public_contact/ContactView';
import EnquiriesView from '../pages/public/public_enquiries/EnquiriesView';
import JobsView from '../pages/public/public_jobs/JobsView';

// Auth pages
import LoginView from '../pages/auth/LoginView';

// Dashboard pages - Admin
import AdminDashboard from '../pages/dashboards/admin/AdminDashboard';
import AdminDashboardHome from '../pages/dashboards/admin/AdminDashboardHome';
import BookingsBoard from '../pages/dashboards/admin/bookings/BookingsBoard';
import AllocateDriverPage from '../pages/dashboards/admin/bookings/AllocateDriverPage';
import UsersManagement from '../pages/dashboards/admin/userManagement/UsersManagement';
import DriverManagement from '../pages/dashboards/admin/driverManagement/DriverManagement';
import InvoicesManagement from '../pages/dashboards/admin/invoiceManagement/InvoicesManagement';
import PricingManagement from '../pages/dashboards/admin/PricingManagement';
import AnalyticsDashboard from '../pages/dashboards/admin/AnalyticsDashboard';
import SettingsManagement from '../pages/dashboards/admin/SettingsManagement';
import SlotsManagement from '../pages/dashboards/admin/SlotsManagement';
import ContactsManagement from '../pages/dashboards/admin/contactManagement/ContactsManagement';
import EnquiriesManagement from '../pages/dashboards/admin/enquiryManagement/EnquiriesManagement';
import AdminAuditLogs from '../pages/dashboards/admin/adminauditlog/AuditLogs';
import JobApplicationsManagement from '../pages/dashboards/admin/jobApplications/JobApplicationsManagement';

// Dashboard pages - Customer
import CustomerDashboard from '../pages/dashboards/customer/CustomerDashboard';
import CustomerDashboardHome from '../pages/dashboards/customer/CustomerDashboardHome';
import NewDelivery from '../pages/dashboards/customer/NewDelivery';
import DeliveryHistory from '../pages/dashboards/customer/DeliveryHistory';
import CustomerInvoices from '../pages/dashboards/customer/Invoices';
import CustomerProfile from '../pages/dashboards/customer/Profile';
import AuditLogs from '../pages/dashboards/customer/auditLogs/AuditLogs';

// Dashboard pages - Driver
import DriverDashboardLayout from '../pages/dashboards/driver/DriverDashboardLayout';
import DriverDashboardHome from '../pages/dashboards/driver/DriverDashboardHome';
import AssignedDeliveries from '../pages/dashboards/driver/AssignedDeliveries';
import CompletedDeliveries from '../pages/dashboards/driver/CompletedDeliveries';
import DriverProfile from '../pages/dashboards/driver/DriverProfile';

// Dashboard pages - Area Manager
import AreaManagerDashboardLayout from '../pages/dashboards/area-manager/AreaManagerDashboardLayout';
import AreaManagerDashboardHome from '../pages/dashboards/area-manager/AreaManagerDashboardHome';
import StoreDeliveries from '../pages/dashboards/area-manager/StoreDeliveries';
import StoreInvoices from '../pages/dashboards/area-manager/StoreInvoices';
import StoreAnalytics from '../pages/dashboards/area-manager/StoreAnalytics';
import AreaManagerProfile from '../pages/dashboards/area-manager/AreaManagerProfile';

// Dashboard pages - Manager
import ManagerDashboard from '../pages/dashboards/manager/ManagerDashboard';
import ManagerDashboardHome from '../pages/dashboards/manager/ManagerDashboardHome';
import ManagerBookingsBoard from '../pages/dashboards/manager/ManagerBookingsBoard';
import ManagerAllocateDriverPage from '../pages/dashboards/manager/ManagerAllocateDriverPage';
import ManagerDriverManagement from '../pages/dashboards/manager/ManagerDriverManagement';
import ManagerInvoicesManagement from '../pages/dashboards/manager/ManagerInvoicesManagement';
import ManagerAnalyticsDashboard from '../pages/dashboards/manager/ManagerAnalyticsDashboard';
import ManagerProfile from '../pages/dashboards/manager/ManagerProfile';

// Error pages
import NotFound from '../pages/error/NotFound';
import UnauthorizedView from '../pages/error/UnauthorizedView';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomeView />} />
        <Route path="about" element={<AboutView />} />
        <Route path="contact" element={<ContactView />} />
        <Route path="enquiries" element={<EnquiriesView />} />
        <Route path="jobs" element={<JobsView />} />
        <Route path="login" element={<LoginView />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardHome />} />
        <Route path="dashboard" element={<AdminDashboardHome />} />
        <Route path="bookings" element={<BookingsBoard />} />
        <Route path="bookings/allocate" element={<AllocateDriverPage />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="drivers" element={<DriverManagement />} />
        <Route path="contacts" element={<ContactsManagement />} />
        <Route path="enquiries" element={<EnquiriesManagement />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="job-applications" element={<JobApplicationsManagement />} />
        <Route path="slots" element={<SlotsManagement />} />
        <Route path="invoices" element={<InvoicesManagement />} />
        <Route path="pricing" element={<PricingManagement />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="settings" element={<SettingsManagement />} />
      </Route>

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboardHome />} />
        <Route path="new-delivery" element={<NewDelivery />} />
        <Route path="deliveries" element={<DeliveryHistory />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* Driver Routes */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DriverDashboardHome />} />
        <Route path="dashboard" element={<DriverDashboardHome />} />
        <Route path="assigned" element={<AssignedDeliveries />} />
        <Route path="completed" element={<CompletedDeliveries />} />
        <Route path="profile" element={<DriverProfile />} />
      </Route>

      {/* Area Manager Routes */}
      <Route
        path="/area-manager"
        element={
          <ProtectedRoute allowedRoles={['area_manager']}>
            <AreaManagerDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AreaManagerDashboardHome />} />
        <Route path="dashboard" element={<AreaManagerDashboardHome />} />
        <Route path="deliveries" element={<StoreDeliveries />} />
        <Route path="invoices" element={<StoreInvoices />} />
        {/* <Route path="analytics" element={<StoreAnalytics />} /> */}
        <Route path="profile" element={<AreaManagerProfile />} />
      </Route>

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboardHome />} />
        <Route path="dashboard" element={<ManagerDashboardHome />} />
        <Route path="bookings" element={<ManagerBookingsBoard />} />
        <Route path="bookings/allocate" element={<ManagerAllocateDriverPage />} />
        <Route path="drivers" element={<ManagerDriverManagement />} />
        <Route path="store-deliveries" element={<StoreDeliveries />} />
        <Route path="store-invoices" element={<StoreInvoices />} />
        {/* <Route path="store-analytics" element={<StoreAnalytics />} /> */}
        {/* <Route path="invoices" element={<ManagerInvoicesManagement />} /> */}
        <Route path="analytics" element={<ManagerAnalyticsDashboard />} />
        <Route path="profile" element={<ManagerProfile />} />
      </Route>

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedView />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default router;
