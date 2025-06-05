import React, { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { usePayment } from "../../contexts/PaymentContext";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Calendar,
  Clock,
  MapPin,
  Car,
  Wrench,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const CarInspection = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { initializePayment } = usePayment();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carMake: "",
    carModel: "",
    carYear: "",
    inspectionType: "standard",
    inspectionDate: "",
    inspectionTime: "",
    address: "",
    city: "",
    zipCode: "",
    specialRequests: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  const inspectionTypes = [
    {
      id: "standard",
      title: "Standard Inspection",
      description: "Basic inspection of your car's vital systems",
      price: 49.99,
      features: [
        "Engine check",
        "Brake system check",
        "Fluid levels inspection",
        "Tire condition check",
        "Battery test",
      ],
    },
    {
      id: "comprehensive",
      title: "Comprehensive Inspection",
      description: "Detailed inspection of all major systems",
      price: 89.99,
      features: [
        "All Standard Inspection checks",
        "Transmission check",
        "Suspension system inspection",
        "Exhaust system check",
        "Air conditioning test",
        "Computer diagnostic scan",
      ],
    },
    {
      id: "pre-purchase",
      title: "Pre-Purchase Inspection",
      description: "Complete inspection before buying a used car",
      price: 129.99,
      features: [
        "All Comprehensive Inspection checks",
        "Vehicle history verification",
        "Hidden damage assessment",
        "Test drive evaluation",
        "Market value assessment",
        "Detailed inspection report",
      ],
    },
  ];

  const CarDetailsStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Car Details</h2>
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
        Please provide your car details for the inspection
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="carMake" className="block text-sm font-medium mb-1">
            Car Make
          </label>
          <input
            type="text"
            id="carMake"
            name="carMake"
            value={formData.carMake}
            onChange={handleChange}
            placeholder="e.g., Toyota, Honda, BMW"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label htmlFor="carModel" className="block text-sm font-medium mb-1">
            Car Model
          </label>
          <input
            type="text"
            id="carModel"
            name="carModel"
            value={formData.carModel}
            onChange={handleChange}
            placeholder="e.g., Camry, Civic, 3 Series"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        <div>
          <label htmlFor="carYear" className="block text-sm font-medium mb-1">
            Year
          </label>
          <input
            type="number"
            id="carYear"
            name="carYear"
            value={formData.carYear}
            onChange={handleChange}
            placeholder="e.g., 2018"
            min="1900"
            max={new Date().getFullYear()}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={nextStep}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const InspectionTypeStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Select Inspection Type</h2>
        <button
          type="button"
          onClick={prevStep}
          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          Back
        </button>
      </div>
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
        Choose the inspection package that fits your needs
      </p>

      <div className="space-y-4">
        {inspectionTypes.map((type) => (
          <div
            key={type.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              formData.inspectionType === type.id
                ? "border-blue-600 ring-2 ring-blue-500 ring-opacity-50"
                : isDarkMode
                ? "border-gray-700 hover:border-gray-600"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() =>
              setFormData({ ...formData, inspectionType: type.id })
            }
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{type.title}</h3>
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } text-sm mt-1`}
                >
                  {type.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">${type.price}</p>
                {formData.inspectionType === type.id && (
                  <div className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs rounded-full px-2 py-1 inline-flex items-center">
                    <Check size={12} className="mr-1" />
                    Selected
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Includes:</p>
              <ul className="text-sm space-y-1">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check
                      size={16}
                      className="text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={nextStep}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const SchedulingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Schedule Your Inspection</h2>
        <button
          type="button"
          onClick={prevStep}
          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          Back
        </button>
      </div>
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
        Select your preferred date and time for the inspection
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="inspectionDate"
            className="block text-sm font-medium mb-1"
          >
            Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              id="inspectionDate"
              name="inspectionDate"
              value={formData.inspectionDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="inspectionTime"
            className="block text-sm font-medium mb-1"
          >
            Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={18} className="text-gray-400" />
            </div>
            <select
              id="inspectionTime"
              name="inspectionTime"
              value={formData.inspectionTime}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select a time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="specialRequests"
            className="block text-sm font-medium mb-1"
          >
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={3}
            placeholder="Any specific concerns or requests for the inspection"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          ></textarea>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="button"
          onClick={nextStep}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  const ReviewStep = () => {
    const selectedInspection = inspectionTypes.find(
      (type) => type.id === formData.inspectionType
    );

    const handlePaymentInitiation = () => {
      const serviceDetails = {
        type: "inspection",
        name: selectedInspection?.title,
        price: selectedInspection?.price,
        serviceFee: 9.99,
        totalAmount: (selectedInspection?.price || 0) + 9.99,
        details: {
          date: formData.inspectionDate,
          time: formData.inspectionTime,
          location: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
          vehicle: {
            make: formData.carMake,
            model: formData.carModel,
            year: formData.carYear,
          },
          specialRequests: formData.specialRequests,
        },
      };

      initializePayment(serviceDetails);
      navigate("/payment");
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Review Your Booking</h2>
          <button
            type="button"
            onClick={prevStep}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Back
          </button>
        </div>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-6`}>
          Please review your inspection details before confirming
        </p>

        <div
          className={`rounded-lg p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Car Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Make</p>
                <p className="font-medium">{formData.carMake}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Model
                </p>
                <p className="font-medium">{formData.carModel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                <p className="font-medium">{formData.carYear}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Inspection Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium">{selectedInspection?.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium">{formData.inspectionDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium">{formData.inspectionTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-medium">
                  {formData.address}, {formData.city}, {formData.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="font-semibold text-lg mb-4">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>{selectedInspection?.title}</p>
              <p>${selectedInspection?.price.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Service Fee</p>
              <p>$9.99</p>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 my-2 pt-2 flex justify-between font-semibold">
              <p>Total</p>
              <p>${(selectedInspection?.price + 9.99).toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-lg p-4 border border-yellow-300 ${
            isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
          } flex items-start gap-2`}
        >
          <AlertTriangle
            size={20}
            className="text-yellow-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm">
            By proceeding with this booking, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Cancellation Policy
            </a>
            .
          </p>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={handlePaymentInitiation}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    );
  };

  const ConfirmationStep = () => {
    const selectedInspection = inspectionTypes.find(
      (type) => type.id === formData.inspectionType
    );

    return (
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900">
          <Check size={32} className="text-green-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your car inspection has been scheduled successfully
          </p>
        </div>

        <div
          className={`rounded-lg p-4 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } max-w-md mx-auto text-left`}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inspection Date
                </p>
                <p className="font-medium">
                  {formData.inspectionDate} at {formData.inspectionTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle
                </p>
                <p className="font-medium">
                  {formData.carYear} {formData.carMake} {formData.carModel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Service
                </p>
                <p className="font-medium">{selectedInspection?.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
                <p className="font-medium">
                  ${(selectedInspection?.price + 9.99).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            You will receive a confirmation email with the details of your
            booking. Our mechanic will contact you 30 minutes before the
            appointment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/profile"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View Booking
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
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <CarDetailsStep />;
      case 2:
        return <InspectionTypeStep />;
      case 3:
        return <SchedulingStep />;
      case 4:
        return <ReviewStep />;
      case 5:
        return <ConfirmationStep />;
      default:
        return <CarDetailsStep />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {step < 5 && (
        <div className="mb-8">
          <div className="flex justify-between w-full mb-4">
            {["Car Details", "Inspection Type", "Scheduling", "Review"].map(
              (label, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                    step > index + 1
                      ? "bg-green-500 text-white"
                      : step === index + 1
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > index + 1 ? <Check size={16} /> : index + 1}
                </div>
              )
            )}
          </div>
          <div className="relative">
            <div
              className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
            <div
              className={`h-1 w-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>
      )}

      <div
        className={`rounded-xl shadow-lg p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {renderStep()}
      </div>
    </div>
  );
};

export default CarInspection;
