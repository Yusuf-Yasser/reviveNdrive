import React, { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { usePayment } from "../../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Wrench,
  AlertTriangle,
  CreditCard,
} from "lucide-react";

const MechanicBooking = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { initializePayment } = usePayment();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    carMake: "",
    carModel: "",
    carYear: "",
    preferredDate: "",
    preferredTime: "",
    description: "",
    name: "",
    phone: "",
    email: "",
    address: "",
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

  const services = [
    {
      id: "oil-change",
      name: "Oil Change",
      price: 49.99,
      duration: "30-45 mins",
      description: "Full synthetic oil change with filter replacement",
    },
    {
      id: "brake-service",
      name: "Brake Service",
      price: 149.99,
      duration: "1-2 hours",
      description: "Brake pad replacement and rotor inspection",
    },
    {
      id: "tune-up",
      name: "Engine Tune-Up",
      price: 199.99,
      duration: "2-3 hours",
      description: "Comprehensive engine maintenance and optimization",
    },
    {
      id: "tire-rotation",
      name: "Tire Rotation",
      price: 39.99,
      duration: "30 mins",
      description: "Rotate and balance all tires",
    },
  ];

  const ServiceSelection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Service</h2>
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        Choose the service you need for your vehicle
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setFormData({ ...formData, service: service.id })}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              formData.service === service.id
                ? "border-blue-600 ring-2 ring-blue-500 ring-opacity-50"
                : isDarkMode
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-blue-600 font-semibold">${service.price}</p>
            </div>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {service.description}
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{service.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Continue
      </button>
    </div>
  );

  const VehicleDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Vehicle Details</h2>
        <button
          onClick={() => setStep(1)}
          className="text-blue-600 hover:text-blue-700"
        >
          Back
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Car Make</label>
          <input
            type="text"
            name="carMake"
            value={formData.carMake}
            onChange={handleChange}
            placeholder="e.g., Toyota, Honda"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Car Model</label>
          <input
            type="text"
            name="carModel"
            value={formData.carModel}
            onChange={handleChange}
            placeholder="e.g., Camry, Civic"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="number"
            name="carYear"
            value={formData.carYear}
            onChange={handleChange}
            placeholder="e.g., 2020"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Additional Details
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe any specific issues or concerns"
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
        onClick={() => setStep(3)}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Continue
      </button>
    </div>
  );

  const AppointmentScheduling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Schedule Appointment</h2>
        <button
          onClick={() => setStep(2)}
          className="text-blue-600 hover:text-blue-700"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Date
          </label>
          <input
            type="date"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Preferred Time
          </label>
          <select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          >
            <option value="">Select a time</option>
            <option value="9:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
        </div>
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
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300"
            } focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
        } flex items-start space-x-2`}
      >
        <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
        <p className="text-sm">
          By proceeding with the booking, you agree to our terms of service and
          cancellation policy.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Confirm Booking
      </button>
    </div>
  );

  const ReviewStep = () => {
    const selectedService = services.find((s) => s.id === formData.service);

    const handlePayment = () => {
      if (!selectedService) {
        alert("Please select a service");
        setStep(1);
        return;
      }

      // Prepare service details for payment
      const serviceFee = 5.99;
      const totalPrice = selectedService.price + serviceFee;

      const serviceDetails = {
        type: "mechanic_service",
        name: selectedService.name,
        price: selectedService.price,
        serviceFee: serviceFee,
        totalAmount: totalPrice,
        details: {
          service: selectedService.name,
          vehicle: `${formData.carYear} ${formData.carMake} ${formData.carModel}`,
          date: formData.preferredDate,
          time: formData.preferredTime,
          address: formData.address,
          description: formData.description,
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email
          }
        }
      };

      // Initialize payment in the context which will be used by the PaymentGateway and PaymentConfirmation
      initializePayment(serviceDetails);
      
      // Navigate to payment gateway to process the payment
      // After successful payment, user will be redirected to payment/confirmation page
      navigate("/payment");
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Review Booking</h2>
          <button
            onClick={() => setStep(3)}
            className="text-blue-600 hover:text-blue-700"
          >
            Back
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Appointment</p>
              <p className="font-medium">
                {formData.preferredDate} at {formData.preferredTime}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Wrench size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium">{selectedService?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Car size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Vehicle</p>
              <p className="font-medium">
                {formData.carYear} {formData.carMake} {formData.carModel}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{formData.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <CreditCard size={20} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Estimated Cost</p>
              <p className="font-medium">${selectedService?.price}</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={handlePayment}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    );
  };

  const Confirmation = () => {
    const selectedService = services.find((s) => s.id === formData.service);

    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <Wrench className="text-green-600" size={32} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your mechanic service has been scheduled
          </p>
        </div>

        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Appointment</p>
                <p className="font-medium">
                  {formData.preferredDate} at {formData.preferredTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Wrench size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-medium">{selectedService?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Car size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">
                  {formData.carYear} {formData.carMake} {formData.carModel}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{formData.address}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Estimated Cost</p>
                <p className="font-medium">${selectedService?.price}</p>
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
            You will receive a confirmation email with the booking details. Our
            mechanic will contact you before the appointment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/profile"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View Booking Details
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
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {step === 1 && <ServiceSelection />}
        {step === 2 && <VehicleDetails />}
        {step === 3 && <AppointmentScheduling />}
        {step === 4 && <ReviewStep />}
        {step === 5 && <Confirmation />}
      </div>
    </div>
  );
};

export default MechanicBooking;
