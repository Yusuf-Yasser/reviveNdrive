import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Settings, LogOut, Shield, Car, CreditCard, Trash2, Edit, Key, AlertTriangle } from 'lucide-react';

// Moved SecurityTab outside Profile to prevent input focus loss
const SecurityTab = ({
  isDarkMode,
  passwordData,
  handlePasswordChangeInput,
  handleChangePasswordSubmit,
  passwordChangeMessage,
  localLoading,
  handleDeleteAccountClick,
  showDeleteConfirmModal,
  handleConfirmDeleteAccount,
  handleCancelDelete,
  deleteConfirmPassword,
  setDeleteConfirmPassword,
  deleteAccountMessage,
  activeTab,
  KeyIcon, // Renamed to avoid conflict if Key is used as a prop name
  AlertTriangleIcon // Renamed
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      
      {/* Change Password Section */}
      <div className={`p-6 rounded-xl shadow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <KeyIcon size={24} className="mr-2" /> Change Password
        </h4>
        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
            <input 
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChangeInput}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'}`}
              required 
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
            <input 
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChangeInput}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'}`}
              required 
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
            <input 
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChangeInput}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400'}`}
              required 
            />
          </div>
          {passwordData.newPassword && passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword && (
            <p className="text-sm text-red-500 dark:text-red-400">New passwords do not match.</p>
          )}
          {passwordChangeMessage.text && (
            <p className={`text-sm ${passwordChangeMessage.type === 'error' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
              {passwordChangeMessage.text}
            </p>
          )}
          <button 
            type="submit" 
            disabled={localLoading || (passwordData.newPassword !== passwordData.confirmNewPassword)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {localLoading ? 'Saving...' : 'Save Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone Section */}
      <div className={`p-6 rounded-xl shadow ${isDarkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
        <h4 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2 flex items-center">
          <AlertTriangleIcon size={24} className="mr-2" /> Danger Zone
        </h4>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button 
          onClick={handleDeleteAccountClick}
          disabled={localLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className={`fixed inset-0 transition-opacity ${isDarkMode ? 'bg-gray-900 bg-opacity-75' : 'bg-gray-500 bg-opacity-75'}`} aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${isDarkMode ? 'bg-red-700' : 'bg-red-100'}`}>
                    <AlertTriangleIcon className={`h-6 w-6 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className={`text-lg leading-6 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`} id="modal-title">
                      Delete Account Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-3`}>
                        Are you absolutely sure you want to delete your account? This action cannot be undone. All your data will be permanently lost.
                      </p>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                        Please enter your password to confirm:
                      </p>
                      <input 
                        type="password"
                        name="deleteConfirmPassword"
                        value={deleteConfirmPassword}
                        onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                        className={`focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border rounded-md p-2 shadow-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 bg-white placeholder-gray-500'}`}
                        placeholder="Enter your password"
                        required
                      />
                       {deleteAccountMessage.text && (
                        <p className={`mt-2 text-sm ${deleteAccountMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                          {deleteAccountMessage.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50'}`}>
                <button
                  type="button"
                  disabled={localLoading}
                  onClick={handleConfirmDeleteAccount}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {localLoading && activeTab === 'security' && showDeleteConfirmModal ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={localLoading}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 focus:ring-gray-500' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  // Memories for dropdowns
  const egyptianGovernorates = ["Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr El Sheikh", "Luxor", "Matrouh", "Minya", "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez"];
  const mechanicSpecialties = ["Engine Repair", "Transmission Services", "Brake Systems", "Suspension and Steering", "Electrical Systems", "Air Conditioning (AC) Repair", "Tire Services", "Exhaust Systems", "Diagnostics", "General Maintenance"];

  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser, logout, getProfileData, updateProfileData, changePassword, deleteAccount, isLoading: authIsLoading } = useAuth();
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState({ type: '', text: '' });
  const [deleteAccountMessage, setDeleteAccountMessage] = useState({ type: '', text: '' });
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  const [isProfileDataFetched, setIsProfileDataFetched] = useState(false);

  // Redirect to login page if not authenticated
  useEffect(() => {
    setIsProfileDataFetched(false);
  }, [currentUser]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const loadProfileData = async () => {
      if (currentUser && !isProfileDataFetched) {
        setLocalLoading(true);
        try {
          const data = await getProfileData(signal); 
          if (data && !signal.aborted) {
            setFormData({
              fullName: data.fullName || '',
              phone: data.phone || '',
              avatar: data.avatar || '',
              specialty: data.userType === 'mechanic' ? data.specialty || '' : '',
              location: data.userType === 'mechanic' ? data.location || '' : ''
            });
            setProfileDetails(data);
            setIsProfileDataFetched(true); // Mark as fetched for this user session
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Profile fetch aborted due to component unmount or dependency change.');
          } else if (!signal.aborted) {
            console.error("Failed to fetch profile", error);
            // setProfileMessage({ type: 'error', text: 'Failed to load profile. ' + error.message });
          }
        } finally {
          if (!signal.aborted) {
            setLocalLoading(false);
          }
        }
      } else if (!currentUser) {
        navigate('/login');
      }
    };

    loadProfileData();

    return () => {
      abortController.abort(); // Abort fetch if component unmounts or dependencies change
    };
  }, [currentUser, navigate, getProfileData, isProfileDataFetched, setLocalLoading, setFormData, setProfileDetails]);

  // Clear security-related messages when the security tab is activated
  useEffect(() => {
    if (activeTab === 'security') {
      setPasswordChangeMessage({ type: '', text: '' });
      setDeleteAccountMessage({ type: '', text: '' }); // Clear previous messages
      setDeleteAccountMessage({ type: '', text: '' });
      // Optionally, reset localLoading if it's specific to security tab operations
      // and not general profile loading, but current setup seems fine.
    }
  }, [activeTab]);

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

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordChangeMessage({ type: '', text: '' }); // Clear message on input change
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordChangeMessage({ type: '', text: '' });
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordChangeMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordChangeMessage({ type: 'error', text: 'All password fields are required.' });
      return;
    }
    // TODO: Add password strength validation if desired

    setLocalLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordChangeMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // Clear fields
    } catch (error) {
      console.error("Failed to change password", error);
      setPasswordChangeMessage({ type: 'error', text: error.message || 'Failed to change password. Please try again.' });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setDeleteConfirmPassword(''); // Clear password field when modal opens
    setShowDeleteConfirmModal(true);
    setDeleteAccountMessage({ type: '', text: '' }); // Clear previous messages
  };

  const handleConfirmDeleteAccount = async () => {
    setShowDeleteConfirmModal(false);
    setLocalLoading(true);
    if (!deleteConfirmPassword) {
      setDeleteAccountMessage({ type: 'error', text: 'Password is required to delete your account.' });
      setLocalLoading(false);
      return;
    }
    try {
      await deleteAccount(deleteConfirmPassword);
      // AuthContext's deleteAccount already calls logout.
      // Frontend will re-render due to currentUser becoming null (handled by useEffect for navigation)
      // or we can explicitly navigate here.
      setDeleteAccountMessage({ type: 'success', text: 'Account deleted successfully. You will be redirected.' });
      // The useEffect listening to currentUser should redirect to /login
      // If not, uncomment below:
      // navigate('/login'); 
    } catch (error) {
      console.error("Failed to delete account", error);
      setDeleteAccountMessage({ type: 'error', text: error.message || 'Failed to delete account. Please try again.' });
    }
    setLocalLoading(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
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



  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'security':
        return <SecurityTab 
          isDarkMode={isDarkMode}
          passwordData={passwordData}
          handlePasswordChangeInput={handlePasswordChangeInput}
          handleChangePasswordSubmit={handleChangePasswordSubmit}
          passwordChangeMessage={passwordChangeMessage}
          localLoading={localLoading}
          handleDeleteAccountClick={handleDeleteAccountClick}
          showDeleteConfirmModal={showDeleteConfirmModal}
          handleConfirmDeleteAccount={handleConfirmDeleteAccount}
          handleCancelDelete={handleCancelDelete}
          deleteConfirmPassword={deleteConfirmPassword}
          setDeleteConfirmPassword={setDeleteConfirmPassword}
          deleteAccountMessage={deleteAccountMessage}
          activeTab={activeTab}
          KeyIcon={Key} // Pass the imported icon component
          AlertTriangleIcon={AlertTriangle} // Pass the imported icon component
        />;
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