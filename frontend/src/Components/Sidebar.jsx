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
        
        const response = await axios.get("http://localhost:5000/api/leave-requests/pending/count", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && typeof response.data.count === 'number') {
          setPendingLeaveRequests(response.data.count);
        } else {
          setPendingLeaveRequests(0);
        }
      } catch (error) {
        console.error("Error fetching pending leave requests:", error);
        setPendingLeaveRequests(0);
      }
    };
    
    fetchPendingLeaveRequests();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchPendingLeaveRequests, 30 * 1000);
    
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
      requiredRoles: ['admin'],
    },
    {
      title: "Attendance",
      icon: FaUserCheck,
      path: "/attendance",
      ariaLabel: "Navigate to Attendance",
      requiredRoles: ['admin'],
    },
    {
      title: "Leave Requests",
      icon: MdEventNote,
      path: "/leave-requests",
      ariaLabel: "Navigate to Leave Requests",
      badge: pendingLeaveRequests > 0 ? pendingLeaveRequests : null,
      requiredRoles: null, // all authenticated users can access
    },
    {
      title: "Payroll",
      icon: MdOutlineAttachMoney,
      path: "/payroll",
      ariaLabel: "Navigate to Payroll",
      requiredRoles: ['admin'],
    },
    {
      title: "Recruitment",
      icon: FaUserTie,
      path: "/recruitment",
      ariaLabel: "Navigate to Recruitment",
      requiredRoles: ['admin'],
    },
    {
      title: "Manage Jobs",
      icon: MdWork,
      path: "/manage-jobs",
      ariaLabel: "Navigate to Manage Jobs",
      requiredRoles: ['admin'],
    },
    {
      title: "User Manager",
      icon: AiFillSetting,
      path: "/usermanager",
      ariaLabel: "Navigate to User Manager",
      requiredRoles: ['admin'],
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
          {userRole === 'admin' ? (
            <>Admin<span>Panel</span></>
          ) : (
            <>Employee<span>Portal</span></>
          )}
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