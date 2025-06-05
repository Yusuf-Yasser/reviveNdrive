import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { ChevronRight } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div 
      className={`${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-50'
      } rounded-xl shadow-lg p-6 text-left transition-all duration-300 hover:shadow-xl group`}
    >
      <div className="mb-4">
        {service.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{service.description}</p>
      <Link 
        to={service.link} 
        className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-200"
      >
        Learn more <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  );
};

export default ServiceCard;