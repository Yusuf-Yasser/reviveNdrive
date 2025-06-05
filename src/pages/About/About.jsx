import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { CheckCircle, Users, Award, Clock, Car } from 'lucide-react';

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const team = [
    {
      name: 'John Thompson',
      position: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Former automotive engineer with 15+ years of experience in the industry.'
    },
    {
      name: 'Sarah Chen',
      position: 'Chief Technology Officer',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Tech innovator with a passion for creating seamless digital experiences.'
    },
    {
      name: 'Michael Rodriguez',
      position: 'Head of Operations',
      image: 'https://images.pexels.com/photos/3789888/pexels-photo-3789888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Logistics expert who ensures our service providers deliver excellence.'
    },
    {
      name: 'Aisha Johnson',
      position: 'Customer Success Manager',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      bio: 'Dedicated to ensuring every customer has an exceptional experience.'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Happy Customers', icon: <Users size={24} className="text-blue-600" /> },
    { value: '5,000+', label: 'Service Providers', icon: <Award size={24} className="text-blue-600" /> },
    { value: '15+', label: 'Years Experience', icon: <Clock size={24} className="text-blue-600" /> },
    { value: '95%', label: 'Customer Satisfaction', icon: <CheckCircle size={24} className="text-blue-600" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About CarService</h1>
        <p className={`max-w-3xl mx-auto text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          We're on a mission to make car care simple, transparent, and stress-free for everyone.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Our story" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-2xl font-bold">Our Story</h2>
            <p>
              CarService was born from a simple frustration: car maintenance and repairs were too complicated, expensive, and filled with uncertainty for the average car owner.
            </p>
            <p>
              Founded in 2010, our journey began when our founder, John Thompson, experienced a breakdown on a remote highway. After waiting hours for assistance and then being charged an exorbitant fee for a simple repair, he knew there had to be a better way.
            </p>
            <p>
              Today, CarService connects thousands of car owners with reliable service providers across the country, saving them time, money, and stress. Our platform has grown from a simple towing service to a comprehensive car care ecosystem that handles everything from routine maintenance to emergency repairs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} rounded-2xl p-8 md:p-12 mb-16`}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-lg">
            To create a transparent, accessible, and stress-free car care experience for every vehicle owner, while supporting local service providers and mechanics.
          </p>
          <div className="flex justify-center">
            <Car size={32} className="text-blue-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <h3 className="font-semibold mb-2">Transparency</h3>
              <p className="text-sm">
                Clear pricing, honest advice, and no hidden commissions or fees.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <h3 className="font-semibold mb-2">Accessibility</h3>
              <p className="text-sm">
                Car care services available to everyone, regardless of technical knowledge.
              </p>
            </div>
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm">
                Supporting local mechanics and service providers while building a network of car owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg p-6 text-center`}
            >
              <div className="flex justify-center mb-4">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">Meet Our Team</h2>
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The passionate individuals driving our mission forward
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div 
              key={index}
              className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2`}
            >
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{member.position}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The principles that guide everything we do
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className="font-semibold text-lg mb-3">Customer First</h3>
            <p>
              Every decision we make is based on what's best for our customers. We strive to exceed expectations and create experiences that delight.
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className="font-semibold text-lg mb-3">Integrity</h3>
            <p>
              We operate with honesty and transparency in all our dealings with customers, partners, and service providers.
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className="font-semibold text-lg mb-3">Innovation</h3>
            <p>
              We constantly seek new ways to improve car care through technology, from our AI mechanic to our seamless booking systems.
            </p>
          </div>
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className="font-semibold text-lg mb-3">Community</h3>
            <p>
              We believe in supporting local businesses and creating a network of car owners and service providers who help each other.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-lg opacity-90 max-w-3xl mx-auto mb-8">
          Whether you're a car owner looking for reliable service or a mechanic wanting to grow your business, we invite you to be part of our community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/signup" 
            className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Sign Up Now
          </a>
          <a 
            href="/contact" 
            className="px-6 py-3 bg-transparent border-2 border-white font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;