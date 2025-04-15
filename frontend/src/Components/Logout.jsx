import React from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Clear any local storage or state if needed
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Logout</h1>
          <p className="auth-subtitle">Are you sure you want to log out?</p>
        </div>

        <div className="auth-actions">
          <button
            onClick={handleLogout}
            className="auth-btn auth-btn--primary"
          >
            Logout
          </button>
          <button
            onClick={() => navigate(-1)}
            className="auth-btn auth-btn--secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout; 