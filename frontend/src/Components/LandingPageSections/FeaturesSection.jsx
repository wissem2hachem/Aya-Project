import React from "react";
import { Link } from "react-router-dom";

function FeaturesSection() {
  const features = [
    {
      title: "Job Posting Management",
      desc: "Create, publish, and manage job openings while tracking applicants through the hiring process.",
      icon: "💼",
      path: "/features/job-offers"
    }
  ];

  return (
    <section className="landing__features" id="features">
      <div className="section-header">
        <h2 className="landing__features-title">Hiring Hub</h2>
        <p className="section-subtitle">Everything you need to manage your job postings effectively</p>
      </div>
      <div className="landing__feature-list">
        {features.map((feature, index) => (
          <Link to={feature.path} key={index} className="landing__feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection; 