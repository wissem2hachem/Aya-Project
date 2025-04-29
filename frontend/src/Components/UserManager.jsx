import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserManager.css";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "employee" });
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  const API_URL = "http://localhost:5000/api/users";

  // Role definitions with access permissions
  const roleDefinitions = {
    employee: {
      title: "Employee",
      description: "Basic access level for regular employees",
      permissions: [
        "View/edit their profile",
        "Apply for leave",
        "View payslips",
        "See announcements",
        "Access their attendance records"
      ]
    },
    admin: {
      title: "Admin",
      description: "Full administrative access to all functions",
      permissions: [
        "Manage all users and roles",
        "Access all employee records",
        "Handle all leave requests",
        "Process payroll",
        "Manage recruitment",
        "Generate company-wide reports"
      ]
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${API_URL}/create`, form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      setForm({ name: "", email: "", password: "", role: "employee" });
      setEditId(null);
      fetchUsers();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(err.response?.data?.message || "Error creating/updating user");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: "", role: user.role || "employee" });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      await axios.put(`${API_URL}/${id}`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user role:", err);
      alert(err.response?.data?.message || "Error updating user role");
    }
  };

  const filteredUsers = filter === "all" 
    ? users 
    : users.filter(user => user.role === filter);

  return (
    <div className="user-manager-container">
      <h1>User Manager</h1>
      
      <div className="role-info-header">
        <h2>Role Management</h2>
        <button 
          className="info-toggle-btn"
          onClick={() => setShowRoleInfo(!showRoleInfo)}
        >
          {showRoleInfo ? "Hide Role Information" : "Show Role Information"}
        </button>
      </div>
      
      {showRoleInfo && (
        <div className="role-info-panel">
          <h3>Role Definitions and Permissions</h3>
          <p className="role-info-intro">
            Users can only be promoted by administrators with HR role. Each role has specific access permissions to different parts of the system.
          </p>
          
          <div className="role-cards">
            {Object.keys(roleDefinitions).map(roleKey => (
              <div key={roleKey} className={`role-card ${roleKey}`}>
                <h4>{roleDefinitions[roleKey].title}</h4>
                <p>{roleDefinitions[roleKey].description}</p>
                <h5>Permissions:</h5>
                <ul>
                  {roleDefinitions[roleKey].permissions.map((permission, index) => (
                    <li key={index}>{permission}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="user-manager">
        <h2>{editId ? "Edit User" : "Create New User"}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Name</label>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              placeholder="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password {editId && "(leave blank to keep current)"}</label>
            <input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editId}
            />
          </div>
          
          <div className="form-group">
            <label>Role</label>
            <div className="role-select-group">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <div className="role-description">
                {form.role && roleDefinitions[form.role] ? 
                  roleDefinitions[form.role].description : 
                  "Select a role"}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary">{editId ? "Update User" : "Create User"}</button>
            {editId && (
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => {
                  setForm({ name: "", email: "", password: "", role: "employee" });
                  setEditId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      
        <div className="user-list-section">
          <div className="list-header">
            <h2>User List</h2>
            <div className="filter-controls">
              <label>Filter by Role:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Access Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role || "employee"}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`role-select ${user.role || "employee"}`}
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <div className="access-badges">
                      {user.role === "admin" && (
                        <>
                          <span className="access-badge users">Users</span>
                          <span className="access-badge employees">Employees</span>
                          <span className="access-badge attendance">Attendance</span>
                          <span className="access-badge payroll">Payroll</span>
                          <span className="access-badge recruitment">Recruitment</span>
                        </>
                      )}
                      {(user.role === "employee" || !user.role) && (
                        <span className="access-badge profile">Profile Only</span>
                      )}
                    </div>
                  </td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="no-results">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManager;