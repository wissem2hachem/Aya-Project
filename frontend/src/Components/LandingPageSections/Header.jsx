import React from "react";
import { Link } from "react-router-dom";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

function Header({ theme, toggleTheme }) {
  return (
    <header className="landing__header">
      <nav className="landing__nav">
        <div className="landing__logo">
          <span className="logo-text">HRHub</span>
        </div>
        <ul className="landing__nav-list">
          <li><a href="#features">Features</a></li>
          <li><a href="#our-story">Our Story</a></li>
        </ul>
        <div className="landing__nav-buttons">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <IoMdMoon /> : <IoMdSunny />}
          </button>
          <Link to="/login" className="btn btn--secondary">Log In</Link>
          <Link to="/signup" className="btn btn--primary">Sign Up</Link>
        </div>
      </nav>

      <div className="landing__hero">
        <div className="landing__hero-content">
          <div className="landing__badge">HR Excellence</div>
          <h1 className="landing__title">Transform Your HR Management</h1>
          <p className="landing__subtitle">
            The all-in-one platform for seamless recruitment, talent management, and HR processes. 
            Organize candidates, compliance documents, performance reviews, and employee records in one place.
          </p>
          <div className="landing__cta">
            <Link to="/signup" className="btn btn--primary btn--large">Get Started Free</Link>
            <div className="landing__trust-badges">
              <span>Trusted by 10,000+ HR professionals</span>
              <div className="landing__ratings">
                <span className="stars">★★★★★</span>
                <span>4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>
        </div>
        <div className="landing__hero-image">
          {/* <img src="/images/illustration.png" alt="HR Management Illustration" className="hero-image" /> */}
        </div>
      </div>
    </header>
  );
}

export default Header; 