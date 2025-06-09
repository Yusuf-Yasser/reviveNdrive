import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FeedbackModal from "../../components/Feedback/FeedbackModal";

const MyOrders = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [feedbackModalData, setFeedbackModalData] = useState({
    isOpen: false,
    orderId: null,
    mechanicId: null
  });

  // Check if user is logged in, but only after auth is done loading
  useEffect(() => {
    // Don't redirect immediately if auth is still loading
    if (authLoading) {
      return;
    }

    // Check authentication after auth has finished loading
    if (!currentUser) {
      navigate("/login", { state: { from: "/profile/orders" } });
    } else {
      fetchUserOrders();
    }
  }, [currentUser, navigate, statusFilter, authLoading]);

  const fetchUserOrders = async () => {
    if (!currentUser) return; // Don't fetch if user is not logged in
    
    setLoading(true);
    setError(null);

    try {
      let url = "http://localhost/CarService-master/api/get_user_orders.php";
      if (statusFilter) {
        url += `?status=${statusFilter}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch your orders");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleViewPartDetails = (partId) => {
    navigate(`/spare-parts-details/${partId}`);
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      const response = await fetch("http://localhost/CarService-master/api/submit_feedback.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: feedbackData.orderId,
          rating: feedbackData.rating,
          comment: feedbackData.comment
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh orders to update UI
        fetchUserOrders();
        return true;
      } else {
        throw new Error(data.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert(error.message);
      return false;
    }
  };

  const openFeedbackModal = (orderId, mechanicId) => {
    setFeedbackModalData({
      isOpen: true,
      orderId,
      mechanicId
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModalData({
      isOpen: false,
      orderId: null,
      mechanicId: null
    });
  };

  // Show loading spinner while auth is being checked
  if (authLoading || (loading && !error)) {
    return (
      <div className="max-w-7xl mx-auto p-6 pt-24 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-6 flex items-center">
        <label className="mr-2 font-medium">Filter by status:</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-700">No orders found</h3>
          <p className="text-gray-500 mt-2">
            {statusFilter 
              ? `You don't have any ${statusFilter} orders.` 
              : "You haven't placed any orders yet."}
          </p>
          <button 
            onClick={() => navigate('/spare-parts-list')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Browse Spare Parts
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0">
                          {order.sparePart.imageUrl ? (
                            <img 
                              src={order.sparePart.imageUrl}
                              alt={order.sparePart.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{order.sparePart.name}</h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {order.quantity} × ${parseFloat(order.sparePart.unitPrice).toFixed(2)}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            Total: ${parseFloat(order.totalPrice).toFixed(2)}
                          </p>
                          <button 
                            onClick={() => handleViewPartDetails(order.sparePart.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Details</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</p>
                      <p className="text-sm text-gray-700 mt-1">Phone: {order.contactPhone}</p>
                      
                      {order.notes && (
                        <div className="mt-3">
                          <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                          <p className="text-sm text-gray-700">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Seller Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">Seller</h4>
                      <p className="text-sm text-gray-700">{order.mechanic.name}</p>
                      <p className="text-sm text-gray-700">{order.mechanic.location || 'Location not specified'}</p>
                      <p className="text-sm text-gray-700">Email: {order.mechanic.email}</p>
                      <p className="text-sm text-gray-700">Phone: {order.mechanic.phone || 'Not provided'}</p>
                      
                      {/* Feedback Button - Only show for delivered orders without feedback */}
                      {order.orderStatus === 'delivered' && !order.hasFeedback && (
                        <button
                          onClick={() => openFeedbackModal(order.id, order.mechanic.id)}
                          className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg transition duration-300"
                        >
                          Leave Feedback
                        </button>
                      )}
                      
                      {/* Show if feedback was already given */}
                      {order.hasFeedback && (
                        <p className="mt-3 text-sm text-green-600">
                          ✓ Feedback submitted
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalData.isOpen}
        onClose={closeFeedbackModal}
        onSubmit={async (data) => {
          const success = await handleFeedbackSubmit({
            ...data,
            orderId: feedbackModalData.orderId,
            mechanicId: feedbackModalData.mechanicId
          });
          if (success) {
            closeFeedbackModal();
          }
        }}
        orderId={feedbackModalData.orderId}
        mechanicId={feedbackModalData.mechanicId}
      />
    </div>
  );
};

export default MyOrders; 