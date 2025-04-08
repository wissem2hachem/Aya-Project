import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ name: "", email: "" });
    const [editingUser, setEditingUser] = useState(null);
    const navigate = useNavigate();
  
  
    // Check if user is logged in
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if no token
      }
    }, [navigate]);
  
  
    // Fetch Users
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:5000/api/users/");
      const data = await res.json();
      setUsers(data);
    };
  
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
  
    // Handle Input Changes
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
  
    // Create or Update User
    const handleSubmit = async (e) => {
      e.preventDefault();
     
      const method = editingUser ? "PUT" : "POST";
      const url = editingUser
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : "http://localhost:5000/api/users/create";  //  Correct endpoint
   
      // If creating a new user, add a default password
      const userData = editingUser
        ? { name: form.name, email: form.email }
        : { name: form.name, email: form.email, password: "defaultPassword123" };  //  Add password
   
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
   
        if (!response.ok) {
          const errorData = await response.json();
          alert("Error: " + errorData.message);
          return;
        }
   
        fetchUsers(); //  Refresh user list after creation
        setForm({ name: "", email: "" });
        setEditingUser(null);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to create/update user. Check your backend.");
      }
    };
   
  
  
    // Delete User
    const deleteUser = async (id) => {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    };
  
  
    // Edit User
    const editUser = (user) => {
      setForm({ name: user.name, email: user.email });
      setEditingUser(user);
    };
  
  
    // Logout function
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
  
  
    return (
      <div>
        <h2>User Management</h2>
  
  
        <button onClick={handleLogout}>Logout</button>
  
  
        {/* User Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <button type="submit">{editingUser ? "Update" : "Create"} User</button>
        </form>
  
  
        {/* User List */}
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => editUser(user)}>Edit</button>
                  <button onClick={() => deleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  
  export default Dashboard;
  
  
  