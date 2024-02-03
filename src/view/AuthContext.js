import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize authState with isLoggedIn as false and userId as null
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userId: null,
  });

  // Function to handle user login
  // const login = (userId) => {
  //   // Set isLoggedIn to true and userId to the provided userId
  //   setAuthState({ isLoggedIn: true, userId });
  // };

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
  
      if (response.status === 200 && response.data.userId) {
        setAuthState({ isLoggedIn: true, userId: response.data.userId });
      } else {
        // Handle login failure
      }
    } catch (error) {
      // Handle login error
    }
  };

  // Function to handle user logout
  const logout = () => {
    // Set isLoggedIn to false and userId to null
    setAuthState({ isLoggedIn: false, userId: null });
  };

  const authContextValue = {
    authState,
    login,
    logout,
  };

  // Provide the authContextValue to children components
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
