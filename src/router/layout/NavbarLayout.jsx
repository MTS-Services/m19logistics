import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Home, Info, Mail, HelpCircle, LogIn, LogOut, User, Truck } from 'lucide-react';

const NavbarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Enquiries', href: '/enquiries', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-20 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-gray-400/5 bg-white/40 shadow-lg backdrop-blur-md'
          : 'border-gray-200 bg-white shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="mr-4 ml-4 flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="M19 Logistics" className="h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 md:flex">
            {navigation.map((item) => {
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`rounded-md px-4 py-2.5 text-base font-[500] transition-all ${
                    isActive(item.href)
                      ? ' text-[#31A2A2]'
                      : isScrolled
                        ? 'text-gray-800 hover:text-[#31A2A2]'
                        : 'text-gray-500 hover:text-[#31A2A2]'
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
                          : '/customer'
                  }
                  className={`rounded-md px-4 py-2.5 text-base font-[500] transition-all ${
                    isScrolled
                      ? 'text-gray-800 hover:text-[#31A2A2]'
                      : 'text-gray-500 hover:text-[#31A2A2]'
                  }`}
                >
                  <span>Dashboard</span>
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
                className="flex items-center space-x-1 rounded-md bg-teal-600 px-5 py-2.5 text-base font-bold text-white shadow-sm hover:bg-teal-700"
              >
                <LogIn className="h-5 w-5" />
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
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="space-y-1 pt-2 pb-4">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-teal-50 text-teal-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                  style={{
                    animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.05}s forwards` : 'none',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                  }}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive(item.href)
                        ? 'text-teal-600'
                        : 'text-gray-400 group-hover:text-teal-500'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="my-3 border-t border-gray-200"></div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : user.role === 'driver'
                        ? '/driver/dashboard'
                        : user.role === 'area_manager'
                          ? '/area-manager/dashboard'
                          : '/customer'
                  }
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100"
                  style={{
                    animation: isOpen ? 'slideIn 0.3s ease-out 0.2s forwards' : 'none',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 rounded-lg bg-red-50 px-4 py-3 text-base font-medium text-red-600 transition-all duration-200 hover:bg-red-100"
                  style={{
                    animation: isOpen ? 'slideIn 0.3s ease-out 0.25s forwards' : 'none',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 hover:from-teal-700 hover:to-teal-800 hover:shadow-lg"
                style={{
                  animation: isOpen ? 'slideIn 0.3s ease-out 0.2s forwards' : 'none',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Animation Keyframes */}
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </nav>
  );
};

export default NavbarLayout;
