import React, { useState, useEffect } from 'react';
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io';
import axios from 'axios';
import '../styles/Notifications.scss';

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Mark a single notification as read
  const handleNotificationClick = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Fetch notifications on component mount and every 30 seconds
  useEffect(() => {
    fetchNotifications();
    
    const intervalId = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.notifications-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notifications-container">
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {unreadCount > 0 ? <IoMdNotifications /> : <IoMdNotificationsOutline />}
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="notifications-list">
            {loading ? (
              <div className="loading">Loading notifications...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="empty">No notifications</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!notification.read && <div className="unread-indicator" />}
                </div>
              ))
            )}
          </div>

          <div className="notifications-footer">
            <button className="view-all">View all notifications</button>
          </div>
        </div>
      )}
    </div>
  );
} 