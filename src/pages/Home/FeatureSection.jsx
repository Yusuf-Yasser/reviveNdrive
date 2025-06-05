import React from 'react';
import { Shield, Clock, DollarSign, UserCheck } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: <Shield size={24} className="text-blue-600" />,
      title: "Trusted Service Providers",
      description: "All mechanics and service providers are vetted and reviewed by our team."
    },
    {
      icon: <Clock size={24} className="text-blue-600" />,
      title: "24/7 Assistance",
      description: "Get help anytime with our round-the-clock towing and emergency services."
    },
    {
      icon: <DollarSign size={24} className="text-blue-600" />,
      title: "Transparent Pricing",
      description: "Know exactly what you're paying for with our clear pricing structure."
    },
    {
      icon: <UserCheck size={24} className="text-blue-600" />,
      title: "Verified Reviews",
      description: "Read genuine reviews from verified customers for each service provider."
    }
  ];

  return (
    <section className="py-8 mt-20">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
        <p className="text-gray-600 dark:text-gray-300">
          We're dedicated to providing the best car service experience with these key benefits
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;