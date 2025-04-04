import React, { useState } from "react";
import {
  MdDashboard,
  MdPeople,
  MdEventNote,
  MdOutlineAttachMoney,
} from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { FaUserTie, FaUserCheck } from "react-icons/fa";

export default function Sidebar() {
  const [activeLink, setActiveLink] = useState("Dashboard");

  const links = [
    { title: "Dashboard", icon: MdDashboard },
    { title: "Employees", icon: MdPeople },
    { title: "Attendance", icon: FaUserCheck },
    { title: "Leave Requests", icon: MdEventNote },
    { title: "Payroll", icon: MdOutlineAttachMoney },
    { title: "Recruitment", icon: FaUserTie },
    { title: "Settings", icon: AiFillSetting },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar__brand">
        <h2>
          HR<span>Manager</span>
        </h2>
      </div>
      <ul className="sidebar__links">
        {links.map((link) => (
          <li key={link.title}>
            <button
              className={`sidebar__link-button ${
                activeLink === link.title ? "active" : ""
              }`}
              onClick={() => setActiveLink(link.title)}
              aria-label={`Go to ${link.title}`}
            >
              <link.icon className="sidebar__icon" />
              <span>{link.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
