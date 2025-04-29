import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is authenticated
const isAuthenticated = () => {
  return !!getToken();
};

// Login user
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
const logout = () => {
  removeToken();
};

export { getToken, setToken, removeToken, isAuthenticated, login, logout }; 