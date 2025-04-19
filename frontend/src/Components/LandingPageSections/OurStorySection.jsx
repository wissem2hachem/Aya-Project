import React from "react";

function OurStorySection() {
  const timelineItems = [
    {
      year: "2019",
      title: "The Beginning",
      content: "HRHub was born out of frustration with existing HR management systems. Our founders, Jane and Michael, experienced firsthand the challenges of managing recruitment, employee records, and compliance across distributed teams."
    },
    {
      year: "2020",
      title: "First Launch",
      content: "We launched our beta version with core HR management and talent acquisition features. Despite the global pandemic, our team worked remotely to refine the platform based on feedback from HR professionals."
    },
    {
      year: "2021",
      title: "Rapid Growth",
      content: "As remote work and hiring became the new normal, HRHub experienced exponential growth. We secured our first round of funding and expanded our team to serve HR departments across industries."
    },
    {
      year: "Today",
      title: "Looking Forward",
      content: "With over 10,000 HR teams using HRHub daily, we're more committed than ever to our mission of transforming human resources management. We continue to innovate and develop new features based on HR professionals' feedback."
    }
  ];

  const coreValues = [
    { icon: "🤝", value: "People-First", description: "We believe in empowering human connections" },
    { icon: "💡", value: "Innovation", description: "We continuously evolve our HR platform" },
    { icon: "👂", value: "User-Focused", description: "We listen to HR professionals' needs" },
    { icon: "🛡️", value: "Security", description: "We protect sensitive employee data" }
  ];

  return (
    <section className="landing__our-story" id="our-story">
      <div className="section-header">
        <h2>Our Story</h2>
        <p className="section-subtitle">How HRHub came to transform human resources management</p>
      </div>
      <div className="our-story-container">
        <div className="our-story-image">
          <img src="/images/our-story.jpg" alt="HRHub Team" className="story-image" />
        </div>
        <div className="our-story-content">
          <div className="story-timeline">
            {timelineItems.map((item, index) => (
              <div className="timeline-item" key={index}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="story-values">
            <h3>Our Core Values</h3>
            <ul className="values-list">
              {coreValues.map((value, index) => (
                <li key={index}>
                  <span className="value-icon">{value.icon}</span> 
                  <strong>{value.value}</strong>: {value.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStorySection; 