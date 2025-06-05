import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, role, image, testimonial, rating }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div 
      className={`${
        isDarkMode 
          ? 'bg-gray-800' 
          : 'bg-white'
      } rounded-xl shadow-lg p-6 text-left transition-all duration-300 hover:shadow-xl flex flex-col`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={image} 
          alt={name} 
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{role}</p>
        </div>
      </div>
      
      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex-grow mb-4 italic`}>
        "{testimonial}"
      </p>
      
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i}
            size={16}
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;