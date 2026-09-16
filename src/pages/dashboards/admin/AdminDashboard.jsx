import React, { useState, useEffect, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  ChevronDown,
  Calendar,
  MessageSquare,
  HelpCircle,
  Briefcase,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance';
import { ENDPOINT } from '../../../services/httpEndpoint';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({
    contacts: 0,
    enquiries: 0,
    jobApplications: 0,
    total: 0,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(ENDPOINT.API.ADMIN_NOTIFICATIONS.UNREAD_COUNTS);
      const data = response.data?.data || {};

      setUnreadCounts({
        contacts: data.contacts ?? 0,
        enquiries: data.enquiries ?? 0,
        jobApplications: data.jobApplications ?? 0,
        total: data.total ?? 0,
      });
    } catch (error) {
      console.error('Failed to fetch unread sidebar counts:', error);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCounts]);

  useEffect(() => {
    if (
      location.pathname.startsWith('/admin/contacts') ||
      location.pathname.startsWith('/admin/enquiries') ||
      location.pathname.startsWith('/admin/job-applications')
    ) {
      fetchUnreadCounts();
    }
  }, [location.pathname, fetchUnreadCounts]);

  const navigationSections = [
    {
      title: 'Main',
      items: [{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Operations',
      items: [
        { name: 'Bookings', href: '/admin/bookings', icon: Package },
        { name: 'Create Job', href: '/admin/create-job', icon: PlusCircle },
        { name: 'My Bookings', href: '/admin/my-bookings', icon: FileText },
        { name: 'Failed Deliveries', href: '/admin/failed-deliveries', icon: AlertTriangle },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Drivers', href: '/admin/drivers', icon: Truck },
        {
          name: 'Contacts',
          href: '/admin/contacts',
          icon: MessageSquare,
          badgeKey: 'contacts',
        },
        {
          name: 'Enquiries',
          href: '/admin/enquiries',
          icon: HelpCircle,
          badgeKey: 'enquiries',
        },
        {
          name: 'Jobs Application',
          href: '/admin/job-applications',
          icon: Briefcase,
          badgeKey: 'jobApplications',
        },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
        { name: 'Slots', href: '/admin/slots', icon: Calendar },
      ],
    },
    {
      title: 'Finance',
      items: [
        { name: 'Invoices', href: '/admin/invoices', icon: FileText },
        { name: 'Contractor Invoice', href: '/admin/contractor-invoices', icon: FileText },
        { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'System',
      items: [{ name: 'Settings', href: '/admin/settings', icon: Settings }],
    },
  ];

  const isActive = (path) => location.pathname === path;

  const formatBadge = (count) => (count > 99 ? '99+' : String(count));

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {sidebarOpen && (
        <div
          className="bg-opacity-75 fixed inset-0 z-40 bg-gray-600 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-linear-to-b from-gray-900 to-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b border-gray-700 px-6">
            <Link to="/" className="transition-opacity hover:opacity-80">
              <img src="/images/logo.png" alt="M19 Logistics" className="h-12 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {navigationSections.map((section, sectionIndex) => (
              <div key={section.title}>
                <div className="mb-3 px-3">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {section.title}
                  </h3>
                </div>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const unreadCount = item.badgeKey ? unreadCounts[item.badgeKey] || 0 : 0;
                    const hasUnread = unreadCount > 0;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group relative flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                          active
                            ? 'bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/50'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        {active && (
                          <div className="absolute top-0 left-0 h-full w-1 rounded-r-full bg-white"></div>
                        )}

                        <div className="flex min-w-0 items-center space-x-3">
                          <div
                            className={`rounded-lg p-1.5 transition-colors ${
                              active ? 'bg-white/20' : 'bg-gray-800 group-hover:bg-gray-700'
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-teal-400'}`}
                            />
                          </div>
                          <span className="truncate font-medium">{item.name}</span>

                          {/* Rounded circle badge — new message count */}
                          {hasUnread && (
                            <span
                              className={`inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] leading-none font-bold ${
                                active ? 'bg-white text-teal-700' : 'bg-red-500 text-white'
                              }`}
                            >
                              {formatBadge(unreadCount)}
                            </span>
                          )}
                        </div>

                        {active && <ChevronRight className="h-4 w-4 shrink-0 animate-pulse" />}
                      </Link>
                    );
                  })}
                </div>

                {sectionIndex < navigationSections.length - 1 && (
                  <div className="mt-6 border-t border-gray-700/50"></div>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="relative text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            {unreadCounts.total > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>
          <div className="flex-1"></div>
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-3 rounded-lg px-4 py-2 transition-colors hover:bg-gray-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  userDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setUserDropdownOpen(false)}
                ></div>
                <div className="absolute top-full right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                  <Link
                    to="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center space-x-2 rounded-t-lg px-4 py-3 text-base text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    <Home className="h-4 w-4" />
                    <span>Homepage</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
