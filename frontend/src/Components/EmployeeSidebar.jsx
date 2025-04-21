import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdEventNote,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { FiCalendar, FiUser, FiFileText, FiClock, FiSettings } from "react-icons/fi";
import "../styles/sidebar.scss";

export default function EmployeeSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  
  const links = [
    {
      title: "My Dashboard",
      icon: MdDashboard,
      path: "/employee/dashboard",
      ariaLabel: "Navigate to My Dashboard",
    },
    {
      title: "Profile",
      icon: FiUser,
      path: "/employee/profile",
      ariaLabel: "Navigate to Profile",
    },
    {
      title: "Attendance",
      icon: FiClock,
      path: "/employee/attendance",
      ariaLabel: "Navigate to Attendance",
    },
    {
      title: "Leave Requests",
      icon: FiCalendar,
      path: "/employee/leave-requests",
      ariaLabel: "Navigate to Leave Requests",
    },
    {
      title: "Payslips",
      icon: MdOutlineAttachMoney,
      path: "/employee/payslips",
      ariaLabel: "Navigate to Payslips",
    },
    {
      title: "Documents",
      icon: FiFileText,
      path: "/employee/documents",
      ariaLabel: "Navigate to Documents",
    },
    {
      title: "Calendar",
      icon: MdEventNote,
      path: "/employee/calendar",
      ariaLabel: "Navigate to Calendar",
    },
    {
      title: "Settings",
      icon: FiSettings,
      path: "/employee/settings",
      ariaLabel: "Navigate to Settings",
    }
  ];

  return (
    <nav className={`sidebar ${isOpen ? 'is-active' : ''}`} aria-label="Employee navigation">
      <div className="brand">
        <h2>
          HR<span>Portal</span>
        </h2>
      </div>
      <ul className="links">
        {links.map((link) => (
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
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
} 