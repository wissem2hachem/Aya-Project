import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Settings.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../styles/layout.scss';
// Import icons
import { FaUser, FaCog, FaUsers, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'HRHub',
    enableEmailNotifications: true,
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    timeZone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    languagePreference: 'en',
  });
  
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  const USER_API_URL = 'http://localhost:5000/api/users';
  const SETTINGS_API_URL = 'http://localhost:5000/api/settings';

  useEffect(() => {
    // Fetch current user profile
    const fetchUserProfile = async () => {
      try {
        if (userId) {
          const res = await axios.get(`${USER_API_URL}/${userId}`);
          setUserProfile(prev => ({
            ...prev,
            name: res.data.name || '',
            email: res.data.email || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        showNotification('Failed to load profile data', 'error');
      }
    };

    // Fetch system settings
    const fetchSystemSettings = async () => {
      try {
        const res = await axios.get(SETTINGS_API_URL);
        setSystemSettings(res.data);
      } catch (err) {
        console.error('Error fetching system settings:', err);
        // If the API fails, we'll use the default values already in state
      }
    };

    fetchUserProfile();
    fetchSystemSettings();
  }, [userId]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (userProfile.newPassword !== userProfile.confirmPassword) {
        return showNotification("New passwords don't match", 'error');
      }

      const updateData = {
        name: userProfile.name,
        email: userProfile.email,
      };

      if (userProfile.newPassword) {
        updateData.password = userProfile.newPassword;
        updateData.currentPassword = userProfile.currentPassword;
      }

      await axios.put(`${USER_API_URL}/${userId}`, updateData);
      showNotification('Profile updated successfully', 'success');
      
      setUserProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (err) {
      console.error('Error updating profile:', err);
      showNotification(err.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const handleSystemSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(SETTINGS_API_URL, systemSettings);
      setSystemSettings(response.data);
      showNotification('System settings updated successfully', 'success');
    } catch (err) {
      console.error('Error updating system settings:', err);
      showNotification('Failed to update system settings', 'error');
    }
  };

  const handleResetSystemSettings = async () => {
    try {
      const response = await axios.post(`${SETTINGS_API_URL}/reset`);
      setSystemSettings(response.data);
      showNotification('System settings reset to defaults', 'success');
    } catch (err) {
      console.error('Error resetting system settings:', err);
      showNotification('Failed to reset system settings', 'error');
    }
  };

  const renderNotification = (message, type) => (
    <div className={`notification ${type}`}>
      {type === 'success' ? (
        <FaCheckCircle className="notification-icon" />
      ) : (
        <FaExclamationTriangle className="notification-icon" />
      )}
      <span>{message}</span>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="settings-content">
      <h2>Profile Settings</h2>
      {notification.message && activeTab === 'profile' && 
        renderNotification(notification.message, notification.type)
      }
      <form onSubmit={handleProfileUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={userProfile.name}
            onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={userProfile.email}
            onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
            required
          />
        </div>
        <h3>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={userProfile.currentPassword}
            onChange={(e) => setUserProfile({ ...userProfile, currentPassword: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={userProfile.newPassword}
            onChange={(e) => setUserProfile({ ...userProfile, newPassword: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={userProfile.confirmPassword}
            onChange={(e) => setUserProfile({ ...userProfile, confirmPassword: e.target.value })}
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="settings-content">
      <h2>System Settings</h2>
      {notification.message && activeTab === 'system' && 
        renderNotification(notification.message, notification.type)
      }
      <form onSubmit={handleSystemSettingsUpdate}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            value={systemSettings.companyName}
            onChange={(e) => setSystemSettings({ ...systemSettings, companyName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Working Hours</label>
          <div className="time-range">
            <input
              type="time"
              value={systemSettings.workingHoursStart}
              onChange={(e) => setSystemSettings({ ...systemSettings, workingHoursStart: e.target.value })}
            />
            <span>to</span>
            <input
              type="time"
              value={systemSettings.workingHoursEnd}
              onChange={(e) => setSystemSettings({ ...systemSettings, workingHoursEnd: e.target.value })}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Time Zone</label>
          <select
            value={systemSettings.timeZone}
            onChange={(e) => setSystemSettings({ ...systemSettings, timeZone: e.target.value })}
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Standard Time (EST)</option>
            <option value="CST">Central Standard Time (CST)</option>
            <option value="PST">Pacific Standard Time (PST)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date Format</label>
          <select
            value={systemSettings.dateFormat}
            onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div className="form-group">
          <label>Language</label>
          <select
            value={systemSettings.languagePreference}
            onChange={(e) => setSystemSettings({ ...systemSettings, languagePreference: e.target.value })}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={systemSettings.enableEmailNotifications}
              onChange={(e) => setSystemSettings({ ...systemSettings, enableEmailNotifications: e.target.checked })}
            />
            Enable Email Notifications
          </label>
        </div>
        <div className="buttons-row">
          <button type="submit" className="save-button">Save Settings</button>
          <button type="button" className="reset-button" onClick={handleResetSystemSettings}>Reset to Defaults</button>
        </div>
      </form>
    </div>
  );

  const renderUserManagement = () => (
    <div className="settings-content">
      <h2>User Management</h2>
      <iframe 
        src="/usermanager" 
        title="User Management" 
        className="user-manager-iframe"
      />
    </div>
  );

  return (
    <div className="app-layout">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <div className="settings-container">
          <h1>Settings</h1>
          <div className="settings-wrapper">
            <div className="settings-sidebar">
              <ul>
                <li 
                  className={activeTab === 'profile' ? 'active' : ''}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="settings-icon" />
                  <span>Profile Settings</span>
                </li>
                <li 
                  className={activeTab === 'system' ? 'active' : ''}
                  onClick={() => setActiveTab('system')}
                >
                  <FaCog className="settings-icon" />
                  <span>System Settings</span>
                </li>
                <li 
                  className={activeTab === 'users' ? 'active' : ''}
                  onClick={() => setActiveTab('users')}
                >
                  <FaUsers className="settings-icon" />
                  <span>User Management</span>
                </li>
              </ul>
            </div>
            <div className="settings-main">
              {activeTab === 'profile' && renderProfileSettings()}
              {activeTab === 'system' && renderSystemSettings()}
              {activeTab === 'users' && renderUserManagement()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings; 