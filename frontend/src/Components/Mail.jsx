import React, { useState, useEffect } from 'react';
import { FaRegEnvelope, FaEnvelope } from 'react-icons/fa';
import '../styles/Mail.scss';

export default function Mail() {
  const [isOpen, setIsOpen] = useState(false);
  const [mails, setMails] = useState([
    {
      id: 1,
      from: 'HR Department',
      subject: 'Important: Company Policy Update',
      message: 'Please review the updated company policies regarding remote work...',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      from: 'Project Manager',
      subject: 'Weekly Team Meeting',
      message: 'Reminder: Team meeting scheduled for tomorrow at 10 AM...',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      from: 'System Admin',
      subject: 'Password Reset Required',
      message: 'Your password needs to be reset for security reasons...',
      time: '2 days ago',
      read: true
    }
  ]);

  const unreadCount = mails.filter(mail => !mail.read).length;

  const handleMailClick = (id) => {
    setMails(mails.map(mail => 
      mail.id === id ? { ...mail, read: true } : mail
    ));
  };

  const markAllAsRead = () => {
    setMails(mails.map(mail => ({ ...mail, read: true })));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mail-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="mail-container">
      <button
        className="mail-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Mail ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {unreadCount > 0 ? <FaEnvelope /> : <FaRegEnvelope />}
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="mail-dropdown">
          <div className="mail-header">
            <h3>Messages</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="mail-list">
            {mails.map(mail => (
              <div
                key={mail.id}
                className={`mail-item ${!mail.read ? 'unread' : ''}`}
                onClick={() => handleMailClick(mail.id)}
              >
                <div className="mail-content">
                  <h4>{mail.from}</h4>
                  <p className="subject">{mail.subject}</p>
                  <p className="message-preview">{mail.message}</p>
                  <span className="time">{mail.time}</span>
                </div>
                {!mail.read && <div className="unread-indicator" />}
              </div>
            ))}
          </div>

          <div className="mail-footer">
            <button className="view-all">View all messages</button>
          </div>
        </div>
      )}
    </div>
  );
} 