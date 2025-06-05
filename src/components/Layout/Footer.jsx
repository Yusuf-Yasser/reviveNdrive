import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <footer
      className={`${
        isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
      } transition-colors duration-300`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Car size={24} className="text-blue-600" />
              <span className="font-bold text-xl">CarService</span>
            </Link>
            <p className="text-sm">
              Your one-stop solution for all car-related services. We connect
              you with the best mechanics, tow trucks, and spare parts
              suppliers.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-blue-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="hover:text-blue-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/mechanics"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Find Mechanics
                </Link>
              </li>
              <li>
                <Link
                  to="/spare-parts"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Spare Parts
                </Link>
              </li>
              <li>
                <Link
                  to="/used-cars"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Used Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/inspection"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Car Inspection
                </Link>
              </li>
              <li>
                <Link
                  to="/tow-truck"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Tow Truck
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbot"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  AI Mechanic Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  FAQs & Tips
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  Community Q&A
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (234) 567-8901</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@carservice.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>123 Car Avenue, Auto City, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 CarService. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-sm hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-sm hover:text-blue-600 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookie-policy"
                className="text-sm hover:text-blue-600 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;