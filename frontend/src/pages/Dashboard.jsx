import React, { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiClock, FiBriefcase, FiDollarSign, FiBarChart2, FiUser, FiEdit, FiCheckCircle, FiXCircle, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.scss";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const { userRole, hasPermission } = useAuth();

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded._id;

        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch leave requests
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:5000/api/leave-requests?limit=3&status=pending", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Transform the data to match the expected format
        const formattedRequests = response.data.map(request => ({
          id: request._id,
          employeeName: request.employeeId?.name || 'Unknown Employee',
          department: request.department || 'Unknown Department',
          type: request.type,
          startDate: request.startDate,
          endDate: request.endDate,
          status: request.status,
          avatar: `https://ui-avatars.com/api/?name=${request.employeeId?.name?.charAt(0) || 'U'}&background=3498db&color=fff`
        }));
        
        setLeaveRequests(formattedRequests);
        setLoadingRequests(false);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setLoadingRequests(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Mock data for dashboard statistics
  const stats = [
    { id: 1, title: 'Total Employees', value: '128', icon: <FiUsers />, color: '#3498db' },
    { id: 2, title: 'Departments', value: '8', icon: <FiBriefcase />, color: '#2ecc71' },
    { id: 3, title: 'Present Today', value: '105', icon: <FiCalendar />, color: '#9b59b6' },
    { id: 4, title: 'On Leave', value: '12', icon: <FiClock />, color: '#e74c3c' },
    { id: 5, title: 'Open Positions', value: '5', icon: <FiBriefcase />, color: '#f39c12' },
    { id: 6, title: 'Monthly Budget', value: '$28,500', icon: <FiDollarSign />, color: '#1abc9c' }
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, user: 'Sarah Johnson', action: 'updated the attendance record', time: '10 minutes ago', avatar: 'https://ui-avatars.com/api/?name=SJ&background=9b59b6&color=fff' },
    { id: 2, user: 'Michael Brown', action: 'submitted a leave request', time: '2 hours ago', avatar: 'https://ui-avatars.com/api/?name=MB&background=3498db&color=fff' },
    { id: 3, user: 'Emily Davis', action: 'completed quarterly report', time: 'Yesterday at 4:30 PM', avatar: 'https://ui-avatars.com/api/?name=ED&background=e74c3c&color=fff' },
    { id: 4, user: 'David Wilson', action: 'approved budget for Q3', time: 'Yesterday at 1:20 PM', avatar: 'https://ui-avatars.com/api/?name=DW&background=f39c12&color=fff' },
    { id: 5, user: 'Lisa Wang', action: 'onboarded 3 new employees', time: '2 days ago', avatar: 'https://ui-avatars.com/api/?name=LW&background=1abc9c&color=fff' }
  ];

  // Navigation handlers for quick action buttons
  const handleNavigateToEmployees = () => navigate('/employees');
  const handleNavigateToAttendance = () => navigate('/attendance');
  const handleNavigateToPayroll = () => navigate('/payroll');
  const handleNavigateToDepartments = () => navigate('/departments');
  const handleNavigateToProfile = () => navigate('/profile');
  const handleNavigateToLeaveRequests = () => navigate('/leave-requests');

  // Function to handle approving a leave request
  const handleApproveRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.patch(
        `http://localhost:5000/api/leave-requests/${id}/status`,
        { status: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        // Update local state with the new data
        setLeaveRequests(prev => 
          prev.map(request => 
            request.id === id ? {
              ...request,
              status: 'approved',
              approvedBy: response.data.approvedBy?.name || 'Unknown',
              approvedDate: response.data.approvedDate
            } : request
          )
        );
        alert('Leave request approved successfully');
      }
    } catch (error) {
      console.error("Error approving leave request:", error);
      alert(error.response?.data?.message || 'Failed to approve leave request');
    }
  };

  // Function to handle rejecting a leave request
  const handleRejectRequest = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const reason = window.prompt("Please enter the reason for rejection:");
      if (!reason) {
        return; // User cancelled the prompt
      }

      const response = await axios.patch(
        `http://localhost:5000/api/leave-requests/${id}/status`,
        { 
          status: 'rejected',
          rejectionReason: reason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data) {
        // Update local state with the new data
        setLeaveRequests(prev => 
          prev.map(request => 
            request.id === id ? {
              ...request,
              status: 'rejected',
              rejectionReason: reason,
              approvedBy: response.data.approvedBy?.name || 'Unknown',
              approvedDate: response.data.approvedDate
            } : request
          )
        );
        alert('Leave request rejected successfully');
      }
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      alert(error.response?.data?.message || 'Failed to reject leave request');
    }
  };

  // Function to render status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="status-badge approved"><FiCheckCircle /> Approved</span>;
      case 'rejected':
        return <span className="status-badge rejected"><FiXCircle /> Rejected</span>;
      default:
        return <span className="status-badge pending"><FiClock /> Pending</span>;
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-picker">
          <span>June 2023</span>
          <button className="refresh-button">
            <FiBarChart2 /> Reports
          </button>
        </div>
      </header>

      {/* Role Information Alert */}
      {userRole !== 'admin' && (
        <div className="role-info-alert">
          <div className="alert-icon">
            <FiInfo />
          </div>
          <div className="alert-content">
            <h3>Welcome, {userRole === 'hr' ? 'HR Staff' : userRole === 'manager' ? 'Manager' : 'Employee'}</h3>
            <p>
              {userRole === 'hr' 
                ? 'You have access to HR functions including employees, attendance, leave requests, payroll, and recruitment.' 
                : userRole === 'manager' 
                ? 'You have access to view employee information, attendance records, and user management.' 
                : 'You can view and submit leave requests. Contact your HR department for any questions.'}
            </p>
          </div>
        </div>
      )}

      <section className="dashboard-content">
        {/* Profile Summary Card */}
        <div className="dashboard-card profile-summary-card">
          {loading ? (
            <div className="profile-loading">Loading profile data...</div>
          ) : user ? (
            <>
              <div className="profile-card-header">
                <h2>My Profile</h2>
                <div className="profile-completion">
                  <div className="completion-bar">
                    <div 
                      className="completion-progress" 
                      style={{ width: `${user.profileCompletion || 0}%` }}
                    ></div>
                  </div>
                  <span>{user.profileCompletion || 0}% Complete</span>
                </div>
              </div>
              <div className="profile-card-content">
                <div className="profile-avatar">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=3498db&color=fff`} 
                    alt={user.name} 
                  />
                </div>
                <div className="profile-info">
                  <h3>{user.name}</h3>
                  <p className="profile-position">{user.position || 'Position not set'}</p>
                  <p className="profile-department">{user.department || 'Department not set'}</p>
                  
                  {user.skills && user.skills.length > 0 && (
                    <div className="profile-skills">
                      {user.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="skill-tag more">+{user.skills.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <button 
                  className="view-profile-btn"
                  onClick={handleNavigateToProfile}
                >
                  <FiUser /> View Profile
                </button>
              </div>
            </>
          ) : (
            <div className="profile-error">
              <p>Could not load profile data. Please log in again.</p>
            </div>
          )}
        </div>

        {/* Leave Requests Summary Card */}
        <div className="dashboard-card leave-requests-card">
          <div className="leave-requests-header">
            <h2>Leave Requests</h2>
            <button className="view-all-btn" onClick={handleNavigateToLeaveRequests}>
              View All
            </button>
          </div>
          
          {loadingRequests ? (
            <div className="loading-requests">Loading leave requests...</div>
          ) : leaveRequests.length > 0 ? (
            <ul className="leave-requests-list">
              {leaveRequests.map(request => (
                <li key={request.id} className="leave-request-item">
                  <div className="request-header">
                    <div className="employee-info">
                      <img 
                        src={request.avatar} 
                        alt={request.employeeName} 
                        className="employee-avatar"
                      />
                      <div>
                        <h3 className="employee-name">{request.employeeName}</h3>
                        <p className="employee-department">{request.department}</p>
                      </div>
                    </div>
                    {renderStatusBadge(request.status)}
                  </div>
                  
                  <div className="request-details">
                    <div className="request-type">
                      <span className="label">Type:</span>
                      <span className="value">{request.type}</span>
                    </div>
                    <div className="request-dates">
                      <span className="label">Dates:</span>
                      <span className="value">{request.startDate} to {request.endDate}</span>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && hasPermission(['admin', 'hr', 'manager']) && (
                    <div className="request-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApproveRequest(request.id)}
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectRequest(request.id)}
                      >
                        <FiXCircle /> Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-requests">
              <FiCalendar className="empty-icon" />
              <p>No leave requests at the moment</p>
            </div>
          )}
        </div>

        <div className="dashboard-card attendance-overview">
          <h2>Attendance Overview</h2>
          <div className="attendance-chart">
            <div className="chart-placeholder">
              <div className="chart-bar" style={{ height: '70%', backgroundColor: '#3498db' }}></div>
              <div className="chart-bar" style={{ height: '65%', backgroundColor: '#3498db' }}></div>
              <div className="chart-bar" style={{ height: '80%', backgroundColor: '#3498db' }}></div>
              <div className="chart-bar" style={{ height: '75%', backgroundColor: '#3498db' }}></div>
              <div className="chart-bar" style={{ height: '85%', backgroundColor: '#3498db' }}></div>
              <div className="chart-bar" style={{ height: '60%', backgroundColor: '#3498db' }}></div>
              <div className="chart-bar" style={{ height: '90%', backgroundColor: '#3498db' }}></div>
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          <div className="attendance-summary">
            <div className="summary-item">
              <span className="label">Present</span>
              <span className="value">82%</span>
            </div>
            <div className="summary-item">
              <span className="label">Absent</span>
              <span className="value">10%</span>
            </div>
            <div className="summary-item">
              <span className="label">Leave</span>
              <span className="value">8%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card recent-activities">
          <h2>Recent Activities</h2>
          <ul className="activities-list">
            {recentActivities.map(activity => (
              <li key={activity.id} className="activity-item">
                <img 
                  src={activity.avatar} 
                  alt={activity.user} 
                  className="activity-avatar"
                />
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className="view-all-btn">View All Activities</button>
        </div>

        {/* Recommended Connections */}
        <div className="dashboard-card connections-card">
          <div className="connections-header">
            <h2>Recommended Connections</h2>
            <button className="view-all">View All</button>
          </div>
          
          <div className="connections-list">
            <div className="connection-card">
              <img 
                src="https://ui-avatars.com/api/?name=JD&background=3498db&color=fff" 
                alt="John Doe" 
                className="connection-avatar"
              />
              <div className="connection-info">
                <h3>John Doe</h3>
                <p className="connection-position">UX Designer</p>
                <p className="mutual-connections">3 mutual connections</p>
              </div>
              <button className="connect-btn">Connect</button>
            </div>
            
            <div className="connection-card">
              <img 
                src="https://ui-avatars.com/api/?name=AS&background=9b59b6&color=fff" 
                alt="Alice Smith" 
                className="connection-avatar"
              />
              <div className="connection-info">
                <h3>Alice Smith</h3>
                <p className="connection-position">Product Manager</p>
                <p className="mutual-connections">5 mutual connections</p>
              </div>
              <button className="connect-btn">Connect</button>
            </div>
            
            <div className="connection-card">
              <img 
                src="https://ui-avatars.com/api/?name=RJ&background=e74c3c&color=fff" 
                alt="Robert Johnson" 
                className="connection-avatar"
              />
              <div className="connection-info">
                <h3>Robert Johnson</h3>
                <p className="connection-position">Backend Developer</p>
                <p className="mutual-connections">2 mutual connections</p>
              </div>
              <button className="connect-btn">Connect</button>
            </div>
          </div>
          
          {/* Empty state - will be shown conditionally in a real app */}
          <div className="empty-connections" style={{ display: 'none' }}>
            <div className="empty-icon">
              <FiUsers />
            </div>
            <h3 className="empty-title">No recommendations yet</h3>
            <p className="empty-message">We'll suggest connections as you grow your network</p>
          </div>
        </div>
      </section>
      
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map(stat => (
            <div className="stat-card" key={stat.id}>
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="quick-actions">
        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button 
              className="action-button"
              onClick={handleNavigateToEmployees}
              aria-label="Manage Employees"
            >
              <FiUsers /> Manage Employees
            </button>
            <button 
              className="action-button"
              onClick={handleNavigateToAttendance}
              aria-label="View Attendance"
            >
              <FiCalendar /> View Attendance
            </button>
            <button 
              className="action-button"
              onClick={handleNavigateToPayroll}
              aria-label="Process Payroll"
            >
              <FiDollarSign /> Process Payroll
            </button>
            <button 
              className="action-button"
              onClick={handleNavigateToDepartments}
              aria-label="Manage Departments"
            >
              <FiBriefcase /> Manage Departments
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
