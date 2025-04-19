import React from "react";

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "HRHub has transformed how our HR team operates. The platform is intuitive and powerful for managing all our people processes.",
      author: "Sarah Johnson",
      role: "HR Director, TechCorp"
    },
    {
      quote: "The best HR management tool we've ever used. It's become essential to our talent acquisition and employee management operations.",
      author: "Michael Chen",
      role: "Talent Acquisition Manager, InnovateX"
    },
    {
      quote: "Simple to use yet packed with HR features. Our time-to-hire has decreased by 40% since implementation.",
      author: "Emma Davis",
      role: "Chief People Officer, StartUp Inc"
    }
  ];

  return (
    <section className="landing__testimonials">
      <div className="section-header">
        <h2>What HR Leaders Say</h2>
        <p className="section-subtitle">Join thousands of HR professionals worldwide</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
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
  );
}

export default TestimonialsSection; 