import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// IMPORTANT: Adjust this URL to where your CarService-master/api folder is accessible via XAMPP
// For example, if CarService-master is directly in htdocs, it would be:
const API_BASE_URL = 'http://localhost/CarService-master/api'; 
// If you have a virtual host or a different setup, change this accordingly.

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check auth

  useEffect(() => {
    // Check authentication status when the provider mounts
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/check_auth.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important to send cookies
        });
        const data = await response.json();
        if (response.ok && data.status === 'success' && data.loggedIn) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setCurrentUser(null);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important to send/receive cookies
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        setCurrentUser(data.user);
        return data.user;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        // setCurrentUser(data.user); // Prevent auto-login after signup
        return data.user; // User created, redirect to login
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/logout.php`, {
        method: 'POST', // Or 'GET' if you changed logout.php to accept GET
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        setCurrentUser(null);
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Logout error:', error);
      // Still set currentUser to null on frontend even if backend logout fails for some reason
      setCurrentUser(null);
      throw error;
    }
  };

  // Get Profile Data function
  const getProfileData = async (signal) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get_profile.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal, // Pass the AbortSignal to fetch
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        return data.user; // Return the detailed user profile
      } else {
        throw new Error(data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Get profile data error:', error);
      throw error;
    }
  };

  // Update Profile Data function
  const updateProfileData = async (profileDataToUpdate) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/update_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileDataToUpdate),
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        // Optionally, update currentUser if the changed data is part of it
        // This might be better handled by re-fetching or having the backend return the full updated user
        setCurrentUser(prevUser => ({ ...prevUser, ...profileDataToUpdate }));
        return data; 
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Change Password function
  const changePassword = async (currentPassword, newPassword) => {
    if (!currentUser) throw new Error('User not authenticated');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/change_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: currentUser.id, currentPassword, newPassword }),
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        return data; // Or data.message
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Change password error:', error);
      throw error;
    }
  };

  // Delete Account function
  const deleteAccount = async (password) => {
    if (!currentUser) throw new Error('User not authenticated');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete_account.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: currentUser.id, password }), // Sending password for server-side confirmation
      });
      const data = await response.json();
      setIsLoading(false);
      if (response.ok && data.status === 'success') {
        await logout(); // Logout the user on successful account deletion
        return data; // Or data.message
      } else {
        throw new Error(data.message || 'Failed to delete account');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    getProfileData,
    updateProfileData,
    changePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
