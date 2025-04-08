import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Departments.scss';

const DepartmentForm = ({ department, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    manager: '',
    description: ''
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        manager: department.manager,
        description: department.description || ''
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="department-form">
        <div className="form-header">
          <h3>{department ? 'Edit Department' : 'Add New Department'}</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Department Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Manager</label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {department ? 'Update' : 'Create'} Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;