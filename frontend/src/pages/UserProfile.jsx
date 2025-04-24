import React, { useState, useEffect } from 'react';
import { FaUser, FaIdCard, FaBriefcase, FaGraduationCap, FaUserPlus, FaRegAddressCard } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin, FiEdit, FiSave, FiX, FiLink, FiPlus, FiUpload, FiDownload, FiFile, FiFileText, FiEye } from 'react-icons/fi';
import { IoMdSchool } from 'react-icons/io';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../styles/UserProfile.scss';
import { uploadCertificate, getCertificateUrl, deleteCertificate } from '../services/certificateService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState({});
  const [newWorkHistory, setNewWorkHistory] = useState({
    position: '',
    department: '',
    startDate: '',
    endDate: '',
    achievements: []
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [showCertForm, setShowCertForm] = useState(false);
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Get user ID from JWT token
        const token = localStorage.getItem('token');
        if (!token) {
          // Handle not logged in case
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded._id;

        // Fetch user profile
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
        setFormData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        showNotification('Failed to load profile data', 'error');
      }
    };

    fetchUserProfile();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (e, parent, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
    setShowCertForm(false);
    setShowWorkForm(false);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded._id;

      // Update profile
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data);
      setEditMode(false);
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
    
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleRemoveCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleAddWorkHistory = () => {
    if (!newWorkHistory.position || !newWorkHistory.department || !newWorkHistory.startDate) return;
    
    setFormData(prev => ({
      ...prev,
      workHistory: [...(prev.workHistory || []), {
        ...newWorkHistory,
        achievements: newWorkHistory.achievements || []
      }]
    }));
    
    setNewWorkHistory({
      position: '',
      department: '',
      startDate: '',
      endDate: '',
      achievements: []
    });
    
    setShowWorkForm(false);
  };

  const handleRemoveWorkHistory = (index) => {
    setFormData(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }));
  };

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    
    setNewWorkHistory(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
    
    setNewAchievement('');
  };

  const handleRemoveAchievement = (index) => {
    setNewWorkHistory(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Handle certificate file upload
  const handleCertificateUpload = async (certificationData) => {
    try {
      setShowCertForm(false);
      
      // Show loading notification
      showNotification('Uploading certificate...', 'info');
      
      const userId = user._id;
      const formData = new FormData();
      
      // Add the file to the form data
      formData.append('certificateFile', certificationData.file);
      
      // Use the file name as the certificate name
      const fileName = certificationData.file.name;
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      formData.append('name', nameWithoutExt);
      
      const result = await uploadCertificate(userId, formData);
      
      // Update user data with the new certificate
      setUser(prevUser => ({
        ...prevUser,
        certifications: [...(prevUser.certifications || []), result.certificate]
      }));
      
      setFormData(prevData => ({
        ...prevData,
        certifications: [...(prevData.certifications || []), result.certificate]
      }));
      
      // Reset the new certification data
      setNewCertification({});
      
      // Show success notification
      showNotification('Certificate uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      showNotification('Failed to upload certificate: ' + (error.response?.data?.message || error.message), 'error');
    }
  };
  
  // Handle certificate deletion
  const handleDeleteCertificate = async (certificateId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this certificate?')) {
        return;
      }
      
      const userId = user._id;
      await deleteCertificate(userId, certificateId);
      
      // Update user data by removing the deleted certificate
      setUser(prevUser => ({
        ...prevUser,
        certifications: prevUser.certifications.filter(cert => cert._id !== certificateId)
      }));
      
      setFormData(prevData => ({
        ...prevData,
        certifications: prevData.certifications.filter(cert => cert._id !== certificateId)
      }));
      
      showNotification('Certificate deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      showNotification('Failed to delete certificate: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="profile-error">
        <h2>Profile Not Found</h2>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const renderNotification = () => {
    if (!notification.message) return null;
    
    return (
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="profile-overview">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=3498db&color=fff&size=128`} 
            alt={user.name} 
          />
        </div>
        <div className="profile-summary">
          <h2>{user.name}</h2>
          <h3>{user.position || 'No position set'} {user.department ? `at ${user.department}` : ''}</h3>
          <div className="profile-meta">
            <div className="meta-item">
              <FiMail />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="meta-item">
                <FiPhone />
                <span>{user.phone}</span>
              </div>
            )}
            {user.location && (
              <div className="meta-item">
                <FiMapPin />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="profile-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => setEditMode(true)}
          >
            <FiEdit />
            Edit Profile
          </button>
        </div>
      </div>
      
      <div className="profile-completion">
        <div className="completion-header">
          <h3>Profile Completion</h3>
          <span className="completion-percentage">{user.profileCompletion || 0}%</span>
        </div>
        <div className="completion-bar">
          <div className="completion-progress" style={{ width: `${user.profileCompletion || 0}%` }}></div>
        </div>
        <p className="completion-message">
          {user.profileCompletion < 50 ? 
            'Complete your profile to help us personalize your experience.' : 
            user.profileCompletion < 100 ? 
            'Your profile is coming along nicely! Add more details to complete it.' :
            'Your profile is complete!'
          }
        </p>
      </div>
      
      {user.bio && (
        <div className="profile-section">
          <h3>About Me</h3>
          <p className="user-bio">{user.bio}</p>
        </div>
      )}
      
      {user.skills && user.skills.length > 0 && (
        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skills-container">
            {user.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}
      
      {user.socialProfiles && Object.values(user.socialProfiles).some(v => v) && (
        <div className="profile-section">
          <h3>Social Profiles</h3>
          <div className="social-links">
            {user.socialProfiles.linkedin && (
              <a href={user.socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                <FiLink /> LinkedIn
              </a>
            )}
            {user.socialProfiles.twitter && (
              <a href={user.socialProfiles.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                <FiLink /> Twitter
              </a>
            )}
            {user.socialProfiles.github && (
              <a href={user.socialProfiles.github} target="_blank" rel="noopener noreferrer" className="social-link github">
                <FiLink /> GitHub
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderEditProfileForm = () => (
    <div className="edit-profile-form">
      <div className="form-header">
        <h2>Edit Profile</h2>
        <div className="form-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            <FiX />
            Cancel
          </button>
          <button className="save-btn" onClick={handleSaveProfile}>
            <FiSave />
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={formData.position || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              disabled
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
              placeholder="City, Country"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
              rows="4"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Skills</h3>
        <div className="skills-editor">
          <div className="current-skills">
            {formData.skills && formData.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
                <button className="remove-btn" onClick={() => handleRemoveSkill(skill)}>×</button>
              </div>
            ))}
          </div>
          
          <div className="add-skill">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button onClick={handleAddSkill}>Add</button>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Social Profiles</h3>
        <div className="form-row">
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              value={formData.socialProfiles?.linkedin || ''}
              onChange={(e) => handleNestedInputChange(e, 'socialProfiles', 'linkedin')}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Twitter</label>
            <input
              type="url"
              value={formData.socialProfiles?.twitter || ''}
              onChange={(e) => handleNestedInputChange(e, 'socialProfiles', 'twitter')}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              value={formData.socialProfiles?.github || ''}
              onChange={(e) => handleNestedInputChange(e, 'socialProfiles', 'github')}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Emergency Contact</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Contact Name</label>
            <input
              type="text"
              value={formData.emergencyContact?.name || ''}
              onChange={(e) => handleNestedInputChange(e, 'emergencyContact', 'name')}
            />
          </div>
          <div className="form-group">
            <label>Relationship</label>
            <input
              type="text"
              value={formData.emergencyContact?.relationship || ''}
              onChange={(e) => handleNestedInputChange(e, 'emergencyContact', 'relationship')}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Contact Phone</label>
            <input
              type="text"
              value={formData.emergencyContact?.phone || ''}
              onChange={(e) => handleNestedInputChange(e, 'emergencyContact', 'phone')}
            />
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              value={formData.emergencyContact?.email || ''}
              onChange={(e) => handleNestedInputChange(e, 'emergencyContact', 'email')}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCertificationsTab = () => (
    <div className="profile-certifications">
      <div className="section-header">
        <h2>Certifications & Qualifications</h2>
      </div>
      
      {showCertForm && (
        <div className="cert-form">
          <h3>Select File to Upload</h3>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Certificate File</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewCertification({
                      ...newCertification || {},
                      file: e.target.files[0]
                    });
                  }
                }}
              />
              <p className="form-hint">Select a certification file (PDF, JPG, JPEG, or PNG)</p>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={() => {
                setShowCertForm(false);
                setNewCertification({});
              }}
            >
              Cancel
            </button>
            <button 
              className="save-btn"
              onClick={() => {
                if (newCertification?.file) {
                  handleCertificateUpload(newCertification);
                }
              }}
              disabled={!newCertification?.file}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      
      {!formData.certifications || formData.certifications.length === 0 ? (
        <div className="empty-state">
          <IoMdSchool className="empty-icon" />
          <h3>No Certifications Added</h3>
          <p>Add your professional certifications and qualifications to showcase your expertise.</p>
          {editMode && (
            <button 
              className="upload-cert-btn"
              onClick={() => setShowCertForm(true)}
            >
              <FiUpload />
              Upload Your First Certificate
            </button>
          )}
        </div>
      ) : (
        <div className="certifications-list">
          {editMode && (
            <div className="add-cert-button-container">
              <button 
                className="upload-cert-btn"
                onClick={() => setShowCertForm(true)}
              >
                <FiUpload />
                Upload Certificate
              </button>
            </div>
          )}
          {formData.certifications.map((cert, index) => (
            <div className="certification-card" key={index}>
              <div className="cert-header">
                <IoMdSchool className="cert-icon" />
                <div className="cert-title">
                  <h3>{cert.name || 'Certificate'}</h3>
                  {cert.issuer && <h4>{cert.issuer}</h4>}
                </div>
                {editMode && (
                  <button 
                    className="remove-btn"
                    onClick={() => cert._id ? handleDeleteCertificate(cert._id) : handleRemoveCertification(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
              {(cert.issueDate || cert.expiryDate || cert.credentialID) && (
                <div className="cert-meta">
                  {cert.issueDate && (
                    <div className="meta-item">
                      <span className="label">Issued:</span>
                      <span className="value">{new Date(cert.issueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {cert.expiryDate && (
                    <div className="meta-item">
                      <span className="label">Expires:</span>
                      <span className="value">{new Date(cert.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {cert.credentialID && (
                    <div className="meta-item">
                      <span className="label">Credential ID:</span>
                      <span className="value">{cert.credentialID}</span>
                    </div>
                  )}
                </div>
              )}
              
              {(cert.file || cert._id) && (
                <div className="cert-file">
                  <div className="file-preview">
                    {cert.file && cert.file.mimeType && cert.file.mimeType.match(/image\/(jpe?g|png)/i) ? (
                      <img src={getCertificateUrl(user._id, cert._id)} alt="Certificate" className="cert-image" />
                    ) : (
                      <div className="pdf-placeholder">
                        <FiFileText className="pdf-icon" />
                        <span>Certificate File</span>
                      </div>
                    )}
                  </div>
                  <div className="file-actions">
                    <a 
                      href={getCertificateUrl(user._id, cert._id)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      <FiEye /> View
                    </a>
                    <a 
                      href={getCertificateUrl(user._id, cert._id)} 
                      download
                      className="download-btn"
                    >
                      <FiDownload /> Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWorkHistoryTab = () => (
    <div className="profile-work-history">
      <div className="section-header">
        <h2>Work History</h2>
        {editMode && (
          <button 
            className="add-work-btn"
            onClick={() => setShowWorkForm(!showWorkForm)}
          >
            <FiPlus />
            Add Position
          </button>
        )}
      </div>
      
      {showWorkForm && (
        <div className="work-form">
          <h3>Add Work History</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Position</label>
              <input
                type="text"
                value={newWorkHistory.position}
                onChange={(e) => setNewWorkHistory({...newWorkHistory, position: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={newWorkHistory.department}
                onChange={(e) => setNewWorkHistory({...newWorkHistory, department: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newWorkHistory.startDate}
                onChange={(e) => setNewWorkHistory({...newWorkHistory, startDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date (leave blank if current)</label>
              <input
                type="date"
                value={newWorkHistory.endDate}
                onChange={(e) => setNewWorkHistory({...newWorkHistory, endDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label>Key Achievements</label>
              <div className="achievements-editor">
                <div className="achievements-list">
                  {newWorkHistory.achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <span>{achievement}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveAchievement(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="add-achievement">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                  />
                  <button onClick={handleAddAchievement}>Add</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={() => setShowWorkForm(false)}
            >
              Cancel
            </button>
            <button 
              className="save-btn"
              onClick={handleAddWorkHistory}
              disabled={!newWorkHistory.position || !newWorkHistory.department || !newWorkHistory.startDate}
            >
              Add Work History
            </button>
          </div>
        </div>
      )}
      
      {!formData.workHistory || formData.workHistory.length === 0 ? (
        <div className="empty-state">
          <FaBriefcase className="empty-icon" />
          <h3>No Work History Added</h3>
          <p>Add your positions and roles within the company to track your career growth.</p>
          {editMode && (
            <button 
              className="add-work-btn"
              onClick={() => setShowWorkForm(true)}
            >
              <FiPlus />
              Add Your First Position
            </button>
          )}
        </div>
      ) : (
        <div className="work-history-timeline">
          {formData.workHistory.map((work, index) => (
            <div className="work-history-item" key={index}>
              <div className="timeline-point"></div>
              <div className="work-card">
                <div className="work-header">
                  <h3>{work.position}</h3>
                  <h4>{work.department}</h4>
                  {editMode && (
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveWorkHistory(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="work-dates">
                  <span>
                    {new Date(work.startDate).toLocaleDateString()} - 
                    {work.endDate ? new Date(work.endDate).toLocaleDateString() : 'Present'}
                  </span>
                </div>
                {work.achievements && work.achievements.length > 0 && (
                  <div className="work-achievements">
                    <h5>Key Achievements</h5>
                    <ul>
                      {work.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="user-profile-container">
      {renderNotification()}
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaUser />
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'certifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('certifications')}
        >
          <FaGraduationCap />
          Certifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'work-history' ? 'active' : ''}`}
          onClick={() => setActiveTab('work-history')}
        >
          <FaBriefcase />
          Work History
        </button>
      </div>
      
      <div className="profile-content">
        {activeTab === 'overview' && (editMode ? renderEditProfileForm() : renderOverviewTab())}
        {activeTab === 'certifications' && renderCertificationsTab()}
        {activeTab === 'work-history' && renderWorkHistoryTab()}
      </div>
    </div>
  );
};

export default UserProfile; 