import React from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Wrench,
  Truck,
  ShoppingCart,
  MessageSquare,
  Info,
} from "lucide-react";
import ServiceCard from "./ServiceCard";
import TestimonialCard from "./TestimonialCard";
import FeatureSection from "./FeatureSection";

const Home = () => {
  const services = [
    {
      icon: <Car size={24} className="text-blue-600" />,
      title: "Car Inspection",
      description:
        "Get your car inspected by certified mechanics for only $49.99",
      link: "/inspection",
    },
    {
      icon: <Truck size={24} className="text-blue-600" />,
      title: "Tow Truck",
      description: "24/7 towing service to get you and your car to safety",
      link: "/tow-truck",
    },
    {
      icon: <Wrench size={24} className="text-blue-600" />,
      title: "Mechanic Services",
      description: "Connect with trusted mechanics for all your repair needs",
      link: "/mechanics",
    },
    {
      icon: <ShoppingCart size={24} className="text-blue-600" />,
      title: "Spare Parts",
      description: "Find genuine spare parts for all car makes and models",
      link: "/spare-parts",
    },
  ];

  return (
    <div className="space-y-16 mt-20">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl opacity-90"></div>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-2xl overflow-hidden">
          <div className="text-white z-10 max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Your One-Stop Solution for All Car Services
            </h1>
            <p className="text-lg opacity-90 mb-8">
              From diagnostics to repairs, towing to spare parts - we've got
              everything to keep your car in perfect condition
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/inspection"
                className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300"
              >
                Book Inspection
              </Link>
              <Link
                to="/chatbot"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Ask AI Mechanic
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-first md:order-last">
            <img
              src="https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Car service professional"
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="text-center space-y-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            We offer a wide range of services to meet all your car-related needs
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </section>

      {/* Feature Highlight */}
      <FeatureSection />

      {/* AI Chatbot Section */}
      <section className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="text-blue-600" />
                <h3 className="font-semibold">AI Mechanic</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-sm">
                    What's that clicking noise when I start my car?
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg ml-auto max-w-[80%]">
                  <p className="text-sm">
                    Based on your description, this could be a starter motor
                    issue. Would you like me to explain more or help you book a
                    diagnostic service?
                  </p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                  <p className="text-sm">
                    Yes, please help me book a diagnostic.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex">
                <input
                  type="text"
                  placeholder="Ask about your car issues..."
                  className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="ml-2 bg-blue-600 text-white p-2 rounded-lg">
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold">AI-Powered Car Diagnostics</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our advanced AI mechanic can help diagnose car issues, provide
              maintenance tips, and guide you to the right service - all through
              a simple chat.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <Info size={20} className="text-blue-600 mt-1" />
                <span>Get instant answers about car problems</span>
              </li>
              <li className="flex items-start space-x-2">
                <Info size={20} className="text-blue-600 mt-1" />
                <span>Available 24/7 in multiple languages</span>
              </li>
              <li className="flex items-start space-x-2">
                <Info size={20} className="text-blue-600 mt-1" />
                <span>Book services directly through the chat</span>
              </li>
            </ul>
            <Link
              to="/chatbot"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Try AI Mechanic Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="text-center space-y-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestimonialCard
            name="John Smith"
            role="Toyota Owner"
            image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            testimonial="The AI mechanic accurately diagnosed my car's issue and saved me from an expensive repair. Highly recommended!"
            rating={5}
          />
          <TestimonialCard
            name="Sarah Johnson"
            role="BMW Driver"
            image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            testimonial="The tow truck arrived within 15 minutes of my request. The driver was professional and got me to the nearest garage quickly."
            rating={4}
          />
          <TestimonialCard
            name="Michael Chen"
            role="Honda Enthusiast"
            image="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            testimonial="Found exactly the spare parts I needed for my vintage Honda at a great price. Delivery was quick and parts were genuine."
            rating={5}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Keep Your Car in Perfect Condition?
        </h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
          Join thousands of satisfied car owners who trust our platform for all
          their car service needs
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition duration-300"
          >
            Sign Up Now
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-transparent border-2 border-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition duration-300"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
