import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdEventNote,
  MdOutlineAttachMoney,
  MdWork,
} from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { FaUserTie, FaUserCheck } from "react-icons/fa";
import "../styles/sidebar.scss";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState(0);
  const { userRole, hasPermission } = useAuth();
  
  // Fetch pending leave requests count
  useEffect(() => {
    const fetchPendingLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        // Mock data for now - would be replaced with actual API call
        // const response = await axios.get("http://localhost:5000/api/leave-requests/pending/count", {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        // setPendingLeaveRequests(response.data.count);
        
        // Simulating API response with mock data
        setTimeout(() => {
          setPendingLeaveRequests(3);
        }, 500);
      } catch (error) {
        console.error("Error fetching pending leave requests:", error);
      }
    };
    
    fetchPendingLeaveRequests();
    
    // Set up polling for real-time updates (every 5 minutes)
    const intervalId = setInterval(fetchPendingLeaveRequests, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Define all links with their role requirements
  const allLinks = [
    {
      title: "Dashboard",
      icon: MdDashboard,
      path: "/dashboard",
      ariaLabel: "Navigate to Dashboard",
      requiredRoles: null, // all authenticated users
    },
    {
      title: "Employees",
      icon: MdPeople,
      path: "/employees",
      ariaLabel: "Navigate to Employees",
      requiredRoles: ['admin', 'hr', 'manager'],
    },
    {
      title: "Attendance",
      icon: FaUserCheck,
      path: "/attendance",
      ariaLabel: "Navigate to Attendance",
      requiredRoles: ['admin', 'hr', 'manager'],
    },
    {
      title: "Leave Requests",
      icon: MdEventNote,
      path: "/leave-requests",
      ariaLabel: "Navigate to Leave Requests",
      badge: pendingLeaveRequests > 0 && hasPermission(['admin', 'hr']) ? pendingLeaveRequests : null,
      requiredRoles: null, // all authenticated users can access
    },
    {
      title: "Payroll",
      icon: MdOutlineAttachMoney,
      path: "/payroll",
      ariaLabel: "Navigate to Payroll",
      requiredRoles: ['admin', 'hr'],
    },
    {
      title: "Recruitment",
      icon: FaUserTie,
      path: "/recruitment",
      ariaLabel: "Navigate to Recruitment",
      requiredRoles: ['admin', 'hr', 'manager'],
    },
    {
      title: "Manage Jobs",
      icon: MdWork,
      path: "/manage-jobs",
      ariaLabel: "Navigate to Manage Jobs",
      requiredRoles: ['admin', 'hr', 'manager'],
    },
    {
      title: "User Manager",
      icon: AiFillSetting,
      path: "/usermanager",
      ariaLabel: "Navigate to User Manager",
      requiredRoles: ['admin', 'manager'],
    },
  ];
  
  // Filter links based on user role permissions
  const visibleLinks = allLinks.filter(link => 
    !link.requiredRoles || hasPermission(link.requiredRoles)
  );

  return (
    <nav className={`sidebar ${isOpen ? 'is-active' : ''}`} aria-label="Main navigation">
      <div className="brand">
        <h2>
          HR<span>Manager</span>
        </h2>
      </div>
      <ul className="links">
        {visibleLinks.map((link) => (
          <li key={link.title}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `link-button${isActive ? " active" : ""}`
              }
              aria-label={link.ariaLabel}
              aria-current={pathname === link.path ? "page" : undefined}
              onClick={onClose}
            >
              <link.icon className="nav-icon" aria-hidden="true" />
              <span className="nav-text">{link.title}</span>
              {link.badge && (
                <span className="notification-badge" aria-label={`${link.badge} pending requests`}>
                  {link.badge}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}