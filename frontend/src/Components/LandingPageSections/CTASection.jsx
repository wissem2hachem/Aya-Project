import React from "react";
import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="landing__cta-section">
      <div className="cta-content">
        <h2>Ready to Transform Your HR Department?</h2>
        <p>Join thousands of HR professionals who are already working smarter with HRHub</p>
        <Link to="/signup" className="btn btn--primary btn--large">Start Free Trial</Link>
      </div>
    </section>
  );
}

export default CTASection; 