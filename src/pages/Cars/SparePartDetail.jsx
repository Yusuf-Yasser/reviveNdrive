import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SparePartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sparePart, setSparePart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSparePartDetails = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost/CarService-master/api/get_spare_part.php?id=${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          setSparePart(data.sparePart);
        } else {
          setError(data.message || 'Failed to load spare part details');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSparePartDetails();
  }, [id]);

  const handleContactMechanic = () => {
    if (sparePart && sparePart.mechanic) {
      window.location.href = `mailto:${sparePart.mechanic.email}?subject=Inquiry about ${sparePart.name}`;
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-24 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!sparePart) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No spare part found with this ID.</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <button 
        onClick={handleGoBack}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Search
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            {sparePart.imageUrl ? (
              <img 
                src={sparePart.imageUrl} 
                alt={sparePart.name} 
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No image available</span>
              </div>
            )}
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{sparePart.name}</h1>
            <p className="text-lg font-semibold text-blue-600 mb-4">${parseFloat(sparePart.price).toFixed(2)}</p>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Car Make</p>
                <p className="font-medium">{sparePart.carMake || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Car Model</p>
                <p className="font-medium">{sparePart.carModel || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Year Range</p>
                <p className="font-medium">{sparePart.yearRange || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Condition</p>
                <p className="font-medium">{sparePart.condition}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Available</p>
                <p className="font-medium">{sparePart.quantity} {parseInt(sparePart.quantity) === 1 ? 'unit' : 'units'}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Posted</p>
                <p className="font-medium">{new Date(sparePart.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{sparePart.description || 'No description provided.'}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
              <p className="font-medium">{sparePart.mechanic.name}</p>
              <p className="text-gray-600">{sparePart.mechanic.location || 'Location not specified'}</p>
              <p className="text-gray-600">Specialty: {sparePart.mechanic.specialty || 'Not specified'}</p>
              
              <button 
                onClick={handleContactMechanic}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparePartDetail; 