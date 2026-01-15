import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Heart, Code } from 'lucide-react';

const FooterLayout = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="text-sm font-bold text-white">RB</span>
              </div>
              <span className="text-xl font-bold text-gray-900">React Boilerplate</span>
            </div>
            <p className="mb-4 max-w-md text-gray-600">
              A modern React boilerplate with Redux Toolkit, Tailwind CSS, and best practices for
              building scalable web applications.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 transition-colors hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 transition-colors hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 transition-colors hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  React Docs
                </a>
              </li>
              <li>
                <a
                  href="https://redux-toolkit.js.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Redux Toolkit
                </a>
              </li>
              <li>
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Tailwind CSS
                </a>
              </li>
              <li>
                <a
                  href="https://vitejs.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Vite
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="mb-4 text-sm text-gray-500 md:mb-0">
              © {currentYear} React Boilerplate. Built with{' '}
              <Heart className="inline h-4 w-4 text-red-500" /> by developers.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Code className="h-4 w-4" />
              <span>Open Source & Free to Use</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
