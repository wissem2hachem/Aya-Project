import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/employees';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // This is important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const employeeService = {
  getAllEmployees: async () => {
    try {
      console.log('Fetching employees from:', API_URL);
      const response = await api.get('/employees');
      console.log('Response received:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error in employeeService.getAllEmployees:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch employees');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up the request');
      }
    }
  },

  getEmployeeById: async (id) => {
    try {
      console.log('Fetching employee with ID:', id);
      const response = await api.get(`/employees/${id}`);
      console.log('Response received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in employeeService.getEmployeeById:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.message || 'Failed to fetch employee');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please check if the server is running.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Error setting up the request');
      }
    }
  }
};

export default employeeService; 