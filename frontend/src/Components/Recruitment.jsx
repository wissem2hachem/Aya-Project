import React, { useState, useEffect } from 'react';
import { FaUser, FaFilePdf, FaDownload, FaSearch, FaFilter, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Recruitment.scss';

const Recruitment = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/job-applications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to fetch applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobId && app.jobId.title && app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/job-applications/${applicationId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update application status');
    }
  };

  const handleDownloadCV = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Attempting to download CV for application:', applicationId);
      
      const response = await axios.get(`http://localhost:5000/api/job-applications/${applicationId}/cv`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/pdf'
        },
        responseType: 'blob'
      });

      console.log('CV download response received');
      
      // Get filename from Content-Disposition header or use a default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `CV_${applicationId}.pdf`;

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading CV:', err);
      if (err.response?.status === 404) {
        alert('CV file not found');
      } else {
        alert('Failed to download CV. Please try again.');
      }
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/job-applications/${applicationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Remove the deleted application from the state
        setApplications(prev => prev.filter(app => app._id !== applicationId));
      } catch (err) {
        console.error('Error deleting application:', err);
        alert('Failed to delete application');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="recruitment-container">
      <div className="recruitment-header">
        <h1>Job Applications</h1>
        <p>Review and manage job applications</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <FaFilter className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="applications-list">
        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>No applications found</p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="candidate-info">
                <div className="name-section">
                  <FaUser className="user-icon" />
                  <div>
                    <h3>{application.firstName} {application.lastName}</h3>
                    <p className="email">{application.email}</p>
                  </div>
                </div>
                <div className="job-info">
                  <p className="job-title">
                    Applied for: {application.jobId?.title || 'Unknown Position'}
                  </p>
                  <p className="department">
                    Department: {application.jobId?.department || 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="application-details">
                <div className="status-section">
                  <span className={`status-badge ${application.status.toLowerCase()}`}>
                    {application.status}
                  </span>
                  <p className="date">Applied: {new Date(application.applicationDate).toLocaleDateString()}</p>
                </div>

                <div className="actions">
                  <button 
                    className="download-btn"
                    onClick={() => handleDownloadCV(application._id)}
                  >
                    <FaDownload /> Download CV
                  </button>
                  <div className="status-actions">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteApplication(application._id)}
                      title="Delete Application"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recruitment; 