import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UsedCarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    location: ''
  });

  useEffect(() => {
    fetchUsedCars();
  }, []);

  const fetchUsedCars = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = "http://localhost/CarService-master/api/get_used_cars.php";
      
      // Add filters if they exist
      const queryParams = [];
      if (filters.brand) queryParams.push(`brand=${encodeURIComponent(filters.brand)}`);
      if (filters.model) queryParams.push(`model=${encodeURIComponent(filters.model)}`);
      if (filters.minYear) queryParams.push(`min_year=${encodeURIComponent(filters.minYear)}`);
      if (filters.maxYear) queryParams.push(`max_year=${encodeURIComponent(filters.maxYear)}`);
      if (filters.minPrice) queryParams.push(`min_price=${encodeURIComponent(filters.minPrice)}`);
      if (filters.maxPrice) queryParams.push(`max_price=${encodeURIComponent(filters.maxPrice)}`);
      if (filters.location) queryParams.push(`location=${encodeURIComponent(filters.location)}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url);
      
      // First check if the response is OK
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        } else {
          // If not JSON, get the text content for debugging
          const textContent = await response.text();
          console.error("Non-JSON response:", textContent);
          throw new Error(`Server returned ${response.status}: Non-JSON response received. Check console for details.`);
        }
      }

      // Try to parse the response as JSON
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, get the text content
        const textContent = await response.text();
        console.error("Unexpected non-JSON response:", textContent);
        throw new Error("Server returned an unexpected format. Check console for details.");
      }
      
      if (data.success) {
        // Normalize the data to ensure all values are properly typed
        const normalizedCars = (data.usedCars || []).map(car => ({
          ...car,
          price: parseFloat(car.price) || 0,
          km: parseInt(car.km) || 0,
          year: parseInt(car.year) || 0
        }));
        
        setCars(normalizedCars);
      } else {
        setError(data.message || "Failed to fetch used cars");
      }
    } catch (err) {
      setError("Network error: " + (err.message || "Please try again."));
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
    fetchUsedCars();
  };
  
  const viewCarDetails = (carId) => {
    navigate(`/used-car-details/${carId}`);
  };

  const renderFilterForm = () => (
    <form onSubmit={applyFilters} className="bg-white p-4 rounded-lg shadow mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
        <input
          type="text"
          name="brand"
          value={filters.brand}
          onChange={handleFilterChange}
          placeholder="e.g., Toyota"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
        <input
          type="text"
          name="model"
          value={filters.model}
          onChange={handleFilterChange}
          placeholder="e.g., Corolla"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
          placeholder="e.g., Cairo"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Year</label>
        <input
          type="number"
          name="minYear"
          value={filters.minYear}
          onChange={handleFilterChange}
          placeholder="e.g., 2010"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Year</label>
        <input
          type="number"
          name="maxYear"
          value={filters.maxYear}
          onChange={handleFilterChange}
          placeholder="e.g., 2023"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Price ($)</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="e.g., 5000"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Price ($)</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="e.g., 20000"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
      
      <div className="md:col-span-3">
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
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Used Cars for Sale</h2>
      
      {/* Filter form */}
      {renderFilterForm()}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">No used cars found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                {car.image_url ? (
                  <img 
                    src={car.image_url} 
                    alt={`${car.brand} ${car.model}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x200/e2e8f0/1e293b?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{car.brand} {car.model} ({car.year})</h3>
                <p className="text-gray-600">Color: {car.color || 'Not specified'}</p>
                <p className="text-gray-600">KM: {car.km.toLocaleString()}</p>
                <p className="text-gray-800 font-semibold text-lg">${car.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                <p className="text-sm text-gray-500">Location: {car.location}</p>
                <p className="text-sm text-gray-500">Seller: {car.seller_name}</p>
                <button
                  onClick={() => viewCarDetails(car.id)}
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

export default UsedCarsList;
