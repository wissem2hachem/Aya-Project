import React from "react";
import { Link } from "react-router-dom";

function JobSeekersSection() {
  const benefits = [
    {
      title: "Get Matched to Your Dream Job",
      description: "Our AI analyzes your skills and preferences to match you with perfect opportunities.",
      icon: "✨"
    },
    {
      title: "Application Tracking",
      description: "Manage all your applications in one place with status updates and reminders.",
      icon: "📱"
    },
    {
      title: "Resume Enhancement",
      description: "AI-powered tools help optimize your resume for each application.",
      icon: "📝"
    },
    {
      title: "Interview Preparation",
      description: "Access company-specific interview questions and preparation resources.",
      icon: "🎤"
    }
  ];

  return (
    <section className="landing__job-seekers-section" id="job-seekers">
      <div className="section-header">
        <h2>For Job Seekers</h2>
        <p className="section-subtitle">Find your ideal role faster with less effort</p>
      </div>

      <div className="job-seekers-content">
        <div className="job-seekers-benefits">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
          
          <div className="job-seekers-cta">
            <Link to="/candidate-signup" className="btn btn--primary">Create Free Account</Link>
            <Link to="/browse-jobs" className="btn btn--secondary">Browse Jobs</Link>
          </div>
          
          <div className="job-seekers-trust">
            <p className="metric">72% of users find employment within 45 days</p>
            <p className="testimonial">"I found my dream job in just 3 weeks!" - Sarah K., Marketing Manager</p>
          </div>
        </div>
        
        <div className="job-seekers-image">
          <img src="/images/job-seeker-app.png" alt="Job Seeker Dashboard" />
        </div>
      </div>
    </section>
  );
}

export default JobSeekersSection; 