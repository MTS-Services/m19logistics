import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Clock } from 'lucide-react';

const FooterLayout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <img src="images/logo.png" alt="M19 Logistics" className="h-16 w-auto" />
            </div>
            <p className="mb-4 max-w-md text-gray-400">
              Your trusted partner in seamless delivery solutions across the UK. Providing reliable,
              efficient courier services since 2019.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>24/7 Operations - Always Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Wrexham, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
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
            <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Phone className="mt-1 h-4 w-4 flex-shrink-0 text-teal-400" />
                <div>
                  <a href="tel:07971415430" className="block text-gray-400 hover:text-[#31A2A2]">
                    07971 415430
                  </a>
                  <a href="tel:01978439739" className="block text-gray-400 hover:text-[#31A2A2]">
                    01978 439739
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Mail className="mt-1 h-4 w-4 flex-shrink-0 text-teal-400" />
                <div className="space-y-1">
                  <a
                    href="mailto:enquiries@m19logistics.com"
                    className="block text-gray-400 hover:text-[#31A2A2]"
                  >
                    enquiries@m19logistics.com
                  </a>
                  <a
                    href="mailto:deliveries@m19logistics.com"
                    className="block text-gray-400 hover:text-[#31A2A2]"
                  >
                    deliveries@m19logistics.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} M19 Logistics Limited. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">VAT Number: 447 5918 54</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
