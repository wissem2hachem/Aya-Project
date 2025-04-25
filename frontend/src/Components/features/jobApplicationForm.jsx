import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/jobApplicationForm.scss';
import axios from 'axios';

const JobApplicationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId;
  const jobTitle = location.state?.jobTitle;

  // Check job information on component mount
  useEffect(() => {
    if (!jobId || !jobTitle) {
      console.log("Missing job info, redirecting to job offers");
      navigate('/features/job-offers');
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
    if (file) {
      if (file.type === 'application/pdf') {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          setFormData(prev => ({
            ...prev,
            cv: file
          }));
          setErrors(prev => ({
            ...prev,
            cv: null
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            cv: 'File size must be less than 5MB'
          }));
          e.target.value = null; // Clear the file input
        }
      } else {
        setErrors(prev => ({
          ...prev,
          cv: 'Please upload a PDF file'
        }));
        e.target.value = null; // Clear the file input
      }
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
        console.log("Submitting application with data:", {
          ...formData,
          jobId,
          jobTitle
        });

        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('degree', formData.degree);
        formDataToSend.append('cv', formData.cv);
        formDataToSend.append('jobId', jobId);

        console.log("Sending request to /api/job-applications/apply");
        const response = await axios.post('http://localhost:5000/api/job-applications/apply', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Response received:", response.data);
        if (response.status === 201) {
          navigate('/thank-you', { state: { jobTitle: jobTitle } });
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        console.error('Error response:', error.response?.data);
        alert(error.response?.data?.message || 'An error occurred while submitting the application. Please try again.');
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