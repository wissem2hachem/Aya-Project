import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ManageJobs.scss';

const ManageJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/jobs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch jobs');
      }
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/jobs/${jobId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchJobs(); // Refresh the list
    } catch (err) {
      console.error('Error updating job status:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to update job status');
      }
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        fetchJobs(); // Refresh the list
      } catch (err) {
        console.error('Error deleting job:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to delete job');
        }
      }
    }
  };

  const handleEdit = (jobId) => {
    // Navigate to the edit page for the specific job
    navigate(`/edit-job/${jobId}`);
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="manage-jobs-container">
      <div className="manage-jobs-header">
        <h1>Manage Job Postings</h1>
        <button 
          className="create-job-button"
          onClick={() => navigate('/create-job')}
        >
          Create New Job
        </button>
      </div>

      <div className="jobs-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Type</th>
              <th>Status</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.department}</td>
                <td>{job.employmentType}</td>
                <td>
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Paused">Paused</option>
                  </select>
                </td>
                <td>{new Date(job.postedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(job._id)} // Fixed Edit button
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;