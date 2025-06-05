import React, { useState } from "react";

const UsedCars = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    price: "",
    km: "",
    location: "",
    email: "",
    desc: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

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

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch("https://your-api-url.com/api/used-cars", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to submit");

      const result = await response.json();
      alert("✅ Car listed successfully!");
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ An error occurred while submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl space-y-6 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">List Your Used Car</h2>

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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 px-4 rounded-xl transition duration-300"
      >
        Submit Car Listing
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
