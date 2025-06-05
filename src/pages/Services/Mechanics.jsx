import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { MapPin, Star, Clock, Phone, Calendar, Wrench, Shield, DollarSign, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mechanics = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const mechanics = [
    {
      id: 1,
      name: "John Smith",
      specialization: "General Repairs & Maintenance",
      experience: "15+ years",
      rating: 4.8,
      reviews: 156,
      image: "https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      location: "Downtown Auto District",
      availability: "Available Today",
      certifications: ["ASE Master Technician", "BMW Certified"],
      hourlyRate: 85,
      services: [
        "Engine Diagnostics",
        "Brake Service",
        "Oil Change",
        "Transmission Repair"
      ],
      bookingLink: "/mechanic-booking",
    },
    {
      id: 2,
      name: "Sarah Chen",
      specialization: "Electric & Hybrid Vehicles",
      experience: "10+ years",
      rating: 4.9,
      reviews: 98,
      image: "https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      location: "West Side Auto Mall",
      availability: "Next Day Available",
      certifications: ["Tesla Certified", "Hybrid Specialist"],
      hourlyRate: 95,
      services: [
        "EV Diagnostics",
        "Battery Service",
        "Charging System Repair",
        "Regenerative Brake "
      ],
      bookingLink: "/mechanic-booking",
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      specialization: "Performance & Custom Tuning",
      experience: "12+ years",
      rating: 4.7,
      reviews: 124,
      image: "https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      location: "East End Auto Zone",
      availability: "Available Today",
      certifications: ["Performance Tuning Specialist", "Custom Fabrication"],
      hourlyRate: 90,
      services: [
        "Engine Tuning",
        "Turbo Installation",
        "Custom Exhaust",
        "Suspension Upgrades"
      ],
      bookingLink: "/mechanic-booking",
    },
  ];

  const services = [
    "All Services",
    "General Repairs",
    "Engine Diagnostics",
    "Brake Service",
    "Oil Change",
    "Transmission Repair",
    "Electric Vehicles",
    "Hybrid Vehicles",
    "Performance Tuning",
    "Custom Modifications"
  ];

  const locations = [
    "All Locations",
    "Downtown Auto District",
    "West Side Auto Mall",
    "East End Auto Zone",
    "North Auto Center",
    "South Service Area"
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search and Filter Section */}
      <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mechanics by name or service..."
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          >
            {services.map((service, index) => (
              <option key={index} value={service}>{service}</option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          >
            {locations.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mechanics.map(mechanic => (
          <div 
            key={mechanic.id}
            className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="relative">
              <img
                src={mechanic.image}
                alt={mechanic.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                {mechanic.availability}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{mechanic.name}</h3>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="ml-1">{mechanic.rating}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      ({mechanic.reviews})
                    </span>
                  </div>
                </div>
                <p className="text-blue-600 text-sm">{mechanic.specialization}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-2" />
                  <span>{mechanic.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 mr-2" />
                  <span>{mechanic.experience} Experience</span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="text-gray-400 mr-2" />
                  <span>${mechanic.hourlyRate}/hour</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {mechanic.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode 
                          ? 'bg-blue-900/20 text-blue-400' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Services</h4>
                <div className="grid grid-cols-2 gap-2">
                  {mechanic.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm"
                    >
                      <Wrench size={14} className="text-blue-600 mr-1" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
               
                  <Link to={mechanic.bookingLink} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center">
                    Book Appointment
                  </Link>
                <button className="py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                  <Phone size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us Section */}
      <div className={`mt-12 rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Mechanics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Verified Professionals</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              All our mechanics are thoroughly vetted and certified professionals
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Transparent Pricing</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Clear upfront pricing with no hidden fees or surprises
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold mb-2">Flexible Scheduling</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Book appointments at your convenience, including same-day service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mechanics;