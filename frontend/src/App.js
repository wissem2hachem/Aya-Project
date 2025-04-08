import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Navbar from "./Components/Navbar";
import Departments from "./pages/Departments";


const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists
  return isAuthenticated ? element : <Navigate to="/" />; // Redirect to Login if not authenticated
};


function App() {
  return (
    
        <Routes>
          {/* Public Route - Login */}

        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path = "/navbar" element={<Navbar />} />
        <Route path="/departments" element={<Departments />} />

        
        </Routes>
      
  );
}

export default App;
