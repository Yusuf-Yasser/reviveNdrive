import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const UsedCarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    fetchCarDetails();
  }, [id]);
  
  const fetchCarDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost/CarService-master/api/get_used_car.php?id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setCarDetails(data.usedCar);
        // Check if current user is the owner of this car
        if (currentUser && parseInt(data.usedCar.user_id) === parseInt(currentUser.id)) {
          setIsOwner(true);
        }
      } else {
        setError(data.message || "Failed to fetch car details");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await fetch("http://localhost/CarService-master/api/delete_used_car.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car_id: id }),
      });
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        setError("Server error: " + text);
        setDeleteConfirmOpen(false);
        setDeleteLoading(false);
        return;
      }
      if (data.success) {
        navigate("/used-cars-list");
      } else {
        setError(data.message || "Failed to delete car");
        setDeleteConfirmOpen(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
      setDeleteConfirmOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/used-cars-list")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Back to Used Cars
          </button>
        </div>
      </div>
    );
  }
  
  if (!carDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Car not found.</p>
          <button
            onClick={() => navigate("/used-cars-list")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Back to Used Cars
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="relative">
          {/* Navigation back to list */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => navigate("/used-cars-list")}
              className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-full shadow transition duration-300"
            >
              &larr; Back
            </button>
          </div>
          
          {/* Image section */}
          <div className="h-80">
            {carDetails.image_url ? (
              <img 
                src={carDetails.image_url} 
                alt={`${carDetails.brand} ${carDetails.model}`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/800x400/e2e8f0/1e293b?text=No+Image";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No image available</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Car details */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {carDetails.brand} {carDetails.model} ({carDetails.year})
            </h1>
            <p className="text-2xl font-bold text-blue-600">
              ${parseFloat(carDetails.price).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
            <div>
              <p className="text-gray-600 text-sm">Color</p>
              <p className="font-medium">{carDetails.color || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Kilometers</p>
              <p className="font-medium">{parseInt(carDetails.km).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Location</p>
              <p className="font-medium">{carDetails.location}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Posted On</p>
              <p className="font-medium">{new Date(carDetails.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* Description */}
          {carDetails.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{carDetails.description}</p>
            </div>
          )}
          
          {/* Seller information */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Name</p>
                <p className="font-medium">{carDetails.seller_name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium">{carDetails.email}</p>
              </div>
              {carDetails.seller_phone && (
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-medium">{carDetails.seller_phone}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <a 
                href={`mailto:${carDetails.email}?subject=Inquiry about your ${carDetails.brand} ${carDetails.model}`} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 inline-block"
              >
                Contact Seller
              </a>
              
              {/* Delete button for owner */}
              {isOwner && (
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="ml-4 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
                >
                  Delete Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Listing</h3>
            <p className="mb-6">Are you sure you want to delete this car listing? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsedCarDetails; 