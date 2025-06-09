import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  Users,
  Car,
  Wrench,
  DollarSign,
  BarChart,
  LogOut,
  Search,
  Sun,
  Moon
} from "lucide-react";
import UserEditModal from "./UserEditModal";
import MechanicEditModal from "./MechanicEditModal";
import ConfirmModal from "./ConfirmModal";

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    mechanics: 0,
    bookings: 0,
    revenue: 0,
    towTrucks: 0,
    inspections: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  
  // Modal state
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showMechanicEditModal, setShowMechanicEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user is admin
  useEffect(() => {
    checkAdminAuth();
    
    // Initial data fetching
    if (activeTab === "overview") {
      fetchStats();
      fetchRecentBookings();
    }
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "overview") {
      fetchStats();
      fetchRecentBookings();
    } else if (activeTab === "users") {
      fetchUsers(1);
    } else if (activeTab === "mechanics") {
      fetchMechanics(1);
    }
  }, [activeTab]);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch(
        "http://localhost/CarService-master/api/admin_check_auth.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.status !== "success" || !data.isAdmin) {
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error checking admin authentication:", error);
      navigate("/admin/login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost/CarService-master/api/admin_logout.php", {
        method: "POST",
        credentials: "include",
      });
      
      localStorage.removeItem("isAdmin");
      navigate("/admin/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost/CarService-master/api/admin_get_stats.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setStats(data.stats);
      } else {
        setError("Failed to fetch statistics");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Server error while fetching statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost/CarService-master/api/admin_get_recent_bookings.php",
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setRecentBookings(data.bookings);
      } else {
        setError("Failed to fetch recent bookings");
      }
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      setError("Server error while fetching bookings");
    }
  };

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost/CarService-master/api/admin_get_users.php?page=${page}&search=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setUsers(data.users);
        setCurrentPage(data.pagination.current_page);
        setTotalPages(data.pagination.last_page);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Server error while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchMechanics = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost/CarService-master/api/admin_get_mechanics.php?page=${page}&search=${searchTerm}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        setMechanics(data.mechanics);
        setCurrentPage(data.pagination.current_page);
        setTotalPages(data.pagination.last_page);
      } else {
        setError("Failed to fetch mechanics");
      }
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      setError("Server error while fetching mechanics");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === "users") {
      fetchUsers(1);
    } else if (activeTab === "mechanics") {
      fetchMechanics(1);
    }
  };

  const handlePageChange = (page) => {
    if (activeTab === "users") {
      fetchUsers(page);
    } else if (activeTab === "mechanics") {
      fetchMechanics(page);
    }
    setCurrentPage(page);
  };
  
  // Handler for editing a user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserEditModal(true);
  };
  
  // Handler for updating a user
  const handleUserUpdate = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id 
        ? { 
            ...user, 
            name: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            status: updatedUser.user_type === 'mechanic' ? 'Mechanic' : 'User'
          } 
        : user
    ));
    setShowUserEditModal(false);
    setSelectedUser(null);
  };
  
  // Handler for deleting a user prompt
  const handleDeleteUserPrompt = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirmModal(true);
  };
  
  // Handler for deleting a user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost/CarService-master/api/admin_delete_user.php?id=${selectedUser.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Remove the user from the list
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setShowDeleteConfirmModal(false);
        setSelectedUser(null);
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Server error. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handler for editing a mechanic
  const handleEditMechanic = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowMechanicEditModal(true);
  };
  
  // Handler for updating a mechanic
  const handleMechanicUpdate = (updatedMechanic) => {
    setMechanics(mechanics.map(mechanic => 
      mechanic.id === updatedMechanic.id 
        ? { 
            ...mechanic, 
            name: updatedMechanic.fullName,
            specialty: updatedMechanic.specialty,
            status: updatedMechanic.status
          } 
        : mechanic
    ));
    setShowMechanicEditModal(false);
    setSelectedMechanic(null);
  };
  
  // Handler for deleting a mechanic prompt
  const handleDeleteMechanicPrompt = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowDeleteConfirmModal(true);
  };
  
  // Handler for deleting a mechanic
  const handleDeleteMechanic = async () => {
    if (!selectedMechanic) return;
    
    setIsDeleting(true);
    try {
      // For mechanics, we delete the user associated with the mechanic
      // First get the user_id
      const response = await fetch(`http://localhost/CarService-master/api/admin_get_mechanic_user.php?id=${selectedMechanic.id}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const mechData = await response.json();
      
      if (mechData.status !== 'success') {
        throw new Error(mechData.message || 'Failed to get mechanic data');
      }
      
      // Now delete the user
      const deleteResponse = await fetch(`http://localhost/CarService-master/api/admin_delete_user.php?id=${mechData.user_id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const deleteData = await deleteResponse.json();
      
      if (deleteData.status === 'success') {
        // Remove the mechanic from the list
        setMechanics(mechanics.filter(m => m.id !== selectedMechanic.id));
        setShowDeleteConfirmModal(false);
        setSelectedMechanic(null);
      } else {
        setError(deleteData.message || 'Failed to delete mechanic');
      }
    } catch (err) {
      console.error('Error deleting mechanic:', err);
      setError('Server error. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  };

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
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Show error message if any */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

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
                      <h3 className="text-2xl font-bold">
                        {loading ? "Loading..." : stats.users}
                      </h3>
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
                      <h3 className="text-2xl font-bold">
                        {loading ? "Loading..." : stats.mechanics}
                      </h3>
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
                      <h3 className="text-2xl font-bold">
                        ${loading ? "Loading..." : stats.revenue}
                      </h3>
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
                  {loading ? (
                    <p>Loading bookings...</p>
                  ) : recentBookings.length > 0 ? (
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
                  ) : (
                    <p>No bookings found</p>
                  )}
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
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button type="submit" className="absolute left-3 top-2.5 text-gray-500">
                      <Search size={18} />
                    </button>
                  </form>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add User</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <p>Loading users...</p>
                ) : users.length > 0 ? (
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
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="py-3">{user.id}</td>
                          <td className="py-3">{user.name}</td>
                          <td className="py-3">{user.email}</td>
                          <td className="py-3">{user.phone || 'N/A'}</td>
                          <td className="py-3">{user.joined}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.status === "User"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditUser(user)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteUserPrompt(user)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No users found</p>
                )}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <div>Showing page {currentPage} of {totalPages}</div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? "bg-gray-300 cursor-not-allowed" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                          ? "bg-gray-300 cursor-not-allowed" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mechanics Tab */}
          {activeTab === "mechanics" && (
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Mechanics Management</h2>
                <div className="flex space-x-3">
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search mechanics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <button type="submit" className="absolute left-3 top-2.5 text-gray-500">
                      <Search size={18} />
                    </button>
                  </form>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                    <span>Add Mechanic</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <p>Loading mechanics...</p>
                ) : mechanics.length > 0 ? (
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
                      {mechanics.map((mechanic) => (
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
                              <button 
                                onClick={() => handleEditMechanic(mechanic)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteMechanicPrompt(mechanic)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No mechanics found</p>
                )}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                  <div>Showing page {currentPage} of {totalPages}</div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? "bg-gray-300 cursor-not-allowed" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                          ? "bg-gray-300 cursor-not-allowed" 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
      
      {/* User Edit Modal */}
      {showUserEditModal && (
        <UserEditModal 
          user={selectedUser} 
          onClose={() => {
            setShowUserEditModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUserUpdate}
        />
      )}
      
      {/* Mechanic Edit Modal */}
      {showMechanicEditModal && (
        <MechanicEditModal
          mechanic={selectedMechanic}
          onClose={() => {
            setShowMechanicEditModal(false);
            setSelectedMechanic(null);
          }}
          onUpdate={handleMechanicUpdate}
        />
      )}
      
      {/* Confirm Delete Modal */}
      {showDeleteConfirmModal && (
        <ConfirmModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${selectedUser ? 'user ' + selectedUser.name : selectedMechanic ? 'mechanic ' + selectedMechanic.name : 'this item'}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={selectedUser ? handleDeleteUser : handleDeleteMechanic}
          onCancel={() => {
            setShowDeleteConfirmModal(false);
            setSelectedUser(null);
            setSelectedMechanic(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Dashboard;
