import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaChartLine, FaPalette, FaShieldAlt, FaMobile, FaDatabase } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/JobOffers.scss';

const JobOffers = () => {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/job-applications/offers');
        if (response.data && Array.isArray(response.data)) {
          setJobOffers(response.data);
        } else {
          setError('Invalid response format from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job offers:', err);
        setError(err.response?.data?.message || 'Failed to fetch job offers. Please try again later.');
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  const getIconForCategory = (category) => {
    switch (category.toLowerCase()) {
      case 'engineering':
        return <FaCode />;
      case 'product':
        return <FaChartLine />;
      case 'design':
        return <FaPalette />;
      case 'security':
        return <FaShieldAlt />;
      case 'mobile':
        return <FaMobile />;
      case 'data':
        return <FaDatabase />;
      default:
        return <FaCode />;
    }
  };

  const handleApply = (jobId, jobTitle) => {
    navigate('/features/job-application', { 
      state: { 
        jobId, 
        jobTitle 
      } 
    });
  };

  if (loading) {
    return <div className="loading">Loading job offers...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="job-offers-container">
      <div className="job-offers-header">
        <div>
          <h1>Available Job Positions</h1>
          <p>Find your next career opportunity with us</p>
        </div>
      </div>

      <div className="job-offers-grid">
        {jobOffers.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-card-header">
              <div className="job-icon">{getIconForCategory(job.category)}</div>
              <div className="job-title-info">
                <h2>{job.title}</h2>
                <span className="job-category">{job.category}</span>
              </div>
              <span className="job-type">{job.type}</span>
            </div>
            
            <div className="job-company">
              <h3>{job.company}</h3>
              <span className="job-location">{job.location}</span>
            </div>

            <div className="job-meta">
              <div className="job-salary">
                <span>Salary: {job.salary}</span>
              </div>
              <div className="job-posted">
                <span>Posted: {job.postedDate}</span>
              </div>
            </div>

            <div className="job-description">
              <p>{job.description}</p>
            </div>

            <div className="job-requirements">
              <h4>Requirements:</h4>
              <ul>
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <button 
              className="apply-button"
              onClick={() => handleApply(job._id, job.title)}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobOffers;