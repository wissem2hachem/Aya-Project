import React from 'react';
import ReactDOM from 'react-dom/client'; // Make sure to import from 'react-dom/client'
import { ThemeProvider } from './context/ThemeContext'; // Import your ThemeProvider
import App from './App'; // Your main app component

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
