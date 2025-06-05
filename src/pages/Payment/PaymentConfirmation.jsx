import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { usePayment } from "../../contexts/PaymentContext";
import {
  CheckCircle,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  Printer,
  Mail,
  ArrowLeft,
  Car,
  Truck,
  Wrench,
} from "lucide-react";

const PaymentConfirmation = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { paymentDetails, serviceDetails } = usePayment();
  const navigate = useNavigate();
  
  // Create mock data for static display when real data isn't available
  const mockPaymentDetails = {
    confirmationNumber: "CONF-ABC123XYZ",
    transactionId: "TXN_123456789",
    paymentMethod: "Visa ending in 4242",
    service: "Car Service",
    location: "123 Main Street, Anytown",
    date: new Date().toLocaleDateString(),
    time: "10:00 AM",
    email: "customer@example.com",
    amount: 99.99,
    serviceFee: 9.99,
    serviceType: "tow_truck"
  };
  
  const mockServiceDetails = {
    name: "Tow Truck Service",
    details: {
      pickup: "123 Main Street, Anytown",
      destination: "456 Service Road, Anytown",
      date: new Date().toLocaleDateString(),
      time: "10:00 AM"
    }
  };
  
  // Use real data if available, otherwise use mock data
  const displayPaymentDetails = paymentDetails || mockPaymentDetails;
  const displayServiceDetails = serviceDetails || mockServiceDetails;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`rounded-xl shadow-lg p-8 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your booking has been confirmed and paid for
          </p>
        </div>

        {/* Confirmation Details */}
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } mb-6`}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Confirmation Number
              </p>
              <p className="font-medium">{displayPaymentDetails.confirmationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Payment Method
              </p>
              <p className="font-medium">{displayPaymentDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Service
              </p>
              <p className="font-medium">{displayPaymentDetails.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Location
              </p>
              <p className="font-medium">{displayPaymentDetails.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Date & Time
              </p>
              <p className="font-medium">
                {displayPaymentDetails.date} at {displayPaymentDetails.time}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium">{displayPaymentDetails.email}</p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          } mb-6`}
        >
          <h3 className="font-semibold mb-4">Payment Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>${displayPaymentDetails.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>${displayPaymentDetails.serviceFee.toFixed(2)}</span>
            </div>
            <div
              className={`flex justify-between font-semibold pt-2 border-t ${
                isDarkMode ? "border-gray-600" : "border-gray-300"
              }`}
            >
              <span>Total Paid</span>
              <span>
                $
                {(displayPaymentDetails.amount + displayPaymentDetails.serviceFee).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Download size={20} />
              <span>Download Receipt</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
              <Printer size={20} />
              <span>Print Receipt</span>
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
            <Mail size={20} />
            <span>Email Receipt</span>
          </button>
        </div>

        {/* Service Specific Info */}
        <div className={`p-6 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"} mb-6`}>
          {/* Tow Truck Service */}
          {displayPaymentDetails.serviceType === "tow_truck" && (
            <div className="flex items-start gap-3">
              <Truck className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-medium mb-1">Tow Truck Service Details</h3>
                <p className="text-sm">A tow truck has been dispatched to your location. You will receive updates about the driver's arrival via text message.</p>
                <p className="text-sm mt-2">Pickup: {displayServiceDetails.details?.pickup || "N/A"}</p>
                {displayServiceDetails.details?.destination && (
                  <p className="text-sm">Destination: {displayServiceDetails.details.destination}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Mechanic Service */}
          {displayPaymentDetails.serviceType === "mechanic_service" && (
            <div className="flex items-start gap-3">
              <Wrench className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-medium mb-1">Mechanic Service Details</h3>
                <p className="text-sm">Your mechanic service has been scheduled. A professional will arrive at the scheduled time.</p>
                <p className="text-sm mt-2">Service: {displayServiceDetails.details?.service || "N/A"}</p>
                <p className="text-sm">Vehicle: {displayServiceDetails.details?.vehicle || "N/A"}</p>
              </div>
            </div>
          )}

          {/* Car Inspection */}
          {displayPaymentDetails.serviceType === "car_inspection" && (
            <div className="flex items-start gap-3">
              <Car className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-medium mb-1">Car Inspection Details</h3>
                <p className="text-sm">Your car inspection has been scheduled. A certified inspector will arrive at the scheduled time.</p>
                <p className="text-sm mt-2">Inspection Type: {displayServiceDetails.name || "N/A"}</p>
                <p className="text-sm">Vehicle: {displayServiceDetails.details?.vehicle || "N/A"}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
          <Link 
            to="/profile"
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View Booking Details
          </Link>
          
          {displayPaymentDetails.serviceType === "tow_truck" && (
            <Link 
              to="/tow-truck"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              Back to Tow Truck
            </Link>
          )}
          
          {displayPaymentDetails.serviceType === "mechanic_service" && (
            <Link 
              to="/mechanic-booking"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              Back to Mechanic Services
            </Link>
          )}
          
          {displayPaymentDetails.serviceType === "car_inspection" && (
            <Link 
              to="/inspection"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              Back to Car Inspection
            </Link>
          )}
          
          <Link 
            to="/"
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-100 hover:bg-gray-200"
            } rounded-lg transition-colors duration-200`}
          >
            <ArrowLeft size={20} />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
