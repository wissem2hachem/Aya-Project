import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  IoMdNotificationsOutline,
  IoMdNotifications,
  IoMdMenu,
  IoMdClose
} from "react-icons/io";
import { FaSearch, FaRegEnvelope, FaEnvelope } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import avatar from "../assets/avatarImage.jpeg";
import "./navbar.scss";

export default function Navbar() {
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="navbar" role="banner">
      {/* Logo and Menu Toggle */}
      <div className="navbar-brand">
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
        <Link to="/" className="logo">
          <span className="logo-text">CollabHub</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <label htmlFor="search-input" className="visually-hidden">
          Search 
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Search employees, projects, or tasks..."
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="button" 
          className="search-button"
          aria-label="Perform search"
        >
          <FaSearch aria-hidden="true" />
        </button>
      </div>

      {/* User Profile and Actions */}
      <div className="navbar-end">
        {/* Notifications */}
        <div className="navbar-item">
          <button 
            className="icon-button notification-button"
            aria-label={`Notifications ${hasNotifications ? '(has unread)' : ''}`}
            onClick={() => setHasNotifications(!hasNotifications)}
          >
            {hasNotifications ? (
              <IoMdNotifications aria-hidden="true" />
            ) : (
              <IoMdNotificationsOutline aria-hidden="true" />
            )}
            {hasNotifications && <span className="badge" aria-hidden="true"></span>}
          </button>
        </div>

        {/* Messages */}
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

        {/* User Profile Dropdown */}
        <div className="navbar-item user-profile-dropdown">
          <div 
            className="user-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
          <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <button 
              className="dropdown-item logout-button"
              onClick={handleLogout}
            >
              <MdLogout />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'is-active' : ''}`}>
        <Link to="/dashboard" className="mobile-menu-item">Dashboard</Link>
        <Link to="/employees" className="mobile-menu-item">Employees</Link>
        <Link to="/projects" className="mobile-menu-item">Projects</Link>
        <Link to="/tasks" className="mobile-menu-item">Tasks</Link>
        <Link to="/settings" className="mobile-menu-item">Settings</Link>
      </div>
    </header>
  );
}