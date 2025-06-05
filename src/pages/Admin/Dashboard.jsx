import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  Users,
  Car,
  Wrench,
  Truck,
  ClipboardCheck,
  DollarSign,
  BarChart,
  Settings,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon
} from "lucide-react";

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin/login");
  };

  // Mock data for dashboard
  const stats = {
    users: 1234,
    mechanics: 89,
    bookings: 156,
    revenue: 45678,
    towTrucks: 34,
    inspections: 67,
  };

  const recentBookings = [
    {
      id: 1,
      service: "Mechanic",
      customer: "John Doe",
      status: "Pending",
      amount: 150,
    },
    {
      id: 2,
      service: "Tow Truck",
      customer: "Jane Smith",
      status: "Completed",
      amount: 200,
    },
    {
      id: 3,
      service: "Inspection",
      customer: "Mike Johnson",
      status: "In Progress",
      amount: 100,
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Top Navigation */}
      <nav
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg px-6 py-4`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Bell size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`w-64 min-h-screen ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <BarChart size={18} />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Users size={18} />
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab("mechanics")}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === "mechanics"
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Wrench size={18} />
                <span>Mechanics</span>
              </button>
              <button
                onClick={() => setActiveTab("tow-trucks")}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === "tow-trucks"
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Truck size={18} />
                <span>Tow Trucks</span>
              </button>
              <button
                onClick={() => setActiveTab("inspections")}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === "inspections"
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <ClipboardCheck size={18} />
                <span>Inspections</span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === "settings"
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-lg shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold">{stats.users}</h3>
                    </div>
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-lg shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Mechanics</p>
                      <h3 className="text-2xl font-bold">{stats.mechanics}</h3>
                    </div>
                    <Wrench className="text-green-600" size={24} />
                  </div>
                </div>
                <div
                  className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } p-6 rounded-lg shadow-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold">${stats.revenue}</h3>
                    </div>
                    <DollarSign className="text-yellow-600" size={24} />
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-lg p-6`}
              >
                <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-left`}
                      >
                        <th className="pb-3">ID</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <td className="py-3">{booking.id}</td>
                          <td className="py-3">{booking.service}</td>
                          <td className="py-3">{booking.customer}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3">${booking.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">User Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add User</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-left`}>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Joined</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: "John Doe", email: "john@example.com", phone: "(555) 123-4567", joined: "2023-05-10", status: "Active" },
                      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "(555) 987-6543", joined: "2023-06-15", status: "Active" },
                      { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "(555) 456-7890", joined: "2023-07-22", status: "Inactive" },
                      { id: 4, name: "Sarah Williams", email: "sarah@example.com", phone: "(555) 234-5678", joined: "2023-08-30", status: "Active" },
                      { id: 5, name: "Robert Johnson", email: "robert@example.com", phone: "(555) 876-5432", joined: "2023-09-12", status: "Suspended" },
                    ].map((user) => (
                      <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3">{user.id}</td>
                        <td className="py-3">{user.name}</td>
                        <td className="py-3">{user.email}</td>
                        <td className="py-3">{user.phone}</td>
                        <td className="py-3">{user.joined}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : user.status === "Inactive"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">Edit</button>
                            <button className="p-1 text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>Showing 1-5 of 24 users</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Mechanics Tab */}
          {activeTab === "mechanics" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Mechanics Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search mechanics..."
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add Mechanic</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-left`}>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Speciality</th>
                      <th className="pb-3">Rating</th>
                      <th className="pb-3">Experience</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: "Alex Johnson", specialty: "Engine Repair", rating: 4.8, experience: "7 years", status: "Available" },
                      { id: 2, name: "Maria Garcia", specialty: "Transmission", rating: 4.7, experience: "5 years", status: "Busy" },
                      { id: 3, name: "David Wilson", specialty: "Electrical Systems", rating: 4.9, experience: "10 years", status: "Available" },
                      { id: 4, name: "Sarah Miller", specialty: "Brake Systems", rating: 4.6, experience: "4 years", status: "On Leave" },
                      { id: 5, name: "James Brown", specialty: "General Repair", rating: 4.5, experience: "6 years", status: "Available" },
                    ].map((mechanic) => (
                      <tr key={mechanic.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3">{mechanic.id}</td>
                        <td className="py-3">{mechanic.name}</td>
                        <td className="py-3">{mechanic.specialty}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="mr-1">{mechanic.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </td>
                        <td className="py-3">{mechanic.experience}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              mechanic.status === "Available"
                                ? "bg-green-100 text-green-800"
                                : mechanic.status === "Busy"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {mechanic.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">Edit</button>
                            <button className="p-1 text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>Showing 1-5 of 18 mechanics</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Tow Trucks Tab */}
          {activeTab === "tow-trucks" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Tow Truck Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search trucks..."
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add Truck</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-left`}>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Truck Number</th>
                      <th className="pb-3">Driver</th>
                      <th className="pb-3">Capacity</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, number: "TT-001", driver: "John Harris", capacity: "2 Tons", location: "Downtown", status: "Available" },
                      { id: 2, number: "TT-002", driver: "Michael Scott", capacity: "3 Tons", location: "North Side", status: "On Service" },
                      { id: 3, number: "TT-003", driver: "Emily Clark", capacity: "2 Tons", location: "West District", status: "Maintenance" },
                      { id: 4, number: "TT-004", driver: "Daniel Lewis", capacity: "4 Tons", location: "South Side", status: "Available" },
                      { id: 5, number: "TT-005", driver: "Amanda White", capacity: "3 Tons", location: "East District", status: "On Service" },
                    ].map((truck) => (
                      <tr key={truck.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3">{truck.id}</td>
                        <td className="py-3">{truck.number}</td>
                        <td className="py-3">{truck.driver}</td>
                        <td className="py-3">{truck.capacity}</td>
                        <td className="py-3">{truck.location}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              truck.status === "Available"
                                ? "bg-green-100 text-green-800"
                                : truck.status === "On Service"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {truck.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">Edit</button>
                            <button className="p-1 text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>Showing 1-5 of 12 trucks</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Inspections Tab */}
          {activeTab === "inspections" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Car Inspection Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search inspections..."
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add Inspection</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-left`}>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Vehicle</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Inspector</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, vehicle: "Toyota Camry 2020", customer: "James Wilson", date: "2023-04-15", inspector: "Michael Davis", status: "Completed" },
                      { id: 2, vehicle: "Honda Civic 2019", customer: "Emma Taylor", date: "2023-04-18", inspector: "Jessica Adams", status: "Pending" },
                      { id: 3, vehicle: "Ford F-150 2021", customer: "William Moore", date: "2023-04-20", inspector: "David Johnson", status: "In Progress" },
                      { id: 4, vehicle: "Chevrolet Malibu 2018", customer: "Olivia Brown", date: "2023-04-22", inspector: "Sarah Wilson", status: "Completed" },
                      { id: 5, vehicle: "Nissan Altima 2022", customer: "Daniel Martin", date: "2023-04-25", inspector: "Brian Miller", status: "Pending" },
                    ].map((inspection) => (
                      <tr key={inspection.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3">{inspection.id}</td>
                        <td className="py-3">{inspection.vehicle}</td>
                        <td className="py-3">{inspection.customer}</td>
                        <td className="py-3">{inspection.date}</td>
                        <td className="py-3">{inspection.inspector}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              inspection.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : inspection.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {inspection.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">View</button>
                            <button className="p-1 text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>Showing 1-5 of 15 inspections</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Booking Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add Booking</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-left`}>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Time</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, service: "Mechanic", customer: "John Doe", date: "2023-05-15", time: "10:00 AM", status: "Confirmed", amount: 150 },
                      { id: 2, service: "Tow Truck", customer: "Jane Smith", date: "2023-05-15", time: "02:30 PM", status: "Completed", amount: 200 },
                      { id: 3, service: "Inspection", customer: "Mike Johnson", date: "2023-05-16", time: "09:15 AM", status: "Pending", amount: 100 },
                      { id: 4, service: "Mechanic", customer: "Sarah Davis", date: "2023-05-16", time: "11:45 AM", status: "Cancelled", amount: 175 },
                      { id: 5, service: "Tow Truck", customer: "Robert Wilson", date: "2023-05-17", time: "03:00 PM", status: "Confirmed", amount: 225 },
                    ].map((booking) => (
                      <tr key={booking.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3">{booking.id}</td>
                        <td className="py-3">{booking.service}</td>
                        <td className="py-3">{booking.customer}</td>
                        <td className="py-3">{booking.date}</td>
                        <td className="py-3">{booking.time}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3">${booking.amount}</td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">Edit</button>
                            <button className="p-1 text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>Showing 1-5 of 28 bookings</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Payment Management</h2>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search payments..."
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-500" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Export</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-left`}>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "PAY-1001", customer: "John Doe", service: "Mechanic", date: "2023-05-15", amount: 150, method: "Credit Card", status: "Completed" },
                      { id: "PAY-1002", customer: "Jane Smith", service: "Tow Truck", date: "2023-05-15", amount: 200, method: "PayPal", status: "Completed" },
                      { id: "PAY-1003", customer: "Mike Johnson", service: "Inspection", date: "2023-05-16", amount: 100, method: "Credit Card", status: "Pending" },
                      { id: "PAY-1004", customer: "Sarah Davis", service: "Mechanic", date: "2023-05-16", amount: 175, method: "Bank Transfer", status: "Failed" },
                      { id: "PAY-1005", customer: "Robert Wilson", service: "Tow Truck", date: "2023-05-17", amount: 225, method: "Credit Card", status: "Completed" },
                    ].map((payment) => (
                      <tr key={payment.id} className="border-t border-gray-200 dark:border-gray-700">
                        <td className="py-3">{payment.id}</td>
                        <td className="py-3">{payment.customer}</td>
                        <td className="py-3">{payment.service}</td>
                        <td className="py-3">{payment.date}</td>
                        <td className="py-3">${payment.amount}</td>
                        <td className="py-3">{payment.method}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              payment.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">View</button>
                            <button className="p-1 text-gray-600 hover:text-gray-800">Refund</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div>Showing 1-5 of 42 payments</div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">2</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">3</button>
                  <button className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700">Next</button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <h2 className="text-xl font-bold mb-6">Admin Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Admin Name</label>
                      <input 
                        type="text" 
                        className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        defaultValue="Admin User"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Admin Email</label>
                      <input 
                        type="email" 
                        className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        defaultValue="admin@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Password</label>
                      <input 
                        type="password" 
                        className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        defaultValue="********"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Push Notifications</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer mr-3">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-sm text-gray-500">Enable maintenance mode</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">System Language</label>
                    <select className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 mr-3">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
