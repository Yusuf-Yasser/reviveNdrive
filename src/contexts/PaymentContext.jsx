import React, { createContext, useContext, useState } from "react";

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [serviceDetails, setServiceDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [transactionId, setTransactionId] = useState(null);

  const initializePayment = (details) => {
    setServiceDetails(details);
    setPaymentStatus("pending");
  };

  const processPayment = async (paymentData) => {
    try {
      // Simulate payment processing
      setPaymentStatus("processing");

      // In a real application, this would be an API call to a payment processor
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockTransactionId =
        "TXN_" + Math.random().toString(36).substr(2, 9);
      setTransactionId(mockTransactionId);
      setPaymentStatus("completed");

      return {
        success: true,
        transactionId: mockTransactionId,
      };
    } catch (error) {
      setPaymentStatus("failed");
      throw error;
    }
  };

  const resetPayment = () => {
    setServiceDetails(null);
    setPaymentStatus("pending");
    setTransactionId(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        serviceDetails,
        paymentStatus,
        transactionId,
        initializePayment,
        processPayment,
        resetPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
