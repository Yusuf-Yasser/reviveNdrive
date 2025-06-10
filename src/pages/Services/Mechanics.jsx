import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { MapPin, Star, Clock, Phone, Calendar, Wrench, Shield, DollarSign, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Mechanics = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = "http://localhost/CarService-master/api/get_mechanics.php";
      
      // Add filters if they exist
      const queryParams = [];
      if (searchQuery) queryParams.push(`search=${encodeURIComponent(searchQuery)}`);
      if (selectedService && selectedService !== 'All Services') queryParams.push(`specialty=${encodeURIComponent(selectedService)}`);
      if (selectedLocation && selectedLocation !== 'All Locations') queryParams.push(`location=${encodeURIComponent(selectedLocation)}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      
      if (response.ok) {
        setMechanics(data.mechanics || []);
      } else {
        setError(data.message || "Failed to fetch mechanics");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMechanics();
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'service') {
      setSelectedService(value);
    } else if (filterType === 'location') {
      setSelectedLocation(value);
    }
    // Auto-search when filter changes
    setTimeout(fetchMechanics, 100);
  };

  const services = [
    "All Services",
    "Engine Repair",
    "Transmission Services", 
    "Brake Systems",
    "Suspension and Steering",
    "Electrical Systems",
    "Air Conditioning (AC) Repair",
    "Tire Services",
    "Exhaust Systems",
    "Diagnostics",
    "General Maintenance"
  ];

  const locations = [
    "All Locations",
    "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", 
    "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Giza", "Ismailia", 
    "Kafr El Sheikh", "Luxor", "Matrouh", "Minya", "Monufia", "New Valley", 
    "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", 
    "Sohag", "South Sinai", "Suez"
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
            onChange={(e) => handleFilterChange('service', e.target.value)}
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
            onChange={(e) => handleFilterChange('location', e.target.value)}
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
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Search size={18} />
            Search
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && mechanics.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No mechanics found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Mechanics Grid */}
      {!loading && !error && mechanics.length > 0 && (
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
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm ${
                  mechanic.availability === 'Available Today' 
                    ? 'bg-green-500 text-white'
                    : mechanic.availability === 'Next Day Available'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
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
                  {mechanic.phone && (
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-2" />
                      <span>{mechanic.phone}</span>
                    </div>
                  )}
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
                  <Link to={`/mechanic-booking?mechanicId=${mechanic.id}`} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center">
                    Book Appointment
                  </Link>
                  {mechanic.phone && (
                    <a 
                      href={`tel:${mechanic.phone}`}
                      className="py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                    >
                      <Phone size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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