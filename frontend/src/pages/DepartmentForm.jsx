import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './DepartmentForm.scss';

const DepartmentForm = ({ department, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    description: '',
    location: ''
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        manager: department.manager || '',
        description: department.description || '',
        location: department.location || ''
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="department-form-modal">
        <div className="modal-header">
          <h2>{department ? 'Edit Department' : 'Add Department'}</h2>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Department Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="manager">Department Manager</label>
            <input
              type="text"
              id="manager"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {department ? 'Update Department' : 'Add Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm; 