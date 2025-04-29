import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const PayrollContext = createContext();

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
};

export const PayrollProvider = ({ children }) => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPayrolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/payrolls');
      setPayrolls(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payrolls');
    } finally {
      setLoading(false);
    }
  }, []);

  const generatePayroll = async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/payrolls/generate', { month, year });
      setPayrolls(prevPayrolls => [...prevPayrolls, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate payroll');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    payrolls,
    loading,
    error,
    fetchPayrolls,
    generatePayroll,
  };

  return (
    <PayrollContext.Provider value={value}>
      {children}
    </PayrollContext.Provider>
  );
}; 