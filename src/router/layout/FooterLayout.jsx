import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Clock } from 'lucide-react';

const FooterLayout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <img src="images/logo.png" alt="M19 Logistics" className="h-20 w-auto sm:h-24" />
            </div>
            <p className="mb-4 max-w-md text-xs sm:text-sm text-gray-400">
              Your trusted partner in seamless delivery solutions across the UK. Providing reliable,
              efficient courier services since 2019.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>24/7 Operations - Always Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Wrexham, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-white">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-gray-400 transition-colors hover:text-[#31A2A2]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 transition-colors hover:text-[#31A2A2]">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 transition-colors hover:text-[#31A2A2]"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/enquiries"
                  className="text-gray-400 transition-colors hover:text-[#31A2A2]"
                >
                  Enquiries
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 transition-colors hover:text-[#31A2A2]">
                  Customer Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-semibold text-white">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <li className="flex items-start space-x-2">
                <Phone className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-teal-400" />
                <div className="space-y-0.5 sm:space-y-1">
                  <a href="tel:07818077110" className="block text-gray-400 hover:text-[#31A2A2] break-all">
                    07818 077110
                  </a>
                  <a
                    href="https://wa.me/447577574676"
                    className="block text-gray-400 hover:text-[#31A2A2] break-all"
                  >
                    WhatsApp 07577 574676
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="mt-0.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-teal-400" />
                <div className="space-y-0.5 sm:space-y-1">
                  <a
                    href="mailto:enquiries@m19logistics.com"
                    className="block text-gray-400 hover:text-[#31A2A2] break-all text-xs sm:text-sm"
                  >
                    enquiries@m19logistics.com
                  </a>
                  <a
                    href="mailto:deliveries@m19logistics.com"
                    className="block text-gray-400 hover:text-[#31A2A2] break-all text-xs sm:text-sm"
                  >
                    deliveries@m19logistics.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col items-center justify-between space-y-3 sm:space-y-4 md:space-y-0 text-center md:text-left md:flex-row md:space-y-0">
            <p className="text-xs sm:text-sm text-gray-400">
              © {currentYear} M19 Logistics Limited. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-gray-400">VAT Number: 447 5918 54</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
