import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const UsedCars = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    price: "",
    km: "",
    location: "",
    email: currentUser?.email || "",
    desc: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/used-cars" } });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      console.log("Submitting to: http://localhost/CarService-master/api/add_used_car.php");
      
      const response = await fetch("http://localhost/CarService-master/api/add_used_car.php", {
        method: "POST",
        body: data,
        credentials: "include"
      });
      
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
      let result;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // If not JSON, get the text content
        const textContent = await response.text();
        console.error("Unexpected non-JSON response:", textContent);
        throw new Error("Server returned an unexpected format. Check console for details.");
      }
      
      if (result.success) {
        setSuccess("Car listed successfully!");
        // Reset form
        setFormData({
          brand: "",
          model: "",
          year: "",
          color: "",
          price: "",
          km: "",
          location: "",
          email: currentUser?.email || "",
          desc: "",
          image: null,
        });
        setPreview(null);
        
        // Redirect to used cars list
        setTimeout(() => {
          navigate("/used-cars-list");
        }, 2000);
      } else {
        setError(result.message || "Failed to submit");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl space-y-6 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">List Your Used Car</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
        <Input label="Model" name="model" value={formData.model} onChange={handleChange} />
        <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} />
        <Input label="Color" name="color" value={formData.color} onChange={handleChange} />
        <Input label="Price ($)" name="price" type="number" value={formData.price} onChange={handleChange} />
        <Input label="Kilometers driven" name="km" type="number" value={formData.km} onChange={handleChange} />
        <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
        <Input label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="desc"
          rows="4"
          placeholder="Describe the car..."
          value={formData.desc}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-gray-600"
          required
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 h-40 object-cover rounded-lg border"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white text-lg font-semibold py-3 px-4 rounded-xl transition duration-300`}
      >
        {loading ? "Submitting..." : "Submit Car Listing"}
      </button>
    </form>
  );
};

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={label}
      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
      required
    />
  </div>
);

export default UsedCars;
