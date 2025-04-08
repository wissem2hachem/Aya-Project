import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdEventNote,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { FaUserTie, FaUserCheck } from "react-icons/fa";
import "./sidebar.scss";

export default function Sidebar() {
  const { pathname } = useLocation();
  
  const links = [
    {
      title: "Dashboard",
      icon: MdDashboard,
      path: "/dashboard",
      ariaLabel: "Navigate to Dashboard",
    },
    {
      title: "Employees",
      icon: MdPeople,
      path: "/employees",
      ariaLabel: "Navigate to Employees",
    },
    {
      title: "Attendance",
      icon: FaUserCheck,
      path: "/attendance",
      ariaLabel: "Navigate to Attendance",
    },
    {
      title: "Leave Requests",
      icon: MdEventNote,
      path: "/leave-requests",
      ariaLabel: "Navigate to Leave Requests",
    },
    {
      title: "Payroll",
      icon: MdOutlineAttachMoney,
      path: "/payroll",
      ariaLabel: "Navigate to Payroll",
    },
    {
      title: "Recruitment",
      icon: FaUserTie,
      path: "/recruitment",
      ariaLabel: "Navigate to Recruitment",
    },
    {
      title: "Settings",
      icon: AiFillSetting,
      path: "/settings",
      ariaLabel: "Navigate to Settings",
    },
  ];

  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <h2>
          HR<span>Manager</span>
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