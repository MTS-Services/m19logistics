import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import RootLayout from './layout/RootLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Public pages
import HomeView from '../pages/public/public_Home/HomeView';
import AboutView from '../pages/public/public_about/AboutView';
import ContactView from '../pages/public/public_contact/ContactView';
import EnquiriesView from '../pages/public/public_enquiries/EnquiriesView';

// Auth pages
import LoginView from '../pages/auth/LoginView';

// Dashboard pages
import AdminDashboard from '../pages/dashboards/admin/AdminDashboard';
import AdminDashboardHome from '../pages/dashboards/admin/AdminDashboardHome';
import BookingsBoard from '../pages/dashboards/admin/BookingsBoard';
import UsersManagement from '../pages/dashboards/admin/UsersManagement';
import DriverManagement from '../pages/dashboards/admin/DriverManagement';
import InvoicesManagement from '../pages/dashboards/admin/InvoicesManagement';
import PricingManagement from '../pages/dashboards/admin/PricingManagement';
import AnalyticsDashboard from '../pages/dashboards/admin/AnalyticsDashboard';
import SettingsManagement from '../pages/dashboards/admin/SettingsManagement';
import CustomerDashboard from '../pages/dashboards/customer/CustomerDashboard';
import DriverDashboardLayout from '../pages/dashboards/driver/DriverDashboardLayout';
import AreaManagerDashboardLayout from '../pages/dashboards/area-manager/AreaManagerDashboardLayout';

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
        <Route path="dashboard" element={<AdminDashboardHome />} />
        <Route path="bookings" element={<BookingsBoard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="drivers" element={<DriverManagement />} />
        <Route path="invoices" element={<InvoicesManagement />} />
        <Route path="pricing" element={<PricingManagement />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="settings" element={<SettingsManagement />} />
      </Route>

      {/* Customer Routes */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}
      <Route
        path="/driver/*"
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverDashboardLayout />
          </ProtectedRoute>
        }
      />

      {/* Area Manager Routes */}
      <Route
        path="/area-manager/*"
        element={
          <ProtectedRoute allowedRoles={['area_manager']}>
            <AreaManagerDashboardLayout />
          </ProtectedRoute>
        }
      />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<UnauthorizedView />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);

export default router;
