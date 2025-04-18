import React, { createContext, useState, useEffect } from 'react';

// Create a context
const ThemeContext = createContext();

// ThemeProvider component to wrap around App or other components that need the theme
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Set the theme attribute on the root element
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS variables based on theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#1a1b1e');
      root.style.setProperty('--bg-secondary', '#25262b');
      root.style.setProperty('--bg-tertiary', '#2c2e33');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#c1c2c5');
      root.style.setProperty('--text-tertiary', '#909296');
      root.style.setProperty('--accent-primary', '#4dabf7');
      root.style.setProperty('--accent-secondary', '#339af0');
      root.style.setProperty('--border-color', '#373a40');
      root.style.setProperty('--card-bg', '#25262b');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--hover-bg', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8f9fa');
      root.style.setProperty('--bg-tertiary', '#f1f3f5');
      root.style.setProperty('--text-primary', '#212529');
      root.style.setProperty('--text-secondary', '#495057');
      root.style.setProperty('--text-tertiary', '#868e96');
      root.style.setProperty('--accent-primary', '#228be6');
      root.style.setProperty('--accent-secondary', '#1c7ed6');
      root.style.setProperty('--border-color', '#e9ecef');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.05)');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
