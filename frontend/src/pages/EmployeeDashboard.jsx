import React from "react";
import { FiUser, FiCalendar, FiFileText, FiClock, FiBell, FiCheckCircle } from "react-icons/fi";
import "./EmployeeDashboard.scss";

export default function EmployeeDashboard() {
  // Mock data for employee dashboard
  const employeeInfo = {
    name: "John Doe",
    position: "Software Developer",
    department: "Engineering",
    joinDate: "May 15, 2022",
    manager: "Sarah Johnson",
    nextReview: "December 10, 2023"
  };

  // Mock upcoming events
  const upcomingEvents = [
    { id: 1, title: "Team Meeting", date: "Today, 2:00 PM", type: "meeting" },
    { id: 2, title: "Project Deadline", date: "Tomorrow, 5:00 PM", type: "deadline" },
    { id: 3, title: "Company Holiday", date: "Dec 25, 2023", type: "holiday" },
    { id: 4, title: "Performance Review", date: "Dec 10, 2023", type: "review" }
  ];

  // Mock leave balance
  const leaveBalance = [
    { type: "Annual Leave", used: 10, total: 20 },
    { type: "Sick Leave", used: 3, total: 12 },
    { type: "Personal Leave", used: 2, total: 5 }
  ];

  // Mock recent pay slips
  const recentPayslips = [
    { id: 1, period: "November 2023", date: "Nov 30, 2023", amount: "$3,500" },
    { id: 2, period: "October 2023", date: "Oct 31, 2023", amount: "$3,500" },
    { id: 3, period: "September 2023", date: "Sep 30, 2023", amount: "$3,500" }
  ];

  // Mock notifications
  const notifications = [
    { id: 1, message: "Your leave request has been approved", time: "2 hours ago", read: false },
    { id: 2, message: "New company policy updated", time: "1 day ago", read: false },
    { id: 3, message: "Reminder: Submit your timesheet", time: "2 days ago", read: true }
  ];

  return (
    <div className="employee-dashboard-page">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <div className="welcome-message">
          Welcome back, {employeeInfo.name}!
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-column">
          <div className="dashboard-card profile-summary">
            <h2><FiUser /> Profile Summary</h2>
            <div className="profile-details">
              <div className="profile-avatar">
                <img src={`https://ui-avatars.com/api/?name=${employeeInfo.name.replace(' ', '+')}&background=3498db&color=fff&size=128`} alt={employeeInfo.name} />
              </div>
              <div className="profile-info">
                <h3>{employeeInfo.name}</h3>
                <p className="position">{employeeInfo.position}</p>
                <p className="department">{employeeInfo.department}</p>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Join Date:</span>
                    <span className="value">{employeeInfo.joinDate}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Manager:</span>
                    <span className="value">{employeeInfo.manager}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Next Review:</span>
                    <span className="value">{employeeInfo.nextReview}</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="action-button">View Full Profile</button>
          </div>

          <div className="dashboard-card leave-balance">
            <h2><FiCalendar /> Leave Balance</h2>
            <div className="leave-progress-container">
              {leaveBalance.map(leave => (
                <div key={leave.type} className="leave-progress-item">
                  <div className="leave-info">
                    <span className="leave-type">{leave.type}</span>
                    <span className="leave-ratio">{leave.used}/{leave.total} days</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${(leave.used / leave.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="action-button">Request Leave</button>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card upcoming-events">
            <h2><FiClock /> Upcoming Events</h2>
            <ul className="event-list">
              {upcomingEvents.map(event => (
                <li key={event.id} className="event-item">
                  <div className={`event-icon ${event.type}`}>
                    {event.type === 'meeting' && <FiUser />}
                    {event.type === 'deadline' && <FiClock />}
                    {event.type === 'holiday' && <FiCalendar />}
                    {event.type === 'review' && <FiFileText />}
                  </div>
                  <div className="event-details">
                    <p className="event-title">{event.title}</p>
                    <p className="event-date">{event.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="action-button">View Calendar</button>
          </div>

          <div className="dashboard-card recent-payslips">
            <h2><FiFileText /> Recent Payslips</h2>
            <ul className="payslip-list">
              {recentPayslips.map(payslip => (
                <li key={payslip.id} className="payslip-item">
                  <div className="payslip-icon">
                    <FiFileText />
                  </div>
                  <div className="payslip-details">
                    <p className="payslip-period">{payslip.period}</p>
                    <p className="payslip-date">{payslip.date}</p>
                  </div>
                  <div className="payslip-amount">{payslip.amount}</div>
                  <button className="download-button">View</button>
                </li>
              ))}
            </ul>
            <button className="action-button">All Payslips</button>
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-card notifications">
            <h2><FiBell /> Notifications</h2>
            <ul className="notification-list">
              {notifications.map(notification => (
                <li key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                  <div className="notification-status">
                    {!notification.read && <span className="unread-indicator"></span>}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">{notification.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="action-button">View All Notifications</button>
          </div>

          <div className="dashboard-card quick-actions">
            <h2><FiCheckCircle /> Quick Actions</h2>
            <div className="actions-grid">
              <button className="quick-action-button">
                <FiClock />
                <span>Clock In/Out</span>
              </button>
              <button className="quick-action-button">
                <FiCalendar />
                <span>Request Leave</span>
              </button>
              <button className="quick-action-button">
                <FiFileText />
                <span>Submit Expense</span>
              </button>
              <button className="quick-action-button">
                <FiUser />
                <span>Update Profile</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 