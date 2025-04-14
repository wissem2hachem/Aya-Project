import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Navbar from "./Components/Navbar";
import Departments from "./pages/Departments";

import UserManager from "./Components/UserManager";
import "./Components/Login";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import LandingPage from "./Components/LandingPage";



const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if token exists
  return isAuthenticated ? element : <Navigate to="/" />; // Redirect to Login if not authenticated
};


function App() {
  return (
    
        <Routes>
          {/* Public Route - Login */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path = "/navbar" element={<Navbar />} />
        <Route path="/departments" element={<Departments />} />
   
        <Route path = "/user-manager" element={<UserManager />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        

        
        </Routes>
      
  );
}

export default App;
