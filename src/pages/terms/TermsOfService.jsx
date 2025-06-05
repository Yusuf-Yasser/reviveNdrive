import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const TermsOfService = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing and using CarService, you accept and agree to be bound
            by the terms and provisions of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            2. User Accounts
          </h2>
          <p className="mb-4">
            To access certain features of the Service, you must register for an
            account. You agree to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Not share your account credentials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            3. Service Usage
          </h2>
          <p className="mb-4">
            Our services are provided "as is." You agree to use them at your own
            risk and discretion. You must:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Follow all applicable laws and regulations</li>
            <li>Respect other users and their privacy</li>
            <li>Not misuse or abuse our services</li>
            <li>Not interfere with the proper working of the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            4. Payment Terms
          </h2>
          <p className="mb-4">For paid services:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              Payments are processed securely through our payment providers
            </li>
            <li>Prices are subject to change with notice</li>
            <li>Refunds are handled according to our refund policy</li>
            <li>You are responsible for all applicable taxes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            5. Limitation of Liability
          </h2>
          <p className="mb-4">
            CarService and its affiliates shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting
            from your use or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            6. Changes to Terms
          </h2>
          <p className="mb-4">
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes via email or through the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Contact Information
          </h2>
          <p>
            For questions about these Terms of Service, please contact us at:
            <br />
            Email: legal@carservice.com
            <br />
            Phone: 1-800-CAR-SERV
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
