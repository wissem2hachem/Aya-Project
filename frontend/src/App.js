import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import UserProfile from "./pages/UserProfile";
import Unauthorized from "./pages/Unauthorized";
import RouteGuard from "./Components/RouteGuard";
import { AuthProvider } from "./context/AuthContext";
import ThemeContext from "./context/ThemeContext";
import "./styles/auth-loading.scss";
import CreateJob from './Components/features/CreateJob';
import ManageJobs from './Components/admin/ManageJobs';
import Recruitment from './Components/Recruitment';
import ThankYouPage from './Components/features/ThankYouPage';

function App() {
  const { theme } = useContext(ThemeContext);
  
  // Apply theme class to body element
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/features/job-offers" element={<JobOffers />} />
          <Route path="/features/job-application" element={<JobApplicationForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes - all authenticated users */}
          <Route element={<Layout />}>
            {/* Common routes - accessible by all authenticated users */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leave-requests" element={<LeaveRequests />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/create-job" element={<CreateJob />} />
            
            {/* HR, Manager, and Admin routes */}
            <Route element={<RouteGuard requiredRoles={['admin', 'hr', 'manager']} />}>
              <Route path="/employees" element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
            </Route>
            
            {/* HR and Admin only routes */}
            <Route element={<RouteGuard requiredRoles={['admin', 'hr']} />}>
              <Route path="/departments" element={<Departments />} />
              <Route path="/payroll" element={<Payroll />} />
            </Route>
            
            {/* HR, Admin, and Manager routes */}
            <Route element={<RouteGuard requiredRoles={['admin', 'hr', 'manager']} />}>
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
            </Route>
            
            {/* Admin and Manager only routes */}
            <Route element={<RouteGuard requiredRoles={['admin', 'manager', 'hr']} />}>
              <Route path="/usermanager" element={<UserManager />} />
            </Route>
          </Route>
          
          {/* Global catch-all - redirect to login page */}
          <Route path="*" element={<Navigate to="/login" replace />} />

          {/* Additional route for ThankYouPage */}
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;