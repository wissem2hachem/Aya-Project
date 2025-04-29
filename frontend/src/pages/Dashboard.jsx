import React, { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiClock, FiBriefcase, FiDollarSign, FiBarChart2, FiUser, FiEdit, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.scss";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
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

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setAttendanceLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        // Get current week's dates
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
        const endOfWeek = new Date(today);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday

        const response = await axios.get(
          `http://localhost:5000/api/attendance/weekly?startDate=${startOfWeek.toISOString().split('T')[0]}&endDate=${endOfWeek.toISOString().split('T')[0]}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (!attendanceData) return { present: 0, absent: 0, leave: 0 };

    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.status === 'present').length;
    const absent = attendanceData.filter(record => record.status === 'absent').length;
    const leave = attendanceData.filter(record => record.status === 'leave').length;

    return {
      present: total ? Math.round((present / total) * 100) : 0,
      absent: total ? Math.round((absent / total) * 100) : 0,
      leave: total ? Math.round((leave / total) * 100) : 0
    };
  };

  // Get attendance data for chart
  const getAttendanceChartData = () => {
    if (!attendanceData) return Array(7).fill(0);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.map(day => {
      const dayRecords = attendanceData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.toLocaleDateString('en-US', { weekday: 'long' }) === day;
      });
      
      const presentCount = dayRecords.filter(record => record.status === 'present').length;
      return dayRecords.length ? Math.round((presentCount / dayRecords.length) * 100) : 0;
    });
  };

  const attendanceStats = calculateAttendanceStats();
  const chartData = getAttendanceChartData();

  // Navigation handlers for quick action buttons
  const handleNavigateToEmployees = () => navigate('/employees');
  const handleNavigateToAttendance = () => navigate('/attendance');
  const handleNavigateToPayroll = () => navigate('/payroll');
  const handleNavigateToDepartments = () => navigate('/departments');
  const handleNavigateToProfile = () => navigate('/profile');

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
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
                ? 'You have access to HR functions including employees, attendance, payroll, and recruitment.' 
                : userRole === 'manager' 
                ? 'You have access to view employee information, attendance records, and user management.' 
                : 'You can view your profile and attendance records. Contact your HR department for any questions.'}
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

        <div className="dashboard-card attendance-overview">
          <h2>Attendance Overview</h2>
          {attendanceLoading ? (
            <div className="loading-message">Loading attendance data...</div>
          ) : (
            <>
              <div className="attendance-chart">
                <div className="chart-placeholder">
                  {chartData.map((value, index) => (
                    <div 
                      key={index}
                      className="chart-bar" 
                      style={{ 
                        height: `${value}%`, 
                        backgroundColor: '#3498db' 
                      }}
                    ></div>
                  ))}
                </div>
                <div className="chart-labels">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>
              </div>
              <div className="attendance-summary">
                <div className="summary-item">
                  <span className="label">Present</span>
                  <span className="value">{attendanceStats.present}%</span>
                </div>
                <div className="summary-item">
                  <span className="label">Absent</span>
                  <span className="value">{attendanceStats.absent}%</span>
                </div>
                <div className="summary-item">
                  <span className="label">Leave</span>
                  <span className="value">{attendanceStats.leave}%</span>
                </div>
              </div>
            </>
          )}
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
