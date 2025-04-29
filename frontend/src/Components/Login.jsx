import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have a redirect destination after login
  const from = location.state?.from || '/dashboard';
  const jobInfo = location.state?.jobInfo;

  // For debugging
  useEffect(() => {
    console.log("Redirect destination:", from);
    console.log("Job info:", jobInfo);
  }, [from, jobInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the login function from AuthContext
      await login(email, password);
      
      // Handle redirect based on the from path
      if (from === '/jobApplication' && jobInfo) {
        navigate('/jobApplication', { state: jobInfo });
      } else {
        navigate(from);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome to HR Management</h1>
          <p className="auth-subtitle">Sign in to access your dashboard</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn auth-btn--primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="auth-loading"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
          <span style={{ margin: "0 0.5rem" }}>•</span>
          <Link to="/signup" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;