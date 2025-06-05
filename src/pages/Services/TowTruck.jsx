import React, { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { usePayment } from "../../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Truck,
  Phone,
  Clock,
  AlertTriangle,
  CreditCard,
} from "lucide-react";

const TowTruck = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { initializePayment } = usePayment();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    location: "",
    destination: "",
    vehicleType: "car",
    description: "",
    name: "",
    phone: "",
    paymentMethod: "card",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handlePaymentInitiation = () => {
    const serviceDetails = {
      type: "tow_truck",
      name: "Tow Truck Service",
      price: 99.99, // Base price for tow truck service
      serviceFee: 9.99,
      totalAmount: 109.98, // Base price + service fee
      details: {
        pickup: formData.location,
        destination: formData.destination,
        vehicleType: formData.vehicleType,
        description: formData.description,
        customer: {
          name: formData.name,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod,
        },
      },
    };

    initializePayment(serviceDetails);
    navigate("/payment");
  };

  const LocationStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Request Tow Truck</h2>
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        Please provide your location details
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Location
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your current location"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Destination (Optional)
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter destination if needed"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vehicle Type</label>
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          >
            <option value="car">Car</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="motorcycle">Motorcycle</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description of Issue
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what happened to your vehicle"
            rows="3"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Continue
      </button>
    </div>
  );

  const ContactStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        <button
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-700"
        >
          Back
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Payment Method
          </label>
          <div className="space-y-2">
            <label
              className={`block p-3 rounded-lg border ${
                formData.paymentMethod === "card"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : isDarkMode
                  ? "border-gray-600"
                  : "border-gray-300"
              } cursor-pointer`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <CreditCard className="text-blue-600 mr-2" size={20} />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-gray-500">
                    Pay securely with your card
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`block p-3 rounded-lg border ${
                formData.paymentMethod === "cash"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : isDarkMode
                  ? "border-gray-600"
                  : "border-gray-300"
              } cursor-pointer`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === "cash"}
                onChange={handleChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <CreditCard className="text-blue-600 mr-2" size={20} />
                <div>
                  <p className="font-medium">Cash</p>
                  <p className="text-sm text-gray-500">
                    Pay in cash after service
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
        } flex items-start space-x-2`}
      >
        <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
        <p className="text-sm">
          By proceeding, you agree to our terms of service and cancellation
          policy. Standard rates apply, and additional fees may be charged based
          on distance and service requirements.
        </p>
      </div>

      <button
        onClick={handlePaymentInitiation}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Proceed to Payment
      </button>
    </div>
  );

  const ConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900">
        <Truck className="text-green-600" size={32} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Help is on the way!</h2>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          A tow truck has been dispatched to your location
        </p>
      </div>

      <div
        className={`p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-500">Estimated Arrival Time</p>
              <p className="font-medium">15-20 minutes</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Truck className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-500">Driver Details</p>
              <p className="font-medium">John Smith • ABC Towing</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="font-medium">+1 (234) 567-8901</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-gray-500">Pickup Location</p>
              <p className="font-medium">{formData.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
        }`}
      >
        <p className="text-sm">
          The driver will call you shortly. Please keep your phone nearby and
          stay in a safe location.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/profile"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          View Request Details
        </a>
        <a
          href="/"
          className={`px-6 py-3 ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200"
          } font-medium rounded-lg transition-colors duration-200`}
        >
          Return to Home
        </a>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {step === 1 && <LocationStep />}
        {step === 2 && <ContactStep />}
        {step === 3 && <ConfirmationStep />}
      </div>
    </div>
  );
};

export default TowTruck;
