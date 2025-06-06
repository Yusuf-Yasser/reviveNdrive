import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Settings, LogOut, Shield, Car, CreditCard, History, BellRing, Trash2, Edit } from 'lucide-react';

const Profile = () => {
  // Memories for dropdowns
  const egyptianGovernorates = ["Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr El Sheikh", "Luxor", "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"];
  const mechanicSpecialties = ["Engine Repair", "Transmission Services", "Brake Systems", "Suspension and Steering", "Electrical Systems", "Air Conditioning (AC) Repair", "Tire Services", "Exhaust Systems", "Diagnostics", "General Maintenance"];

  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser, logout, getProfileData, updateProfileData, isLoading: authIsLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileDetails, setProfileDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    avatar: '', // Assuming URL
    specialty: '',
    location: ''
  });

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      const fetchProfile = async () => {
        setLocalLoading(true);
        try {
          const data = await getProfileData();
          setProfileDetails(data);
          setFormData({
            fullName: data.fullName || '',
            phone: data.phone || '',
            avatar: data.avatar || '',
            specialty: data.userType === 'mechanic' ? data.specialty || '' : '',
            location: data.userType === 'mechanic' ? data.location || '' : ''
          });
        } catch (error) {
          console.error("Failed to load profile details", error);
          // Consider adding toast.error("Could not load profile details.");
        }
        setLocalLoading(false);
      };
      fetchProfile();
    }
  }, [currentUser, navigate, getProfileData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If initial authentication is happening (AuthContext is loading and no user yet)
  if (authIsLoading && !currentUser) {
    return <div className="flex justify-center items-center h-screen">Loading session...</div>;
  }

  // If not authenticated after AuthContext has loaded (currentUser is still null)
  // The useEffect should handle navigation, but this is a fallback.
  if (!currentUser) {
    // console.log('Profile: No current user, should be redirecting via useEffect.');
    // It's better to rely on the useEffect for navigation to avoid rendering flashes.
    // Showing a minimal loader or null here as useEffect will navigate away.
    return <div className="flex justify-center items-center h-screen">Authenticating...</div>; 
  }

  // At this point, currentUser is available.
  // Now, if profileDetails are not yet loaded (either fetching or fetch failed).
  if (!profileDetails) {
    // This covers the period where getProfileData is running (localLoading would be true)
    // or if getProfileData failed and profileDetails remained null.
    return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
  }

  // If we reach here, currentUser and profileDetails are loaded and available.



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      const dataToUpdate = {
        fullName: formData.fullName,
        phone: formData.phone,
        avatar: formData.avatar,
      };
      if (profileDetails?.userType === 'mechanic') {
        dataToUpdate.specialty = formData.specialty;
        dataToUpdate.location = formData.location;
      }
      
      await updateProfileData(dataToUpdate);
      // toast.success("Profile updated successfully!"); // If using toasts
      const updatedProfile = await getProfileData(); 
      setProfileDetails(updatedProfile);
      // Update formData as well after successful save
      setFormData({
        fullName: updatedProfile.fullName || '',
        phone: updatedProfile.phone || '',
        avatar: updatedProfile.avatar || '',
        specialty: updatedProfile.userType === 'mechanic' ? updatedProfile.specialty || '' : '',
        location: updatedProfile.userType === 'mechanic' ? updatedProfile.location || '' : ''
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
      // toast.error(error.message || "Could not update profile.");
    }
    setLocalLoading(false);
  };

  const ProfileTab = () => {
    if (!profileDetails) return <div className="p-4">Loading profile information...</div>;

    return (
      <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {(isEditing ? formData.avatar : profileDetails.avatar) ? (
            <img
              src={isEditing ? formData.avatar : profileDetails.avatar}
              alt={isEditing ? formData.fullName : profileDetails.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
              <User size={48} />
            </div>
          )}
        </div>
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold">{isEditing ? formData.fullName : profileDetails.fullName}</h2>
          <p className="text-blue-600">{profileDetails.userType === 'mechanic' ? 'Mechanic' : 'User'}</p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
            Joined: {new Date(profileDetails.created_at).toLocaleDateString()}
          </p>
                    {!isEditing ? (
            <button 
              type="button"
              onClick={() => setIsEditing(true)} 
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2 mt-2">
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                disabled={localLoading}
              >
                {localLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data to original profile details
                  setFormData({
                    fullName: profileDetails.fullName || '',
                    phone: profileDetails.phone || '',
                    avatar: profileDetails.avatar || '',
                    specialty: profileDetails.userType === 'mechanic' ? profileDetails.specialty || '' : '',
                    location: profileDetails.userType === 'mechanic' ? profileDetails.location || '' : ''
                  });
                }} 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                disabled={localLoading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email (cannot be changed)</p>
              <p>{profileDetails.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              {isEditing ? (
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              ) : (
                <p>{profileDetails.phone || 'Not set'}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <User size={18} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avatar URL</p>
              {isEditing ? (
                <input 
                  type="text" 
                  name="avatar" 
                  value={formData.avatar} 
                  onChange={handleInputChange} 
                  placeholder="https://example.com/avatar.jpg"
                  className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              ) : (
                <p>{profileDetails.avatar ? <a href={profileDetails.avatar} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Avatar</a> : 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {profileDetails.userType === 'mechanic' && (
          <>
            <h3 className="text-lg font-semibold mb-4">Mechanic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Specialty</p>
                  {isEditing ? (
                    <select 
                      name="specialty" 
                      value={formData.specialty} 
                      onChange={handleInputChange} 
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">Select Specialty</option>
                      {mechanicSpecialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                    </select>
                  ) : (
                    <p>{profileDetails.specialty || 'Not set'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Car size={18} className="text-blue-600" /> {/* Using Car icon for location */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location (Governorate)</p>
                  {isEditing ? (
                    <select 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      className={`w-full p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">Select Location</option>
                      {egyptianGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                    </select>
                  ) : (
                    <p>{profileDetails.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* My Cars Section - This section might need to be removed or adapted if not relevant for all users */}
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">My Cars</h3>
          <button className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-1">
            <Edit size={16} />
            <span>Add Car</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {profileDetails && Array.isArray(profileDetails.cars) && profileDetails.cars.length > 0 ? (
            profileDetails.cars.map(car => (
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
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 p-4 text-center">No cars added yet.</p>
          )}
        </div>
      </div>
  </form>
);
  };

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
            {(profileDetails?.serviceHistory || []).map((service) => (
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
        {(profileDetails?.notifications || []).map((notification) => (
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