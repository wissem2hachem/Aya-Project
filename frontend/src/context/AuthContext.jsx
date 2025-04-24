import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token and get user info
        try {
          const decoded = jwtDecode(token);
          
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired
            localStorage.removeItem('token');
            setLoading(false);
            return;
          }

          // Get user data from token or API
          const userId = decoded._id;
          const userRole = decoded.role || 'employee'; // Default to employee if role not in token
          
          // Optional: Fetch more user details from API
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setCurrentUser(response.data);
          setUserRole(response.data.role || userRole);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const userId = decoded._id;
      
      // Get full user data
      const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCurrentUser(userResponse.data);
      setUserRole(userResponse.data.role || 'employee');
      setIsAuthenticated(true);
      
      return userResponse.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  // Check if user has permission to access a specific page/feature
  const hasPermission = (requiredRoles) => {
    if (!isAuthenticated || !userRole) return false;
    
    // If requiredRoles is not provided, require at least being authenticated
    if (!requiredRoles) return true;
    
    // Convert single role to array for consistent handling
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    
    // Special case: admin role has access to everything
    if (userRole === 'admin') return true;
    
    // Check if user's role is in the required roles list
    return roles.includes(userRole);
  };

  const value = {
    currentUser,
    userRole,
    isAuthenticated,
    loading,
    login,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 