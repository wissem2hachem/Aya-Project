import React, { useContext } from "react";
import "../styles/LandingPage.css";
import { Link } from "react-router-dom";
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import ThemeContext  from "../context/ThemeContext";

function LandingPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="landing">
      {/* Header */}
      <header className="landing__header">
        <nav className="landing__nav">
          <div className="landing__logo">
            <span className="logo-text">CollabHub</span>
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
            <img src="/images/illustration.png" alt="Collaboration Illustration" className="hero-image" />
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
              icon: "📁",
              path: "/features/file-management"
            },
            {
              title: "Review Management",
              desc: "Ensure reviews are consistent and manage the process efficiently.",
              icon: "✅",
              path: "/features/review-management"
            },
            {
              title: "Real-time Status Tracking",
              desc: "24/7 access to an overview of your work status with live updates.",
              icon: "📊",
              path: "/features/status-tracking"
            },
            {
              title: "Automated Approvals",
              desc: "Streamline stakeholder processes with smart approval workflows.",
              icon: "⚡",
              path: "/features/automated-approvals"
            },
            {
              title: "Job Offers",
              desc: "Find and post job opportunities, connect with potential employers and candidates.",
              icon: "💼",
              path: "/features/job-offers"
            }
          ].map((feature, index) => (
            <Link to={feature.path} key={index} className="landing__feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="landing__our-story" id="our-story">
        <div className="section-header">
          <h2>Our Story</h2>
          <p className="section-subtitle">How CollabHub came to transform workplace collaboration</p>
        </div>
        <div className="our-story-container">
          <div className="our-story-image">
            <img src="/images/our-story.jpg" alt="CollabHub Team" className="story-image" />
          </div>
          <div className="our-story-content">
            <div className="story-timeline">
              <div className="timeline-item">
                <div className="timeline-year">2019</div>
                <div className="timeline-content">
                  <h3>The Beginning</h3>
                  <p>CollabHub was born out of frustration with existing collaboration tools. Our founders, Jane and Michael, experienced firsthand the challenges of managing complex projects across distributed teams.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3>First Launch</h3>
                  <p>We launched our beta version with core file sharing and project management features. Despite the global pandemic, our team worked remotely to refine the platform based on early user feedback.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-content">
                  <h3>Rapid Growth</h3>
                  <p>As remote work became the new normal, CollabHub experienced exponential growth. We secured our first round of funding and expanded our team to serve our growing user base.</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-year">Today</div>
                <div className="timeline-content">
                  <h3>Looking Forward</h3>
                  <p>With over 10,000 teams using CollabHub daily, we're more committed than ever to our mission of transforming workplace collaboration. We continue to innovate and develop new features based on user feedback.</p>
                </div>
              </div>
            </div>
            <div className="story-values">
              <h3>Our Core Values</h3>
              <ul className="values-list">
                <li><span className="value-icon">🤝</span> <strong>Collaboration</strong>: We believe in the power of teamwork</li>
                <li><span className="value-icon">💡</span> <strong>Innovation</strong>: We continuously evolve our platform</li>
                <li><span className="value-icon">👂</span> <strong>User-Focused</strong>: We listen to our users' needs</li>
                <li><span className="value-icon">🛡️</span> <strong>Security</strong>: We protect your data like it's our own</li>
              </ul>
            </div>
          </div>
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
