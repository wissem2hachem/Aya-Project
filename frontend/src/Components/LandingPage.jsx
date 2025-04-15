import React from "react";
import "./LandingPage.css";
import { Link } from "react-router-dom";
import { FaCode, FaChartLine, FaPalette, FaShieldAlt, FaMobile, FaDatabase, FaBriefcase } from "react-icons/fa";

function LandingPage() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing__header">
        <nav className="landing__nav">
          <div className="landing__logo">
            <span className="logo-text">CollabHub</span>
          </div>
          <ul className="landing__nav-list">
            <li><a href="#services">Services</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#platform">Platform</a></li>
            <li><a href="#our-story">Our Story</a></li>
          </ul>
          <div className="landing__nav-buttons">
            <Link to="/login" className="btn btn--secondary">Log In</Link>
            <Link to="/signup" className="btn btn--primary">Sign Up</Link>
          </div>
        </nav>

        <div className="landing__hero">
          <div className="landing__hero-content">
            <div className="landing__badge">New Feature Alert</div>
            <h1 className="landing__title">Transform Your Team's Collaboration</h1>
            <p className="landing__subtitle">
              The all-in-one platform for seamless project management, file sharing, and team communication. 
              Organize updates and manage files, projects, schedules, and tasks in one place.
            </p>
            <div className="landing__cta">
              <Link to="/signup" className="btn btn--primary btn--large">Get Started Free</Link>
              <div className="landing__trust-badges">
                <span>Trusted by 10,000+ teams</span>
                <div className="landing__ratings">
                  <span className="stars">★★★★★</span>
                  <span>4.9/5 from 2,000+ reviews</span>
                </div>
              </div>
            </div>
          </div>
          <div className="landing__hero-image">
            <img src="illustration.png" alt="Collaboration Illustration" className="hero-image" />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="landing__features" id="features">
        <div className="section-header">
          <h2 className="landing__features-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to manage your team effectively</p>
        </div>
        <div className="landing__feature-list">
          {[
            {
              title: "Smart File Management",
              desc: "Click to add comments directly on file stamps and enjoy collaboration benefits.",
              icon: "📁"
            },
            {
              title: "Review Management",
              desc: "Ensure reviews are consistent and manage the process efficiently.",
              icon: "✅"
            },
            {
              title: "Real-time Status Tracking",
              desc: "24/7 access to an overview of your work status with live updates.",
              icon: "📊"
            },
            {
              title: "Automated Approvals",
              desc: "Streamline stakeholder processes with smart approval workflows.",
              icon: "⚡"
            },
            {
              title: "Career Opportunities",
              desc: "Access to exclusive job opportunities and career growth within our network.",
              icon: <FaBriefcase />,
              link: "/job-offers",
              isLink: true
            }
          ].map((feature, index) => (
            <div className="landing__feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              {feature.isLink && (
                <Link to={feature.link} className="feature-link">
                  Explore Opportunities →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="landing__testimonials">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p className="section-subtitle">Join thousands of satisfied teams worldwide</p>
        </div>
        <div className="testimonials-grid">
          {[
            {
              quote: "CollabHub has transformed how our team works together. The platform is intuitive and powerful.",
              author: "Sarah Johnson",
              role: "Project Manager, TechCorp"
            },
            {
              quote: "The best collaboration tool we've ever used. It's become essential to our daily operations.",
              author: "Michael Chen",
              role: "Team Lead, InnovateX"
            },
            {
              quote: "Simple to use yet packed with features. Our productivity has increased by 40%.",
              author: "Emma Davis",
              role: "CEO, StartUp Inc"
            }
          ].map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="quote">"{testimonial.quote}"</div>
              <div className="author-info">
                <div className="author-name">{testimonial.author}</div>
                <div className="author-role">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing__cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Team's Collaboration?</h2>
          <p>Join thousands of teams who are already working smarter with CollabHub</p>
          <Link to="/signup" className="btn btn--primary btn--large">Start Free Trial</Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
