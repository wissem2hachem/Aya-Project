import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Layout from "./Components/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import Attendance from "./pages/Attendance";
import LeaveRequests from "./pages/LeaveRequests";
import Payroll from "./pages/Payroll";
import UserManager from "./Components/UserManager";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ForgotPassword from "./Components/forgetpass";
import ResetPassword from "./Components/resetPassword";
import LandingPage from "./Components/LandingPage";
import JobOffers from "./Components/features/JobOffers";
import JobApplicationForm from "./Components/features/jobApplicationForm";
import AccessDenied from "./Components/AccessDenied";
import ThemeContext from "./context/ThemeContext";

// Protected route wrapper - checks for authentication
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Role-based route wrapper - checks if user has required role
const RoleBasedRoute = ({ allowedRoles }) => {
  const userRole = localStorage.getItem("userRole") || "employee";
  const location = useLocation();
  
  // Remove role checking - allow access to all users
  return <Outlet />;
};

function App() {
  const { theme } = useContext(ThemeContext);
  
  // Set default role for development - remove in production
  useEffect(() => {
    if (!localStorage.getItem("userRole")) {
      localStorage.setItem("userRole", "employee");
    }
  }, []);

  // Apply theme class to body element
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/features/job-offers" element={<JobOffers />} />
        <Route path="/jobApplication" element={<JobApplicationForm />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Protected Routes - require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Common routes - accessible by all roles */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* HR and Manager only routes */}
            <Route element={<RoleBasedRoute allowedRoles={["hr", "manager"]} />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
            </Route>
            
            {/* HR only routes */}
            <Route element={<RoleBasedRoute allowedRoles={["hr"]} />}>
              <Route path="/departments" element={<Departments />} />
              <Route path="/leave-requests" element={<LeaveRequests />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/recruitment" element={<JobOffers />} />
              <Route path="/usermanager" element={<UserManager />} />
            </Route>
            
            {/* Redirect any other authenticated route to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        
        {/* Global catch-all - redirect to login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;