import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ title, message, confirmText, cancelText, onConfirm, onCancel, isDeleting }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        
        <div className="flex items-start">
          <div className="shrink-0 text-yellow-500">
            <AlertTriangle size={32} />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              {message}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className={`px-4 py-2 rounded ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
                disabled={isDeleting}
              >
                {cancelText || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-70"
                disabled={isDeleting}
              >
                {isDeleting ? 'Processing...' : confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 