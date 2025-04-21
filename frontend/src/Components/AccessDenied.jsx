import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiAlertCircle } from "react-icons/fi";
import "../styles/AccessDenied.css";

const AccessDenied = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: "/dashboard" };
  const userRole = localStorage.getItem("userRole") || "employee";

  const roleInfo = {
    employee: {
      name: "Employee",
      allowedPages: ["Dashboard", "Profile", "Personal Leave Requests"]
    },
    manager: {
      name: "Manager",
      allowedPages: ["Dashboard", "Profile", "Team Management", "Employees", "Attendance", "Team Leave Approvals"]
    },
    hr: {
      name: "HR Administrator",
      allowedPages: ["All pages including User Management"]
    }
  };

  // Function to determine what page user was trying to access
  const getPageName = (path) => {
    const pathMap = {
      "/employees": "Employees",
      "/attendance": "Attendance",
      "/departments": "Departments",
      "/leave-requests": "Leave Requests",
      "/payroll": "Payroll",
      "/recruitment": "Recruitment",
      "/usermanager": "User Management"
    };
    
    return pathMap[path] || path;
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <FiLock size={56} />
        </div>
        
        <h1>Access Denied</h1>
        
        <p className="access-denied-message">
          <FiAlertCircle className="inline-icon" />
          You don't have permission to access the <strong>{getPageName(from)}</strong> page.
        </p>
        
        <div className="role-info-box">
          <h2>Your Current Role: {roleInfo[userRole]?.name || "Employee"}</h2>
          <p>With this role, you can access:</p>
          <ul>
            {roleInfo[userRole]?.allowedPages.map((page, index) => (
              <li key={index}>{page}</li>
            ))}
          </ul>
        </div>
        
        <p className="help-text">
          If you believe you should have access to this page, please contact your HR administrator 
          to have your role permissions updated.
        </p>
        
        <div className="action-buttons">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          
          <button 
            className="dashboard-button"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 