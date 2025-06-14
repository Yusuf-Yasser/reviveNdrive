import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SparePartDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sparePart, setSparePart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    shippingAddress: '',
    contactPhone: '',
    notes: ''
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);

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
          // Initialize the order quantity to 1 or the max available quantity if it's less than 1
          setOrderQuantity(Math.min(1, data.sparePart.quantity));
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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= sparePart.quantity) {
      setOrderQuantity(value);
    }
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/login', { state: { from: `/spare-parts-details/${id}` } });
      return;
    }
    
    setOrderSubmitting(true);
    setOrderError(null);
    setOrderSuccess(null);
    
    try {
      const response = await fetch('http://localhost/CarService-master/api/place_part_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          sparePartId: sparePart.id,
          quantity: orderQuantity,
          shippingAddress: orderFormData.shippingAddress,
          contactPhone: orderFormData.contactPhone,
          notes: orderFormData.notes
        }),
      });
      
      // Get response text first
      const responseText = await response.text();
      
      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        console.error('Raw response:', responseText);
        throw new Error('Server returned an invalid response. Please try again later.');
      }
      
      if (response.ok) {
        setOrderSuccess(data.message || 'Order placed successfully!');
        setOrderFormData({
          shippingAddress: '',
          contactPhone: '',
          notes: ''
        });
        setShowOrderForm(false);
        
        // Update the spare part quantity
        setSparePart(prev => ({
          ...prev,
          quantity: prev.quantity - orderQuantity
        }));
        
        // Reset order quantity
        setOrderQuantity(1);
      } else {
        setOrderError(data.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setOrderError(err.message || 'Network error. Please try again.');
      console.error('Error:', err);
    } finally {
      setOrderSubmitting(false);
    }
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

      {orderSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Success!</p>
          <p>{orderSuccess}</p>
        </div>
      )}

      {orderError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{orderError}</p>
        </div>
      )}

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

            {sparePart.quantity > 0 && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                {showOrderForm ? (
                  <form onSubmit={handlePlaceOrder}>
                    <h3 className="text-lg font-semibold mb-4">Place Order</h3>
                    
                    <div className="mb-4">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        value={orderQuantity}
                        onChange={handleQuantityChange}
                        min="1"
                        max={sparePart.quantity}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Address
                      </label>
                      <textarea
                        id="shippingAddress"
                        name="shippingAddress"
                        value={orderFormData.shippingAddress}
                        onChange={handleOrderFormChange}
                        rows="3"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                      ></textarea>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={orderFormData.contactPhone}
                        onChange={handleOrderFormChange}
                        className="border border-gray-300 rounded-md p-2 w-full"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={orderFormData.notes}
                        onChange={handleOrderFormChange}
                        rows="2"
                        className="border border-gray-300 rounded-md p-2 w-full"
                      ></textarea>
                    </div>
                    
                    <div className="mt-6 flex gap-3">
                      <button
                        type="submit"
                        disabled={orderSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300 disabled:bg-blue-400"
                      >
                        {orderSubmitting ? 'Processing...' : 'Confirm Order'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShowOrderForm(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowOrderForm(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                      Place Order
                    </button>
                    
                    <button 
                      onClick={handleContactMechanic}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                    >
                      Contact Seller
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {sparePart.quantity <= 0 && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                <p className="font-medium">Out of stock</p>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
              <p className="font-medium">{sparePart.mechanic.name}</p>
              <p className="text-gray-600">{sparePart.mechanic.location || 'Location not specified'}</p>
              <p className="text-gray-600">Specialty: {sparePart.mechanic.specialty || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparePartDetail; 