import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Attendance.scss";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);
  const { hasPermission } = useAuth();

  // Fetch employees for attendance marking
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!hasPermission(['admin', 'hr', 'manager'])) {
        setLoadingEmployees(false);
        return;
      }

      try {
        setLoadingEmployees(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Get attendance status for each employee for the selected date
        const employeesWithAttendance = await Promise.all(
          response.data.map(async (employee) => {
            try {
              const attendanceResponse = await axios.get(
                `http://localhost:5000/api/attendance/employee/${employee._id}?startDate=${selectedDate}&endDate=${selectedDate}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
              return {
                ...employee,
                attendance: attendanceResponse.data[0] || null
              };
            } catch (error) {
              console.error(`Error fetching attendance for ${employee.name}:`, error);
              return {
                ...employee,
                attendance: null
              };
            }
          })
        );

        setEmployees(employeesWithAttendance);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error.response?.data?.message || "Failed to fetch employees");
      } finally {
        setLoadingEmployees(false);
      }
    };

    fetchEmployees();
  }, [selectedDate, hasPermission]);

  // Function to mark attendance
  const handleMarkAttendance = async (employeeId, status) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/attendance",
        {
          employeeId,
          date: selectedDate,
          status,
          checkIn: status === 'present' ? new Date().toISOString() : undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update the employees list with the new attendance record
      setEmployees(prevEmployees =>
        prevEmployees.map(emp =>
          emp._id === employeeId
            ? { ...emp, attendance: response.data }
            : emp
        )
      );

      // Show success message
      alert('Attendance marked successfully');
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError(error.response?.data?.message || "Failed to mark attendance");
      alert(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  // Function to handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Calculate attendance statistics
  const calculateStats = () => {
    const total = employees.length;
    const present = employees.filter(emp => emp.attendance?.status === 'present').length;
    const absent = employees.filter(emp => emp.attendance?.status === 'absent').length;
    const pending = employees.filter(emp => !emp.attendance).length;

    return {
      total,
      present,
      absent,
      pending,
      presentPercentage: total ? Math.round((present / total) * 100) : 0,
      absentPercentage: total ? Math.round((absent / total) * 100) : 0,
      pendingPercentage: total ? Math.round((pending / total) * 100) : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="attendance-page">
      <header className="page-header">
        <h1>Attendance Management</h1>
        <div className="date-picker">
          <FiCalendar className="icon" />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="attendance-content">
        <div className="attendance-card">
          <div className="card-header">
            <h2>Mark Attendance</h2>
            <div className="attendance-summary">
              <div className="summary-item">
                <span className="label">Present</span>
                <span className="value">{stats.present}</span>
                <span className="percentage">({stats.presentPercentage}%)</span>
              </div>
              <div className="summary-item">
                <span className="label">Absent</span>
                <span className="value">{stats.absent}</span>
                <span className="percentage">({stats.absentPercentage}%)</span>
              </div>
              <div className="summary-item">
                <span className="label">Pending</span>
                <span className="value">{stats.pending}</span>
                <span className="percentage">({stats.pendingPercentage}%)</span>
              </div>
            </div>
          </div>
          
          {loadingEmployees ? (
            <div className="loading-message">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p>No employees found</p>
            </div>
          ) : (
            <div className="attendance-list">
              {employees.map(employee => (
                <div key={employee._id} className="attendance-item">
                  <div className="employee-info">
                    <img 
                      src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.name.replace(' ', '+')}&background=3498db&color=fff`}
                      alt={employee.name}
                      className="employee-avatar"
                    />
                    <div>
                      <h3>{employee.name}</h3>
                      <p>{employee.department || 'No Department'}</p>
                    </div>
                  </div>
                  
                  <div className="attendance-status">
                    {employee.attendance ? (
                      <span className={`status-badge ${employee.attendance.status}`}>
                        {employee.attendance.status.charAt(0).toUpperCase() + employee.attendance.status.slice(1)}
                        {employee.attendance.checkIn && (
                          <span className="check-in-time">
                            <FiClock /> {new Date(employee.attendance.checkIn).toLocaleTimeString()}
                          </span>
                        )}
                      </span>
                    ) : (
                      <div className="attendance-actions">
                        <button
                          className="mark-present-btn"
                          onClick={() => handleMarkAttendance(employee._id, 'present')}
                        >
                          <FiCheck /> Present
                        </button>
                        <button
                          className="mark-absent-btn"
                          onClick={() => handleMarkAttendance(employee._id, 'absent')}
                        >
                          <FiX /> Absent
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
