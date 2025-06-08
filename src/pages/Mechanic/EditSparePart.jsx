import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const EditSparePart = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    carMake: "",
    carModel: "",
    yearRange: "",
    condition: "used",
    price: "",
    quantity: "1",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is logged in and is a mechanic
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/mechanic/edit-spare-part/${id}` } });
    } else if (currentUser.userType !== "mechanic") {
      navigate("/");
    } else {
      fetchSparePart();
    }
  }, [currentUser, navigate, id]);

  // Fetch the spare part data to populate the form
  const fetchSparePart = async () => {
    setFetchLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost/CarService-master/api/get_spare_part.php?id=${id}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        // Populate the form with the spare part data
        const sparePart = data.sparePart;
        setFormData({
          id: sparePart.id,
          name: sparePart.name,
          description: sparePart.description,
          carMake: sparePart.carMake || "",
          carModel: sparePart.carModel || "",
          yearRange: sparePart.yearRange || "",
          condition: sparePart.condition,
          price: sparePart.price,
          quantity: sparePart.quantity.toString(),
          imageUrl: sparePart.imageUrl || "",
        });
      } else {
        setError(data.message || "Failed to fetch spare part details");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost/CarService-master/api/update_spare_part.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Spare part updated successfully!");
        // Navigate back to manage spare parts after a short delay
        setTimeout(() => {
          navigate("/mechanic/spare-parts");
        }, 2000);
      } else {
        setError(data.message || "Failed to update spare part");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Spare Part</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Part Name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required
          />
          <Input 
            label="Car Make" 
            name="carMake" 
            value={formData.carMake} 
            onChange={handleChange}
            placeholder="e.g., Toyota, Honda"
          />
          <Input 
            label="Car Model" 
            name="carModel" 
            value={formData.carModel} 
            onChange={handleChange}
            placeholder="e.g., Camry, Civic"
          />
          <Input 
            label="Year Range" 
            name="yearRange" 
            value={formData.yearRange} 
            onChange={handleChange}
            placeholder="e.g., 2015-2020"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="new">New</option>
              <option value="used">Used - Good Condition</option>
              <option value="refurbished">Refurbished</option>
              <option value="damaged">Damaged/For Parts</option>
            </select>
          </div>
          <Input 
            label="Price ($)" 
            name="price" 
            type="number" 
            min="0" 
            step="0.01"
            value={formData.price} 
            onChange={handleChange}
            required
          />
          <Input 
            label="Quantity" 
            name="quantity" 
            type="number" 
            min="1" 
            value={formData.quantity} 
            onChange={handleChange}
          />
          <Input 
            label="Image URL" 
            name="imageUrl" 
            type="url" 
            value={formData.imageUrl} 
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows="4"
            placeholder="Describe the spare part, including its condition, compatibility, etc."
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/mechanic/spare-parts")}
            className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white text-lg font-semibold py-3 px-4 rounded-xl transition duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-1/2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white text-lg font-semibold py-3 px-4 rounded-xl transition duration-300`}
          >
            {loading ? "Updating..." : "Update Spare Part"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange, placeholder = "", required = false, min, step }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
      required={required}
      min={min}
      step={step}
    />
  </div>
);

export default EditSparePart; 