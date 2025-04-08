import React from "react";
import { 
  IoMdNotificationsOutline,
  IoMdNotifications 
} from "react-icons/io";
import { FaSearch, FaRegEnvelope, FaEnvelope } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import avatar from "../assets/avatarImage.jpeg";
import "./navbar.scss";

export default function Navbar() {
  const [hasNotifications, setHasNotifications] = React.useState(true);
  const [hasUnreadMessages, setHasUnreadMessages] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <header className="navbar" role="banner">
      {/* User Profile Section */}
      <div className="user-profile">
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

      {/* Search Bar */}
      <div className="search-container">
        <label htmlFor="search-input" className="visually-hidden">
          Search Employees
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Search Employees..."
          aria-label="Search Employees"
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

      {/* Navbar Actions */}
      <nav className="navbar-actions" aria-label="User actions">
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
        
        <button 
          className="logout-button"
          aria-label="Logout"
          onClick={() => console.log('Logout clicked')}
        >
          <MdLogout aria-hidden="true" />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
}