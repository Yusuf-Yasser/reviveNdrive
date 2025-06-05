import React, { useState, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { usePayment } from "../../contexts/PaymentContext";
import { CreditCard, Lock, Calendar, User, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const PaymentGateway = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { serviceDetails, processPayment } = usePayment();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    email: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cardType = getCardType(formData.cardNumber);
      const result = await processPayment({
        ...formData,
        cardType,
      });
      
      if (result.success) {
        // Redirect to the updated confirmation page path
        navigate("/payment/confirmation");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle payment failure (show error message, etc.)
      alert("Payment failed. Please try again.");
    }
  };

  const getCardType = (number) => {
    // Basic card type detection
    const firstDigit = number.charAt(0);
    switch (firstDigit) {
      case "4":
        return "Visa";
      case "5":
        return "Mastercard";
      case "3":
        return "American Express";
      default:
        return "Card";
    }
  };

  if (!serviceDetails) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Payment Form */}
        <div className="flex-grow">
          <div
            className={`rounded-xl shadow-lg p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
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
                <label className="block text-sm font-medium mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } focus:ring-2 focus:ring-blue-500`}
                    maxLength="19"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cardholder Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300"
                    } focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500`}
                      maxLength="5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300"
                      } focus:ring-2 focus:ring-blue-500`}
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={formData.saveCard}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="saveCard" className="ml-2 block text-sm">
                  Save card for future payments
                </label>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                } flex items-start space-x-2`}
              >
                <Lock className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-sm">
                  Your payment information is secure. We use industry-standard
                  encryption to protect your data.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <Lock size={20} className="mr-2" />
                Pay $
                {(
                  serviceDetails.price + (serviceDetails.serviceFee || 5.0)
                ).toFixed(2)}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80">
          <div
            className={`rounded-xl shadow-lg p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="font-semibold mb-4">Order Summary</h3>

            <div className="space-y-4">
              <div>
                <p className="font-medium">{serviceDetails.name}</p>
                <div className="flex items-center text-sm mt-1">
                  <Calendar size={16} className="text-gray-400 mr-1" />
                  <span>
                    {serviceDetails.date} at {serviceDetails.time}
                  </span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <AlertTriangle size={16} className="text-gray-400 mr-1" />
                  <span>{serviceDetails.location}</span>
                </div>
              </div>

              <div
                className={`border-t ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } pt-4`}
              >
                <div className="flex justify-between mb-2">
                  <span>Service Fee</span>
                  <span>${serviceDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Platform Fee</span>
                  <span>${(serviceDetails.serviceFee || 5.0).toFixed(2)}</span>
                </div>
                <div
                  className={`flex justify-between font-semibold pt-2 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span>Total</span>
                  <span>
                    $
                    {(
                      serviceDetails.price + (serviceDetails.serviceFee || 5.0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"
                } flex items-start space-x-2`}
              >
                <AlertTriangle
                  className="text-yellow-600 flex-shrink-0"
                  size={20}
                />
                <p className="text-sm">
                  By proceeding with the payment, you agree to our terms of
                  service and cancellation policy.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`mt-4 p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Contact our support team at support@carservice.com or call us at
              +1 (234) 567-8901
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
