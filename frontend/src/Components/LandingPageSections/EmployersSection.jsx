import React from "react";
import { Link } from "react-router-dom";

function EmployersSection() {
  const benefits = [
    {
      title: "Reduce Time-to-Hire by 35%",
      description: "Our automated screening and candidate management tools help you fill positions faster.",
      icon: "⏱️"
    },
    {
      title: "Improve Candidate Quality",
      description: "AI-powered matching ensures you only see candidates who truly fit your requirements.",
      icon: "🎯"
    },
    {
      title: "Streamline Compliance",
      description: "Built-in tools ensure your hiring process meets all regulatory requirements.",
      icon: "📜"
    },
    {
      title: "Reduce Recruitment Costs",
      description: "Save up to 40% on recruitment costs through process optimization.",
      icon: "💰"
    }
  ];

  return (
    <section className="landing__employers-section" id="employers">
      <div className="section-header">
        <h2>For HR Professionals & Employers</h2>
        <p className="section-subtitle">Transform your recruitment process end-to-end</p>
      </div>

      <div className="employers-content">
        <div className="employers-image">
          <img src="/images/hr-dashboard.png" alt="HR Dashboard" />
        </div>

        <div className="employers-benefits">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
          
          <div className="employers-cta">
            <Link to="/employer-demo" className="btn btn--secondary">Request Demo</Link>
            <Link to="/employer-signup" className="btn btn--primary">Start Free Trial</Link>
          </div>
          
          <div className="employers-trust">
            <p className="metric">94% of HR managers report improved hiring outcomes</p>
            <p className="companies">Trusted by leading companies including Deloitte, Amazon, and IBM</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmployersSection; 