import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Home, Info, Mail, HelpCircle, LogIn, LogOut, User, Truck } from 'lucide-react';

const NavbarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
    { name: 'Enquiries', href: '/enquiries', icon: HelpCircle },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="M19 Logistics" className="h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`rounded-md px-3 py-2 text-base font-extrabold transition-colors ${
                    isActive(item.href) ? 'text-[#31A2A2]' : 'text-gray-700 hover:text-[#31A2A2]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : user.role === 'driver'
                        ? '/driver/dashboard'
                        : user.role === 'area_manager'
                          ? '/area-manager/dashboard'
                          : '/customer/dashboard'
                  }
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="pb-4 md:hidden">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-md px-3 py-2 text-base font-medium transition-colors ${
                      isActive(item.href) ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      user.role === 'admin'
                        ? '/admin/dashboard'
                        : user.role === 'driver'
                          ? '/driver/dashboard'
                          : user.role === 'area_manager'
                            ? '/area-manager/dashboard'
                            : '/customer/dashboard'
                    }
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 rounded-md bg-red-600 px-3 py-2 text-base font-medium text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 rounded-md bg-teal-500 px-3 py-2 text-base font-medium text-white"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarLayout;
