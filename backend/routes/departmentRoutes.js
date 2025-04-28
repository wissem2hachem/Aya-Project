const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { authenticate } = require('../middleware/authMiddleware');

// Get all departments
router.get('/', authenticate, async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('manager', 'name email')
      .sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single department
router.get('/:id', authenticate, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('manager', 'name email');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new department
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, manager } = req.body;
    const department = new Department({
      name,
      description,
      manager
    });
    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a department
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, manager } = req.body;
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    department.name = name || department.name;
    department.description = description || department.description;
    department.manager = manager || department.manager;
    
    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a department
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    await department.remove();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 