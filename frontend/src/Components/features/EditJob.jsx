import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/CreateJob.scss';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const job = response.data;
        setFormData({
          title: job.title,
          description: job.description,
          department: job.department,
          location: job.location || 'Remote',
          employmentType: job.employmentType || 'Full-Time',
          salaryRange: {
            min: job.salaryRange?.min || '',
            max: job.salaryRange?.max || ''
          },
          status: job.status || 'Open'
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else if (err.response?.status === 404) {
          setError('Job not found');
        } else {
          setError('Failed to fetch job details');
        }
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'salaryMin') {
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          min: value
        }
      }));
    } else if (name === 'salaryMax') {
      setFormData(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          max: value
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

      // Ensure salary values are numbers
      const jobData = {
        ...formData,
        salaryRange: {
          min: Number(formData.salaryRange.min),
          max: Number(formData.salaryRange.max)
        }
      };

      const response = await axios.put(`http://localhost:5000/api/jobs/${id}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        alert('Job updated successfully!');
        navigate('/manage-jobs');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to update job. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading job details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="create-job-container">
      <h1>Edit Job</h1>
      <form onSubmit={handleSubmit}>
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
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          >
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
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
          <button type="submit" className="submit-button">Update Job</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/manage-jobs')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob; 