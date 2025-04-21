import React, { useState, useEffect } from "react";
import { FiEdit2, FiUserCheck, FiFilter, FiSearch } from "react-icons/fi";
import "./UserManagement.scss";

export default function UserManagement() {
  // Mock user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "employee",
      department: "Engineering",
      joinDate: "2022-05-15",
      status: "active"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      role: "hr",
      department: "Human Resources",
      joinDate: "2021-11-10",
      status: "active"
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      role: "manager",
      department: "Marketing",
      joinDate: "2022-01-20",
      status: "active"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "employee",
      department: "Finance",
      joinDate: "2022-03-08",
      status: "inactive"
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@example.com",
      role: "employee",
      department: "Engineering",
      joinDate: "2022-06-12",
      status: "active"
    },
    {
      id: 6,
      name: "Lisa Wang",
      email: "lisa.w@example.com",
      role: "manager",
      department: "Sales",
      joinDate: "2021-09-15",
      status: "active"
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditClick = (user) => {
    setEditingUser({...user});
    setModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    // In a real application, this would be an API call
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ));
    
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleRoleChange = (e) => {
    setEditingUser({...editingUser, role: e.target.value});
  };

  const handleStatusChange = (e) => {
    setEditingUser({...editingUser, status: e.target.value});
  };

  return (
    <div className="user-management-page">
      <header className="page-header">
        <h1>User Management</h1>
        <p>Manage user roles and permissions</p>
      </header>

      <div className="filter-section">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter">
            <label htmlFor="role-filter">
              <FiFilter /> Role:
            </label>
            <select 
              id="role-filter"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR</option>
            </select>
          </div>

          <div className="filter">
            <label htmlFor="status-filter">
              <FiUserCheck /> Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className={user.status === "inactive" ? "inactive-user" : ""}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td>{user.department}</td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-indicator ${user.status}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => handleEditClick(user)}
                    aria-label={`Edit ${user.name}`}
                  >
                    <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="no-results">
                  No users found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {modalOpen && editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit User</h2>
            
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={editingUser.name} disabled />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={editingUser.email} disabled />
            </div>
            
            <div className="form-group">
              <label>Role</label>
              <select value={editingUser.role} onChange={handleRoleChange}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select value={editingUser.status} onChange={handleStatusChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Department</label>
              <input type="text" value={editingUser.department} disabled />
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={() => {
                  setModalOpen(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="save-button"
                onClick={handleSaveUser}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 