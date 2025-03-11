import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 
{ 
  FaHome, 
  FaCog, 
  FaUser, 
  FaSignOutAlt, 
  FaChartBar,
  FaBars,
  FaTimes 
} 
from 'react-icons/fa'; // Make sure to install react-icons
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/',name: 'Dashboard', icon: <FaHome /> },
    { path: '/analytics', name: 'Analytics', icon: <FaChartBar /> },
    { path: '/profile', name: 'Profile', icon: <FaUser /> },
    { path: '/settings', name: 'Settings', icon: <FaCog /> },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        role="navigation" 
        aria-label="Main Navigation"
      >
        {/* Collapse Toggle Button */}
        <button 
          className="collapse-toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FaBars />
        </button>

        {/* Logo/Brand Section */}
        <div className="sidebar-header">
          {!isCollapsed && <h1>Your Logo</h1>}
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'active-link' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="icon">{item.icon}</span>
                  {!isCollapsed && <span className="label">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <NavLink 
            to="/logout" 
            className="logout-button"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="icon"><FaSignOutAlt /></span>
            {!isCollapsed && <span className="label">Logout</span>}
          </NavLink>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
