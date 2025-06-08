import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SparePartsList = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    condition: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = "http://localhost/CarService-master/api/get_spare_parts.php";
      
      // Add filters if they exist
      const queryParams = [];
      if (filters.make) queryParams.push(`make=${encodeURIComponent(filters.make)}`);
      if (filters.model) queryParams.push(`model=${encodeURIComponent(filters.model)}`);
      if (filters.condition) queryParams.push(`condition=${encodeURIComponent(filters.condition)}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        setSpareParts(data.spareParts || []);
      } else {
        setError(data.message || "Failed to fetch spare parts");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchSpareParts();
  };

  const viewDetails = (id) => {
    navigate(`/spare-parts-details/${id}`);
  };

  const renderFilterForm = () => (
    <form onSubmit={applyFilters} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Car Make</label>
        <input
          type="text"
          name="make"
          value={filters.make}
          onChange={handleFilterChange}
          placeholder="e.g., Toyota"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
        <input
          type="text"
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          placeholder="e.g., Camry"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
        <select
          name="condition"
          value={filters.condition}
          onChange={handleFilterChange}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
          <option value="damaged">Damaged/For Parts</option>
        </select>
      </div>

      <div className="sm:col-span-3">
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded transition duration-300"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8">Spare Parts Listings</h1>

      {renderFilterForm()}

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
          <h3 className="text-xl font-medium text-gray-700">No spare parts found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spareParts.map((part) => (
            <div key={part.id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                {part.imageUrl ? (
                  <img src={part.imageUrl} alt={part.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{part.name}</h3>
                <div className="flex justify-between">
                  <p className="text-gray-600">Make: {part.carMake || 'N/A'}</p>
                  <p className="text-gray-600">Model: {part.carModel || 'N/A'}</p>
                </div>
                <p className="text-gray-600">Condition: {part.condition}</p>
                <p className="text-gray-600">Quantity: {part.quantity}</p>
                <p className="text-gray-800 font-semibold text-lg">${parseFloat(part.price).toFixed(2)}</p>
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">Sold by: {part.mechanic.name}</p>
                  <p className="text-sm text-gray-500">{part.mechanic.location || 'Location not specified'}</p>
                </div>
                <button
                  onClick={() => viewDetails(part.id)}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SparePartsList;
