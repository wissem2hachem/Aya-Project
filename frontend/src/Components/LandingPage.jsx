import React, { useContext } from "react";
import "../styles/LandingPage.css";
import ThemeContext from "../context/ThemeContext";
import Header from "./LandingPageSections/Header";
import FeaturesSection from "./LandingPageSections/FeaturesSection";
import OurStorySection from "./LandingPageSections/OurStorySection";
import TestimonialsSection from "./LandingPageSections/TestimonialsSection";
import CTASection from "./LandingPageSections/CTASection";

function LandingPage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Set title for HR focus
  React.useEffect(() => {
    document.title = "HRHub | HR Management Platform";
  }, []);

  return (
    <div className="landing">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <FeaturesSection />
      <OurStorySection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

export default LandingPage;
