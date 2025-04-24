import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock, FiHome } from 'react-icons/fi';
import './Unauthorized.scss';

const Unauthorized = () => {
  return (
    <div className="unauthorized-page">
      <div className="error-container">
        <div className="error-icon">
          <FiLock />
        </div>
        <h1>Access Denied</h1>
        <p>
          Sorry, you don't have permission to access this page. If you believe
          this is an error, please contact your administrator.
        </p>
        <div className="action-buttons">
          <Link to="/" className="home-button">
            <FiHome /> Go to Home
          </Link>
          <Link to="/dashboard" className="dashboard-button">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 