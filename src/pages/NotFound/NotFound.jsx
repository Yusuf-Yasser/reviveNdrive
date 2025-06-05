import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className={`p-6 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-6`}>
        <AlertTriangle size={64} className="text-yellow-500" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold mb-2">404</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className={`max-w-md mx-auto mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or it never existed.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Home size={18} />
          <span>Go to Home</span>
        </Link>
        <button 
          onClick={() => window.history.back()}
          className={`flex items-center justify-center gap-2 px-6 py-3 ${
            isDarkMode 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-gray-100 hover:bg-gray-200'
          } font-medium rounded-lg transition-colors duration-200`}
        >
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;