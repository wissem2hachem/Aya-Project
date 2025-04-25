import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/CreateJob.scss';

const CreateJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: 'Remote',
    employmentType: 'Full-Time',
    salaryRange: {
      min: '',
      max: ''
    },
    status: 'Open'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'salaryMin' || name === 'salaryMax') {
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [name === 'salaryMin' ? 'min' : 'max']: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/jobs/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        alert('Job created successfully!');
        navigate('/features/job-offers');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to create job. Please try again.');
      }
    }
  };

  return (
    <div className="create-job-container">
      <h1>Create New Job Posting</h1>
      <form onSubmit={handleSubmit} className="create-job-form">
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Design">Design</option>
            <option value="Security">Security</option>
            <option value="Mobile">Mobile</option>
            <option value="Data">Data</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Employment Type</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            required
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="form-group salary-range">
          <label>Salary Range</label>
          <div className="salary-inputs">
            <input
              type="number"
              name="salaryMin"
              placeholder="Min"
              value={formData.salaryRange.min}
              onChange={handleChange}
              required
            />
            <span>to</span>
            <input
              type="number"
              name="salaryMax"
              placeholder="Max"
              value={formData.salaryRange.max}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Create Job</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/features/job-offers')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob; 