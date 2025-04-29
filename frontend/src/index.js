import React from 'react';
import ReactDOM from 'react-dom/client'; // Make sure to import from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'; // Import your ThemeProvider
import { AuthProvider } from './context/AuthContext';
import { PayrollProvider } from './context/PayrollContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { ToastProvider } from './context/ToastContext';
import App from './App'; // Your main app component

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <PayrollProvider>
          <EmployeeProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </EmployeeProvider>
        </PayrollProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
