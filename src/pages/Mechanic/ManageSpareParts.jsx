import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ManageSpareParts = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Check if user is logged in and is a mechanic
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/mechanic/spare-parts" } });
    } else if (currentUser.userType !== "mechanic") {
      navigate("/");
    } else {
      fetchMechanicSpareParts();
    }
  }, [currentUser, navigate]);

  const fetchMechanicSpareParts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost/CarService-master/api/get_mechanic_spare_parts.php", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        setSpareParts(data.spareParts || []);
      } else {
        setError(data.message || "Failed to fetch your spare parts");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm("Are you sure you want to delete this spare part?")) return;

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const response = await fetch("http://localhost/CarService-master/api/delete_spare_part.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sparePartId: partId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setActionSuccess("Spare part deleted successfully");
        // Remove the deleted part from the state
        setSpareParts(current => current.filter(part => part.id !== partId));
      } else {
        setActionError(data.message || "Failed to delete spare part");
      }
    } catch (err) {
      setActionError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditPart = (partId) => {
    // In a full implementation, you might navigate to an edit page or show a modal
    alert(`Edit functionality for part #${partId} would go here`);
  };

  const handleAddPart = () => {
    navigate("/spare-parts");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Spare Parts</h1>
        <button
          onClick={handleAddPart}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Add New Part
        </button>
      </div>

      {actionError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : spareParts.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-700">No spare parts listed yet</h3>
          <p className="text-gray-500 mt-2">
            Start adding your spare parts for sale by clicking the "Add New Part" button.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {spareParts.map((part) => (
                <tr key={part.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-3">
                        {part.imageUrl ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={part.imageUrl} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-sm text-gray-500">{part.condition}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{part.carMake || 'N/A'} {part.carModel || ''}</div>
                    <div className="text-sm text-gray-500">{part.yearRange || 'Any year'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${parseFloat(part.price).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {part.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditPart(part.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      disabled={actionLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePart(part.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageSpareParts; 