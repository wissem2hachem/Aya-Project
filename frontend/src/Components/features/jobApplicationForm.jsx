import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/jobApplicationForm.scss';

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId;
  const jobTitle = location.state?.jobTitle;

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token in JobApplicationForm:", token);
    
    // Always redirect to login if accessed directly
    if (!jobId || !jobTitle || !token) {
      console.log("Missing job info or token, redirecting to login");
      navigate('/login');
      return;
    }
  }, [navigate, jobId, jobTitle]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    degree: '',
    cv: null
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        cv: file
      }));
    } else {
      alert('Please upload a PDF file');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.degree) newErrors.degree = 'Degree is required';
    if (!formData.cv) newErrors.cv = 'CV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('degree', formData.degree);
        formDataToSend.append('cv', formData.cv);
        formDataToSend.append('jobId', jobId);

        const response = await fetch('http://localhost:5000/api/jobs/apply', {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          alert('Application submitted successfully!');
          navigate('/job-offers');
        } else {
          alert('Failed to submit application. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="job-application-container">
      <div className="job-application-form">
        <h1>Apply for {jobTitle}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="degree">Degree</label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className={errors.degree ? 'error' : ''}
            />
            {errors.degree && <span className="error-message">{errors.degree}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cv">Upload CV (PDF only)</label>
            <input
              type="file"
              id="cv"
              name="cv"
              accept=".pdf"
              onChange={handleFileChange}
              className={errors.cv ? 'error' : ''}
            />
            {errors.cv && <span className="error-message">{errors.cv}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Submit Application</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/job-offers')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;