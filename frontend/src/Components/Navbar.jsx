import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEnvelope, FaEnvelope, FaUserCircle, FaCog } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import "../styles/navbar.scss";

export default function Navbar({ onMenuClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const avatar = "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff";

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // if your backend needs cookies/session
      });

      localStorage.removeItem("token");
      navigate("/login"); // optional: redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <button
          className="menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <span className="hamburger"></span>
        </button>
        <Link to="/dashboard" className="logo">
          <span className="logo-text">HRMS</span>
        </Link>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Search..." aria-label="Search" />
        <button className="search-button" aria-label="Search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <button
            className="icon-button message-button"
            aria-label={`Messages ${hasUnreadMessages ? '(has unread)' : ''}`}
            onClick={() => setHasUnreadMessages(!hasUnreadMessages)}
          >
            {hasUnreadMessages ? (
              <FaEnvelope aria-hidden="true" />
            ) : (
              <FaRegEnvelope aria-hidden="true" />
            )}
            {hasUnreadMessages && <span className="badge" aria-hidden="true"></span>}
          </button>
        </div>

        <div className="navbar-item user-profile-dropdown">
          <div
            className="user-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            role="button"
            tabIndex="0"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <img
              src={avatar}
              alt="User Avatar"
              className="avatar-image"
              width={40}
              height={40}
              loading="lazy"
            />
            <div className="user-info">
              <h4 className="user-name">Admin</h4>
              <span className="user-status">Online</span>
            </div>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu is-active">
              <Link to="/profile" className="dropdown-item">
                <FaUserCircle />
                <span>Profile</span>
              </Link>
              <Link to="/settings" className="dropdown-item">
                <FaCog />
                <span>Settings</span>
              </Link>
              <button
                className="dropdown-item logout-button"
                onClick={handleLogout}
              >
                <MdLogout />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "is-active" : ""}`}>
        <Link to="/dashboard" className="mobile-menu-item">Dashboard</Link>
        <Link to="/employees" className="mobile-menu-item">Employees</Link>
        <Link to="/projects" className="mobile-menu-item">Projects</Link>
        <Link to="/tasks" className="mobile-menu-item">Tasks</Link>
        <Link to="/settings" className="mobile-menu-item">Settings</Link>
      </div>
    </header>
  );
}
