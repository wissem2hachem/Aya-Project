import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCode, FaChartLine, FaPalette, FaShieldAlt, FaMobile, FaDatabase, FaRobot, FaGlobe } from 'react-icons/fa';
import './JobOffers.scss';

const JobOffers = () => {
  const [jobOffers, setJobOffers] = useState([
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      type: 'Full-time',
      icon: <FaCode />,
      category: 'Engineering',
      description: 'We are looking for an experienced software engineer to join our team and help build innovative solutions.',
      requirements: [
        '5+ years of experience in software development',
        'Strong knowledge of React and Node.js',
        'Experience with cloud services (AWS/GCP)',
        'Excellent problem-solving skills',
        'Strong communication abilities'
      ],
      salary: '$120,000 - $150,000',
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovate Corp',
      location: 'New York, NY',
      type: 'Full-time',
      icon: <FaChartLine />,
      category: 'Product',
      description: 'Join our product team to drive innovation and create exceptional user experiences.',
      requirements: [
        '3+ years of product management experience',
        'Strong analytical skills',
        'Excellent communication abilities',
        'Experience with agile methodologies',
        'Data-driven decision making'
      ],
      salary: '$100,000 - $130,000',
      postedDate: '1 week ago'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'Creative Minds',
      location: 'San Francisco, CA',
      type: 'Full-time',
      icon: <FaPalette />,
      category: 'Design',
      description: 'Looking for a creative designer to shape our digital products and create beautiful user experiences.',
      requirements: [
        'Portfolio demonstrating UI/UX work',
        'Experience with Figma/Sketch',
        'Understanding of user-centered design',
        'Strong visual design skills',
        'Experience with design systems'
      ],
      salary: '$90,000 - $120,000',
      postedDate: '3 days ago'
    },
    {
      id: 4,
      title: 'Security Engineer',
      company: 'SecureTech',
      location: 'Remote',
      type: 'Full-time',
      icon: <FaShieldAlt />,
      category: 'Security',
      description: 'Help us build and maintain secure systems to protect our users and their data.',
      requirements: [
        '4+ years of security engineering experience',
        'Knowledge of security best practices',
        'Experience with penetration testing',
        'Understanding of encryption methods',
        'Security certifications preferred'
      ],
      salary: '$130,000 - $160,000',
      postedDate: '5 days ago'
    },
    {
      id: 5,
      title: 'Mobile Developer',
      company: 'AppWorks',
      location: 'Austin, TX',
      type: 'Full-time',
      icon: <FaMobile />,
      category: 'Mobile',
      description: 'Join our mobile team to build beautiful and performant applications for iOS and Android.',
      requirements: [
        '3+ years of mobile development experience',
        'Strong knowledge of React Native',
        'Experience with native development',
        'Understanding of mobile UI/UX',
        'Performance optimization skills'
      ],
      salary: '$110,000 - $140,000',
      postedDate: '1 day ago'
    },
    {
      id: 6,
      title: 'Data Scientist',
      company: 'DataInsights',
      location: 'Boston, MA',
      type: 'Full-time',
      icon: <FaDatabase />,
      category: 'Data',
      description: 'Help us extract valuable insights from our data and build predictive models.',
      requirements: [
        '4+ years of data science experience',
        'Strong Python and SQL skills',
        'Experience with machine learning',
        'Statistical analysis expertise',
        'Data visualization skills'
      ],
      salary: '$140,000 - $170,000',
      postedDate: '4 days ago'
    }
  ]);

  const navigate = useNavigate();

  const handleApply = (jobId, jobTitle) => {
    navigate('/job-application', { state: { jobId, jobTitle } });
  };

  return (
    <div className="job-offers-container">
      <div className="job-offers-header">
        <h1>Available Job Positions</h1>
        <p>Find your next career opportunity with us</p>
      </div>

      <div className="job-offers-grid">
        {jobOffers.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
              <div className="job-icon">{job.icon}</div>
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
              onClick={() => handleApply(job.id, job.title)}
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