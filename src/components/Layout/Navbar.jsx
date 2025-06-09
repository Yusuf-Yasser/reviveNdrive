import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import AuthNav from "../../contexts/AuthNav";
import { useAuth } from "../../contexts/AuthContext";
import {
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  Car,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [carsDropdown, setCarsDropdown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState("");

  // Handle scroll for mobile menu and navbar hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && isMenuOpen) {
        setIsMenuOpen(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setMobileDropdown("");
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setMobileDropdown("");
    document.body.style.overflow = !isMenuOpen ? "hidden" : "auto";
  };

  // Dropdown handlers with delay
  const handleDropdownEnter = (dropdownType) => {
    if (window.innerWidth < 768) return; // Disable hover on mobile
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    if (dropdownType === "Services") {
      setServicesDropdown(true);
    } else if (dropdownType === "Cars") {
      setCarsDropdown(true);
    }
  };

  const handleDropdownLeave = (dropdownType) => {
    if (window.innerWidth < 768) return; // Disable hover on mobile
    const timeout = setTimeout(() => {
      if (dropdownType === "Services") {
        setServicesDropdown(false);
      } else if (dropdownType === "Cars") {
        setCarsDropdown(false);
      }
    }, 200);
    setDropdownTimeout(timeout);
  };

  // Toggle mobile dropdown
  const toggleMobileDropdown = (name) => {
    setMobileDropdown(mobileDropdown === name ? "" : name);
  };

  // Create cars menu items based on user type
  const getCarsMenuItems = () => {
    // For regular users (non-mechanics)
    const regularUserItems = [
      { name: "List Used Cars", path: "/used-cars", icon: "Car" },
      { name: "View Spare Parts", path: "/spare-parts-list", icon: "tool" },
      {
        name: "View Used Cars",
        path: "/used-cars-list",
        icon: "car",
      },
    ];

    // For mechanics, show Spare Parts options
    if (currentUser && currentUser.userType === "mechanic") {
      return [
        { name: "List Spare Parts", path: "/spare-parts", icon: "Tool" },
        { name: "Manage Spare Parts", path: "/mechanic/spare-parts", icon: "Settings" },
        { name: "View Spare Parts", path: "/spare-parts-list", icon: "tool" },
      ];
    }

    // Return regular menu items for non-mechanic users
    return regularUserItems;
  };

  // Build navLinks conditionally based on user type and login state
  let navLinks;
  if (!currentUser) {
    navLinks = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ];
  } else {
    navLinks = [
      { name: "Home", path: "/" },
      // Only show Services menu to non-mechanics
      ...(
        currentUser.userType !== "mechanic"
          ? [
              {
                name: "Services",
                items: [
                  { name: "Find Mechanic", path: "/mechanics", icon: "Wrench" },
                  { name: "Tow Truck", path: "/tow-truck", icon: "Truck" },
                  { name: "Car Inspection", path: "/inspection", icon: "Search" },
                ],
              },
            ]
          : []
      ),
      {
        name: "Cars",
        items: getCarsMenuItems(),
      },
      { name: "About", path: "/about" },
    ];
  }

  return (
    <header
      className={`fixed w-full top-0 z-50 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow-md transition-colors duration-300`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <Car size={24} className="text-blue-600" />
            <span className="font-bold text-xl">Revive & Drive</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.items ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => handleDropdownEnter(link.name)}
                  onMouseLeave={() => handleDropdownLeave(link.name)}
                >
                  <button
                    className={`flex items-center space-x-1 group py-2 ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    } transition-colors duration-200`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      size={16}
                      className="transform group-hover:rotate-180 transition-transform duration-200"
                    />
                  </button>
                  {/* Desktop Dropdown Menu */}
                  {((link.name === "Services" && servicesDropdown) ||
                    (link.name === "Cars" && carsDropdown)) && (
                    <div
                      className={`absolute left-0 mt-1 w-56 rounded-md shadow-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-white"
                      } ring-1 ring-black ring-opacity-5 transform origin-top-left transition-all duration-200 ease-out`}
                    >
                      <div className="py-1" role="menu">
                        {link.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-3 text-sm ${
                              isDarkMode
                                ? "text-gray-300 hover:bg-gray-600"
                                : "text-gray-700 hover:bg-gray-100"
                            } hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2`}
                            role="menuitem"
                          >
                            <ChevronRight size={16} />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 ${
                    location.pathname === link.path
                      ? "text-blue-600 font-medium"
                      : isDarkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  } transition-colors duration-200 hover:text-blue-600`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-all duration-200 hover:scale-110`}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Navigation */}
            <div className="hidden sm:block">
              <AuthNav />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
            isMenuOpen
              ? "opacity-100 z-50"
              : "opacity-0 pointer-events-none -z-10"
          }`}
          onClick={toggleMenu}
        >
          <div
            className={`fixed inset-y-0 right-0 max-w-xs w-full ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 min-h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1">
                <div className="space-y-2">
                  {navLinks.map((link) =>
                    link.items ? (
                      <div key={link.name} className="space-y-2">
                        <button
                          onClick={() => toggleMobileDropdown(link.name)}
                          className={`w-full flex items-center justify-between p-2 text-lg ${
                            isDarkMode
                              ? "text-gray-300 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                          } transition-colors duration-200`}
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            size={16}
                            className={`transform transition-transform duration-200 ${
                              mobileDropdown === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`ml-4 space-y-2 transition-all duration-200 ${
                            mobileDropdown === link.name
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0 overflow-hidden"
                          }`}
                        >
                          {link.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`block p-2 ${
                                location.pathname === item.path
                                  ? "text-blue-600"
                                  : isDarkMode
                                  ? "text-gray-300 hover:text-white"
                                  : "text-gray-600 hover:text-gray-900"
                              } transition-colors duration-200`}
                              onClick={toggleMenu}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block p-2 text-lg ${
                          location.pathname === link.path
                            ? "text-blue-600 font-medium"
                            : isDarkMode
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                        } transition-colors duration-200`}
                        onClick={toggleMenu}
                      >
                        {link.name}
                      </Link>
                    )
                  )}
                </div>
              </nav>

              {/* Mobile Auth Navigation */}
              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="py-3">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Account
                  </h3>
                  <AuthNav />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
