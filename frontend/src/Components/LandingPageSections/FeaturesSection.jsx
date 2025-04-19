import React from "react";
import { Link } from "react-router-dom";

function FeaturesSection() {
  const features = [
    {
      title: "Smart Document Management",
      desc: "Organize employee records, contracts, and compliance documents with easy access and commenting features.",
      icon: "📁",
      path: "/features/file-management"
    },
    {
      title: "Performance Review System",
      desc: "Create consistent performance evaluations and manage the review process efficiently.",
      icon: "✅",
      path: "/features/review-management"
    },
    {
      title: "Real-time Recruitment Tracking",
      desc: "24/7 access to candidate pipelines and hiring status with live updates for all stakeholders.",
      icon: "📊",
      path: "/features/status-tracking"
    },
    {
      title: "Automated HR Workflows",
      desc: "Streamline approvals for time-off requests, expense reports, and onboarding documentation.",
      icon: "⚡",
      path: "/features/automated-approvals"
    },
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
        <h2 className="landing__features-title">HR-Focused Features</h2>
        <p className="section-subtitle">Everything you need to manage your HR operations effectively</p>
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