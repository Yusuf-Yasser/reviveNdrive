import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const PrivacyPolicycar = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us when you:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Create an account</li>
            <li>Book a service</li>
            <li>Contact customer support</li>
            <li>Sign up for our newsletter</li>
            <li>Participate in surveys or promotions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Provide and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and events</li>
            <li>Protect against fraudulent or illegal activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Information Sharing
          </h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your
            information with:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Service providers who assist in our operations</li>
            <li>Professional advisers and insurers</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Your Rights
          </h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
            <br />
            Email: privacy@carservice.com
            <br />
            Phone: 1-800-CAR-SERV
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicycar;
