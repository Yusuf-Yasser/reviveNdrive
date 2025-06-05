import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const Cookcar = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div
      className={`max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

      <div className="space-y-6 text-gray-600 dark:text-gray-300">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            What Are Cookies
          </h2>
          <p className="mb-4">
            Cookies are small text files that are placed on your computer or
            mobile device when you visit our website. They are widely used to
            make websites work more efficiently and provide useful information
            to website owners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            How We Use Cookies
          </h2>
          <p className="mb-4">We use cookies for the following purposes:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              Essential cookies: Required for the website to function properly
            </li>
            <li>Analytical cookies: To analyze how visitors use our website</li>
            <li>
              Preference cookies: To remember your settings and preferences
            </li>
            <li>Marketing cookies: To deliver personalized advertisements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Types of Cookies We Use
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function and
                cannot be switched off in our systems.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Performance Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we
                can measure and improve the performance of our site.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Functional Cookies</h3>
              <p>
                These cookies enable the website to provide enhanced
                functionality and personalization.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Targeting Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising
                partners to build a profile of your interests.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Managing Cookies
          </h2>
          <p className="mb-4">
            Most web browsers allow you to control cookies through their
            settings preferences. However, limiting cookies may impact your
            experience of the site.
          </p>
          <p className="mb-4">To manage cookies in your browser:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Chrome: Settings → Privacy and Security → Cookies</li>
            <li>Firefox: Options → Privacy & Security → Cookies</li>
            <li>Safari: Preferences → Privacy → Cookies</li>
            <li>Edge: Settings → Privacy & Security → Cookies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Changes to This Policy
          </h2>
          <p className="mb-4">
            We may update our Cookie Policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Contact Us
          </h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us
            at:
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

export default Cookcar;
