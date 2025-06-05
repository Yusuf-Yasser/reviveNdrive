import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Settings, LogOut, Shield, Car, CreditCard, History, BellRing, Trash2, Edit } from 'lucide-react';

const Profile = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If not authenticated, don't render the profile
  if (!currentUser) {
    return null;
  }

  // Combine currentUser data with demo data
  const userInfo = {
    name: currentUser.name || 'User',
    email: currentUser.email || 'user@example.com',
    phone: currentUser.phone || '+1 (234) 567-8901',
    address: currentUser.address || '123 Main Street, Anytown, CA 12345',
    memberSince: 'January 2023',
    avatar: currentUser.avatar,
    cars: [
      { id: 1, make: 'Toyota', model: 'Camry', year: 2018, color: 'Silver' },
      { id: 2, make: 'Honda', model: 'Civic', year: 2020, color: 'Blue' }
    ],
    paymentMethods: [
      { id: 1, type: 'Credit Card', last4: '4242', expiry: '04/25', isDefault: true },
      { id: 2, type: 'PayPal', email: 'john.doe@example.com', isDefault: false }
    ],
    serviceHistory: [
      { id: 1, service: 'Oil Change', date: '2023-05-15', provider: 'QuickFix Auto', status: 'Completed', amount: 49.99 },
      { id: 2, service: 'Tire Rotation', date: '2023-07-22', provider: 'Tire Center', status: 'Completed', amount: 35.00 },
      { id: 3, service: 'Brake Inspection', date: '2023-10-05', provider: 'Midas', status: 'Completed', amount: 79.95 }
    ],
    notifications: [
      { id: 1, type: 'Service Reminder', message: 'Your Toyota Camry is due for an oil change', date: '2023-11-01', isRead: false },
      { id: 2, type: 'Promotion', message: '25% off on all brake services this week!', date: '2023-10-28', isRead: true },
      { id: 3, type: 'System', message: 'Your account information has been updated', date: '2023-10-25', isRead: true }
    ]
  };

  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
              <User size={48} />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold">{userInfo.name}</h2>
          <p className="text-blue-600">Premium Member</p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            Member since {userInfo.memberSince}
          </p>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Edit Profile
          </button>
        </div>
      </div>

      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p>{userInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p>{userInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <User size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
              <p>{userInfo.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">My Cars</h3>
          <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-1">
            <Edit size={16} />
            <span>Add Car</span>
          </button>
        </div>
        <div className="space-y-4">
          {userInfo.cars.map(car => (
            <div key={car.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} flex justify-between items-center`}>
              <div className="flex items-center gap-3">
                <Car size={20} className="text-blue-600" />
                <div>
                  <p className="font-medium">{car.year} {car.make} {car.model}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Color: {car.color}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                  <Edit size={16} />
                </button>
                <button className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const PaymentTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Methods</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-1">
          <CreditCard size={16} />
          <span>Add New</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {userInfo.paymentMethods.map(method => (
          <div key={method.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex justify-between items-center`}>
            <div className="flex items-center gap-3">
              {method.type === 'Credit Card' ? (
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <svg viewBox="0 0 24 24" width="20" height="20" className="text-blue-600">
                    <path fill="currentColor" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74l2.933-18.158a.91.91 0 0 1 .899-.739H9.86c3.99 0 6.464 1.343 5.741 5.653-.723 4.31-3.4 5.916-7.164 5.916h-1.28l-.76 4.828a.641.641 0 0 1-.633.528c-.3.012-.505.012-.699.012v2.7zm2.697-11.494h.899c1.898 0 2.933-.633 3.245-2.544.317-1.91-.317-2.544-2.215-2.544h-.899l-1.03 5.088z"/>
                  </svg>
                </div>
              )}
              <div>
                <p className="font-medium">
                  {method.type === 'Credit Card' ? `•••• •••• •••• ${method.last4}` : method.email}
                </p>
                {method.type === 'Credit Card' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expires: {method.expiry}</p>
                )}
                {method.isDefault && (
                  <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                <Edit size={16} />
              </button>
              <button className="p-1 text-red-600 hover:text-red-700 transition-colors duration-200">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const HistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Service History</h3>
      
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Provider</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {userInfo.serviceHistory.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{service.service}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{new Date(service.date).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{service.provider}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">${service.amount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.status === 'Completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}>
                    {service.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200">
          Mark all as read
        </button>
      </div>
      
      <div className="space-y-4">
        {userInfo.notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md 
              ${notification.isRead ? '' : 'border-l-4 border-blue-600'}`}
          >
            <div className="flex justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  notification.type === 'Service Reminder' 
                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' 
                    : notification.type === 'Promotion' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' 
                      : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
                }`}>
                  {notification.type === 'Service Reminder' ? (
                    <BellRing size={18} />
                  ) : notification.type === 'Promotion' ? (
                    <CreditCard size={18} />
                  ) : (
                    <Settings size={18} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{notification.type}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(notification.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {!notification.isRead && (
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-medium">Password</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last changed 3 months ago
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Change Password
          </button>
        </div>
      </div>
      
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
            Enable
          </button>
        </div>
      </div>
      
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-medium">Login Sessions</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your active sessions
            </p>
          </div>
          <button className="px-4 py-2 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
            Sign Out All Devices
          </button>
        </div>
        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} mb-2`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Current Device</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chrome on Windows • IP: 192.168.1.1
              </p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full">
              Active Now
            </span>
          </div>
        </div>
      </div>
      
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-red-50'}`}>
        <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'payment':
        return <PaymentTab />;
      case 'history':
        return <HistoryTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className={`rounded-xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <ul>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeTab === 'profile' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeTab === 'payment' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab('payment')}
                >
                  <CreditCard size={20} />
                  <span>Payment Methods</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeTab === 'history' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab('history')}
                >
                  <History size={20} />
                  <span>Service History</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeTab === 'notifications' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <BellRing size={20} />
                  <span>Notifications</span>
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    1
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                    activeTab === 'security' 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } transition-colors duration-200`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={20} />
                  <span>Security</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-grow">
          <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;