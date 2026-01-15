import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import DriverDashboardHome from './DriverDashboardHome';
import AssignedDeliveries from './AssignedDeliveries';
import CompletedDeliveries from './CompletedDeliveries';
import DriverProfile from './DriverProfile';
import {
  LayoutDashboard,
  Package,
  CheckCircle,
  User,
  LogOut,
  Truck,
  Menu,
  X,
  ChevronRight,
  Clock,
} from 'lucide-react';

const DriverDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationSections = [
    {
      title: 'Main',
      items: [{ name: 'Dashboard', href: '/driver/dashboard', icon: LayoutDashboard }],
    },
    {
      title: 'Deliveries',
      items: [
        { name: 'Assigned Deliveries', href: '/driver/assigned', icon: Clock },
        { name: 'Completed Deliveries', href: '/driver/completed', icon: CheckCircle },
      ],
    },
    {
      title: 'Account',
      items: [{ name: 'Profile', href: '/driver/profile', icon: User }],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="bg-opacity-75 fixed inset-0 z-40 bg-gray-600 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-3/4 transform bg-gradient-to-b from-gray-900 to-gray-800 transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-blue-600">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">M19 Driver</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="border-b border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">Driver</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 overflow-y-auto p-4">
            {navigationSections.map((section, sectionIndex) => (
              <div key={section.title}>
                {/* Section Header */}
                <div className="mb-3 px-3">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {section.title}
                  </h3>
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group relative flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-900/50'
                            : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }`}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <div className="absolute top-0 left-0 h-full w-1 rounded-r-full bg-white"></div>
                        )}

                        <div className="flex items-center space-x-3">
                          <div
                            className={`rounded-lg p-1.5 transition-colors ${
                              active ? 'bg-white/20' : 'bg-gray-800 group-hover:bg-gray-700'
                            }`}
                          >
                            <Icon
                              className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-teal-400'}`}
                            />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>

                        {active && <ChevronRight className="h-4 w-4 animate-pulse" />}
                      </Link>
                    );
                  })}
                </div>

                {/* Section Divider (except for last section) */}
                {sectionIndex < navigationSections.length - 1 && (
                  <div className="mt-6 border-t border-gray-700/50"></div>
                )}
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-red-600 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            {navigationSections.flatMap((s) => s.items).find((item) => isActive(item.href))?.name ||
              'Driver Portal'}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="hidden text-sm text-gray-600 sm:inline">
              Welcome back, {user?.name}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <Routes>
            <Route index element={<DriverDashboardHome />} />
            <Route path="dashboard" element={<DriverDashboardHome />} />
            <Route path="assigned" element={<AssignedDeliveries />} />
            <Route path="completed" element={<CompletedDeliveries />} />
            <Route path="profile" element={<DriverProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboardLayout;
