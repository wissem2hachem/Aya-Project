import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../../styles/ThankYouPage.scss';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobTitle = location.state?.jobTitle;

  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <FaCheckCircle className="success-icon" />
        <h1>Thank You for Your Application!</h1>
        <p className="job-title">
          {jobTitle ? `Position: ${jobTitle}` : 'Your application has been successfully submitted.'}
        </p>
        <div className="message">
          <p>We have received your application and will review your information carefully.</p>
          <p>If your qualifications match our requirements, we will contact you soon to discuss the next steps.</p>
          <p>We appreciate your interest in joining our team!</p>
        </div>
        <div className="actions">
          <button 
            className="back-to-jobs"
            onClick={() => navigate('/features/job-offers')}
          >
            View Other Job Opportunities
          </button>
          <button 
            className="go-home"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage; 